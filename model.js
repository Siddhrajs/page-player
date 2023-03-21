import { renderOptions, renderReadList, displayPopUp } from './view.js';
//model should not communicate directly with view make appropiate changes

function changeData() {
  console.log(chrome.storage);
  const url = document.getElementById("date").value;
  const data = {};
  data[url]=1;
  console.log(url);
  
  if(this.checked) {
    chrome.storage.local.set(data);
  }
  else {
    chrome.storage.local.remove(url);
  }
  renderReadList();
}
async function removeTutorial() {
  const tutorialName = document.getElementById("tutName").value;
  let data = await chrome.storage.local.get("tutorials");
  let dataList = data["tutorials"];
  let newlist = [];
  chrome.storage.local.remove(tutorialName);

  for(const tut of dataList)
  {
    if(tut !== tutorialName)
    {
      newlist.push(tut);
    }
  }

  data = {"tutorials": [...newlist]};
  renderOptions(newlist);
  chrome.storage.local.set(data).then(()=>{
    renderReadList();
  });
}
async function addInTutList(tutorialName) {
  let data = await chrome.storage.local.get("tutorials");
  let dataList = data["tutorials"];
  let present = false;

  if(!dataList || !Array.isArray(dataList))
  {
    dataList = [];
  }

  for(const tut of dataList)
  {
    if(tut === tutorialName)
    {
      present = true;
      break;
    }
  }

  if(!present)
    data = {"tutorials": [...dataList,tutorialName]};
  renderOptions(data["tutorials"]);
  chrome.storage.local.set(data).then(() => {
    renderReadList();
  });
}
async function addTutorial() {
  const tutorialName = document.getElementById("tutName").value;
  if(tutorialName === "tutorials")
    return;
  addInTutList(tutorialName);
}

async function linkTutNSite() {
  const element = document.getElementById("tutList");
  const tutorialName = element.options[element.selectedIndex].text;
  const siteName = document.getElementById("siteTitle").innerHTML;
  const siteUrl = document.getElementById("siteTitle").value;
  const siteObj = [{"url": siteUrl, "title": siteName}];
  let data = await chrome.storage.local.get(tutorialName);
  let oldSiteObj = data[tutorialName];
  let present = false;

  if(!oldSiteObj || !Array.isArray(oldSiteObj))
  {
    oldSiteObj = [];
  }

  for(const tut of oldSiteObj)
  {
    if(tut.title === siteName)
    {
      present = true;
      break;
    }
  }

  if(!present)
    data[tutorialName]=[...oldSiteObj,...siteObj];
  chrome.storage.local.set(data);
  renderReadList();
}

async function delinkTutNSite() {
  const element = document.getElementById("tutList");
  const tutorialName = element.options[element.selectedIndex].text;
  const siteName = document.getElementById("siteTitle").innerHTML;
  const siteUrl = document.getElementById("siteTitle").value;
  let data = await chrome.storage.local.get(tutorialName);
  let oldSiteObj = data[tutorialName];
  let newSiteObj = [];

  if(!oldSiteObj || !Array.isArray(oldSiteObj))
  {
    oldSiteObj = [];
  }

  for(const tut of oldSiteObj)
  {
    if(tut.title !== siteName)
    {
      newSiteObj.push(tut);
    }
  }

  data[tutorialName]=[...newSiteObj];
  chrome.storage.local.set(data);
  renderReadList();
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

export { changeData, removeTutorial, addInTutList, addTutorial, linkTutNSite, delinkTutNSite, factoryReset, storeData, copyToClipBoard };