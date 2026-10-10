# Workflow Monitoring

## Purpose

This document records workflow executions and their outcomes.

The goal is to demonstrate visibility into workflow behavior, execution paths, escalation events, and successful completions.

---

# Workflow Outcome Types

## WORKFLOW_SUCCESS

The workflow successfully completed all agent and guardrail stages.

Criteria:

- Agent 1 executed
- Guardrail 1 passed
- Agent 2 executed
- Guardrail 2 passed
- Punch-Out Enforcement passed
- Agent 3 executed
- Guardrail 3 passed

Result:

WORKFLOW_SUCCESS

Exit Code:

0

---

## HUMAN_REVIEW_REQUIRED

The workflow intentionally stopped because a human decision was required.

Criteria:

- Agent 2 identified a blocking ambiguity
- Guardrail 2 validated the escalation
- Punch-Out Enforcement blocked continuation
- Agent 3 did not execute

Result:

HUMAN_REVIEW_REQUIRED

Exit Code:

2

---

## WORKFLOW_FAILURE

The workflow failed because of:

- invalid agent output
- validation failures
- execution errors

Result:

WORKFLOW_FAILURE

Exit Code:

1

---

# Observed Executions

## Execution 1

Run Directory:

`runs/2026-10-10T18-43-09-463Z`

Outcome:

HUMAN_REVIEW_REQUIRED

Agent 3 Executed:

false

Workflow Cost:

$0.003194

Purpose:

Demonstrate human escalation workflow path.

---

## Execution 2

Run Directory:

`runs/2026-10-10T18-37-44-451Z`

Outcome:

WORKFLOW_SUCCESS

Agent 3 Executed:

true

Workflow Cost:

$0.004061

Purpose:

Demonstrate successful end-to-end workflow completion.

---

# Monitoring Strategy

Workflow monitoring is performed using:

- workflow-result.json
- guardrail result files
- agent outputs
- run-audit.json
- run execution directories

Each workflow execution generates a timestamped execution folder containing inputs, outputs, validation results, audit records, and final workflow outcome information.

This provides visibility into:

- successful completions
- escalation events
- workflow failures
- agent execution decisions
- workflow branching behavior
- token and cost estimates
