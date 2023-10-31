import * as vscode from "vscode";
import { createDevContainerCommand } from "./commands/createDevContainer";
import { startCCFNetworkDevContainer } from "./commands/startCCFNetworkInDevContainer";
import { startCCFNetworkDocker } from "./commands/startCCFNetworkInDocker";
import { validateCCFConstitution } from "./commands/validateConstitution";
import { createMCCFInstance } from "./commands/createMCCFInstance";
import { getMCCFInstanceDetails } from "./commands/getMCCFInstanceDetails";
import { submitProposal } from "./commands/submitProposal";
import { createMemberProposal } from "./commands/createMemberProposal";
import { createUserProposal } from "./commands/createUserProposal";
import { generateIdentity } from "./commands/generateIdentity";
import { voteProposal } from "./commands/voteProposal";
import { applicationBundle } from "./commands/applicationBundle";

// This method is called when your extension is activated
export function activate(context: vscode.ExtensionContext) {
  console.log("Extension Activated");

  // COMMAND: Create CCF project in devcontainer
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "vscode-azure-managed-ccf.createCCFDevContainer",
      () => createDevContainerCommand(context),
    ),
  );

  // COMMAND: Start CCF network in devcontainer
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "vscode-azure-managed-ccf.startCCFNetworkDevContainer",
      startCCFNetworkDevContainer,
    ),
  );

  // COMMAND: Start CCF network in docker container
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "vscode-azure-managed-ccf.startCCFNetworkDocker",
      startCCFNetworkDocker,
    ),
  );

  // COMMAND: Start CCF network in devcontainer and test custom constitution
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "vscode-azure-managed-ccf.validateCCFConstitution",
      () => validateCCFConstitution(context),
    ),
  );

  // COMMAND: Create MCCF instance
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "vscode-azure-managed-ccf.createMCCFInstance",
      createMCCFInstance,
    ),
  );

  // COMMAND: List MCCF instances
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "vscode-azure-managed-ccf.getMCCFInstanceDetails",
      getMCCFInstanceDetails,
    ),
  );

  // COMMAND: Create Member proposal
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "vscode-azure-managed-ccf.createMemberProposal",
      () => createMemberProposal(context),
    ),
  );

  // COMMAND: Create User proposal
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "vscode-azure-managed-ccf.createUserProposal",
      () => createUserProposal(context),
    ),
  );

  // COMMAND: Generate identity
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "vscode-azure-managed-ccf.generateIdentity",
      () => generateIdentity(context),
    ),
  );

  // COMMAND: Submit proposal
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "vscode-azure-managed-ccf.submitProposal",
      () => submitProposal(context),
    ),
  );

  // COMMAND: Vote on proposal
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "vscode-azure-managed-ccf.voteProposal",
      () => voteProposal(context),
    ),
  );

  // COMMAND: Create application bundle
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "vscode-azure-managed-ccf.createApplicationBundle",
      applicationBundle,
    ),
  );
}

// This method is called when your extension is deactivated
export function deactivate() {
  console.log("Extension Deactivated");
}
