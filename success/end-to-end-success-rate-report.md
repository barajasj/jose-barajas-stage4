# End-to-End Success Rate Report

## Overview

This report summarizes workflow execution outcomes using the latest actual workflow runs. It records what each outcome means for certification: which outcomes were achieved, at what rate, and what behavior was demonstrated.

Per-execution token and cost detail lives in `success/workflow-success-metrics.md`.

---

## Evaluation Cohort

Many workflow executions were performed during development and prompt refinement.

This report intentionally focuses on the final evaluation cohort used to validate the production workflow configuration.

Included Runs:

- 2026-10-10T18-37-44-451Z
- 2026-10-10T18-43-09-463Z

Excluded Runs:

Earlier executions were used for workflow development, prompt refinement, debugging, and guardrail validation.

# Executions

## Run 1

Outcome:

HUMAN_REVIEW_REQUIRED

Agent 3 Executed:

false

Run Folder:

`runs/2026-10-10T18-43-09-463Z`

Reason:

Agent 2 identified blocking ambiguities requiring human clarification.

---

## Run 2

Outcome:

WORKFLOW_SUCCESS

Agent 3 Executed:

true

Run Folder:

`runs/2026-10-10T18-37-44-451Z`

Reason:

Workflow completed successfully through all stages.

---

# Metrics

Total Runs:

2

Successful Runs:

1

Human Escalations:

1

Workflow Failures:

0

---

# Completion Rate

1 / 2

50%

---

# Escalation Rate

1 / 2

50%

---

# Failure Rate

0 / 2

0%

---

# Observations

The workflow demonstrated:

- Successful autonomous completion.
- Human escalation routing.
- Punch-out enforcement.
- Multi-agent orchestration.
- Deterministic guardrail validation.
- Audit logging and traceability.
- Token and cost estimation per execution.

No workflow execution failures were observed during measured runs.

A WORKFLOW_FAILURE outcome has been demonstrated separately; see `success/workflow-failure-evidence.md`.
