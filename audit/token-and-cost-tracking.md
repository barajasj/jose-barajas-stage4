# Token and Cost Tracking

## Purpose

Stage 4 workflows require visibility into execution costs and model usage.

This document describes the token and cost tracking strategy for the HVAC Ticket Analysis Workflow.

---

# Current Implementation

The workflow records token and cost estimates in:

`runs/<timestamp>/run-audit.json`

For each executed agent, `run-audit.json` stores:

- step and agent name
- model name
- status (PASS, PUNCH_OUT, etc.)
- inputTokens
- outputTokens
- estimatedCostUsd
- timestamp

Token counts are estimated by `audit-logger.js` using:

```text
Math.ceil(text.length / 4)
```

Cost is estimated using SWE-1.7 Max pricing:

- Input: $0.50 per 1,000,000 tokens
- Output: $2.50 per 1,000,000 tokens

```text
estimatedCostUsd =
  (inputTokens / 1_000_000 * 0.50) +
  (outputTokens / 1_000_000 * 2.50)
```

The workflow also calculates `totalEstimatedCostUsd` by summing per-agent costs.

---

# Example

From `runs/2026-10-10T18-37-44-451Z/run-audit.json` (WORKFLOW_SUCCESS):

| Step | Input Tokens | Output Tokens | Estimated Cost |
|---|---|---:|---:|
| Agent 1 | 326 | 926 | $0.002478 |
| Agent 2 | 926 | 101 | $0.000715 |
| Agent 3 | 1,042 | 139 | $0.000868 |
| **Total** | **2,294** | **1,166** | **$0.004061** |

From `runs/2026-10-10T18-43-09-463Z/run-audit.json` (HUMAN_REVIEW_REQUIRED):

| Step | Input Tokens | Output Tokens | Estimated Cost |
|---|---|---:|---:|
| Agent 1 | 72 | 732 | $0.001866 |
| Agent 2 | 732 | 385 | $0.001328 |
| **Total** | **804** | **1,117** | **$0.003194** |

---

# Traceability

Workflow executions are traceable through:

- agent1-output.md
- agent2-output.json
- agent3-output.json
- guardrail outputs
- workflow-result.json
- run-audit.json

This provides step-level visibility into workflow execution history, including token and cost estimates.

---

# Cost Visibility Goal

For each workflow execution:

```text
Workflow Run
    ↓

Agent 1
Input Tokens
Output Tokens
Cost

    ↓

Agent 2
Input Tokens
Output Tokens
Cost

    ↓

Agent 3
Input Tokens
Output Tokens
Cost

    ↓

Total Workflow Cost
```

The current implementation captures execution history and provides automated token and cost reporting based on the estimated token counts above.

---

## Cost Estimation Method

Token costs are estimated using SWE-1.7 Max pricing.

Pricing assumptions:

- Input: $0.50 per 1M tokens
- Output: $2.50 per 1M tokens

Token counts are estimated from character counts and are not provider-reported values.

Costs are therefore estimates intended for workflow-level monitoring rather than billing accuracy.
