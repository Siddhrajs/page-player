function colorProg(lowerLimit,upperLimit,percentage)
{
  let pad = (upperLimit - lowerLimit)*percentage/100;
  pad = upperLimit - pad;
  return pad.toString(16).padStart(6,0).substring(0,6);
}
function progressCircle(percent,percentage) {
  const size = 50;

  const canvas = document.getElementById("cvs");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");

  ctx.beginPath();
  ctx.arc(size/2, size/2, size/3, 0, Math.PI * 2);
  const colStr = colorProg(0x00,0xff,100-percent).substring(0,2);
  ctx.strokeStyle = "#"+colStr+colStr+colStr;
  ctx.lineWidth = size/5;
  ctx.stroke();
  ctx.closePath();

  const angle = percent/100 * 360;
  ctx.beginPath();
  ctx.arc(size/2, size/2, size/3, -90 * Math.PI/180, (angle - 90) * Math.PI/180);
  ctx.strokeStyle = "#"+colorProg(0x0000ff,0xff0000,percent);
  ctx.lineWidth = size/5;
  ctx.stroke();
  ctx.closePath();

  ctx.beginPath();
  ctx.arc(size/2, size/2, size/3.5, 0, Math.PI * 2);
  ctx.fillStyle = "#34495e";
  ctx.fill();
  ctx.closePath();

  ctx.textBaseline = "middle";
  ctx.textAlign = "center";
  ctx.font = "10px arial bold";
  ctx.fillStyle = "#f0f3f2"
  

  ctx.fillText(percentage + "%", size/2, size/2);
}
function updateTutList(tutorialList) {
  let innerhtml = "";

  for(const name of tutorialList)
  {
    innerhtml+= '<option value="'+name+'">'+name+'</option>';
  }
  if(innerhtml === "")
    innerhtml = "<option value='' disabled selected hidden>No Readlist</option>";
  document.getElementById("tutList").innerHTML = innerhtml;
}
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

  updateTutList(tutorialList);
  displaySites();
  if(data[tab.url])
    document.getElementById("checkPage").checked = true;
}
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
  displaySites();
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
  updateTutList(newlist);
  chrome.storage.local.set(data).then(()=>{
    displaySites();
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
  updateTutList(data["tutorials"]);
  chrome.storage.local.set(data).then(() => {
    displaySites();
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
  displaySites();
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
  displaySites();
}

async function displaySites() {
  const element = document.getElementById("tutList");
  let index = element.selectedIndex;
  const tutorialName = element.options[index].text;
  let data = await chrome.storage.local.get(tutorialName);
  data = data[tutorialName];

  if(this === element)
  {
    document.getElementById("tutName").value=tutorialName;
  }

  if(!data || !Array.isArray(data))
  {
    data = [];
  }

  let innerhtml = "";
  let total = 0;
  let hasRead = 0;
  for(const site of data)
  {
    let currentdata = await chrome.storage.local.get(site.url);
    currentdata = currentdata[site.url];
    total++;
    if(currentdata) {
      hasRead++;
      innerhtml += "<li><a href="+site.url+" target='_blank'>"+site.title+" \u2705</a></li>";
    }
    else {
      innerhtml += "<li><a href="+site.url+" target='_blank'>"+site.title+"</a></li>";
    }
  }
  let percent = ((total===0)?0:(hasRead*100/total));
  progressCircle(percent.toFixed(2),percent.toFixed(0));
  document.getElementById("selectedList").innerHTML = innerhtml;
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

function displayPopUp() {
  let popup = document.getElementById("myPopup");
  popup.classList.toggle("show");
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
document.getElementById("tutList").addEventListener("change", displaySites);
document.getElementById("remFromTut").addEventListener("click", delinkTutNSite);
document.getElementById("clipbutton").addEventListener("click", copyToClipBoard);
document.getElementById("addReadlist").addEventListener("click", storeData);
document.getElementById("resetBtn").addEventListener("click", displayPopUp);
document.getElementById("finalResetBtn").addEventListener("click", factoryReset);