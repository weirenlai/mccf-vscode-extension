import * as vscode from "vscode";
import { exec, execSync } from "child_process";
import path = require("path");
import { chdir } from "process";
import { error } from "console";
const fs = require("fs");
import * as os from 'os';

export async function addMember(specialContext: vscode.ExtensionContext) {

    // Prompt user to enter member name
    const memberName = await vscode.window.showInputBox({
        prompt: "Enter the member name",
        placeHolder: "Member name",
    });

    // If no member name is entered, report it to the user
    if (!memberName || memberName.length === 0) {
        vscode.window.showInformationMessage("No member name entered");
        return;
    }

    // Create a certificate directory folder name accessible by all functions in this command
    const certificateFolder = "Certificates";

    // Get a certificate directory path accessible by all functions
    const certificatePath = path.join(process.cwd(), certificateFolder);

    // The following line translates the windows directory path to our extension into a wsl path
    const extensionPath = getExtensionPathOSAgnostic(specialContext.extensionPath);

    // Call the createFolder function
    createFolder(certificatePath);

    // Call the memberGenerator function
    memberGenerator(memberName, certificatePath, extensionPath);

    // Call the addUserProposal function
    //addUserProposal(memberName);
}

// Create a certificate directory path accessible by all functions in this command
async function createFolder(certificatesFolderPath: string) {

    // Check if the folder exists in the current file system. If not, create a certificates folder
    try {
        if (!fs.existsSync(certificatesFolderPath)) {
            fs.mkdirSync(certificatesFolderPath);
            vscode.window.showInformationMessage(
                certificatesFolderPath + " directory created successfully"
            ); // show in the extension environment
        }
    } catch (error) {
        console.error(error);
        vscode.window.showErrorMessage("Error creating certificates folder");
    }
}

// Member Generator function that runs the keygenerator.sh script to generate member certificates
async function memberGenerator(memberName: string, certificatesFolderPath: string, extensionPath: string) {

    // Access the files in the certificate folder directory
    const files = fs.readdirSync(certificatesFolderPath);
    try {
        // If the folder contains a file with membername already, report it to the user and do not overwrite member certificates
        if (files.includes(memberName + "_cert.pem" || files.includes(memberName + "_privk.pem"))) {
            vscode.window.showWarningMessage(
                "Member already exists. Please enter a unique member name"
            );
            return;
        }
        vscode.window.showInformationMessage("Generating member certificates..."); // show in the extension environment

        // This will create a subshell to execute the script inside of the certificate directory path without changing our main process's working directory
       execSync(`(cd ${certificatesFolderPath.toString().trim()} && ${getBashCommand()} ${extensionPath}/dist/keygenerator.sh --name ${memberName})`);

    } catch (error: any) {
        console.error(error.message);
        vscode.window.showErrorMessage("Error generating member certificates");
    }

    // Show success message to user
    vscode.window.showInformationMessage(
        "Member " + memberName + " created successfully"
    );
}

// Function that runs the add_user.sh script to create user JSON file and later add them to the network
// FIXME: This function is not working as intended. It is not creating the user JSON file or adding the user to the network. Still working on
async function addUserProposal(memberName: string, certificateFolder: string, extensionPath: string) {
    // Create a folder directory called ProposalFiles
    const proposalFolder = "ProposalFiles";

    // Create a proposal folder directory path
    const proposalPath = path.join(process.cwd(), proposalFolder);

    if (!fs.existsSync(proposalPath)) {
        fs.mkdirSync(proposalPath);
        vscode.window.showInformationMessage(
            proposalFolder + " directory created successfully"
        ); // show in the extension environment
    }

    // Creation the member's specific certificate file path
    const certificatePath = path.join(process.cwd(), certificateFolder);
    const certFilePath = path.join(certificatePath, memberName + "_cert.pem");

    // Change certFilePath to a wsl path
    const certFilePathWsl = execSync(`wsl wslpath -u '${certFilePath}'`);

    // Change ProposalPath to a wsl path
    const proposalResultWsl = execSync(`wsl wslpath -u '${proposalPath}'`);

    try {
        // FIXME: 
        // This will run the script and set the destination folder to the proposal folder
        execSync(`${getBashCommand()} '${extensionPath.toString().trim()}/src/scripts/add_user.sh' --cert-file ${certFilePathWsl.toString().trim()} --dest-folder ${proposalResultWsl.toString().trim()}`);

    } catch (error) {
        console.error(error);
        vscode.window.showErrorMessage("Error passing user to network");
    }
}


function getBashCommand() : string
{
    return os.platform() === 'win32' ? `wsl bash` : `bash`;
}

function getExtensionPathOSAgnostic(extensionPath: string) : string
{
    if(os.platform() === 'win32')
    {
        return execSync(`wsl wslpath -u '${extensionPath}'`).toString().trim();
    }
    else
    {
        return extensionPath;
    }
}