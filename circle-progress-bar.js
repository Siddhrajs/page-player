function pickFromRange(lowerLimit,upperLimit,percentage)
{
  let pad = (upperLimit - lowerLimit)*percentage/100;
  pad = upperLimit - pad;
  return pad.toString(16).padStart(6,0).substring(0,6);
}
function progressCircle(percent) {
  percent = percent.toFixed(2);
  const size = 50;

  const canvas = document.getElementById("cvs");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");

  ctx.beginPath();
  ctx.arc(size/2, size/2, size/3, 0, Math.PI * 2);
  const colStr = pickFromRange(0x00,0xff,100-percent).substring(0,2);
  ctx.strokeStyle = "#"+colStr+colStr+colStr;
  ctx.lineWidth = size/5;
  ctx.stroke();
  ctx.closePath();

  const angle = percent/100 * 360;
  ctx.beginPath();
  ctx.arc(size/2, size/2, size/3, -90 * Math.PI/180, (angle - 90) * Math.PI/180);
  ctx.strokeStyle = "#"+pickFromRange(0x0000ff,0xff0000,percent);
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
  

  ctx.fillText(percent.slice(0,-3) + "%", size/2, size/2);
}

export default progressCircle;