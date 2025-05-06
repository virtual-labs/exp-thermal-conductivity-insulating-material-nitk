const canvas = document.querySelector("#simscreen");
const ctx = canvas.getContext("2d");
const btnStart = document.querySelector(".btn-start");
const btnReset = document.querySelector(".btn-reset");
const voltageButtons = document.querySelectorAll(".voltage");
const heatSpinner = document.querySelector("#heat");
const temperature1 = document.querySelector("#temp1");
const temperature2 = document.querySelector("#temp2");
const temperature3 = document.querySelector("#temp3");
const temperature4 = document.querySelector("#temp4");
const temperature5 = document.querySelector("#temp5");
// const btnCheck1 = document.querySelector(".btn-check1");
const btnCheck2 = document.querySelector(".btn-check2");
const taskTitle = document.querySelector(".task-title");

btnStart.addEventListener("click", initiateProcess);
btnReset.addEventListener("click", resetAll);
voltageButtons.forEach((voltage) =>
  voltage.addEventListener("click", () => setVoltage(voltage))
);
background = new Image();
background.src = "./images/model2.jpg";

let steadyState = 0;
let currentVoltage = 0;
//controls section
var v = 0;
var vf = 0;
var heat = 0;
//timing section
var simTimeId = setInterval("", "1000");
var TimeInterval = setInterval("", "1000");
var TimeInterval1 = setInterval("", "1000");
var time = 0;
var time1 = 0;
var time2 = 0;

//point tracing section and initial(atmospheric section)
// var t1 = [26, 28.1, 26.5, 27, 27.2];
var t1 = [26, 26, 26, 26, 26];
var off = [0, 0, 0, 0, 0];
var q = [43.36, 43.71, 43.84];
var k = [0.0796, 0.0947, 0.1101];
var qtemp = 1;
var ktemp = 1;
var th = [45, 45, 45, 45, 45];

//temporary or dummy variables for locking buttons
// let temp = 0;
// let temp1 = 2;
// let temp2 = 0;
// let tempslope = 0;
// let tempk = 0;
var temp = 0;
var temp1 = 2;
var temp2 = 0;
function displayDiv(ele) {
  const taskScreen = document.querySelectorAll(".task-screen");
  taskScreen.forEach((task) => {
    task.classList.add("hide");
  });
  if (ele.classList.contains("tool-objective")) {
    document.querySelector(".objective").classList.remove("hide");
    taskTitle.textContent = "Objective";
  }
  if (ele.classList.contains("tool-description")) {
    document.querySelector(".description").classList.remove("hide");
    taskTitle.textContent = "Description";
  }
  if (ele.classList.contains("tool-explore")) {
    document.querySelector(".explore").classList.remove("hide");
    document.querySelector(".extra-info").classList.add("hide");
    taskTitle.textContent = "Experiment";

    if (temp2 !== 1) {
      drawModel();
      startsim();
      varinit();
    }
  }
  if (ele.classList.contains("tool-practice")) {
    document.querySelector(".practice").classList.remove("hide");
    document.querySelector(".extra-info").classList.remove("hide");
    taskTitle.textContent = "Solve";

    if (temp2 == 1) {
      temp1 = 1;
      validation();
      document.querySelector("#info").innerHTML = "Temperature Gradient";
    } else {
      document.querySelector("#info").innerHTML =
        "Perform the experiment to solve the questions";
      document.querySelector(".graph-div").classList.add("hide");
      document.querySelector(".questions").classList.add("hide");
      document.querySelector(".extra-info").classList.add("hide");
    }
  }
}
//Change in Variables with respect to time
function varinit() {
  if (time2 > 0) {
    t1[0] += off[0];
  }
  if (time2 > 0) {
    t1[1] += off[1];
  }
  if (time2 > 0) {
    t1[2] += off[2];
  }
  if (time2 > 3) {
    t1[3] += off[3];
  }
  if (time2 > 3) {
    t1[4] += off[4];
  }

  if (currentVoltage == 10) {
    heat = 50;
    qtemp = q[0];
    ktemp = k[0];
  } else if (currentVoltage == 20) {
    heat = 60;
    qtemp = q[1];
    ktemp = k[1];
  } else if (currentVoltage == 30) {
    heat = 70;
    qtemp = q[2];
    ktemp = k[2];
  } else {
    heat = 0;
  }

  heatSpinner.textContent = heat;
  temperature1.textContent = t1[0].toFixed(2);
  temperature2.textContent = t1[1].toFixed(2);
  temperature3.textContent = t1[2].toFixed(2);
  temperature4.textContent = t1[3].toFixed(2);
  temperature5.textContent = t1[4].toFixed(2);
}

