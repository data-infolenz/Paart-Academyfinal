import net from "node:net"
import { isComposedEmail } from "@sdxc/mail"
import { MemoryTransport } from "@sdxc/mail/memory"
import { isFailure, isSuccess } from "@sdxc/result"
import { describe, expect, it } from "vitest"
import {
  createPaartMailer,
  NodeSmtpTransport,
  paartEmails,
  parseSenderAddress,
  sendAccountCredentialsEmail
} from "./mail"

function createLoopbackSmtpServer(options: { rejectRecipient?: boolean } = {}): Promise<{
  port: number
  receivedPayloads: string[]
  close: () => Promise<void>
}> {
  const receivedPayloads: string[] = []

  return new Promise((resolve, reject) => {
    const server = net.createServer((socket) => {
      socket.setEncoding("utf8")
      let inDataMode = false
      let dataBuffer = ""
      let lineBuffer = ""

      socket.write("220 localhost ESMTP Loopback\r\n")

      socket.on("data", (chunk: string) => {
        if (inDataMode) {
          dataBuffer += chunk
          const endIdx = dataBuffer.indexOf("\r\n.\r\n")
          if (endIdx !== -1) {
            receivedPayloads.push(dataBuffer.slice(0, endIdx))
            dataBuffer = ""
            inDataMode = false
            socket.write("250 2.0.0 OK: queued as loopback-1\r\n")
          }
          return
        }

        lineBuffer += chunk
        let newlineIdx = lineBuffer.indexOf("\r\n")
        while (newlineIdx !== -1) {
          const line = lineBuffer.slice(0, newlineIdx)
          lineBuffer = lineBuffer.slice(newlineIdx + 2)
          const upper = line.toUpperCase()

          if (upper.startsWith("EHLO") || upper.startsWith("HELO")) {
            socket.write("250-localhost\r\n250 8BITMIME\r\n")
          } else if (upper.startsWith("MAIL FROM:")) {
            socket.write("250 2.1.0 Originator OK\r\n")
          } else if (upper.startsWith("RCPT TO:")) {
            if (options.rejectRecipient) {
              socket.write("550 5.1.1 Mailbox unavailable\r\n")
            } else {
              socket.write("250 2.1.5 Recipient OK\r\n")
            }
          } else if (upper === "DATA") {
            inDataMode = true
            socket.write("354 Start mail input; end with <CRLF>.<CRLF>\r\n")
            if (lineBuffer.length > 0) {
              dataBuffer += lineBuffer
              lineBuffer = ""
              const endIdx = dataBuffer.indexOf("\r\n.\r\n")
              if (endIdx !== -1) {
                receivedPayloads.push(dataBuffer.slice(0, endIdx))
                dataBuffer = ""
                inDataMode = false
                socket.write("250 2.0.0 OK: queued as loopback-1\r\n")
              }
              break
            }
          } else if (upper === "QUIT") {
            socket.write("221 2.0.0 Bye\r\n")
            socket.end()
          } else {
            socket.write("250 OK\r\n")
          }

          newlineIdx = lineBuffer.indexOf("\r\n")
        }
      })
    })

    server.once("error", reject)
    server.listen(0, "127.0.0.1", () => {
      const address = server.address()
      if (!address || typeof address === "string") {
        reject(new Error("Expected TCP address info"))
        return
      }
      resolve({
        port: address.port,
        receivedPayloads,
        close: () =>
          new Promise<void>((res) => {
            server.close(() => res())
          })
      })
    })
  })
}

describe("app/initializers/mail (@sdxc/mail + NodeSmtpTransport)", () => {
  it("parses RFC display-name sender addresses and renders multipart HTML + plain-text MIME", async () => {
    expect(parseSenderAddress("PAART Academy <no-reply@paartacademy.com>")).toEqual({
      name: "PAART Academy",
      email: "no-reply@paartacademy.com"
    })
    expect(parseSenderAddress("ops@paartacademy.com")).toEqual({
      email: "ops@paartacademy.com"
    })

    const memory = new MemoryTransport({ mime: true })
    const mailer = createPaartMailer(memory, "PAART Academy <no-reply@paartacademy.com>")

    const result = await sendAccountCredentialsEmail({
      kind: "welcome",
      toEmail: "aspirant.new@paartacademy.com",
      fullName: "Kavin Sundar",
      role: "aspirant",
      temporaryPassword: "Temp#Pass9012XyZ",
      origin: "https://paartacademy.com",
      batchSummary: "TNPSC Group 1 · Batch A (2026)",
      mailer
    })

    expect(isSuccess(result)).toBe(true)
    expect(memory.last).toBeDefined()
    expect(isComposedEmail(memory.last?.email, paartEmails.welcomeCredentials)).toBe(true)
    expect(memory.last?.subject).toContain("Aspirant Account Credentials")
    expect(memory.last?.html).toContain("Temp#Pass9012XyZ")
    expect(memory.last?.html).toContain("https://paartacademy.com/login")
    expect(memory.last?.text).toContain("Temp#Pass9012XyZ")
    expect(memory.last?.text).toContain("https://paartacademy.com/login")
    expect(memory.lastMime).toContain("Content-Type: multipart/alternative")
  })

  it("delivers raw MIME over loopback SMTP via NodeSmtpTransport", async () => {
    const smtp = await createLoopbackSmtpServer()
    try {
      const transport = new NodeSmtpTransport({
        host: "127.0.0.1",
        port: smtp.port,
        secure: false,
        tlsRejectUnauthorized: false
      })
      const mailer = createPaartMailer(transport, "PAART Academy <no-reply@paartacademy.com>")

      const result = await sendAccountCredentialsEmail({
        kind: "reset",
        toEmail: "faculty.reset@paartacademy.com",
        fullName: "Prof. Meenakshi",
        role: "faculty",
        temporaryPassword: "Reset!Pass4589Ab",
        origin: "http://localhost:5173",
        mailer
      })

      expect(isSuccess(result)).toBe(true)
      expect(smtp.receivedPayloads.length).toBe(1)
      expect(smtp.receivedPayloads[0]).toContain("Content-Type: multipart/alternative")
      expect(smtp.receivedPayloads[0]).toContain("Temporary Password Re-Issued")
      expect(smtp.receivedPayloads[0]).toContain("Reset!Pass4589Ab")
    } finally {
      await smtp.close()
    }
  })

  it("returns a Result failure without throwing when SMTP rejects delivery or cannot connect", async () => {
    const rejectingSmtp = await createLoopbackSmtpServer({ rejectRecipient: true })
    try {
      const transport = new NodeSmtpTransport({
        host: "127.0.0.1",
        port: rejectingSmtp.port,
        secure: false,
        connectionTimeoutMs: 1500,
        socketTimeoutMs: 1500
      })
      const mailer = createPaartMailer(transport, "PAART Academy <no-reply@paartacademy.com>")

      const result = await sendAccountCredentialsEmail({
        kind: "welcome",
        toEmail: "bounced@paartacademy.com",
        fullName: "Bounced Recipient",
        role: "aspirant",
        temporaryPassword: "Temp!Bounce12345",
        origin: "http://localhost:5173",
        mailer
      })

      expect(isFailure(result)).toBe(true)
      if (isFailure(result)) {
        expect(result.error.message).toContain("SMTP transport error")
      }
    } finally {
      await rejectingSmtp.close()
    }
  })
})
