import ChatApp from "./constructor"
import ChatApi from "./api/chat-api";
import {hideModal, showModal} from "./constructor";

const root = document.getElementById('chat-container');


const chatApi = new ChatApi("ws://chat-v23v.onrender.com/");
        // users => chatApp.updateUsersList(users),
        // message => chatApp.addMessage(message));

const chatApp = new ChatApp(root, "https://chat-v23v.onrender.com/", chatApi);

