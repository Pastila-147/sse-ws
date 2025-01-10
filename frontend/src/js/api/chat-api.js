export default class ChatApi {
  constructor(url) {
    this.url = url;

    this.onNewUser = null;
    this.onMessage = null;
  }

  sendMessage(messageData) {
    messageData.type = "send";
    this.ws.send(JSON.stringify(messageData));
  }

  setOnNewMessageCallback(onNewMessageCallback) {
    this.onMessage = onNewMessageCallback;
  }

  setOnUsersListCallback(onUsersListCallback) {
    this.onNewUser = onUsersListCallback;
  }

  connect(currentUser) {
    this.currentUser = currentUser;
    this.ws = new WebSocket(this.url);
    this.ws.onopen = () => {
      console.log("connected");
    };

    this.ws.onmessage = (evt) => {
      const response = JSON.parse(evt.data);

      if (Array.isArray(response)) {
        this.usersOnline = response;
        if (this.onNewUser)
          this.onNewUser(response);
      } else {
        if (this.onMessage)
          this.onMessage(response);
      }
    };

    this.ws.onclose = (evt) => {
      console.log("connection closed", evt.code);
    };

    this.ws.onerror = () => {
      console.log("error");
    };

    window.addEventListener("beforeunload", () => {
      this.ws.send(
        JSON.stringify({ type: "exit", user: this.currentUser })
      );
    });
  }
}
