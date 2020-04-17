import clock from "clock";
import document from "document";
import { display } from "display";
import { HeartRateSensor } from "heart-rate";
import { preferences } from "user-settings";
import userActivity from "user-activity";
import { user } from "user-profile";
import { battery } from "power";
import * as util from "../common/utils";

// Update the clock every minute
clock.granularity = "minutes";

// Delay between clock face updates
var updateDelay = 2500;

// Get a handle on the <text> element
const timeLabel = document.getElementById("clockTime");
const dateLabel = document.getElementById("clockDate");

// Update the <text> element every tick with the current time
clock.ontick = (evt) => {
  let today = evt.date;
  let hours = today.getHours();
  
  if (preferences.clockDisplay === "12h") {
    // 12h format
    hours = hours % 12 || 12;
  } else {
    // 24h format
    hours = util.zeroPad(hours);
  }

  let mins = util.zeroPad(today.getMinutes());
  timeLabel.text = `${hours}:${mins}`;
  
  let dow = util.dayStr(today.getDay());
  let month = util.monthStr(today.getMonth());
  let date = today.getDate();
  dateLabel.text = `${dow}, ${month} ${date}`;
  
  intervalFunction();
}

const stepsLabel = document.getElementById("stepCount");

function updateSteps() {
  let currentSteps = (userActivity.today.local.steps || 0);
  stepsLabel.text = util.thousandsSeprate(currentSteps);
}

// Update the heart rate
const hrLabel = document.getElementById("heartRate");
const hrImage = document.getElementById("heartRateImage");

var heartRate = 0;

function updateHR() {
  if (!HeartRateSensor) {
    return;
  }
  
  var localTimestamp = Date.now();
  if ((hrmLastTimestamp + 2*updateDelay) < localTimestamp) {
    hrLabel.text = '--';
    hrImage.href = "rest.png";
    return;
  }
  
  if (heartRate > 0) {
    hrLabel.text = heartRate;
  } else {
    hrLabel.text = '--';
    hrImage.href = "rest.png";
  }

  let level0 = user.restingHeartRate + 10;
  let level1 = user.restingHeartRate + 25;
  let level2 = user.restingHeartRate + 50;

  if (heartRate <= level0) {
    hrImage.href = "rest.png";
  } else if (heartRate <= level1) {
    hrImage.href = "quarter.png";
  } else if (heartRate <= level2) {
    hrImage.href = "eighth.png";
  } else {
    hrImage.href = "sixteenth.png";
  }
}

// Update the <text> element with the heart rate.
if (HeartRateSensor) {
  var hrm = new HeartRateSensor();
  var hrmLastTimestamp = 0;
  hrLabel.text = "--";
  hrm.onreading = () => {
    heartRate = hrm.heartRate;
    hrmLastTimestamp = Date.now();
    intervalFunction();
  };
  hrm.onactivate = () => {
    intervalFunction();
  }
  hrm.onerror = () => {
    heartRate = 0;
    intervalFunction();
  };
} else {
  hrLabel.style.display = "none";
}

const batteryImage = document.getElementById("batteryImage");

// Battery API
function updateBattery() {
  if (battery.chargeLevel <= 20) {
    batteryImage.href = "battery-0.png";
  } else if (battery.chargeLevel <= 40) {
    batteryImage.href = "battery-20.png";
  } else if (battery.chargeLevel <= 60) {
    batteryImage.href = "battery-50.png";
  } else if (battery.chargeLevel <= 80) {
    batteryImage.href = "battery-75.png";
  } else {
    batteryImage.href = "battery-100.png";
  }
}

function intervalFunction() {
  if (display.on) {
    hrm.start();
    updateHR();
    updateSteps();
    updateBattery();
  } else {
    hrm.stop();
  }
}

display.onchange = () => {
  if (display.on) {
    hrm.start();
  } else {
    hrm.stop()
  }
}