function inject(tab?: chrome.tabs.Tab) {
  const tabId = tab?.id!;

  chrome.scripting.insertCSS({ target: { tabId }, files: ['viewer.css'] });
  chrome.scripting.executeScript({ target: { tabId }, files: ['contentScript.js'] });
}

chrome.action.onClicked.addListener(inject);

chrome.contextMenus.create({
  id: 'leif_ext_image_scanner',
  title: chrome.i18n.getMessage('tooltip'),
  contexts: ['page'],
});
chrome.contextMenus.onClicked.addListener((_, tab) => inject(tab));
