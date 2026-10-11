#!/usr/bin/env node

/**
 * HVAC Stage 4 Workflow Orchestrator
 *
 * Executes:
 *
 * Ticket
 *   -> Agent 1
 *   -> Guardrail 1
 *   -> Agent 2
 *   -> Guardrail 2
 *   -> Punch-Out Enforcement
 *   -> Agent 3
 *   -> Guardrail 3
 *
 * Final outcomes:
 *   WORKFLOW_SUCCESS
 *   WORKFLOW_FAILURE
 *   HUMAN_REVIEW_REQUIRED
 */

const { spawnSync } = require("child_process");
const {
  existsSync,
  mkdirSync,
  copyFileSync,
  readFileSync,
  writeFileSync,
} = require("fs");
const path = require("path");
const {
  createStepRecord,
  saveRunAudit,
} = require("../monitoring/audit-logger");

const projectRoot = path.resolve(__dirname, "..");
const configPath = path.join(__dirname, "workflow-config.json");

if (!existsSync(configPath)) {
  console.error("Workflow configuration not found.");
  process.exit(1);
}

const config = JSON.parse(readFileSync(configPath, "utf8"));

const ticketArgument = process.argv[2];

if (!ticketArgument) {
  console.error("Usage: node workflow/workflow.js <ticket-file>");
  process.exit(1);
}

const ticketFile = path.resolve(projectRoot, ticketArgument);

if (!existsSync(ticketFile)) {
  console.error(`Ticket file not found: ${ticketFile}`);
  process.exit(1);
}

function createRunDirectory() {
  const timestamp = new Date()
    .toISOString()
    .replace(/[:.]/g, "-");

  const runDirectory = path.join(
    projectRoot,
    "runs",
    timestamp
  );

  mkdirSync(runDirectory, { recursive: true });

  return runDirectory;
}

function executeNodeScript(scriptPath, args = []) {
  return spawnSync(
    process.execPath,
    [scriptPath, ...args],
    {
      cwd: projectRoot,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    }
  );
}

function saveFile(filePath, content) {
  writeFileSync(filePath, content || "", "utf8");
}

function runAgent(agentKey, inputFile, outputFile) {
  const agent = config.agents[agentKey];

  const runnerPath = path.join(
    projectRoot,
    "workflow",
    "run-agent.js"
  );

  const promptPath = path.join(
    projectRoot,
    agent.prompt
  );

  console.log(`Running ${agent.name}...`);

  const result = executeNodeScript(
    runnerPath,
    [promptPath, inputFile]
  );

  saveFile(outputFile, result.stdout);

  if (result.status !== 0) {
    return {
      success: false,
      exitCode: result.status || 1,
      error: result.stderr || result.stdout,
    };
  }

  return {
    success: true,
    exitCode: 0,
    output: result.stdout,
  };
}

function runGuardrail(guardrailRelativePath, inputFile) {
  const guardrailPath = path.join(
    projectRoot,
    guardrailRelativePath
  );

  return executeNodeScript(
    guardrailPath,
    [inputFile]
  );
}

function failWorkflow(reason, runDirectory) {
  const result = {
    outcome: config.outcomes.failure,
    reason,
  };

  saveFile(
    path.join(runDirectory, "workflow-result.json"),
    JSON.stringify(result, null, 2)
  );

  console.error(JSON.stringify(result, null, 2));

  const totalEstimatedCost = auditSteps
  .reduce(
    (sum, step) => sum + step.estimatedCostUsd,
    0
  )
  .toFixed(6);

  saveRunAudit(runDirectory, {
    workflowOutcome: "WORKFLOW_FAILURE",
    model: workflowModel,
    totalEstimatedCostUsd: Number(totalEstimatedCost),
    steps: auditSteps,
  });
  
  process.exit(1);
}

const runDirectory = createRunDirectory();

const auditSteps = [];
const workflowModel = config.runtime.model;

console.log(`Run directory: ${runDirectory}`);

//
// Input Ticket Traceability
//

copyFileSync(
  ticketFile,
  path.join(runDirectory, "input-ticket.md")
);

//
// Agent 1
//

const agent1Output = path.join(
  runDirectory,
  "agent1-output.md"
);

const agent1Result = runAgent(
  "agent1",
  ticketFile,
  agent1Output
);

if (!agent1Result.success) {
  failWorkflow(
    `Agent 1 execution failed: ${agent1Result.error}`,
    runDirectory
  );
}

const agent1InputText = readFileSync(ticketFile, "utf8");
const agent1OutputText = readFileSync(agent1Output, "utf8");

auditSteps.push(
  createStepRecord({
    step: "Agent1",
    agent: "Requirement Interpreter",
    model: workflowModel,
    inputText: agent1InputText,
    outputText: agent1OutputText,
    status: "PASS",
  })
);

//
// Guardrail 1
//

console.log("Running Guardrail 1...");

const guardrail1 = runGuardrail(
  config.agents.agent1.guardrail,
  agent1Output
);

saveFile(
  path.join(runDirectory, "guardrail1-result.json"),
  guardrail1.stdout || guardrail1.stderr
);

if (auditSteps.length > 0) {
  auditSteps[auditSteps.length - 1].status =
    guardrail1.status === 0 ? "PASS" : "FAIL";
}

if (guardrail1.status !== 0) {
  failWorkflow(
    "Agent 1 output validation failed.",
    runDirectory
  );
}

//
// Agent 2
//

const agent2Output = path.join(
  runDirectory,
  "agent2-output.json"
);

const agent2Result = runAgent(
  "agent2",
  agent1Output,
  agent2Output
);