//water temperature changes
function watertemp() {
  switch (vf) {
    case 26:
      t1[6] += 2.2;
      break;
    case 54:
      t1[6] += 1.2;
      break;
    case 60:
      t1[6] += 1.2;
      break;
  }
}

//stops simulations
function simperiod() {
  if (time1 >= 5.0) {
    clearInterval(TimeInterval);
    clearInterval(TimeInterval1);
    time1 = 0;
    time2 = 0;
    temp1 = 0;
    temp2 = 1;
    // watertemp();

    // ctx.clearRect(620, 485, 100, 50);
    // t1[6] = t1[6].toFixed(1);
    // ctx.font = "15px Comic Sans MS";
    // //ctx.fillText(t1[5]+" \u00B0C", 470, 170);
    // ctx.fillText(t1[6] + " \u00B0C", 650, 500);
    // printcomment("", 2);
  } else {
    drawGradient();
    steadyState = 5 - Math.round(time1);
    document.querySelector(
      ".comment"
    ).innerHTML = `Wait for  ${steadyState} seconds for steady state`;
    if (steadyState === 0) {
      temp2 = 0;

      document.querySelector(
        ".comment"
      ).innerHTML = `The steady state is achieved
`;
      btnReset.removeAttribute("disabled");
    }
    // if(time1 >= 5.0){
    //   clearInterval(TimeInterval);
    //   clearInterval(TimeInterval1);
    //   time1 = 0;
    //   time2 = 0
    //   temp1 = 0;
    //   temp2 = 1;
    //   document.getElementById('playpausebutton').src="./images//blueplaydull.png";
    //   //watertemp();
    //    printcomment("", 2);

    // }
    // else{
    //   drawGradient();
    //   printcomment("Wait for "+ (5 - Math.round(time1)) + " seconds for steady state", 2);
    // }
    // printcomment(
    //   "Wait for " + (5 - Math.round(time1)) + " seconds for steady state",
    //   2
    // );
  }
}
//draw gradient w.r.t. time in thermometer water flow and heater
function drawGradient() {
  //heater simulation
  var h = 100 * time1;
  //create gradient
  var grd1 = ctx.createLinearGradient(0, 0, 0, h);
  grd1.addColorStop(0, "red");
  grd1.addColorStop(1, "white");
  // Fill with gradient
  ctx.fillStyle = grd1;
  ctx.fillRect(300, 88, 230, 5);

  //tube simulation
  var w = 30 * time1;
  //create gradient
  var grd2 = ctx.createLinearGradient(0, 0, 0, w);
  grd2.addColorStop(0, "red");
  grd2.addColorStop(1, "white");
  // Fill with gradient
  ctx.fillStyle = grd2;
  ctx.fillRect(290, 99, 255, 17);

  //tube gradient
  var x = 30 * time1;
  var y = 200 - x;
  // Create gradient
  var grd = ctx.createLinearGradient(0, 200, 0, y);
  grd.addColorStop(0, "red");
  grd.addColorStop(1, "white");
  // Fill with gradient
  ctx.fillStyle = grd;
  ctx.fillRect(290, 65, 255, 17);

  var x = 168,
    y = 281,
    // Radii of the white glow.
    innerRadius = 4 * time1,
    outerRadius = 10 * time1,
    // Radius of the entire circle.
    radius = 50;

  var gradient = ctx.createRadialGradient(x, y, innerRadius, x, y, outerRadius);
  //gradient.addColorStop(0, 'white');
  gradient.addColorStop(0, "#ff9999");
  gradient.addColorStop(1, "white");

  ctx.arc(168, 281, radius, 0, 2 * Math.PI);

  ctx.fillStyle = gradient;
  ctx.fill();

  // //thermometer heights add offset
  if (time1 > 0) {
    th[0] += 0.86;
  }
  if (time1 > 0) {
    th[1] += 0.84;
  }
  if (time1 > 0) {
    th[2] += 0.8;
  }
  if (time1 > 3) {
    th[3] += 0.55;
  }
  if (time1 > 3) {
    th[4] += 0.53;
  }

  //thermometers drawing
  ctx.fillStyle = "black";
  ctx.lineJoin = "round";

  //thermometer reading
  ctx.beginPath();
  ctx.fillRect(325.25, 335, 1.5, -th[0]);
  ctx.fillRect(373.25, 335, 1.5, -th[1]);
  ctx.fillRect(425, 335, 1.5, -th[2]);
  ctx.fillRect(473.25, 335, 1.5, -th[3]);
  ctx.fillRect(521.25, 335, 1.5, -th[4]);
  ctx.arc(168, 281, 50, 0, 2 * Math.PI);

  ctx.rect(118, 281, 100, 105);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(168, 281, 20, 0, 2 * Math.PI);

  ctx.rect(148, 205, 40, 76);

  ctx.stroke();
}

