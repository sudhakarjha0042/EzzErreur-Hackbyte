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
        iconPath: vscode.ThemeIcon.File
    };
  }

  getIconPath(fileExtension) {
    // Map file extensions to VSCode theme icons
    const iconMap = {
      '.js': 'javascript',
      '.ts': 'typescript',
      '.py': 'python',
      '.java': 'java',
      '.html': 'html',
      '.css': 'css',
      '.md': 'markdown',
    };
  
    return iconMap[fileExtension] ? new vscode.ThemeIcon(iconMap[fileExtension]) : new vscode.ThemeIcon('file');
  }

  getChildren(element) {
    const dbFilePath = path.join(__dirname, 'db.json');
    const data = JSON.parse(fs.readFileSync(dbFilePath, 'utf8'));
    return Promise.resolve(data.map((item) => new MyTreeNode(item.label, item.tags, item.code)));
  }

  refresh() {
    this._onDidChangeTreeData.fire();
  }
}

class MyTreeNode {
  constructor(label, tags, code, onButtonClick) {
    this.label = label;
    this.tags = tags;
    this.code = code;
    this.onButtonClick = onButtonClick;
  }
}

module.exports = FlatListProvider;