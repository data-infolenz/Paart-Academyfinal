import net from "node:net"
import tls from "node:tls"
import { currentLog } from "@sdxc/logger"
import {
  type Address,
  buildMimeMessage,
  createEmail,
  createMail,
  Email,
  email,
  emails,
  MailError,
  Mailer,
  type NormalizedMessage,
  type SentMessage,
  type Transport
} from "@sdxc/mail"
import { MemoryTransport } from "@sdxc/mail/memory"
import { PrintTransport } from "@sdxc/mail/print"
import { failure, isFailure, type Result, success } from "@sdxc/result"
import type { Handle } from "remix/component"
import * as s from "remix/data-schema"
import { appConfig } from "~/config/app"

const credentialEmailSchema = s.object({
  fullName: s.string(),
  email: s.string(),
  roleLabel: s.string(),
  temporaryPassword: s.string(),
  loginUrl: s.string(),
  batchSummary: s.optional(s.string())
})

export type CredentialEmailProps = s.InferOutput<typeof credentialEmailSchema>

export const paartEmails = emails({
  welcomeCredentials: email({ props: credentialEmailSchema }),
  resetCredentials: email({ props: credentialEmailSchema })
})

function WelcomeCredentialsBody(handle: Handle<CredentialEmailProps & { locale: string }>) {
  return () => {
    const {
      fullName,
      email: recipientEmail,
      roleLabel,
      temporaryPassword,
      loginUrl,
      batchSummary
    } = handle.props

    const rows = [
      { label: "Account Role", value: roleLabel },
      { label: "Sign-In Email", value: recipientEmail },
      {
        label: "Temporary Password",
        value: <Email.CodeInline>{temporaryPassword}</Email.CodeInline>
      },
      ...(batchSummary ? [{ label: "Assigned Batch", value: batchSummary }] : [])
    ]

    return (
      <Email.Layout
        lang="en"
        title="Welcome to PAART Academy"
        preview={`Your ${roleLabel} workspace credentials for PAART Academy are ready.`}
        background="#f7f5f0"
        surface="#ffffff"
        color="#182232"
      >
        <Email.Heading level={1} color="#122138">
          Welcome to PAART Academy
        </Email.Heading>
        <Email.Text>Dear {fullName},</Email.Text>
        <Email.Text>
          Your {roleLabel} account has been provisioned by the PAART Academy administration office.
          Use the temporary credentials below to sign in and set your permanent password.
        </Email.Text>
        <Email.Section padding="12px 0">
          <Email.Table rows={rows} borderColor="#e5e0d5" />
        </Email.Section>
        <Email.Section padding="12px 0">
          <Email.Button href={loginUrl} background="#162b4c" color="#ffffff" radius={6}>
            Sign In to PAART Academy
          </Email.Button>
        </Email.Section>
        <Email.Text muted size={13}>
          For your security, you will be required to choose a new password immediately on your first
          sign-in. Never share your password with anyone.
        </Email.Text>
        <Email.Footer color="#64748b" borderColor="#e5e0d5">
          PAART Academy — Competitive Exam Excellence (TNPSC · UPSC · SSC · Banking) · Chennai
        </Email.Footer>
      </Email.Layout>
    )
  }
}

function ResetCredentialsBody(handle: Handle<CredentialEmailProps & { locale: string }>) {
  return () => {
    const {
      fullName,
      email: recipientEmail,
      roleLabel,
      temporaryPassword,
      loginUrl,
      batchSummary
    } = handle.props

    const rows = [
      { label: "Account Role", value: roleLabel },
      { label: "Sign-In Email", value: recipientEmail },
      {
        label: "New Temporary Password",
        value: <Email.CodeInline>{temporaryPassword}</Email.CodeInline>
      },
      ...(batchSummary ? [{ label: "Assigned Batch", value: batchSummary }] : [])
    ]

    return (
      <Email.Layout
        lang="en"
        title="PAART Academy Credentials Reset"
        preview="Your PAART Academy temporary sign-in password has been reset."
        background="#f7f5f0"
        surface="#ffffff"
        color="#182232"
      >
        <Email.Heading level={1} color="#122138">
          Temporary Password Re-Issued
        </Email.Heading>
        <Email.Text>Dear {fullName},</Email.Text>
        <Email.Text>
          An administrator has reset your PAART Academy {roleLabel} sign-in credentials and revoked
          all previous active sessions. Sign in using the temporary password below to set a new
          password.
        </Email.Text>
        <Email.Section padding="12px 0">
          <Email.Table rows={rows} borderColor="#e5e0d5" />
        </Email.Section>
        <Email.Section padding="12px 0">
          <Email.Button href={loginUrl} background="#162b4c" color="#ffffff" radius={6}>
            Sign In &amp; Update Password
          </Email.Button>
        </Email.Section>
        <Email.Text muted size={13}>
          If you did not expect this reset, please contact the PAART Academy administration desk
          immediately.
        </Email.Text>
        <Email.Footer color="#64748b" borderColor="#e5e0d5">
          PAART Academy — Competitive Exam Excellence · Security Notification
        </Email.Footer>
      </Email.Layout>
    )
  }
}

