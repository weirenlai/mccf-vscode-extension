// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from "vscode";
import * as sinon from "sinon";
import * as utility from "../../Utilities/osUtilities";
import fs = require("fs");
const rewire = require("rewire");

const mockContext = {
  extensionPath: "/mocked/extension/path",
  subscriptions: [],
  workspaceState: {
    get: sinon.stub(),
    update: sinon.stub(),
  },
  globalState: {
    get: sinon.stub(),
    update: sinon.stub(),
  },
};

suite("Create Use Proposal tests", () => {
  let sandbox: sinon.SinonSandbox;

  let generateProposalStub: sinon.SinonStub;
  let existStub: sinon.SinonStub;
  let getPathStub: sinon.SinonStub;

  let showInputBoxStub: sinon.SinonStub;
  let showOpenDialogStub: sinon.SinonStub;
  let showErrorMessageStub: sinon.SinonStub;

  setup(() => {
    sandbox = sinon.createSandbox();

    showInputBoxStub = sandbox.stub(vscode.window, "showInputBox");
    showOpenDialogStub = sandbox.stub(vscode.window, "showOpenDialog");
    showErrorMessageStub = sandbox.stub(vscode.window, "showErrorMessage");

    generateProposalStub = sandbox.stub();
    existStub = sandbox.stub(fs, "existsSync");
    getPathStub = sandbox.stub(utility, "getPathOSAgnostic");
  });

  teardown(() => {
    sandbox.restore();
  });

  test("success behaviour", async () => {
    const rewireCreateProposal = rewire("../../commands/createUserProposal");

    // Mock user input and external functions
    showOpenDialogStub
      .onCall(0)
      .resolves([vscode.Uri.file("path/to/cert.pem")]);
    showOpenDialogStub
      .onCall(1)
      .resolves([vscode.Uri.file("path/to/destination")]);
    showInputBoxStub.resolves("proposal");

    existStub.returns(false);
    generateProposalStub.resolves();
    getPathStub.resolves((input: string) => input);

    rewireCreateProposal.__set__("generateProposal", generateProposalStub);

    await rewireCreateProposal.createUserProposal(mockContext);

    sinon.assert.calledOnce(existStub);
    sinon.assert.calledOnce(generateProposalStub);

    sinon.assert.calledOnce(showInputBoxStub);
    sinon.assert.calledTwice(showOpenDialogStub);
    sinon.assert.notCalled(showErrorMessageStub);
  });

  test("should fail when certificate is not selected", async () => {
    const rewireCreateProposal = rewire("../../commands/createUserProposal");

    // Mock user input and external functions
    showOpenDialogStub.onCall(0).resolves();

    await rewireCreateProposal.createUserProposal(mockContext);

    sinon.assert.notCalled(existStub);
    sinon.assert.notCalled(generateProposalStub);

    sinon.assert.notCalled(showInputBoxStub);
    sinon.assert.calledOnce(showOpenDialogStub);
    sinon.assert.calledWith(
      showErrorMessageStub,
      "No certificate file selected",
    );
  });

  test("should fail when destination is not selected", async () => {
    const rewireCreateProposal = rewire("../../commands/createUserProposal");

    // Mock user input and external functions
    showOpenDialogStub
      .onCall(0)
      .resolves([vscode.Uri.file("path/to/cert.pem")]);
    showOpenDialogStub.onCall(1).resolves();

    await rewireCreateProposal.createUserProposal(mockContext);

    sinon.assert.notCalled(existStub);
    sinon.assert.notCalled(generateProposalStub);

    sinon.assert.notCalled(showInputBoxStub);
    sinon.assert.calledTwice(showOpenDialogStub);
    sinon.assert.calledWith(
      showErrorMessageStub,
      "No destination folder selected",
    );
  });

  test("should fail when id is not inserted", async () => {
    const rewireCreateProposal = rewire("../../commands/createUserProposal");

    // Mock user input and external functions
    showOpenDialogStub
      .onCall(0)
      .resolves([vscode.Uri.file("path/to/cert.pem")]);
    showOpenDialogStub
      .onCall(1)
      .resolves([vscode.Uri.file("path/to/destination")]);
    showInputBoxStub.resolves();

    await rewireCreateProposal.createUserProposal(mockContext);

    sinon.assert.notCalled(existStub);
    sinon.assert.notCalled(generateProposalStub);

    sinon.assert.calledOnce(showInputBoxStub);
    sinon.assert.calledTwice(showOpenDialogStub);
    sinon.assert.calledWith(showErrorMessageStub, "No valid name entered");
  });

  test("should fail when file already exists", async () => {
    const rewireCreateProposal = rewire("../../commands/createUserProposal");

    // Mock user input and external functions
    showOpenDialogStub
      .onCall(0)
      .resolves([vscode.Uri.file("path/to/cert.pem")]);
    showOpenDialogStub
      .onCall(1)
      .resolves([vscode.Uri.file("path/to/destination")]);
    showInputBoxStub.resolves("proposal");

    existStub.returns(true);

    await rewireCreateProposal.createUserProposal(mockContext);

    sinon.assert.calledOnce(existStub);
    sinon.assert.notCalled(generateProposalStub);

    sinon.assert.calledOnce(showInputBoxStub);
    sinon.assert.calledTwice(showOpenDialogStub);
    sinon.assert.calledWith(
      showErrorMessageStub,
      "Proposal file with that name already exists in destination folder",
    );
  });
});
