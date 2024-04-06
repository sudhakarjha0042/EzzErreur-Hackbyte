const vscode = require('vscode');
const fs = require('fs');
const path = require('path');
const FlatListProvider = require('./flatListProvider');
const axios = require('axios');

/**
 * @param {vscode.ExtensionContext} context
 */
async function activate(context) {

	console.log('Congratulations, your extension "Easy-Erreur" is now active!');

	const flatListProvider = new FlatListProvider();
    vscode.window.registerTreeDataProvider('ezzerreur-explorer', flatListProvider);

	function deleteSnippet(node) {
		const dbFilePath = path.join(__dirname, 'db.json');
		const data = JSON.parse(fs.readFileSync(dbFilePath, 'utf8'));
		const updatedData = data.filter((item) => item.label !== node.label);
		fs.writeFileSync(dbFilePath, JSON.stringify(updatedData, null, 2));
	}

	function openSnippetWebview(node) {
		console.log('Opening snippet view...');
		const panel = vscode.window.createWebviewPanel(
		  'ezzerreur-snippet-view',
		  node.label,
		  vscode.ViewColumn.One,
		  {
			enableScripts: true,
			retainContextWhenHidden: true,
		  }
		);

		console.log("-----------------------------------")
		console.log(node.label)
		console.log(node.tags)
		console.log(node.code)
		console.log("-----------------------------------")

		// Set the webview's HTML content
		panel.webview.html = `
		<!DOCTYPE html>
		<html lang="en">
		<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<title>${node.label}</title>
		</head>
		<body>
		<h1>Code Title : ${node.label}</h1>
		<h2>Code Tags : ${node.tags.join(', ')}</h2>
		<h2>Code Snippet:</h2>
		<blockquote><pre><code>${node.code.replace(/"/g, '&quot;')}</code></pre></blockquote>
		<button onclick="copyToClipboard('${node.code}')">Copy to Clipboard</button>
		<button onclick="deleteSnippet('${node.label}')">Delete Snippet</button>
		<button onclick="uploadSnippet('${node.label}', '${node.tags}', '${node.code}')">Upload Snippet</button>
		</body>
		<script>
		function copyToClipboard(text) {
			navigator.clipboard.writeText(text);
		}
		function deleteSnippet(label) {
			acquireVsCodeApi.postMessage({
				command: 'deleteSnippet',
				label: label
			});
		}
	
		function uploadSnippet(label, tags, code) {
			acquireVsCodeApi.postMessage({
				command: 'uploadSnippet',
				label: label,
				tags: tags,
				code: code
			});
		}

		function acquireVsCodeApi() {
			if (typeof acquireVsCodeApi !== 'undefined') {
			  return acquireVsCodeApi();
			} else {
			  const vscode = acquireVsCodeApi();
			  return vscode;
			}
		  }
		</script>
		</html>
	`;
	
	  // Add event listener for button clicks
	  panel.webview.onDidReceiveMessage((message) => {
		switch (message.command) {
			case 'copyToClipboard':
				console.log('Copying to clipboard...');
				vscode.env.clipboard.writeText(node.code);
				vscode.window.showInformationMessage('Code snippet copied to clipboard');
				break;
			case 'deleteSnippet':
				console.log('Deleting snippet...');
				deleteSnippet(node);
				flatListProvider.refresh();
				break;
			case 'uploadSnippet':
				console.log('Uploading Snippet...')
				vscode.commands.executeCommand('Easy-Erreur.pushSnippet_EzzErreur', message.payload);
				break;
		}
	  });
	  }

	let disposable = vscode.commands.registerCommand('Easy-Erreur.saveCodeSnippet', async function () {
		vscode.window.showInformationMessage('Saving Snippet @Easy-Erreur ...');
		const editor = vscode.window.activeTextEditor;
        const selectedText = editor.document.getText(editor.selection);

		if (!editor) {
            vscode.window.showInformationMessage('No text selected');
            return;
        }

		const snippetTitle = await vscode.window.showInputBox({
            prompt: 'Enter a title for the snippet',
			timeout: 10000
        });

		if (snippetTitle !== undefined) {
            // Do something with the selected text and snippet title
            vscode.window.showInformationMessage(`Title: ${snippetTitle}, Selected Text: ${selectedText}`);
        } else {
			vscode.window.showInformationMessage('Operation cancelled or timed out.');
		}

		const tagsInput = await vscode.window.showInputBox({
            prompt: 'Enter tags separated by commas (,) (optional)',
            placeHolder: 'e.g., tag1, tag2, tag3'
        });

		let tags = [];
        if (tagsInput !== undefined) {
            tags = tagsInput.split(',').map(tag => tag.trim());
        }

		if (snippetTitle !== undefined && selectedText !== undefined) {
			vscode.window.showInformationMessage(`Title: ${snippetTitle}, Selected Text: ${selectedText}, Tags: ${tags.join(', ')}`);

			const dbFilePath = path.join(__dirname, 'db.json');
			const data = JSON.parse(fs.readFileSync(dbFilePath, 'utf8'));
			data.push({ label: snippetTitle, tags: tags, code: selectedText});
			fs.writeFileSync(dbFilePath, JSON.stringify(data, null, 2));

			// Refresh the tree view
			flatListProvider.refresh();
		}
	});

	let disposable1 = vscode.commands.registerCommand('Easy-Erreur.deleteSnippet', async (node) => {
		deleteSnippet(node);
		flatListProvider.refresh();
	  });
	
	let webview_disposable = vscode.commands.registerCommand('Easy-Erreur.openSnippetView', async (node) => {
	const selectedNode = node;
	openSnippetWebview(selectedNode);
	});

	let login_disposable = vscode.commands.registerCommand('Easy-Erreur.login_EzzErreur', async () => {
		vscode.window.showInformationMessage('Logging in at Ezz-Erreur ...');

		const username = await vscode.window.showInputBox({ prompt: 'Enter your username' , timeout: 10000});

		if (username === undefined) {
            vscode.window.showInformationMessage('Operation cancelled or timed out.');
        }

    	const password = await vscode.window.showInputBox({ prompt: 'Enter your password', password: true });

		if (password === undefined) {
            vscode.window.showInformationMessage('Operation cancelled or timed out.');
        }

		try {
			const response = await axios.post('https://ezzerreur-hackbyte.onrender.com/users/login', { username, password });
			if (response.status === 200) {
				const token = response.data.token;
				// Store the token in globalState
				context.globalState.update('authToken', token);
				console.log("token = ", token);
				
				vscode.window.showInformationMessage('Logged in successfully!');
			} else  {
				vscode.window.showErrorMessage('Login failed: Unexpected response from server');
			}
		  } catch (error) {
			vscode.window.showErrorMessage('Login failed: ' + error.message);
		  }
	});

	let postcode_disposable = vscode.commands.registerCommand('Easy-Erreur.pushSnippet_EzzErreur', async (node) => {
		// Retrieve the stored token from the VSCode Keychain API
		console.log("Pusing Snippet to Ezz-Erreur ...")
		const token = context.globalState.get('authToken');

		// let node = {
		// 	"label": "python",
		// 	"description": "You can use this for adding a blue button which turns black on hover",
		// 	"tags": [
		// 	"python"
		// 	],
		// 	"codeSnipet": "def greet():\r\n    name = input(\"Enter your name: \")\r\n    print(\"Hello, {}! Welcome to the Python script.\".format(name))"
		// }
	
		if (token) {
		  try {
			const response = await axios.post('https://ezzerreur-hackbyte.onrender.com/codes/postCode',node, {
			  headers: { 'Authorization': `Bearer ${token}` }
			});
			vscode.window.showInformationMessage(response.data.message);
		  } catch (error) {
			console.log(error)
			vscode.window.showErrorMessage('Pushing code failed: ' + error.message);
		  }
		} else {
		  vscode.window.showErrorMessage('Please log in first.');
		}
	  });

	context.subscriptions.push(disposable, login_disposable, disposable1, webview_disposable, postcode_disposable);
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
