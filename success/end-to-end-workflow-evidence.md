# End-to-End Workflow Evidence

## Overview

This document provides evidence that the HVAC Ticket Analysis Workflow successfully executes multiple AI agents, deterministic guardrails, workflow branching, human escalation controls, and final workflow outcomes.

---

# Workflow

HVAC Ticket
    ↓

Agent 1
Requirement Interpreter

    ↓

Guardrail 1
Output Structure Validation

    ↓

Agent 2
Ambiguity Risk Analyzer

    ↓

Guardrail 2
Escalation Validation

    ↓

Punch-Out Enforcement

    ↓

Agent 3
Implementation Readiness Reviewer

    ↓

Guardrail 3
Readiness Validation

    ↓

WORKFLOW_SUCCESS

or

HUMAN_REVIEW_REQUIRED

or

WORKFLOW_FAILURE

---

# Successful Workflow Execution

Run Folder:

`runs/2026-10-10T18-37-44-451Z`

Result:

- Outcome: WORKFLOW_SUCCESS
- Agent 3 Executed: true
- Exit Code: 0
- Estimated Workflow Cost: $0.004061

Agent Execution Path:

Ticket
→ Agent 1
→ Guardrail 1 PASS
→ Agent 2
→ Guardrail 2 PASS / CONTINUE
→ Punch-Out Enforcement CONTINUE
→ Agent 3
→ Guardrail 3 READY
→ WORKFLOW_SUCCESS

Evidence:

- Agent 1 executed successfully.
- Guardrail 1 passed.
- Agent 2 executed successfully.
- Guardrail 2 passed.
- Punch-Out Enforcement allowed continuation.
- Agent 3 executed successfully.
- Guardrail 3 passed.
- Workflow completed successfully.

Cost Detail (from `run-audit.json`):

| Step | Input Tokens | Output Tokens | Estimated Cost |
|---|---|---:|---:|
| Agent 1 | 326 | 926 | $0.002478 |
| Agent 2 | 926 | 101 | $0.000715 |
| Agent 3 | 1,042 | 139 | $0.000868 |
| **Total** | **2,294** | **1,166** | **$0.004061** |

---

# Human Escalation Execution

Run Folder:

`runs/2026-10-10T18-43-09-463Z`

Result:

- Outcome: HUMAN_REVIEW_REQUIRED
- Agent 3 Executed: false
- Exit Code: 2
- Estimated Workflow Cost: $0.003194

Agent Execution Path:

Ticket
→ Agent 1
→ Guardrail 1 PASS
→ Agent 2
→ Guardrail 2 PUNCH_OUT
→ Punch-Out Enforcement BLOCKED
→ STOP

Evidence:

- Agent 2 identified blocking ambiguities.
- Guardrail 2 validated the escalation.
- Punch-Out Enforcement blocked continuation.
- Agent 3 was not executed.
- Human review required.

Cost Detail (from `run-audit.json`):

| Step | Input Tokens | Output Tokens | Estimated Cost |
|---|---|---:|---:|
| Agent 1 | 72 | 732 | $0.001866 |
| Agent 2 | 732 | 385 | $0.001328 |
| **Total** | **804** | **1,117** | **$0.003194** |

---

# Demonstrated Workflow Outcomes

The workflow has demonstrated:

1. Successful automated completion.

2. Human escalation (Punch-Out).

3. Workflow stopping before downstream agent execution when escalation is required.

4. Deterministic guardrail enforcement.

5. End-to-end orchestration across multiple AI agents.
