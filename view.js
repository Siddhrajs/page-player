import progressCircle from './circle-progress-bar.js';

function renderOptions(tutorialList) {
  let innerhtml = "";

  for(const name of tutorialList)
  {
    innerhtml+= '<option value="'+name+'">'+name+'</option>';
  }
  if(innerhtml === "")
    innerhtml = "<option value='' disabled selected hidden>No ReadList</option>";
  document.getElementById("tutList").innerHTML = innerhtml;
}

async function renderReadList() {
  const element = document.getElementById("tutList");
  let index = element.selectedIndex;
  const tutorialName = element.options[index].text;
  let data = await chrome.storage.local.get(tutorialName);
  data = Array.isArray(data[tutorialName])?data[tutorialName]:[];

  if(this === element)
  {
    document.getElementById("tutName").value=tutorialName;
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
  progressCircle(percent);
  document.getElementById("selectedList").innerHTML = innerhtml;
}

function displayPopUp() {
  let popup = document.getElementById("myPopup");
  popup.classList.toggle("show");
}

export { renderOptions, renderReadList, displayPopUp };