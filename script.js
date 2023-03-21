import { renderOptions, renderReadList, displayPopUp } from './view.js';
import { changeData, removeTutorial, addInTutList, addTutorial, linkTutNSite, delinkTutNSite, factoryReset, storeData, copyToClipBoard } from './model.js'

async function getCurrentTab() {
  let queryOptions = { active: true, lastFocusedWindow: true };
  let [tab] = await chrome.tabs.query(queryOptions);
  let data = await chrome.storage.local.get(tab.url);
  let tutorialList = await chrome.storage.local.get("tutorials");
  tutorialList = tutorialList["tutorials"];

  document.getElementById("date").innerHTML = tab.title;
  document.getElementById("date").value = tab.url;
  document.getElementById("siteTitle").innerHTML = tab.title;
  document.getElementById("siteTitle").value = tab.url;

  renderOptions(tutorialList);
  renderReadList();
  if(data[tab.url])
    document.getElementById("checkPage").checked = true;
}

console.log("INDEX SCRIPT STARTED");

getCurrentTab();

document.getElementById("checkPage").addEventListener("change", changeData);
document.getElementById("createTut").addEventListener("click", addTutorial);
document.getElementById("deleteTut").addEventListener("click", removeTutorial);
document.getElementById("addToTut").addEventListener("click", linkTutNSite);
document.getElementById("tutList").addEventListener("change", renderReadList);
document.getElementById("remFromTut").addEventListener("click", delinkTutNSite);
document.getElementById("clipbutton").addEventListener("click", copyToClipBoard);
document.getElementById("addReadlist").addEventListener("click", storeData);
document.getElementById("resetBtn").addEventListener("click", displayPopUp);
document.getElementById("finalResetBtn").addEventListener("click", factoryReset);