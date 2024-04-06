const vscode = require('vscode');
const fs = require('fs');
const path = require('path');

class FlatListProvider {
    constructor() {
        this._onDidChangeTreeData = new vscode.EventEmitter();
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;
    }

    getTreeItem(element) {
        return {
            label: element.label,
            collapsibleState: vscode.TreeItemCollapsibleState.None,
            command: {
                command: 'Easy-Erreur.openSnippetView',
                title: 'Open Snippet',
                arguments: [element]
            },
            buttons: [
                {
                    tooltip: 'Delete Snippet',
                    iconPath: new vscode.ThemeIcon('trash'),
                    command: {
                        command: 'Easy-Erreur.deleteSnippet',
                        title: 'Delete Snippet',
                        arguments: [element]
                    }
                }
            ],
            iconPath: this.getIconPath(element.extension)
        };
    }

    getChildren(element) {
        const dbFilePath = path.join(__dirname, 'db.json');
        const data = JSON.parse(fs.readFileSync(dbFilePath, 'utf8'));
        return Promise.resolve(data.map((item) => new MyTreeNode(item.label, item.description , item.extension, item.tags, item.code)));
    }

    refresh() {
        this._onDidChangeTreeData.fire();
    }

    getIconPath(extension) {
        switch (extension) {
            case 'py':
                return new vscode.ThemeIcon('extensions'); // You can replace 'file-code' with the actual icon you want
            // Add more cases for other file extensions as needed
            default:
                return vscode.ThemeIcon.File;
        }
    }
}

class MyTreeNode {
    constructor(label, description, extension, tags, code, onButtonClick) {
        this.label = label;
        this.description = description;
        this.extension = extension;
        this.tags = tags;
        this.code = code;
        this.onButtonClick = onButtonClick;
    }
}

module.exports = FlatListProvider;
