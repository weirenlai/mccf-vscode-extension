// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const { execSync, exec } = require('child_process');

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "mccf-vscode-extension" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('mccf-vscode-extension.helloWorld', function () {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from mccf-vscode-extension!');
	});
	let install_dev_container = vscode.commands.registerCommand('mccf-vscode-extension.install', function () {
		// The code you place here will be executed every time your command is executed
		execSync('git clone https://github.com/Microsoft/vscode-remote-try-node.git');
		// Display a message box to the user
		vscode.window.showInformationMessage('Installed Dev Enviorment!');
	});
	let create_new_ccf_application_javascript = vscode.commands.registerCommand('mccf-vscode-extension.javascriptapp', function () {
		// The code you place here will be executed every time your command is executed
		       //console.log('Installing Javascript App Template...');
		       // execSync('npm --prefix ./js install');
			   vscode.window.showInformationMessage('Javascript App Template Installed!');
	});
	let create_new_ccf_application_cplus = vscode.commands.registerCommand('mccf-vscode-extension.cplusplusapp', function () {
		// The code you place here will be executed every time your command is executed
		       //console.log('Installing Javascript App Template...');
		       // execSync('npm --prefix ./js install');

			   vscode.window.showInformationMessage('C++ App Template Installed!');
	});
 //https://vscode.dev/redirect?url=vscode://ms-vscode-remote.remote-containers/cloneInVolume?url=https://github.com/microsoft/ccf-app-template
	context.subscriptions.push(disposable);
	context.subscriptions.push(install_dev_container);
	context.subscriptions.push(create_new_ccf_application_javascript);
	context.subscriptions.push(create_new_ccf_application_cplus);
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
