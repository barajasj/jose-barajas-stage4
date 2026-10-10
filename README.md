# HVAC Ticket Analysis Workflow (Stage 4 Certification)

## Overview

This project demonstrates a Stage 4 Generative AI workflow that analyzes HVAC software requirements using multiple AI agents, deterministic guardrails, workflow branching, human escalation controls, monitoring, auditability, and workflow-level evaluation.

The workflow extends the previously certified Stage 3 HVAC Requirement Interpreter into a complete multi-agent workflow.

---

# Certification Evidence

The workflow successfully demonstrates:

- Multi-agent workflow orchestration
- Stage 3 certified prompt reuse
- Deterministic guardrails
- Human escalation (Punch-Out)
- Punch-Out enforcement
- Workflow branching
- End-to-end workflow execution
- Workflow monitoring
- Audit logging
- Token estimation
- Cost estimation
- Workflow-level metrics
- Agent evaluation and refinement
- Execution traceability

Demonstrated Outcomes:

| Outcome | Demonstrated |
|----------|----------|
| WORKFLOW_SUCCESS | Yes |
| HUMAN_REVIEW_REQUIRED | Yes |
| WORKFLOW_FAILURE | Supported through guardrail validation paths |

---

# Workflow

```text
HVAC Ticket
    ↓

Agent 1
Requirement Interpreter

    ↓

Guardrail 1
Output Validation

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
```

---

# Agents

## Agent 1 – Requirement Interpreter

Purpose:

Interpret HVAC software requirements and produce structured analysis.

Output:

- Requirement Summary
- HVAC Terminology
- Developer Interpretation
- Ambiguities / Missing Information

Origin:

Reused from the previously certified Stage 3 HVAC Requirement Interpreter.

---

## Agent 2 – Ambiguity Risk Analyzer

Purpose:

Determine whether implementation can safely continue or whether human review is required.

Outputs:

- PASS
- PUNCH_OUT

Responsibilities:

- Evaluate ambiguities identified during requirement interpretation.
- Distinguish implementation discovery from business/domain decisions.
- Route blocking decisions for human review.

---

## Agent 3 – Implementation Readiness Reviewer

Purpose:

Determine whether interpreted requirements are sufficiently defined to begin implementation.

Outputs:

- READY
- NOT_READY

Responsibilities:

- Verify requirements are actionable.
- Verify expected behavior is defined.
- Determine implementation readiness.

---

# Guardrails

## Guardrail 1 – Agent 1 Output Validation

Purpose:

Validate the required output structure produced by Agent 1.

Results:

- PASS
- FAIL

---

## Guardrail 2 – Agent 2 Output Validation

Purpose:

Validate ambiguity analysis and escalation decisions.

Results:

- PASS
- PUNCH_OUT
- FAIL

---

## Punch-Out Enforcement

Purpose:

Prevent execution of downstream workflow stages after a valid human escalation decision.

Results:

- CONTINUE
- BLOCKED

---

## Guardrail 3 – Agent 3 Output Validation

Purpose:

Validate implementation-readiness assessments.

Results:

- READY
- NOT_READY
- FAIL

---

# Workflow Outcomes

## WORKFLOW_SUCCESS

The workflow completed successfully.

Conditions:

- All agents executed successfully.
- All guardrails passed.
- No human escalation was required.

Exit Code:

```text
0
```

---

## HUMAN_REVIEW_REQUIRED

The workflow intentionally stopped because a decision requiring human judgment was identified.

Conditions:

- Agent 2 returned PUNCH_OUT.
- Punch-Out Enforcement blocked continuation.

Exit Code:

```text
2
```

---

## WORKFLOW_FAILURE

The workflow terminated because of a validation, execution, or workflow error.

Exit Code:

```text
1
```

---

# Demonstrated Outcomes

## Human Escalation

Observed Outcome:

```text
HUMAN_REVIEW_REQUIRED
```

Behavior:

- Agent 2 identified a blocking ambiguity.
- Guardrail 2 validated the escalation.
- Punch-Out Enforcement blocked continuation.
- Agent 3 was not executed.

Evidence:

See:

```text
punchout/bypass-test-evidence.md
```

---

## Successful Completion

Observed Outcome:

```text
WORKFLOW_SUCCESS
```

Behavior:

- Agent 1 executed successfully.
- Agent 2 executed successfully.
- Agent 3 executed successfully.
- All guardrails passed.
- Workflow completed automatically.

Evidence:

See:

```text
success/end-to-end-workflow-evidence.md
```

---

# Monitoring

Workflow executions generate timestamped execution artifacts:

```text
runs/<timestamp>/
```

Artifacts include:

- Agent outputs
- Guardrail results
- Punch-out decisions
- Workflow results
- Audit records
- Token estimates
- Cost estimates

See:

```text
audit/workflow-monitoring.md
```

---

# Audit Trail

Workflow executions are fully traceable through:

- Input ticket
- Agent outputs
- Guardrail validations
- Punch-out actions
- Workflow outcomes
- Audit records

See:

```text
audit/audit-trail.md
```

---

# Token and Cost Tracking

Workflow executions generate estimated:

- Input tokens
- Output tokens
- Per-agent cost
- Total workflow cost

Audit records are stored as:

```text
runs/<timestamp>/run-audit.json
```

See:

```text
audit/token-and-cost-tracking.md
```

---

# Evaluation Evidence

Agent evaluation and prompt refinement evidence:

```text
success/agent-evaluation-evidence.md
```

Workflow execution evidence:

```text
success/end-to-end-workflow-evidence.md
```

Workflow outcome and success-rate summary:

```text
success/end-to-end-success-rate-report.md
```

Execution metrics detail (per-run tokens, cost, outcome definitions):

```text
success/workflow-success-metrics.md
```

---

# Repository Structure

```text
agents/
│
├── agent1-requirement-interpreter.md
├── agent2-ambiguity-risk-analyzer.md
└── agent3-implementation-readiness.md

audit/
│
├── audit-trail.md
├── token-and-cost-tracking.md
└── workflow-monitoring.md

guardrails/
│
├── validate-agent1-output.js
├── validate-agent2-output.js
├── validate-agent3-output.js
└── enforce-punchout.js

monitoring/
│
└── audit-logger.js

punchout/
│
└── bypass-test-evidence.md

runs/

success/
│
├── agent-evaluation-evidence.md
├── end-to-end-success-rate-report.md
├── end-to-end-workflow-evidence.md
├── workflow-failure-evidence.md
└── workflow-success-metrics.md

test-data/

workflow/
│
├── workflow-definition.md
├── handoffs-and-branching.md
├── workflow-config.json
├── workflow.js
└── run-agent.js

devin.js
README.md
```

---

# Stage 4 Capabilities Demonstrated

- Multi-agent workflow orchestration
- Stage 3 certified prompt reuse
- Deterministic guardrails
- Human escalation (Punch-Out)
- Punch-Out enforcement
- Workflow branching
- End-to-end workflow execution
- Workflow monitoring
- Audit logging
- Token estimation
- Cost estimation
- Workflow-level metrics
- Agent evaluation evidence
- Execution traceability