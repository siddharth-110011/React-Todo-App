const keyMapping = {
  todo_id: "todoId",
  user_id: "userId",
  todo_name: "todoName",
  todo_status: "todoStatus",
  todo_description: "todoDescription",
  iteration_details: "iterationDetails",
  todo_type: "todoType",
  iteration_number: "iterationNumber",
  start_datetime: "startDateTime",
  end_datetime: "endDateTime",
};

export function transformTodoListBackendData(data) {
  return data.map((obj) => {
    let newObj = {};

    for (let key in obj) {
      newObj[keyMapping[key] || key] = obj[key];
    }

    if (newObj["iterationDetails"]) {
      for (let iterationDetail of newObj["iterationDetails"]) {
        for (let key in iterationDetail) {
          // console.log(key);
          iterationDetail[keyMapping[key]] = iterationDetail[key];
          delete iterationDetail[key];
        }
        // console.log(iterationDetail);
      }
    }

    return newObj;
  });
}

export function getFormattedDateTimeForUI(dateTimeStr) {
  let date = new Date(dateTimeStr);

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Months array for converting numeric month to abbreviation
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Get the components of the date
  let day = date.getDate();
  let month = months[date.getMonth()];
  let year = date.getFullYear();
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let second = date.getSeconds();
  let weekDay = weekDays[date.getDay()];

  // Pad single digit time components with leading zero
  hours = hours < 10 ? "0" + hours : hours;
  minutes = minutes < 10 ? "0" + minutes : minutes;
  second = second < 10 ? "0" + second : second;

  // Format the date and time
  let formattedDate = `${weekDay} ${day} ${month} ${year} ${hours}:${minutes}:${second}, ${getFormmattedTimeZoneOffset(
    date.getTimezoneOffset()
  )}`;

  return formattedDate;
}

export function getFormattedDateForBackend(dateTimeStr) {
  let date = new Date(dateTimeStr);

  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();

  month = month < 10 ? "0" + month : month;
  day = day < 10 ? "0" + day : day;

  const dateStr = "" + year + "-" + month + "-" + day;

  const timeStr = date.toTimeString().split(" ")[0];

  return dateStr + " " + timeStr;
}

export function getFormattedDateTimeForDateTimeInput(dateStr) {
  let date = new Date(dateStr);

  // Get the components of the date
  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();
  let hours = date.getHours();
  let minutes = date.getMinutes();

  // Pad single digit date components with leading zero
  month = month < 10 ? "0" + month : month;
  day = day < 10 ? "0" + day : day;

  // Pad single digit time components with leading zero
  hours = hours < 10 ? "0" + hours : hours;
  minutes = minutes < 10 ? "0" + minutes : minutes;

  return "" + year + "-" + month + "-" + day + "T" + hours + ":" + minutes;
}

export function getTimeTook(startDateStr, endDateStr) {
  let startDate = new Date(startDateStr);
  let endDate = new Date(endDateStr);
  let timeTook = (endDate - startDate) / (1000 * 3600);
  let hours = Math.floor(timeTook);
  let minutes = Math.round((timeTook - hours) * 60);

  return hours + hours > 1
    ? "hrs "
    : "hr " + minutes + minutes > 1
    ? "mins"
    : "min";
}

export function getFormmattedTimeZoneOffset(offset) {
  let sign = offset < 0 ? "+" : "-";
  let hours = Math.floor(Math.abs(offset) / 60);
  let minutes = (Math.abs(offset) / 60 - hours) * 60;

  // console.log(hours);
  // console.log(minutes);

  hours = hours < 10 ? "0" + hours : hours;
  minutes = minutes < 10 ? "0" + minutes : minutes;

  return "GMT" + sign + hours + minutes;
}
