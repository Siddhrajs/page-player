import { renderOptions, renderReadList, displayPopUp } from './view.js';
import { changeData, removeTutorial, addInTutList, addTutorial, linkTutNSite, delinkTutNSite } from './model.js'

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

async function copyToClipBoard() {
  const element = document.getElementById("tutList");
  const tutorialName = element.options[element.selectedIndex].text;
  const data = await chrome.storage.local.get(tutorialName);
  const copyString = JSON.stringify(data);

  navigator.clipboard.writeText(copyString)
    .then(() => {
    })
    .catch((err) => {
      console.error('Failed to copy string: ', err);
    });
}

function storeData() {
  const data = document.getElementById("readlist").value;
  const obj = JSON.parse(data);

  for(const key in obj)
  {
    addInTutList(key);
  }
  chrome.storage.local.set(obj);
}

function factoryReset() {
  chrome.storage.local.clear().then(() => {
    window.close();
  });
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