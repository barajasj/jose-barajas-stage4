#!/usr/bin/env node

/**
 * Stage 4 Agent Runner
 *
 * Executes an AI agent prompt using the Devin CLI.
 *
 * Usage:
 * node workflow/run-agent.js <prompt-file> <input-file>
 */

const { spawnSync } = require("child_process");
const { existsSync, writeFileSync, unlinkSync } = require("fs");
const os = require("os");
const path = require("path");

function findDevinInPath() {
  const cmd = process.platform === "win32" ? "where" : "which";

  const result = spawnSync(cmd, ["devin"], {
    encoding: "utf8",
  });

  if (result.status === 0) {
    const candidates = result.stdout.trim().split(/\r?\n/);

    const executable = candidates.find((candidate) =>
      /\.(exe|cmd|bat)$/i.test(candidate)
    );

    const devinPath = executable || candidates[0];

    if (devinPath && existsSync(devinPath)) {
      return devinPath;
    }
  }

  return null;
}

const bundledDevin =
  "/Applications/Devin.app/Contents/Resources/app/extensions/windsurf/devin/bin/devin";

const pathDevin = findDevinInPath();

const devin =
  pathDevin ||
  (existsSync(bundledDevin) ? bundledDevin : "devin");

const promptFile = process.argv[2];
const inputFile = process.argv[3];

if (!promptFile || !inputFile) {
  console.error(
    "Usage: node workflow/run-agent.js <prompt-file> <input-file>"
  );
  process.exit(1);
}

if (!existsSync(promptFile)) {
  console.error(`Prompt file not found: ${promptFile}`);
  process.exit(1);
}

if (!existsSync(inputFile)) {
  console.error(`Input file not found: ${inputFile}`);
  process.exit(1);
}

const fs = require("fs");

const agentPrompt = fs.readFileSync(promptFile, "utf8");
const agentInput = fs.readFileSync(inputFile, "utf8");

const fullPrompt = `${agentPrompt}

## Workflow Input

${agentInput}`;

const tempPromptFile = path.join(
  os.tmpdir(),
  `stage4-agent-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2)}.md`
);

writeFileSync(tempPromptFile, fullPrompt, "utf8");

const result = spawnSync(
  devin,
  [
    "-p",
    "--respect-workspace-trust",
    "false",
    "--permission-mode",
    "dangerous",
    "--model",
    "SWE-1.7",
    "--prompt-file",
    tempPromptFile,
  ],
  {
    encoding: "utf8",
    stdio: ["pipe", "pipe", "pipe"],
  }
);

try {
  unlinkSync(tempPromptFile);
} catch {
  // Ignore temporary file cleanup failures.
}

if (result.error) {
  console.error(result.error.message);
  process.exit(1);
}

if (result.status !== 0) {
  console.error(result.stderr || result.stdout);
  process.exit(result.status || 1);
}

let output = result.stdout.trim();

// Remove Markdown JSON code fences if the agent wrapped its response.
const jsonMatch = output.match(/^```json\s*([\s\S]*?)\s*```$/i);

if (jsonMatch) {
  output = jsonMatch[1].trim();
}

console.log(output);