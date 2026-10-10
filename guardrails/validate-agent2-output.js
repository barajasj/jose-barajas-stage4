/**
 * Guardrail 2: Agent 2 Output and Escalation Validator
 *
 * Validates the Ambiguity Risk Analyzer response and determines
 * whether the workflow may continue to Agent 3 or must stop
 * for human review.
 *
 * Exit codes:
 *   0 = PASS, workflow may continue
 *   1 = INVALID, workflow failure
 *   2 = PUNCH_OUT, human review required
 */

const fs = require("fs");

function fail(reason) {
  return {
    exitCode: 1,
    result: {
      status: "FAIL",
      guardrail: "agent2-output-validation",
      reason,
    },
  };
}

function validateAgent2Output(content) {
  let output;

  try {
    output = JSON.parse(content);
  } catch (error) {
    return fail("Agent 2 output is not valid JSON.");
  }

  if (!output.status) {
    return fail("Agent 2 output does not contain a status.");
  }

  if (!Array.isArray(output.blockingAmbiguities)) {
    return fail(
      "Agent 2 output does not contain a valid blockingAmbiguities array."
    );
  }

  if (typeof output.rationale !== "string" || output.rationale.trim() === "") {
    return fail("Agent 2 output does not contain a valid rationale.");
  }

  if (output.status === "PASS") {
    if (output.blockingAmbiguities.length > 0) {
      return fail(
        "Agent 2 returned PASS but also reported blocking ambiguities."
      );
    }

    return {
      exitCode: 0,
      result: {
        status: "PASS",
        guardrail: "agent2-output-validation",
        action: "CONTINUE",
        reason: "No blocking ambiguity requires human review.",
      },
    };
  }

  if (output.status === "PUNCH_OUT") {
    if (output.blockingAmbiguities.length === 0) {
      return fail(
        "Agent 2 returned PUNCH_OUT without identifying a blocking ambiguity."
      );
    }

    for (const ambiguity of output.blockingAmbiguities) {
      if (
        !ambiguity.description ||
        !ambiguity.reason ||
        !ambiguity.clarificationNeeded
      ) {
        return fail(
          "A blocking ambiguity is missing description, reason, or clarificationNeeded."
        );
      }
    }

    return {
      exitCode: 2,
      result: {
        status: "PUNCH_OUT",
        guardrail: "agent2-output-validation",
        action: "HUMAN_REVIEW_REQUIRED",
        reason:
          "Agent 2 identified a decision that requires human clarification.",
        blockingAmbiguities: output.blockingAmbiguities,
      },
    };
  }

  return fail(`Unknown Agent 2 status: ${output.status}`);
}

const inputFile = process.argv[2];

if (!inputFile) {
  console.error(
    JSON.stringify(
      {
        status: "FAIL",
        guardrail: "agent2-output-validation",
        reason: "No Agent 2 output file was provided.",
      },
      null,
      2
    )
  );

  process.exit(1);
}

try {
  const content = fs.readFileSync(inputFile, "utf8").replace(/^\uFEFF/, "");
  const validation = validateAgent2Output(content);

  console.log(JSON.stringify(validation.result, null, 2));

  process.exit(validation.exitCode);
} catch (error) {
  console.error(
    JSON.stringify(
      {
        status: "FAIL",
        guardrail: "agent2-output-validation",
        reason: `Unable to read Agent 2 output: ${error.message}`,
      },
      null,
      2
    )
  );

  process.exit(1);
}