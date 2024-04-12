const keyMapping = {
  todo_id: "taskId",
  user_id: "userId",
  todo_name: "todoName",
  todo_status: "todoStatus",
  todo_description: "todoDescription",
  iteration_details: "iterationDetails",
  todo_type: "todoType"
};

export function transformTodoListBackendData(data) {
  return data.map((obj) => {
    let newObj = {};

    for (let key in obj) {
      newObj[keyMapping[key] || key] = obj[key];
    }

    return newObj;
  });
}

export function getFormattedDate(date) {
  let currentDate = new Date(date);

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
  let day = currentDate.getDate();
  let month = months[currentDate.getMonth()];
  let year = currentDate.getFullYear();
  let hour = currentDate.getHours();
  let minute = currentDate.getMinutes();
  let second = currentDate.getSeconds();

  // Pad single digit time components with leading zero
  hour = hour < 10 ? "0" + hour : hour;
  minute = minute < 10 ? "0" + minute : minute;
  second = second < 10 ? "0" + second : second;

  // Format the date and time
  let formattedDate = `${day}-${month}-${year}, ${hour}:${minute}:${second}`;
  
  return formattedDate;
}
