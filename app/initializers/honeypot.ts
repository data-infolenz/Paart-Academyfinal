import { Honeypot } from "@sdxc/honeypot"
import { appConfig } from "~/config/app"

export const honeypot = new Honeypot({
  secret: appConfig.PAART_HONEYPOT_SECRET,
  minSeconds: 0
})

export async function issueHoneypotFields(): Promise<Record<string, string>> {
  const res = await honeypot.issue()
  if (res.status === "success") {
    return {
      [res.data.tokenField]: res.data.token,
      [res.data.trapField]: ""
    }
  }
  return {}
}
