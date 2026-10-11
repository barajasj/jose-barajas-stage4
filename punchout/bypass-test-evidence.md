# Punch-Out Bypass Test Evidence

## Purpose

This document demonstrates that the workflow prevents continued execution after a valid human escalation decision.

The objective is to verify that a downstream agent cannot execute when a punch-out is active — even if a continuation is explicitly attempted.

---

# Test Scenario

Input:

test-data/sample-ticket.md

Expected Result:

HUMAN_REVIEW_REQUIRED

Reason:

The ticket contains requirements that require human clarification before implementation can safely proceed.

---

# Workflow Execution

Execution Path:

Ticket
→ Agent 1
→ Guardrail 1 PASS
→ Agent 2
→ Guardrail 2 PUNCH_OUT
→ Punch-Out Enforcement
→ BLOCKED
→ STOP

Run Folder:

`runs/2026-10-10T18-43-09-463Z`

Agent 2 Decision (`agent2-output.json`):

```json
{
  "status": "PUNCH_OUT",
  "blockingAmbiguities": [
    {
      "description": "The condenser type selection must present specific options, but the requirement does not list the valid values or state whether they are fixed, free text, or derived from equipment metadata.",
      "reason": "A user-visible selection cannot be built without knowing what choices to display. Inventing a list or defaulting to free text would materially change the required behavior and needs a product/HVAC domain decision.",
      "clarificationNeeded": "What are the exact condenser type options the user must select from, and are they a fixed list, free text, or sourced from existing equipment metadata?"
    },
    {
      "description": "The primary requirement targets the field for air-cooled DX systems, while the secondary rule says to show it whenever the selected system uses any DX cooling coil.",
      "reason": "A non-air-cooled DX system satisfies the secondary rule but may not be covered by the primary requirement. Whether the field should appear for such systems is a user-visible scope decision that creates materially different implementations.",
      "clarificationNeeded": "Should the condenser type field be shown for all DX systems with a DX cooling coil, or only for air-cooled DX systems?"
    }
  ],
  "rationale": "The requirement leaves the condenser type options undefined and gives conflicting signals about the field's visibility scope, both of which are user-visible product decisions that cannot be safely inferred."
}
```

---

# Bypass Attempt

A workflow continuation was attempted by manually invoking the Punch-Out Enforcement gate against the run's Agent 2 output — the same check the orchestrator performs before Agent 3 is allowed to execute.

Command Executed:

```text
node guardrails/enforce-punchout.js runs/2026-10-10T18-43-09-463Z/agent2-output.json
```

Observed Output:

```json
{
  "status": "BLOCKED",
  "guardrail": "punchout-enforcement",
  "action": "HUMAN_REVIEW_REQUIRED",
  "reason": "Workflow continuation blocked because Agent 2 requires human review.",
  "nextAgentAllowed": false
}
```

Observed Exit Code:

```text
2
```

Enforcement Result:

The continuation attempt was blocked deterministically. `nextAgentAllowed: false` and exit code 2 prevent any downstream agent invocation.

This result is also persisted by the workflow itself in `runs/2026-10-10T18-43-09-463Z/punchout-result.json`.

---

# Agent 3 Not Executed

Evidence that the bypass attempt did not reach Agent 3:

Run directory contents (`runs/2026-10-10T18-43-09-463Z`):

```text
agent1-output.md
agent2-output.json
guardrail1-result.json
guardrail2-result.json
punchout-result.json
run-audit.json
workflow-result.json
```

- No `agent3-input.md` was generated.
- No `agent3-output.json` exists.
- No `guardrail3-result.json` exists.

Workflow Result (`workflow-result.json`):

```json
{
  "outcome": "HUMAN_REVIEW_REQUIRED",
  "reason": "Workflow stopped because human clarification is required.",
  "agent3Executed": false
}
```

Audit Trail (`run-audit.json`):

Only two steps were recorded — Agent 1 and Agent 2. No Agent 3 step exists:

```json
{
  "workflowOutcome": "HUMAN_REVIEW_REQUIRED",
  "steps": [
    { "step": "Agent1", "status": "PASS" },
    { "step": "Agent2", "status": "PUNCH_OUT" }
  ]
}
```

---

# Conclusion

- A continuation after PUNCH_OUT was attempted against real workflow artifacts.
- Punch-Out Enforcement returned BLOCKED with exit code 2 and `nextAgentAllowed: false`.
- Agent 3 never executed: no Agent 3 artifacts exist and the audit trail contains only Agent 1 and Agent 2.
- Final outcome: HUMAN_REVIEW_REQUIRED (exit code 2), not WORKFLOW_FAILURE.