export const welcomeCredentialsTemplate = createEmail(paartEmails.welcomeCredentials, {
  subject: ({ roleLabel }) => `Your PAART Academy ${roleLabel} Account Credentials`,
  body: WelcomeCredentialsBody
})

export const resetCredentialsTemplate = createEmail(paartEmails.resetCredentials, {
  subject: () => "PAART Academy — Your Temporary Sign-In Password Has Been Reset",
  body: ResetCredentialsBody
})

export const paartMail = createMail()
paartMail.map(paartEmails.welcomeCredentials, welcomeCredentialsTemplate)
paartMail.map(paartEmails.resetCredentials, resetCredentialsTemplate)

export function parseSenderAddress(rawFrom: string): Address {
  const trimmed = rawFrom.trim()
  const bracketMatch = /^(?:"?([^"<]*)"?\s*)?<([^<>]+)>$/.exec(trimmed)
  if (bracketMatch) {
    const name = bracketMatch[1]?.trim()
    const emailAddr = bracketMatch[2]!.trim()
    return name ? { name, email: emailAddr } : { email: emailAddr }
  }
  return { email: trimmed }
}

export interface SmtpTransportConfig {
  host: string
  port: number
  secure: boolean
  user?: string
  pass?: string
  connectionTimeoutMs?: number
  socketTimeoutMs?: number
  tlsRejectUnauthorized?: boolean
  clientHostname?: string
}

interface SmtpReply {
  code: number
  lines: string[]
}

function sanitizeEnvelopeEmail(value: string): string {
  return value.replace(/[\r\n<>]/g, "").trim()
}

function dotStuffMime(rawMime: string): string {
  const normalized = rawMime.replace(/\r?\n/g, "\r\n")
  const stuffed = normalized.replace(/(^|\r\n)\./g, "$1..")
  return stuffed.endsWith("\r\n") ? `${stuffed}.\r\n` : `${stuffed}\r\n.\r\n`
}

class SmtpLineReader {
  #socket: net.Socket | tls.TLSSocket
  #buffer = ""
  #pendingLines: string[] = []
  #waiter: {
    resolve: (reply: SmtpReply) => void
    reject: (error: Error) => void
    timer: ReturnType<typeof setTimeout>
  } | null = null
  #closedError: Error | null = null
  readonly #timeoutMs: number

  constructor(socket: net.Socket | tls.TLSSocket, timeoutMs: number) {
    this.#socket = socket
    this.#timeoutMs = timeoutMs
    this.#attach(socket)
  }

  upgradeSocket(tlsSocket: tls.TLSSocket): void {
    this.#socket.removeAllListeners("data")
    this.#socket.removeAllListeners("error")
    this.#socket.removeAllListeners("close")
    this.#socket = tlsSocket
    this.#buffer = ""
    this.#pendingLines = []
    this.#attach(tlsSocket)
  }

  get socket(): net.Socket | tls.TLSSocket {
    return this.#socket
  }

  #attach(socket: net.Socket | tls.TLSSocket): void {
    socket.on("data", (chunk: Buffer | string) => {
      this.#buffer += typeof chunk === "string" ? chunk : chunk.toString("utf8")
      this.#drain()
    })
    socket.on("error", (err: Error) => {
      this.#closedError = err
      if (this.#waiter) {
        const current = this.#waiter
        this.#waiter = null
        clearTimeout(current.timer)
        current.reject(err)
      }
    })
    socket.on("close", () => {
      if (!this.#closedError) {
        this.#closedError = new Error("SMTP connection closed unexpectedly.")
      }
      if (this.#waiter) {
        const current = this.#waiter
        this.#waiter = null
        clearTimeout(current.timer)
        current.reject(this.#closedError)
      }
    })
  }

  #drain(): void {
    if (!this.#waiter) return
    let idx = this.#buffer.indexOf("\r\n")
    while (idx !== -1) {
      const line = this.#buffer.slice(0, idx)
      this.#buffer = this.#buffer.slice(idx + 2)
      this.#pendingLines.push(line)

      if (/^\d{3}(?: |$)/.test(line)) {
        const code = Number.parseInt(line.slice(0, 3), 10)
        const lines = this.#pendingLines
        this.#pendingLines = []
        const current = this.#waiter
        this.#waiter = null
        clearTimeout(current.timer)
        current.resolve({ code, lines })
        return
      }
      idx = this.#buffer.indexOf("\r\n")
    }
  }

  readReply(): Promise<SmtpReply> {
    if (this.#closedError) {
      return Promise.reject(this.#closedError)
    }
    return new Promise<SmtpReply>((resolve, reject) => {
      const timer = setTimeout(() => {
        if (this.#waiter) {
          this.#waiter = null
        }
        reject(new Error(`SMTP command timed out after ${this.#timeoutMs}ms.`))
      }, this.#timeoutMs)
      this.#waiter = { resolve, reject, timer }
      this.#drain()
    })
  }

  async command(line: string, expectedHundreds: readonly number[]): Promise<SmtpReply> {
    this.#socket.write(`${line}\r\n`)
    const reply = await this.readReply()
    const category = Math.floor(reply.code / 100)
    if (!expectedHundreds.includes(category)) {
      throw new Error(`SMTP error (${reply.code}): ${reply.lines.join(" ")}`)
    }
    return reply
  }

  async sendRawData(payload: string): Promise<SmtpReply> {
    this.#socket.write(payload)
    const reply = await this.readReply()
    if (Math.floor(reply.code / 100) !== 2) {
      throw new Error(`SMTP DATA rejected (${reply.code}): ${reply.lines.join(" ")}`)
    }
    return reply
  }
}

function connectSocket(config: SmtpTransportConfig): Promise<net.Socket | tls.TLSSocket> {
  const timeoutMs = config.connectionTimeoutMs ?? 8000
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      socket.destroy()
      reject(new Error(`SMTP connection to ${config.host}:${config.port} timed out.`))
    }, timeoutMs)

    const onConnect = () => {
      clearTimeout(timer)
      socket.removeListener("error", onError)
      resolve(socket)
    }

    const onError = (err: Error) => {
      clearTimeout(timer)
      reject(err)
    }

    const socket = config.secure
      ? tls.connect(
          {
            host: config.host,
            port: config.port,
            servername: config.host,
            rejectUnauthorized: config.tlsRejectUnauthorized ?? true
          },
          onConnect
        )
      : net.connect({ host: config.host, port: config.port }, onConnect)

    socket.once("error", onError)
  })
}

