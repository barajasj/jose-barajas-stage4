/**
 * Guardrail 1: Agent 1 Output Validator
 *
 * Validates that the HVAC Requirement Interpreter produced
 * all sections required by the certified Stage 3 prompt.
 *
 * Exit codes:
 *   0 = PASS
 *   1 = WORKFLOW FAILURE
 */

const fs = require("fs");

const requiredSections = [
  "Requirement Summary",
  "HVAC Terminology",
  "Developer Interpretation",
  "Ambiguities / Missing Information",
];

function validateAgent1Output(content) {
  const missingSections = requiredSections.filter(
    (section) => !content.toLowerCase().includes(section.toLowerCase())
  );

  if (missingSections.length > 0) {
    return {
      status: "FAIL",
      guardrail: "agent1-output-validation",
      reason: "Required sections are missing from Agent 1 output.",
      missingSections,
    };
  }

  return {
    status: "PASS",
    guardrail: "agent1-output-validation",
    reason: "All required Agent 1 sections are present.",
    missingSections: [],
  };
}

const inputFile = process.argv[2];

if (!inputFile) {
  console.error(
    JSON.stringify(
      {
        status: "FAIL",
        guardrail: "agent1-output-validation",
        reason: "No Agent 1 output file was provided.",
      },
      null,
      2
    )
  );

  process.exit(1);
}

try {
  const content = fs.readFileSync(inputFile, "utf8");
  const result = validateAgent1Output(content);

  console.log(JSON.stringify(result, null, 2));

  process.exit(result.status === "PASS" ? 0 : 1);
} catch (error) {
  console.error(
    JSON.stringify(
      {
        status: "FAIL",
        guardrail: "agent1-output-validation",
        reason: `Unable to read Agent 1 output: ${error.message}`,
      },
      null,
      2
    )
  );

  process.exit(1);
}