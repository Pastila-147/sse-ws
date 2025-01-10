import ChatApp from "./constructor"
import ChatApi from "./api/chat-api";
import {hideModal, showModal} from "./constructor";

const root = document.getElementById('chat-container');


const chatApi = new ChatApi("ws://localhost:3000/");
        // users => chatApp.updateUsersList(users),
        // message => chatApp.addMessage(message));

const chatApp = new ChatApp(root, "http://localhost:3000/", chatApi);

