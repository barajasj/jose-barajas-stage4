# Workflow Success Metrics

## Purpose

This document is the quantitative annex for workflow executions: outcome definitions, per-execution records, and aggregate token/cost metrics.

Headline rates (completion, escalation, failure) and outcome interpretation live in `success/end-to-end-success-rate-report.md`.

Stage 3 focused on evaluating individual prompts.

Stage 4 evaluates the behavior of the complete workflow.

---

## Evaluation Cohort

Many workflow executions were performed during development and prompt refinement.

This document intentionally focuses on the final evaluation cohort used to validate the production workflow configuration.

Included Runs:

- 2026-10-10T18-37-44-451Z
- 2026-10-10T18-43-09-463Z

Excluded Runs:

Earlier executions were used for workflow development, prompt refinement, debugging, and guardrail validation.

# Workflow Outcomes

The workflow supports three outcomes:

## WORKFLOW_SUCCESS

Meaning:

The workflow completed all agent and guardrail stages successfully.

Exit Code:

0

---

## HUMAN_REVIEW_REQUIRED

Meaning:

The workflow intentionally stopped because a decision requiring human judgment was detected.

Exit Code:

2

---

## WORKFLOW_FAILURE

Meaning:

The workflow could not complete due to execution, validation, or workflow errors.

Exit Code:

1

---

# Recorded Executions

## Execution 1

Run Folder:

`runs/2026-10-10T18-43-09-463Z`

Outcome:

HUMAN_REVIEW_REQUIRED

Agent 3 Executed:

false

Workflow Cost:

$0.003194

Tokens:

1,921

Notes:

Agent 2 identified blocking ambiguities requiring clarification.

---

## Execution 2

Run Folder:

`runs/2026-10-10T18-37-44-451Z`

Outcome:

WORKFLOW_SUCCESS

Agent 3 Executed:

true

Workflow Cost:

$0.004061

Tokens:

3,460

Notes:

Workflow completed successfully through all stages.

---

# Current Metrics

Total Executions:

2

Successful Executions:

1

Human Escalations:

1

Workflow Failures:

0

---

# Outcome Distribution

- WORKFLOW_SUCCESS: 1 (50%)
- HUMAN_REVIEW_REQUIRED: 1 (50%)
- WORKFLOW_FAILURE: 0 (0%)

---

# Cost Metrics

Total Estimated Cost:

$0.007255

Average Estimated Cost:

$0.003628

---

# Token Metrics

Total Estimated Tokens:

5,381

Average Estimated Tokens per Run:

2,690.5
