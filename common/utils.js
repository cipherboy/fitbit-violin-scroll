// Add zero in front of numbers < 10
export function zeroPad(i) {
  if (i < 10) {
    i = "0" + i;
  }
  return i;
}

function hundredPad(i) {
  let result = "" + i;
  if (i < 10) {
    result = "00" + i;
  } else if (i < 100) {
    result = "0" + i;
  }
  
  return result;
}

export function thousandsSeprate(i) {
  let result = "";
  if (i >= 1000) {
    result += parseInt(i / 1000) + ",";
    result += hundredPad(parseInt(i % 1000));
  } else {
    result += i;
  }
  
  return result;
}

export function monthStr(i) {
  let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months[i];
}

export function dayStr(i) {
  let days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return days[i];
}