if (!agent2Result.success) {
  failWorkflow(
    `Agent 2 execution failed: ${agent2Result.error}`,
    runDirectory
  );
}

const agent2InputText = readFileSync(agent1Output, "utf8");
const agent2OutputText = readFileSync(agent2Output, "utf8");

auditSteps.push(
  createStepRecord({
    step: "Agent2",
    agent: "Ambiguity Risk Analyzer",
    model: workflowModel,
    inputText: agent2InputText,
    outputText: agent2OutputText,
    status: "PASS",
  })
);

//
// Guardrail 2
//

console.log("Running Guardrail 2...");

const guardrail2 = runGuardrail(
  config.agents.agent2.guardrail,
  agent2Output
);

saveFile(
  path.join(runDirectory, "guardrail2-result.json"),
  guardrail2.stdout || guardrail2.stderr
);

if (auditSteps.length > 0) {
  auditSteps[auditSteps.length - 1].status =
    guardrail2.status === 2
      ? "PUNCH_OUT"
      : guardrail2.status === 0
        ? "PASS"
        : "FAIL";
}

if (guardrail2.status === 1) {
  failWorkflow(
    "Agent 2 output validation failed.",
    runDirectory
  );
}

if (guardrail2.status === 2) {
  console.log(
    "Agent 2 requested human review. Enforcing punch-out..."
  );

  const punchout = runGuardrail(
    config.agents.agent2.punchoutGuardrail,
    agent2Output
  );

  saveFile(
    path.join(runDirectory, "punchout-result.json"),
    punchout.stdout || punchout.stderr
  );

  const result = {
    outcome: config.outcomes.punchout,
    reason:
      "Workflow stopped because human clarification is required.",
    agent3Executed: false,
  };

  saveFile(
    path.join(runDirectory, "workflow-result.json"),
    JSON.stringify(result, null, 2)
  );

  console.log(JSON.stringify(result, null, 2));

  const totalEstimatedCost = auditSteps
    .reduce(
      (sum, step) => sum + step.estimatedCostUsd,
      0
    )
    .toFixed(6);

  saveRunAudit(runDirectory, {
    workflowOutcome: "HUMAN_REVIEW_REQUIRED",
    model: workflowModel,
    totalEstimatedCostUsd: Number(totalEstimatedCost),
    steps: auditSteps,
  });

  process.exit(2);
}

//
// Punch-Out Enforcement
//

console.log("Checking punch-out enforcement...");

const punchoutCheck = runGuardrail(
  config.agents.agent2.punchoutGuardrail,
  agent2Output
);

saveFile(
  path.join(runDirectory, "punchout-result.json"),
  punchoutCheck.stdout || punchoutCheck.stderr
);

if (auditSteps.length > 0) {
  auditSteps[auditSteps.length - 1].status =
    punchoutCheck.status === 0 ? "PASS" : "FAIL";
}

if (punchoutCheck.status !== 0) {
  failWorkflow(
    "Workflow continuation was blocked by punch-out enforcement.",
    runDirectory
  );
}

//
// Agent 3 Input
//

const agent3Input = path.join(
  runDirectory,
  "agent3-input.md"
);

const agent1Content = readFileSync(
  agent1Output,
  "utf8"
);

const agent2Content = readFileSync(
  agent2Output,
  "utf8"
);

saveFile(
  agent3Input,
  `# Requirement Interpretation

${agent1Content}

# Ambiguity Risk Assessment

${agent2Content}`
);

//
// Agent 3
//

const agent3Output = path.join(
  runDirectory,
  "agent3-output.json"
);

const agent3Result = runAgent(
  "agent3",
  agent3Input,
  agent3Output
);

if (!agent3Result.success) {
  failWorkflow(
    `Agent 3 execution failed: ${agent3Result.error}`,
    runDirectory
  );
}

const agent3InputText = readFileSync(agent3Input, "utf8");
const agent3OutputText = readFileSync(agent3Output, "utf8");

auditSteps.push(
  createStepRecord({
    step: "Agent3",
    agent: "Implementation Readiness Reviewer",
    model: workflowModel,
    inputText: agent3InputText,
    outputText: agent3OutputText,
    status: "PASS",
  })
);

//
// Guardrail 3
//

console.log("Running Guardrail 3...");

const guardrail3 = runGuardrail(
  config.agents.agent3.guardrail,
  agent3Output
);

saveFile(
  path.join(runDirectory, "guardrail3-result.json"),
  guardrail3.stdout || guardrail3.stderr
);

if (auditSteps.length > 0) {
  auditSteps[auditSteps.length - 1].status =
    guardrail3.status === 0 ? "PASS" : "NOT_READY";
}

if (guardrail3.status !== 0) {
  failWorkflow(
    "Implementation readiness validation failed.",
    runDirectory
  );
}

//
// Workflow Success
//

const finalResult = {
  outcome: config.outcomes.success,
  reason:
    "All agents and guardrails completed successfully.",
  agent3Executed: true,
};

saveFile(
  path.join(runDirectory, "workflow-result.json"),
  JSON.stringify(finalResult, null, 2)
);

console.log(JSON.stringify(finalResult, null, 2));

const totalEstimatedCost = auditSteps
  .reduce(
    (sum, step) => sum + step.estimatedCostUsd,
    0
  )
  .toFixed(6);

saveRunAudit(runDirectory, {
  workflowOutcome: "WORKFLOW_SUCCESS",
  model: workflowModel,
  totalEstimatedCostUsd: Number(totalEstimatedCost),
  steps: auditSteps,
});

process.exit(0);