// initial model
function drawModel() {
  ctx.clearRect(0, 0, 800, 500); //clears the complete canvas#simscreen everytime

  // ctx.clearRect(0,0,550,400);  //clears the complete canvas#simscreen everytime

  background = new Image();
  background.src = "./images/model2.jpg";
  layer = new Image();
  layer.src = "./images/screen.png";

  // Make sure the image is loaded first otherwise nothing will draw.
  layer.onload = function () {
    ctx.drawImage(background, 200, 0, 550, 400);

    //ctx.clearRect(78, 210, 46, 64);
    ctx.font = "15px Comic San MS";
    ctx.fillText("Insulating Material", 620, 125);
    ctx.fillText("Lagged Pipe", 240, 200);

    ctx.fillStyle = "black";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.rect(420, 230, 11, 112); //three
    ctx.fillRect(424, 332, 4, 7);
    ctx.fillText("T3", 418, 360);
    ctx.rect(468, 230, 11, 112); // four
    ctx.fillRect(472, 332, 4, 7);
    ctx.fillText("T4", 466, 360);
    ctx.rect(516, 230, 11, 112); // five
    ctx.fillRect(520, 332, 4, 7);
    ctx.fillText("T5", 518, 360);
    ctx.rect(320, 230, 11, 112); //one
    ctx.fillRect(324, 332, 4, 7);
    ctx.fillText("T1", 318, 360);
    ctx.rect(368, 230, 11, 112); //two
    ctx.fillRect(372, 332, 4, 7);
    ctx.fillText("T2", 366, 360);
    ctx.rect(300, 88, 230, 5);
    ctx.drawImage(layer, 0, 0, 550, 400);
    ctx.stroke();
    // printcomment(
    //   "<i>Diameter, </i> d = 20mm <br><i> Length interval</i> = 70mm<br><i>Cp</i>  = 4.187kJ/kg-K<br><i> Length of shaded area</i> = 300mm",
    //   1
    // );

    drawGradient();
  };
}

function comment1() {
  if (currentVoltage != 0) {
    time = 0;
    temp = 1;
    // $("#vspinner").spinner({disabled : true});
    // //$("#vfspinner").spinner({disabled : true});
    // $("#vslider").slider({disabled : true});
    // $("#vfslider").slider({disabled : true});
    clearInterval(simTimeId);
    //printcomment("start simulation", 0);
    if (currentVoltage == 10) {
      vf = 26;
    } else if (currentVoltage == 20) {
      vf = 54;
    } else if (currentVoltage == 30) {
      vf = 60;
    }
    offset();
  }
}

//offset for thermometer and temp change
function offset() {
  if (currentVoltage == 10) {
    //path = "./images//V1.jpg";
    off[0] = 23.4;
    off[1] = 22.58;
    off[2] = 22.9;
    off[3] = 6.5;
    off[4] = 5.9;
  } else if (currentVoltage == 20) {
    //path = "./images//V2.jpg";
    off[0] = 24;
    off[1] = 22.98;
    off[2] = 23.3;
    off[3] = 7;
    off[4] = 6.9;
  } else if (currentVoltage == 30) {
    //path = "./images//V3.jpg";
    off[0] = 24.2;
    off[1] = 23.18;
    off[2] = 23.7;
    off[3] = 7.5;
    off[4] = 7.4;
  }
  // temp1 = 0;
  // temp2 = 1;
}
function setVoltage(ele) {
  currentVoltage = Number(ele.value);
  btnStart.removeAttribute("disabled");
}

function startsim() {
  simTimeId = setInterval("time=time+0.1; comment1(); ", "100");
}
function initiateProcess() {
  if (currentVoltage === 0) return;
  btnStart.setAttribute("disabled", true);
  btnReset.setAttribute("disabled", true);
  voltageButtons.forEach((voltage) => voltage.setAttribute("disabled", true));
  simstate();
}

function simstate() {
  if (temp == 1) {
    temp = 0;
    temp1 = 1;
    TimeInterval = setInterval("time1=time1+.1; simperiod();", "100");
    TimeInterval1 = setInterval("time2=time2+1; varinit()", "1000");
  }
}

