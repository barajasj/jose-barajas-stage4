# Workflow Handoffs and Branching

## Overview

The HVAC Ticket Analysis Workflow connects three AI agents with deterministic validation and routing between stages.

Each agent has a specific responsibility, and the workflow controls whether execution continues, fails, or requires human intervention.

---

## Workflow Flow

HVAC GitLab Ticket
    |
    v
Agent 1 - Requirement Interpreter
    |
    v
Guardrail 1 - Agent 1 Output Validation
    |
    +-- INVALID --> WORKFLOW_FAILURE
    |
    v
Agent 2 - Ambiguity Risk Analyzer
    |
    v
Guardrail 2 - Agent 2 Output and Escalation Validation
    |
    +-- INVALID --> WORKFLOW_FAILURE
    |
    +-- PUNCH_OUT --> HUMAN_REVIEW_REQUIRED
    |
    v
Agent 3 - Implementation Readiness Reviewer
    |
    v
Guardrail 3 - Agent 3 Output Validation
    |
    +-- INVALID --> WORKFLOW_FAILURE
    |
    +-- NOT_READY --> WORKFLOW_FAILURE
    |
    v
READY
    |
    v
WORKFLOW_SUCCESS

---

## Handoff 1: Ticket to Agent 1

### Input

The original HVAC GitLab ticket.

### Agent

Agent 1 - Requirement Interpreter

### Expected Output

A structured interpretation containing the sections required by the certified Stage 3 prompt.

### Next Step

The output is sent to Guardrail 1 for structural validation.

The workflow must not continue to Agent 2 when the required Agent 1 output structure is invalid.

---

## Guardrail 1: Requirement Interpretation Validation

### Purpose

Verify that Agent 1 produced the required output structure before its output is consumed by another AI agent.

### PASS

The required sections are present and the output can be handed to Agent 2.

### FAIL

The workflow terminates as a workflow failure.

A malformed Agent 1 response is not a human punch-out because no human decision is required.

---

## Handoff 2: Agent 1 to Agent 2

### Input

The validated structured interpretation produced by Agent 1.

### Agent

Agent 2 - Ambiguity Risk Analyzer

### Expected Output

Valid JSON containing:

- status
- blockingAmbiguities
- rationale

The status must be either:

- PASS
- PUNCH_OUT

---

## Guardrail 2: Ambiguity and Escalation Validation

### Purpose

Validate the Agent 2 response and enforce the human escalation decision.

### PASS

If status is PASS:

- blockingAmbiguities must be empty.
- The workflow can continue to Agent 3.

### PUNCH_OUT

If status is PUNCH_OUT:

- At least one blocking ambiguity must be provided.
- The reason requiring human judgment must be recorded.
- The workflow stops.
- Agent 3 must not execute.
- Human review is required before the workflow can proceed.

### INVALID

Examples include:

- Invalid JSON.
- Missing status.
- Unknown status.
- PASS with blocking ambiguities.
- PUNCH_OUT without a blocking ambiguity.

Invalid output causes a workflow failure rather than a human punch-out.

---

## Human Punch-Out Branch

A punch-out is intentionally different from workflow failure.

A punch-out occurs when the AI workflow is functioning correctly but identifies a decision that should not be made autonomously.

Examples include unresolved:

- Business decisions.
- Engineering decisions.
- Product decisions.
- HVAC-domain decisions.

When PUNCH_OUT occurs:

1. The reason is recorded.
2. The blocking ambiguity is recorded.
3. The clarification question is recorded.
4. Execution stops.
5. Agent 3 is not invoked.
6. Human review is required.

The workflow must not silently bypass or override this branch.

---

## Handoff 3: Agent 2 to Agent 3

This handoff occurs only when Agent 2 returns a valid PASS result.

### Input

Agent 3 receives:

1. The validated Agent 1 requirement interpretation.
2. The validated Agent 2 PASS assessment.

### Agent

Agent 3 - Implementation Readiness Reviewer

### Expected Output

Valid JSON containing:

- status
- readinessChecks
- remainingIssues
- rationale

The status must be:

- READY
- NOT_READY

---

## Guardrail 3: Implementation Readiness Validation

### READY

When the output is valid and status is READY:

- All required readiness checks must pass.
- remainingIssues must be empty.
- The workflow completes successfully.

### NOT_READY

When status is NOT_READY:

- At least one remaining issue must be identified.
- The workflow terminates as a workflow failure.

NOT_READY is not automatically converted to PUNCH_OUT.

Human escalation is reserved for decisions explicitly identified as requiring human judgment.

---

## Final Outcomes

The workflow has three possible final outcomes.

### WORKFLOW_SUCCESS

Agent 3 returns READY and all guardrails pass.

### HUMAN_REVIEW_REQUIRED

Agent 2 returns PUNCH_OUT — a blocking decision requiring human judgment.

The workflow intentionally stops and requests human review.

### WORKFLOW_FAILURE

The workflow cannot complete correctly because of invalid agent output, failed validation, or an incomplete implementation-readiness result.

---

## Key Principle

Workflow failures and human punch-outs are intentionally separate.

A workflow failure means the automated process did not successfully produce a valid result.

A punch-out means the automated process operated correctly and intentionally identified a decision that should be made by a human rather than by AI.