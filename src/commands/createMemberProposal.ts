/* eslint-disable prettier/prettier */
import * as vscode from "vscode";
import path = require("path");
const fs = require("fs");
import * as utilities from "../Utilities/osUtilities";
import { execSync } from "child_process";

export async function createMemberProposal(specialContext: vscode.ExtensionContext) {

    // Prompt user to enter Member name to generate the proposal for:
    const idName = await vscode.window.showInputBox({
        prompt: "Enter the member ID to generate the proposal for",
        placeHolder: "Ex: member0",
    });
    
    // If no member name is entered, report it to the user
    if (!idName || idName.length === 0) {
        vscode.window.showInformationMessage("No id entered");
        return;
    }

    const certificateFolder = "Certificates";

    // Get a certificate directory path accessible by all functions
    const certificatePath = path.join(process.cwd(), certificateFolder);

    memberProposalCreator(idName, certificatePath, specialContext.extensionPath);

}

// Create function that will check read files in the certificate folder and make sure that the member name entered exists
async function memberProposalCreator(id: string, certificatePath: string, extensionPath: string) {

    // Check if the member name entered exists in the certificate folder
    try {
        if (fs.existsSync(certificatePath)) {
            // Get the files in the certificate folder
            const files = fs.readdirSync(certificatePath);
            // Check if the member name entered exists in the certificate folder
            if (files.includes(id + "_cert.pem" || files.includes(id + "_enc_pubk.pem"))) {

                const wslCertificatePath = utilities.getPathOSAgnostic(certificatePath);

                const certPath = utilities.getPathOSAgnostic(path.join(certificatePath, `${id}_cert.pem`));

                const pubkPath = utilities.getPathOSAgnostic(path.join(certificatePath, `${id}_enc_pubk.pem`));

                // Get the terminal with the name "Generate Identity" if it exists, otherwise create it
                const terminal = vscode.window.terminals.find((t) => t.name === "Generate Member Proposal") || vscode.window.createTerminal("Generate Proposal");
                terminal.show();
                terminal.sendText(`cd ${extensionPath}/dist; ${utilities.getBashCommand()} add_member_2.sh --cert-file "${certPath}" --pubk-file "${pubkPath}" --dest-folder "${wslCertificatePath}" --id ${id}`);
            
            } else {
                vscode.window.showErrorMessage("ID does not exist");
                return;
            }
        } else {
            vscode.window.showErrorMessage("Certificates folder does not exist");
            return;
        }
        // Display success message to user
        vscode.window.showInformationMessage("Proposal generated successfully: " + certificatePath);

    } catch (error) {
        console.error(error);
        vscode.window.showErrorMessage("Error generating proposal");
    }


} 