export default class ChatApp {
  constructor(container, apiUrl, chatApi) {
    this.container = container;
    this.apiUrl = apiUrl;
    this.chatApi = chatApi;
    this.currentUser = null;
    this.createForm();

    this.chatApi.setOnUsersListCallback(users => this.updateUsersList(users));
    this.chatApi.setOnNewMessageCallback(message => this.addMessage(message));


    const sendMessageButton = document.getElementById('send-message-button');
    sendMessageButton.onclick = (e) => {
      e.preventDefault();
      this.sendMessage();
    }
  }

  createForm() {
    const form = document.createElement("form");
    form.classList.add("widget");

    form.innerHTML = `
      <input class="input widget-input" type="text" name="nick" placeholder="Your nickname" required>
      <button type="submit" class="btn">Continue</button>
    `;

    this.container.insertAdjacentElement("afterbegin", form);

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const nickName = form.nick.value.trim();
      if (nickName) {
        const requestData = {
          name: nickName
        };

        try {
          const request = await fetch(`${this.apiUrl}new-user`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(requestData),
          });

          if (request.status !== 200 && request.status !== 201) {
            document.getElementById("modal-message").textContent = 'This user already exists';
            showModal('modal');
          } else if (!request.ok) {
            throw new Error('Network response was not ok');
          } else {
            const json = await request.json();
            if (json.error) {
              document.getElementById("modal-message").textContent = json.error;
              showModal('modal');
            } else {
              this.currentUser = json.user;
              this.chatApi.connect(this.currentUser);
              console.log(this.currentUser);
            }
          }

        } catch (error) {
          console.error('There was a problem with your fetch operation:', error);
        }
      } else {
        alert("Please enter a valid nickname.");
      }
    });
  }

  addUser(user) {
    const usersContainer = document.getElementById("nameList");

    const userTemplate = usersContainer.getElementsByClassName("name-template");

    const userElement = userTemplate[0].cloneNode(true);
    userElement.classList.remove("name-template");
    userElement.getElementsByClassName("user-name")[0].textContent = user.name;

    usersContainer.appendChild(userElement);
  }

  cleanUsersList() {
    const usersContainer = document.getElementById("nameList");
    var itemsToRemove = [];
    for (const child of usersContainer.children) {
      if (!child.classList.contains("name-template")) {
        itemsToRemove.push(child);

      }
    }

    for (const child of itemsToRemove) {
      child.remove();
    }
  }

  updateUsersList(users) {
    this.cleanUsersList();
    for (const user of users) {
      this.addUser(user);
    }
  }

  addMessage(message) {

    const messagesContainer = document.getElementById("messages-container");
    const messageTemplate = messagesContainer.getElementsByClassName("message-template");

    const messageElement = messageTemplate[0].cloneNode(true);
    messageElement.classList.remove("message-template");

    const options = { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric',second: 'numeric' };
    const dateString = new Date(message.date).toLocaleString("ru-RU", options);


    messageElement.getElementsByClassName("message-name")[0].textContent = message.user.name;
    messageElement.getElementsByClassName("message-date")[0].textContent = dateString;
    messageElement.getElementsByClassName("message-text")[0].textContent = message.text;

    if (this.currentUser && message.user.name === this.currentUser.name) {
      messageElement.classList.add("you");
      messageElement.getElementsByClassName("message-data")[0].classList.add("you");
      messageElement.getElementsByClassName("message-name")[0].classList.add("you");
    }

    messagesContainer.appendChild(messageElement);
  }

  sendMessage() {
    const messageInput = document.getElementById('message-input');
    const messageText = messageInput.value.trim();

    if (messageText) {
      const messageData = {
        text: messageText,
        user: this.currentUser,
        date: Date.now(),
      };

      messageInput.value = '';
      this.chatApi.sendMessage(messageData);

      //console.log('Sending message:', messageData);
    } else {
      alert('Please enter a message');
    }
  }
}

// Функция для показа окна
export function showModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = "flex";
  }
  const closeBtn = document.querySelector(".close");
  if (closeBtn) {
    closeBtn.addEventListener("click", () => hideModal("modal"));
  }
}

// Функция для скрытия окна
export function hideModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = "none";
  }
}



