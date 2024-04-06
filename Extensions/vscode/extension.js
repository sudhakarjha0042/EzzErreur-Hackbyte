const vscode = require('vscode');
const fs = require('fs');
const path = require('path');
const FlatListProvider = require('./flatListProvider');
const axios = require('axios');
const OpenAI = require('openai')

const openai = new OpenAI({ apiKey: 'khudka use krow' });


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
		console.log(node.description)
		console.log(node.extension)
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
			<!-- Bootstrap CSS -->
			<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet">
			<style>
				/* Additional custom styles can be added here */
				.code-snippet {
					background-color: #343a40; /* Dark background color */
					color: #ffffff; /* Light text color */
					padding: 1rem; /* Add padding for better readability */
					border-radius: 0.25rem; /* Add border radius for rounded corners */
					overflow-x: auto; /* Allow horizontal scrolling for long code */
				}
				.badge-blue {
					background-color: #007bff;
				}
				.badge-grey {
					background-color: #6c757d;
				}
    		</style>
		</head>
		<body class="container py-4">
			<div class="mb-4">
				<h1 class="h4">EZZ ERREUR - <a href="www.google.com" class="link-primary">View in Browser</a></h1>
			</div>
			<hr>
			<div class="mb-4">
				<h2 class="h5">Code Title:</h2>
				<p class="lead">${node.label}</p>
			</div>
			<div class="mb-4">
				<h2 class="h5">Code Description:</h2>
				<p>${node.description}</p>
			</div>
			<div class="mb-4">
				<h2 class="h5">Code Tags:</h2>
				<div>
					${node.tags.map((tag, index) => `
					<span class="badge ${index % 2 === 0 ? 'badge-blue' : 'badge-grey'} me-2">${tag}</span>
					`).join('')}
				</div>
			</div>
			<div class="mb-4">
				<h2 class="h5">Code Extension:</h2>
				<p>${node.extension}</p>
			</div>
			<hr>
			<div class="mb-4">
				<h2 class="h5">Code Snippet:</h2>
				<pre class="code-snippet"><code>${node.code.replace(/"/g, '&quot;')}</code></pre>
			</div>
			<hr>
			<div class="d-grid gap-2 d-md-flex justify-content-md-start mb-4">
				<button class="btn btn-primary me-md-2" onclick="copyToClipboard('${node.code}')">Copy to Clipboard</button>
				<button class="btn btn-danger me-md-2" onclick="deleteSnippet('${node.label}')">Delete Snippet</button>
				<button class="btn btn-success" onclick="uploadSnippet()">Upload Snippet</button>
			</div>
			<!-- Bootstrap JS (Optional, if needed) -->
			<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"></script>
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
			
				function uploadSnippet() {
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
		</body>
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
		
		const fileName = editor.document.fileName;
		const fileExtension = fileName.split('.').pop();

		const snippetTitle = await vscode.window.showInputBox({
            prompt: 'Enter a title for the snippet',
			timeout: 10000
        });

		let snippetDescription = await vscode.window.showInputBox({
			prompt: 'Enter a description for the snippet (optional)'
		});

		if (snippetDescription === undefined) {
			snippetDescription = '';
		}

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
			vscode.window.showInformationMessage(`Snippet ${snippetTitle}, Saved Successfully!`);

			const dbFilePath = path.join(__dirname, 'db.json');
			const data = JSON.parse(fs.readFileSync(dbFilePath, 'utf8'));
			data.push({ label: snippetTitle, description: snippetDescription, extension: fileExtension ,tags: tags, code: selectedText, cloud: 0});
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

	let postcode_disposable = vscode.commands.registerCommand('Easy-Erreur.pushSnippet', async () => {
		// Retrieve the stored token from the VSCode Keychain API
		console.log("Pusing Snippet to Ezz-Erreur ...")
		const token = context.globalState.get('authToken');

		try {
			if (token) {
				// Read the content of db.json
				const dbFilePath = path.join(__dirname, 'db.json');
				const data = JSON.parse(fs.readFileSync(dbFilePath, 'utf8'));
		
				// Extract labels from data
				const snippetLabels = data.map(item => item.label);
		
				// Show a dropdown menu to select a snippet
				const selectedSnippetLabel = await vscode.window.showQuickPick(snippetLabels, {
					placeHolder: 'Select a snippet to push'
				});
				
				if (selectedSnippetLabel) {
					// Find the selected snippet object
					const selectedSnippet = data.find(item => item.label === selectedSnippetLabel);

					if (selectedSnippet) {
						console.log("Selected snippet:", selectedSnippet);

						const node = {
							"title": `${selectedSnippet.label}`,
							"description": `${selectedSnippet.description}`,
							"tags": `${selectedSnippet.tags}`,
							"codeSnipet": `${selectedSnippet.code}`
						}

						const response = await axios.post('https://ezzerreur-hackbyte.onrender.com/codes/postCode',node, {
							headers: { 'Authorization': `${token}` }
						});
						vscode.window.showInformationMessage(response.data.message);
					} else {
						vscode.window.showErrorMessage('Snippet not found!');
					}
				}
			} else {
				vscode.window.showErrorMessage('Please log in first.');
			}
		} catch (error) {
			vscode.window.showErrorMessage('Error: ' + error.message);
		}
	  });

	  let cleancode_disposable = vscode.commands.registerCommand('Easy-Erreur.cleanCode', async () => {
		const editor = vscode.window.activeTextEditor;
        const uncleanCode = editor.document.getText();

		if (!uncleanCode) {
            vscode.window.showInformationMessage('No text to be cleaned');
            return;
        }

		const completion = await openai.chat.completions.create({
			messages: [
			  {
				role: "system",
				content: "You are a helpful assistant designed to clean my code by removing comments, useless code and make code more readable. also remove statements that we wouldnt like in production - like console.log :",
			  },
			  { role: "user", content: `clean this code for me : ${uncleanCode}` },
			],
			model: "gpt-3.5-turbo-0125"
		});

		const cleanedCode = completion.choices[0].message.content;

        // Replace the text in the editor with the cleaned code
        editor.edit(editBuilder => {
            const fullRange = new vscode.Range(editor.document.positionAt(0), editor.document.positionAt(uncleanCode.length));
            editBuilder.replace(fullRange, cleanedCode);
        });

        vscode.window.showInformationMessage('Code cleaned successfully');
		
	  });

	context.subscriptions.push(disposable, login_disposable, disposable1, webview_disposable, postcode_disposable, cleancode_disposable);
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
