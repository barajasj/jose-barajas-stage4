/**
 * Guardrail 3: Agent 3 Output Validator
 *
 * Validates the Implementation Readiness Reviewer response
 * and determines whether the workflow completed successfully.
 *
 * Exit codes:
 *   0 = READY, workflow success
 *   1 = NOT_READY or INVALID, workflow failure
 */

const fs = require("fs");

function fail(reason) {
  return {
    exitCode: 1,
    result: {
      status: "FAIL",
      guardrail: "agent3-output-validation",
      action: "WORKFLOW_FAILURE",
      reason,
    },
  };
}

function validateAgent3Output(content) {
  let output;

  try {
    output = JSON.parse(content);
  } catch (error) {
    return fail("Agent 3 output is not valid JSON.");
  }

  if (!output.status) {
    return fail("Agent 3 output does not contain a status.");
  }

  if (
    typeof output.readinessChecks !== "object" ||
    output.readinessChecks === null ||
    Array.isArray(output.readinessChecks)
  ) {
    return fail("Agent 3 output does not contain valid readinessChecks.");
  }

  const requiredChecks = [
    "requirementsActionable",
    "expectedBehaviorDefined",
    "noBlockingIssues",
  ];

  for (const check of requiredChecks) {
    if (typeof output.readinessChecks[check] !== "boolean") {
      return fail(`Readiness check '${check}' must be a boolean.`);
    }
  }

  if (!Array.isArray(output.remainingIssues)) {
    return fail("Agent 3 output does not contain a valid remainingIssues array.");
  }

  if (typeof output.rationale !== "string" || output.rationale.trim() === "") {
    return fail("Agent 3 output does not contain a valid rationale.");
  }

  if (output.status === "READY") {
    const allChecksPassed = requiredChecks.every(
      (check) => output.readinessChecks[check] === true
    );

    if (!allChecksPassed) {
      return fail(
        "Agent 3 returned READY but one or more readiness checks did not pass."
      );
    }

    if (output.remainingIssues.length > 0) {
      return fail(
        "Agent 3 returned READY but also reported remaining issues."
      );
    }

    return {
      exitCode: 0,
      result: {
        status: "READY",
        guardrail: "agent3-output-validation",
        action: "WORKFLOW_SUCCESS",
        reason: "All implementation readiness checks passed.",
      },
    };
  }

  if (output.status === "NOT_READY") {
    if (output.remainingIssues.length === 0) {
      return fail(
        "Agent 3 returned NOT_READY without identifying any remaining issues."
      );
    }

    return {
      exitCode: 1,
      result: {
        status: "NOT_READY",
        guardrail: "agent3-output-validation",
        action: "WORKFLOW_FAILURE",
        reason:
          "The requirement analysis is not ready for implementation.",
        remainingIssues: output.remainingIssues,
      },
    };
  }

  return fail(`Unknown Agent 3 status: ${output.status}`);
}

const inputFile = process.argv[2];

if (!inputFile) {
  console.error(
    JSON.stringify(
      {
        status: "FAIL",
        guardrail: "agent3-output-validation",
        action: "WORKFLOW_FAILURE",
        reason: "No Agent 3 output file was provided.",
      },
      null,
      2
    )
  );

  process.exit(1);
}

try {
  const content = fs
.readFileSync(inputFile, "utf8")
.replace(/^\uFEFF/, "")
.trim()
.replace(/^```(?:json)?\s*/i, "")
.replace(/\s*```$/, "");
  const validation = validateAgent3Output(content);

  console.log(JSON.stringify(validation.result, null, 2));

  process.exit(validation.exitCode);
} catch (error) {
  console.error(
    JSON.stringify(
      {
        status: "FAIL",
        guardrail: "agent3-output-validation",
        action: "WORKFLOW_FAILURE",
        reason: `Unable to read Agent 3 output: ${error.message}`,
      },
      null,
      2
    )
  );

  process.exit(1);
}