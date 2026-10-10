# Audit Trail

## Purpose

This document explains how workflow executions can be traced from initial input through final outcome.

The goal is to answer:

- Which agent produced which output?
- Which guardrail validated that output?
- What workflow path was taken?
- Why did the workflow succeed, fail, or escalate?

---

# Workflow Traceability

HVAC Ticket
    ↓

Agent 1
Requirement Interpreter

Output:
agent1-output.md

Validation:
guardrail1-result.json

    ↓

Agent 2
Ambiguity Risk Analyzer

Output:
agent2-output.json

Validation:
guardrail2-result.json

    ↓

Punch-Out Enforcement

Output:
punchout-result.json

    ↓

Agent 3
Implementation Readiness Reviewer

Output:
agent3-output.json

Validation:
guardrail3-result.json

    ↓

workflow-result.json

---

# Execution Artifacts

Each workflow execution creates a timestamped directory:

`runs/<timestamp>/`

Example success run:

`runs/2026-10-10T18-37-44-451Z/`

Contents:

- agent1-output.md
- guardrail1-result.json
- agent2-output.json
- guardrail2-result.json
- punchout-result.json
- agent3-input.md
- agent3-output.json
- guardrail3-result.json
- workflow-result.json
- run-audit.json

---

# Trace Example: Human Escalation Path

Run:

`runs/2026-10-10T18-43-09-463Z`

Workflow Outcome:

HUMAN_REVIEW_REQUIRED

Workflow Cost:

$0.003194

Trace:

Ticket
→ Agent 1
→ Guardrail 1 PASS
→ Agent 2
→ Guardrail 2 PUNCH_OUT
→ Punch-Out Enforcement BLOCKED
→ Workflow Stopped

Agent 3 Executed:

false

Final File:

workflow-result.json

---

# Trace Example: Successful Workflow Path

Run:

`runs/2026-10-10T18-37-44-451Z`

Workflow Outcome:

WORKFLOW_SUCCESS

Workflow Cost:

$0.004061

Trace:

Ticket
→ Agent 1
→ Guardrail 1 PASS
→ Agent 2
→ Guardrail 2 PASS
→ Punch-Out Enforcement CONTINUE
→ Agent 3
→ Guardrail 3 READY
→ Workflow Success

Agent 3 Executed:

true

Final File:

workflow-result.json

---

# Workflow Decisions

Each workflow branch is recorded through artifacts generated during execution.

Examples:

Guardrail Failure:
- Validation result file records failure.
- Workflow terminates.

Punch-Out:
- Escalation recorded.
- Punch-out enforcement recorded.
- Agent 3 not executed.

Success:
- Agent outputs recorded.
- Validation results recorded.
- Workflow completion recorded.

---

# Audit Strategy

Workflow executions are fully traceable through:

- input ticket
- agent outputs
- guardrail validations
- punch-out decisions
- workflow result artifacts
- run-audit.json

A reviewer can reconstruct the exact execution path for each workflow run using the generated run directory contents.
