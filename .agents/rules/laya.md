# Laya Decision Engine Rules

This repository integrates the [Laya](https://github.com/NandhaKishorM/laya) non-autoregressive System 1 decision engine via MCP (`laya` server in `.agents/plugins/laya/`).

---

## When to Consult Laya Tools

Agents MUST invoke Laya MCP tools (`call_mcp_tool`) in the following scenarios:

### 1. Error & Bug Triage
Whenever diagnosing an unexpected runtime error, stack trace, or failing test:
- **Subsystem Classification**: Call `laya_choice` to categorize the error root cause:
  `["database", "frontend-ui", "auth-session", "network-realtime", "type-check", "build-tooling"]`
- **Severity Scoring**: Call `laya_score` to evaluate severity:
  `["low: cosmetic or non-blocking warning", "medium: functional issue with workaround", "high: blocking crash or data integrity risk"]`

### 2. High-Impact Schema & Contract Changes
Before modifying public database schemas, core message contracts, or addon SDK interfaces:
- Call `laya_yes_no` with the proposed diff or change summary:
  *"Does this proposed change introduce a breaking API or database schema change?"*
- If verdict is `true` (`confidence >= 0.70`), explicitly alert the user to breaking implications.

### 3. Task Intent Routing
When a task or bug report is broad or multi-layered (e.g. *"improve performance"*, *"fix chat issues"*):
- Call `laya_choice` to determine the primary architectural layer to investigate first:
  `["api-database", "websocket-redis", "frontend-rerender", "addon-pipeline"]`

### 4. Explicit Invocations & Triage
Whenever the user invokes `/triage`, asks to score or classify text, or explicitly requests Laya analysis.
