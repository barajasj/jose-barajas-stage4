Describes: agents, handoffs, branching and escalation

# HVAC Ticket Analysis Workflow

## Purpose

This workflow analyzes HVAC software requirements from GitLab tickets and determines whether the ticket is ready for implementation or requires human clarification.

The workflow chains together three specialized AI agents with automated guardrails between each step.

## Terminology

- **Handoff:** transfer of output from one agent or guardrail to the next step.
- **Guardrail (validation):** gate that verifies required output fields exist; failure is a workflow failure.
- **Guardrail (routing):** branch point that directs a ticket down a different path based on a decision.
- **PASS:** terminal outcome — ticket is ready for implementation.
- **PUNCH_OUT:** terminal outcome — ticket is escalated to a human for clarification. A valid result, not a failure.
- **Workflow failure:** abnormal termination; required output was not produced.

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
Workflow failure — terminates abnormally; distinct from PUNCH_OUT.

    ↓

Agent 2 - Ambiguity Risk Analyzer

Purpose:
Determine whether ambiguities are implementation-blocking and assess confidence.

Output:
PASS or PUNCH_OUT decision.

    ↓

Guardrail 2 - Escalation Check (routing guardrail)

Purpose:
Branch on Agent 2's decision. PUNCH_OUT routes the ticket to human clarification (escalation); PASS continues to Agent 3.

Branch Action:
PUNCH_OUT → escalate to human clarification. Not a failure.

    ↓

Agent 3 - Implementation Readiness Reviewer

Purpose:
Determine whether a developer can confidently begin implementation.

Output:
Implementation readiness assessment.

    ↓

Final Outcome (two terminal states)

PASS:
Ready for implementation.

PUNCH_OUT:
Escalated — human clarification required.
