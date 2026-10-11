Describes: agents, handoffs, branching and escalation

# HVAC Ticket Analysis Workflow

## Purpose

This workflow analyzes HVAC software requirements from GitLab tickets and determines whether the ticket is ready for implementation or requires human clarification.

The workflow chains together three specialized AI agents with automated guardrails between each step.

## Terminology

- **Handoff:** transfer of output from one agent or guardrail to the next step.
- **Guardrail (validation):** gate that verifies required output fields exist; failure is a workflow failure.
- **Guardrail (routing):** branch point that directs a ticket down a different path based on a decision.
- **Punch-Out Enforcement:** deterministic gate that blocks all downstream agent execution after a PUNCH_OUT decision.
- **PASS:** agent-level decision — no blocking ambiguity; workflow may continue.
- **PUNCH_OUT:** agent-level decision — ticket is escalated to a human for clarification. A valid result, not a failure.
- **READY / NOT_READY:** Agent 3 readiness assessment; NOT_READY is a workflow failure.
- **WORKFLOW_SUCCESS:** terminal outcome — all agents executed and all guardrails passed.
- **HUMAN_REVIEW_REQUIRED:** terminal outcome — valid PUNCH_OUT escalated to human review.
- **WORKFLOW_FAILURE:** terminal outcome — abnormal termination; required output was not produced or validation failed.

---

## Workflow

Raw HVAC Ticket
    ↓

Agent 1 - Requirement Interpreter

Purpose:
Convert the raw ticket into structured requirements, assumptions, ambiguities, technical concepts, and clarification questions.

Output:
Structured requirement analysis with defined sections: requirements, assumptions, ambiguities, technical concepts, clarification questions.

    ↓

Guardrail 1 - Required Section Validation (validation guardrail)

Purpose:
Verify that all required output sections exist before continuing.

Fail Action:
WORKFLOW_FAILURE — terminates abnormally; distinct from PUNCH_OUT.

    ↓

Agent 2 - Ambiguity Risk Analyzer

Purpose:
Determine whether ambiguities are implementation-blocking and assess confidence.

Output:
PASS or PUNCH_OUT decision.

    ↓

Guardrail 2 - Escalation Check (routing guardrail)

Purpose:
Branch on Agent 2's decision. PUNCH_OUT routes the ticket to human clarification (escalation); PASS continues toward Agent 3.

Branch Action:
PUNCH_OUT → HUMAN_REVIEW_REQUIRED. Not a failure.
Invalid output → WORKFLOW_FAILURE.

    ↓

Punch-Out Enforcement (deterministic enforcement gate)

Purpose:
Re-verify Agent 2's decision before any downstream agent executes. If a PUNCH_OUT is active, continuation is blocked and no further agent may run.

Actions:
PASS → CONTINUE to Agent 3.
PUNCH_OUT → BLOCKED; workflow stops with HUMAN_REVIEW_REQUIRED.
Invalid input → WORKFLOW_FAILURE.

    ↓

Agent 3 - Implementation Readiness Reviewer

Purpose:
Determine whether a developer can confidently begin implementation.

Output:
READY or NOT_READY readiness assessment.

    ↓

Guardrail 3 - Readiness Validation (validation guardrail)

Purpose:
Validate Agent 3's readiness assessment before declaring success.

Fail Action:
NOT_READY or invalid output → WORKFLOW_FAILURE.

    ↓

Final Outcome (three terminal states)

WORKFLOW_SUCCESS:
All agents executed; all guardrails passed; ticket is ready for implementation.
Exit code: 0

HUMAN_REVIEW_REQUIRED:
Agent 2 returned PUNCH_OUT and Punch-Out Enforcement blocked continuation. Agent 3 was not executed.
Exit code: 2

WORKFLOW_FAILURE:
A guardrail validation or agent execution failed.
Exit code: 1
