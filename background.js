//check if current web page has been read once and change icons accordingly
async function checkRead(url) {
	const data = await chrome.storage.local.get(url);
	if (data[url])
		chrome.action.setIcon({path: "icon.png"});
	else
		chrome.action.setIcon({path: "red-icon.png"});
}

async function initExtForTab(info) {
	const tab = await chrome.tabs.get(info.tabIds[0]);
	const url = tab.url;

	await checkRead(url);
}

//this function should be called only from scripting callback
function checkScrollDownRead() {
	window.addEventListener('scroll', () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      if (scrollTop + clientHeight >= scrollHeight) {
      	const url = window.location.href;
        const data = {};
        data[url]=1;
    	chrome.storage.local.set(data);
      }
    });
}

chrome.tabs.onHighlighted.addListener((highlightedInfo) => {
	const tabId= highlightedInfo.tabIds[0];

	initExtForTab(highlightedInfo);
    chrome.storage.local.onChanged.addListener((object) => {
    	initExtForTab(highlightedInfo);
    });
    chrome.scripting.executeScript({
     	target : {tabId : tabId, allFrames : true},
		func : checkScrollDownRead,
    });
});