export function sendGetRequest(url, callback) {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);

  xhr.onload = function () {
    if (xhr.status >= 200 && xhr.status < 300) {
      try {
        if (xhr.responseText !== "") {
          const data = JSON.parse(xhr.responseText);
          callback(null, data);
        } else {
          callback(null, null);
        }
      } catch (error) {
        callback(error);
      }
    } else {
      callback(
        new Error(
          `Ошибка при запросе к серверу: ${xhr.status} ${xhr.statusText}`,
        ),
      );
    }
  };

  xhr.onerror = function () {
    callback(new Error("Ошибка соединения с сервером"));
  };

  xhr.send();
}

export function sendPostRequest(url, data, callback) {
  const xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

  xhr.onload = function () {
    if (xhr.status === 200 || xhr.status === 201) {
      callback(null, xhr.responseText);
    } else {
      callback(
        new Error(
          `Ошибка при запросе к серверу: ${xhr.status} ${xhr.statusText}`,
        ),
      );
    }
  };

  xhr.onerror = function () {
    callback(new Error("Ошибка соединения с сервером"));
  };

  xhr.send(JSON.stringify(data));
}

export function getAllTickets(callback) {
  sendGetRequest("http://localhost:7070/?method=allTickets", callback);
}

export function createTicket(newTicket, error) {
  sendPostRequest(
    "http://localhost:7070/?method=createTicket",
    newTicket,
    error,
  );
}

// api.js
export function deleteTicket(ticketId, callback) {
  sendGetRequest(
    "http://localhost:7070/?method=deleteById&id=" + ticketId,
    callback,
  );
}

export function updateTicket(ticketId, ticketData, callback) {
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(ticketData),
  };

  fetch(
    "http://localhost:7070/?method=updateById&id=" + ticketId,
    requestOptions,
  )
    .then(response => {
      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }
      return response.json();
    })
    .then(data => {
      callback(null, data);
    })
    .catch(error => {
      callback(error, null);
    });
}
