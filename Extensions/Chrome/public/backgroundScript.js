chrome.runtime.onInstalled.addListener(() => {
  const contextMenuItem = {
    id: "saveCode",
    title: "Save Code",
    contexts: ["selection"],
  };

  chrome.contextMenus.create(contextMenuItem);

  chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "saveCode" && info.selectionText) {
      console.log("Copied text:", info.selectionText);
    }
  });
});