function upgradeToTls(
  plainSocket: net.Socket,
  config: SmtpTransportConfig
): Promise<tls.TLSSocket> {
  const timeoutMs = config.connectionTimeoutMs ?? 8000
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      tlsSocket.destroy()
      reject(new Error("SMTP STARTTLS handshake timed out."))
    }, timeoutMs)

    const tlsSocket = tls.connect(
      {
        socket: plainSocket,
        servername: config.host,
        rejectUnauthorized: config.tlsRejectUnauthorized ?? true
      },
      () => {
        clearTimeout(timer)
        tlsSocket.removeListener("error", onError)
        resolve(tlsSocket)
      }
    )

    const onError = (err: Error) => {
      clearTimeout(timer)
      reject(err)
    }
    tlsSocket.once("error", onError)
  })
}

export class NodeSmtpTransport implements Transport {
  readonly #config: SmtpTransportConfig

  constructor(config: SmtpTransportConfig) {
    this.#config = config
  }

  async send(message: NormalizedMessage): Promise<Result<SentMessage, MailError>> {
    const recipients = [
      ...message.to.map((addr) => addr.email),
      ...message.cc.map((addr) => addr.email),
      ...message.bcc.map((addr) => addr.email)
    ]
    if (recipients.length === 0) {
      return failure(new MailError("SMTP transport error: message has no recipients."))
    }

    const rawMime = buildMimeMessage(message)
    const clientHost = (this.#config.clientHostname ?? "paartacademy.local").replace(
      /[^a-zA-Z0-9.-]/g,
      ""
    )

    let activeSocket: net.Socket | tls.TLSSocket | null = null
    try {
      activeSocket = await connectSocket(this.#config)
      const reader = new SmtpLineReader(activeSocket, this.#config.socketTimeoutMs ?? 12_000)

      const banner = await reader.readReply()
      if (Math.floor(banner.code / 100) !== 2) {
        throw new Error(`SMTP greeting rejected (${banner.code}): ${banner.lines.join(" ")}`)
      }

      let ehlo = await reader.command(`EHLO ${clientHost}`, [2])
      const supportsStartTls =
        !this.#config.secure && ehlo.lines.some((line) => /\bSTARTTLS\b/i.test(line))

      if (
        supportsStartTls &&
        activeSocket instanceof net.Socket &&
        !(activeSocket instanceof tls.TLSSocket)
      ) {
        await reader.command("STARTTLS", [2])
        const tlsSocket = await upgradeToTls(activeSocket, this.#config)
        activeSocket = tlsSocket
        reader.upgradeSocket(tlsSocket)
        ehlo = await reader.command(`EHLO ${clientHost}`, [2])
      }

      if (this.#config.user && this.#config.user.trim().length > 0) {
        const token = Buffer.from(
          `\u0000${this.#config.user}\u0000${this.#config.pass ?? ""}`,
          "utf8"
        ).toString("base64")
        await reader.command(`AUTH PLAIN ${token}`, [2])
      }

      const sender = sanitizeEnvelopeEmail(message.from.email)
      await reader.command(`MAIL FROM:<${sender}>`, [2])

      for (const recipient of recipients) {
        const cleanRecipient = sanitizeEnvelopeEmail(recipient)
        await reader.command(`RCPT TO:<${cleanRecipient}>`, [2])
      }

      await reader.command("DATA", [3])
      await reader.sendRawData(dotStuffMime(rawMime))

      try {
        await reader.command("QUIT", [2])
      } catch {
        // Server already accepted DATA (2xx); ignore QUIT close race.
      }
      activeSocket.end()
      return success({ messageId: message.messageId })
    } catch (cause) {
      if (activeSocket && !activeSocket.destroyed) {
        activeSocket.destroy()
      }
      const reason = cause instanceof Error ? cause.message : "SMTP delivery failed."
      return failure(new MailError(`SMTP transport error: ${reason}`, { cause }))
    }
  }
}

export const SmtpTransport = NodeSmtpTransport

export const localMailOutbox = new MemoryTransport({ mime: true })

class LocalDevFallbackTransport implements Transport {
  readonly #memory: MemoryTransport
  readonly #printer: PrintTransport | null

  constructor(memory: MemoryTransport, enablePrint: boolean) {
    this.#memory = memory
    this.#printer = enablePrint
      ? new PrintTransport({
          write: (summary) => {
            currentLog()?.note("mail.local_outbox", {
              previewLength: summary.length
            })
          }
        })
      : null
  }

  async send(message: NormalizedMessage): Promise<Result<SentMessage, MailError>> {
    const recorded = await this.#memory.send(message)
    if (this.#printer) {
      await this.#printer.send(message)
    }
    return recorded
  }
}

let cachedDefaultMailer: Mailer | null = null
let mailerOverrideForTests: Mailer | null = null

export function setMailerOverrideForTests(override: Mailer | null): void {
  mailerOverrideForTests = override
}

export function createPaartMailer(transport?: Transport, fromRaw = appConfig.SMTP_FROM): Mailer {
  const resolvedTransport =
    transport ??
    (appConfig.SMTP_HOST.trim().length > 0
      ? new NodeSmtpTransport({
          host: appConfig.SMTP_HOST.trim(),
          port: appConfig.SMTP_PORT,
          secure: appConfig.SMTP_SECURE,
          user: appConfig.SMTP_USER,
          pass: appConfig.SMTP_PASS
        })
      : new LocalDevFallbackTransport(localMailOutbox, appConfig.NODE_ENV === "development"))

  return new Mailer({
    transport: resolvedTransport,
    from: parseSenderAddress(fromRaw),
    mail: paartMail
  })
}

export function getMailer(): Mailer {
  if (mailerOverrideForTests) return mailerOverrideForTests
  if (!cachedDefaultMailer) {
    cachedDefaultMailer = createPaartMailer()
  }
  return cachedDefaultMailer
}

export function formatRoleLabel(role: "admin" | "faculty" | "aspirant"): string {
  switch (role) {
    case "admin":
      return "Administrator"
    case "faculty":
      return "Faculty"
    case "aspirant":
      return "Aspirant"
  }
}

export interface SendCredentialsEmailInput {
  kind: "welcome" | "reset"
  toEmail: string
  fullName: string
  role: "admin" | "faculty" | "aspirant"
  temporaryPassword: string
  origin: string
  batchSummary?: string
  mailer?: Mailer
}

export async function sendAccountCredentialsEmail(
  input: SendCredentialsEmailInput
): Promise<Result<SentMessage, MailError>> {
  const mailer = input.mailer ?? getMailer()
  const loginUrl = new URL("/login", input.origin).toString()
  const declaration =
    input.kind === "reset" ? paartEmails.resetCredentials : paartEmails.welcomeCredentials

  const result = await mailer.send(declaration, {
    to: { name: input.fullName, email: input.toEmail },
    props: {
      fullName: input.fullName,
      email: input.toEmail,
      roleLabel: formatRoleLabel(input.role),
      temporaryPassword: input.temporaryPassword,
      loginUrl,
      batchSummary: input.batchSummary
    }
  })

  if (isFailure(result)) {
    currentLog()?.warn("mail.credentials_delivery_failed", {
      kind: input.kind,
      role: input.role,
      reason: result.error.message
    })
  }

  return result
}