//Calculations of the experienment
function validation() {
  var datapoints = [];
  var Ti = (t1[0] + t1[1] + t1[2]) / 3;
  var To = (t1[3] + t1[4]) / 2;
  var l = 0.5;
  for (var i = 45; i <= 75; i++) {
    y = (qtemp * Math.log(75 / i)) / (2 * Math.PI * l * ktemp);
    y = Math.round(y * 10) / 10;
    datapoints.push({ x: i, y: y });
  }
  document.querySelector(".graph-div").classList.remove("hide");
  document.querySelector(".questions").classList.remove("hide");
  drawgraph(
    "graph",
    datapoints,
    "radius in (mm)",
    "Temperature profile(Ti-To)"
  );
  // if (currentVoltage == 10) {
  //   tempslope = slope[0];
  //   tempk = k[0];
  // } else if (currentVoltage == 20) {
  //   tempslope = slope[1];
  //   tempk = k[1];
  // } else if (currentVoltage == 30) {
  //   tempslope = slope[2];
  //   tempk = k[2];
  // }
  // btnCheck1.addEventListener("click", () => validateAnswer1());
  btnCheck2.addEventListener("click", () => validateAnswer2());
}

function validateAnswer1() {
  const correctAnswer = document.querySelector(".correct-answer1");
  const unit = document.querySelector(".question-unit1");
  unit.innerHTML = `W`;
  let userEnteredValue = Number(
    document.querySelector(".question-input1").value
  );
  // let answer = userEnteredValue === qtemp ? true : false;
  let answer = validateNearToAnswer(qtemp, userEnteredValue);
  if (!userEnteredValue) return;
  if (!answer) {
    correctAnswer.classList.remove("hide");
    unit.innerHTML += " <span class='wrong'>&#x2717;</span>";
    correctAnswer.innerHTML = `<span class='correct'>Correct Answer </span>= ${qtemp} W`;
  } else if (answer) {
    correctAnswer.classList.add("hide");
    unit.innerHTML += " <span class='correct'>&#x2713;</span>";
  }
}
function validateAnswer2() {
  const correctAnswer = document.querySelector(".correct-answer2");
  const unit = document.querySelector(".question-unit2");
  unit.innerHTML = `W/m.K`;
  let userEnteredValue = Number(
    document.querySelector(".question-input2").value
  );
  // let answer = userEnteredValue === ktemp ? true : false;
  let answer = validateNearToAnswer(ktemp, userEnteredValue);
  if (!userEnteredValue) return;
  if (!answer) {
    correctAnswer.classList.remove("hide");
    unit.innerHTML += " <span class='wrong'>&#x2717;</span>";
    correctAnswer.innerHTML = `<span class='correct'>Correct Answer </span>= ${ktemp} W/m.K`;
  } else if (answer) {
    correctAnswer.classList.add("hide");
    unit.innerHTML += " <span class='correct'>&#x2713;</span>";
  }
}

function validateNearToAnswer(exactAnswer, userAnswer) {
  const tolerance = 0.01; // Define the tolerance level
  const lowerBound = exactAnswer - tolerance;
  const upperBound = exactAnswer + tolerance;

  if (userAnswer < lowerBound || userAnswer > upperBound) {
    return false; // Answer is outside the tolerance range
  } else {
    return true; // Answer is within the tolerance range
  }
}
function resetAll() {
  btnStart.setAttribute("disabled", true);
  btnReset.setAttribute("disabled", true);
  voltageButtons.forEach((voltage) => {
    voltage.removeAttribute("disabled");
    voltage.checked = false;
  });
  document.querySelector(".comment").innerHTML = "";
  // if (temp1 == 0) {
  temp2 = 0;
  temp1 = 2;
  // t1 = [26, 28.1, 26.5, 27, 27.2];
  t1 = [26, 26, 26, 26, 26];
  th = [45, 45, 45, 45, 45];
  // v=0;
  background = new Image();
  background.src = "./images/model2.jpg";
  layer = new Image();
  layer.src = "./images/screen.png";
  currentVoltage = 0;
  // vf = 0;
  document.querySelector(".correct-answer1").innerHTML = "";
  document.querySelector(".question-unit1").innerHTML = `<sup>&deg;</sup>C/m`;
  document.querySelector(".question-input1").value = "";
  document.querySelector(".correct-answer2").innerHTML = "";
  document.querySelector(".question-unit2").innerHTML = `W/m.K`;
  document.querySelector(".question-input2").value = "";
  varinit();
  startsim();
  drawModel();
  // if(temp1 == 0){
  //   temp2 = 0; temp1 = 2;
  //   t1 = [26, 28.1, 26.5, 27, 27.2];
  //   th = [45,45,45,45,45];
  //   v=0;
  //   background = new Image();
  // background.src = "./images/model2.jpg";
  // layer = new Image();
  // layer.src = "./images/screen.png";
}

function movetoTop() {
  practiceDiv.scrollIntoView();
}
