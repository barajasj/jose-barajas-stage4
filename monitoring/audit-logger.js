const fs = require("fs");
const path = require("path");

function estimateTokens(text) {
  if (!text) return 0;

  return Math.ceil(text.length / 4);
}

// function estimateCost(inputTokens, outputTokens) {
//   const inputCostPer1K = 0.003;
//   const outputCostPer1K = 0.015;

//   const inputCost = (inputTokens / 1000) * inputCostPer1K;
//   const outputCost = (outputTokens / 1000) * outputCostPer1K;

//   return Number((inputCost + outputCost).toFixed(6));
// }
function estimateCost(inputTokens, outputTokens) {
  // SWE-1.7 Max pricing
  const inputCostPerMillion = 0.50;
  const outputCostPerMillion = 2.50;

  const inputCost =
    (inputTokens / 1_000_000) * inputCostPerMillion;

  const outputCost =
    (outputTokens / 1_000_000) * outputCostPerMillion;

  return Number((inputCost + outputCost).toFixed(6));
}

function createStepRecord({
  step,
  agent,
  model,
  inputText,
  outputText,
  status,
}) {
  const inputTokens = estimateTokens(inputText);
  const outputTokens = estimateTokens(outputText);

  return {
    step,
    agent,
    model,
    status,
    inputTokens,
    outputTokens,
    estimatedCostUsd: estimateCost(
      inputTokens,
      outputTokens
    ),
    timestamp: new Date().toISOString(),
  };
}

function saveRunAudit(runDirectory, auditData) {
  const auditFile = path.join(
    runDirectory,
    "run-audit.json"
  );

  fs.writeFileSync(
    auditFile,
    JSON.stringify(auditData, null, 2),
    "utf8"
  );
}

module.exports = {
  estimateTokens,
  estimateCost,
  createStepRecord,
  saveRunAudit,
};