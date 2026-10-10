/**
 * Punch-Out Enforcement Guardrail
 *
 * Prevents the workflow from invoking another AI agent when
 * Agent 2 has determined that human review is required.
 *
 * Exit codes:
 *   0 = CONTINUE
 *   1 = INVALID INPUT / WORKFLOW FAILURE
 *   2 = BLOCKED - HUMAN REVIEW REQUIRED
 */

const fs = require("fs");

const inputFile = process.argv[2];

if (!inputFile) {
  console.error(
    JSON.stringify(
      {
        status: "FAIL",
        guardrail: "punchout-enforcement",
        action: "WORKFLOW_FAILURE",
        reason: "No Agent 2 output file was provided.",
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
    .replace(/^\uFEFF/, "");

  let output;

  try {
    output = JSON.parse(content);
  } catch {
    console.error(
      JSON.stringify(
        {
          status: "FAIL",
          guardrail: "punchout-enforcement",
          action: "WORKFLOW_FAILURE",
          reason: "Agent 2 output is not valid JSON.",
        },
        null,
        2
      )
    );

    process.exit(1);
  }

  if (output.status === "PUNCH_OUT") {
    console.error(
      JSON.stringify(
        {
          status: "BLOCKED",
          guardrail: "punchout-enforcement",
          action: "HUMAN_REVIEW_REQUIRED",
          reason:
            "Workflow continuation blocked because Agent 2 requires human review.",
          nextAgentAllowed: false,
        },
        null,
        2
      )
    );

    process.exit(2);
  }

  if (output.status === "PASS") {
    console.log(
      JSON.stringify(
        {
          status: "PASS",
          guardrail: "punchout-enforcement",
          action: "CONTINUE",
          reason: "No human punch-out is active.",
          nextAgentAllowed: true,
        },
        null,
        2
      )
    );

    process.exit(0);
  }

  console.error(
    JSON.stringify(
      {
        status: "FAIL",
        guardrail: "punchout-enforcement",
        action: "WORKFLOW_FAILURE",
        reason: `Unknown Agent 2 status: ${output.status}`,
      },
      null,
      2
    )
  );

  process.exit(1);
} catch (error) {
  console.error(
    JSON.stringify(
      {
        status: "FAIL",
        guardrail: "punchout-enforcement",
        action: "WORKFLOW_FAILURE",
        reason: error.message,
      },
      null,
      2
    )
  );

  process.exit(1);
}