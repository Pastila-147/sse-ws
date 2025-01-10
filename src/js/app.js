import {
  initializeUI,
  displayTickets,
  showModal,
  hideModal,
} from "./constructor.js";
import {
  getAllTickets,
  createTicketElement,
  updateTicket,
  deleteTicket,
  createTicket,
} from "./helpdesk.js";

function initializeApp() {
  initializeUI();

  // Загружаем и отображаем список тикетов
  getAllTickets((error, tickets) => {
    if (error) {
      console.error("Не удалось загрузить тикеты:", error);
      return;
    }
    displayTickets(tickets);
  });
}

function handleCreateTicket(name, description) {
  const newTicket = {
    name,
    description,
  };

  createTicket(newTicket, (error, response) => {
    if (error) {
      console.error("Ошибка при создании тикета:", error);
    } else {
      console.log("Тикет успешно создан:", response);
      // Обновить список тикетов после добавления нового
      getAllTickets((error, tickets) => {
        if (error) {
          console.error("Не удалось обновить список тикетов:", error);
          return;
        }
        displayTickets(tickets);
      });
    }
  });
}

export function openDeleteConfirmationModal(ticketId) {
  showModal("delete-ticket-modal");
  const confirmButton = document.getElementById("confirm-delete");
  const cancelButton = document.getElementById("cancel-delete");
  const closeButton = document.querySelector("#delete-ticket-modal .close");
  const confirmDeleteHandler = () => {
    handleDeleteTicket(ticketId);
    hideModal("delete-ticket-modal");
    confirmButton.removeEventListener('click', confirmDeleteHandler);
    cancelButton.removeEventListener('click', cancelDeleteHandler);
    closeButton.removeEventListener('click', cancelDeleteHandler);
  };
  const cancelDeleteHandler = () => {
    hideModal("delete-ticket-modal");
    confirmButton.removeEventListener('click', confirmDeleteHandler);
    cancelButton.removeEventListener('click', cancelDeleteHandler);
    closeButton.removeEventListener('click', cancelDeleteHandler);
  };
  confirmButton.addEventListener('click', confirmDeleteHandler);
  cancelButton.addEventListener('click', cancelDeleteHandler);
  closeButton.addEventListener('click', cancelDeleteHandler);
}

export function toggleDescription(ticketElement) {
  const ticketDescriptionBlock = ticketElement.querySelector('.ticket_sub');
  if (ticketDescriptionBlock.style.display === 'none') {
    ticketDescriptionBlock.style.display = 'flex';
  } else {
    ticketDescriptionBlock.style.display = 'none';
  }
}

export function handleDeleteTicket(ticketId) {
  // eslint-disable-next-line no-unused-vars
  deleteTicket(ticketId, (error, _) => {
    if (!error) {
      // Обновляем список тикетов
      getAllTickets((error, tickets) => {
        if (error) {
          console.error("Не удалось обновить список тикетов", error);
          return;
        }
        displayTickets(tickets);
      });
    } else {
      console.error("Ошибка при удалении тикета:", error);
    }
  });
}

export function openEditTicketModal(ticketId, ticketData) {
  const nameInput = document.getElementById("edit-ticket-name");
  const descriptionInput = document.getElementById("edit-ticket-description");
  nameInput.value = ticketData.name || "";
  descriptionInput.value = ticketData.description || "";
  showModal("edit-ticket-modal");
  const closeButton = document.querySelector("#edit-ticket-modal .close");
  closeButton.onclick = () => hideModal("edit-ticket-modal");
  document.getElementById("edit-ticket-form").onsubmit = (event) => {
    event.preventDefault();
    const updatedTicketData = {
      name: nameInput.value,
      description: descriptionInput.value,
    };
    handleEditTicket(ticketId, updatedTicketData);
    hideModal("edit-ticket-modal");
  };
}

export function handleEditTicket(ticketId, ticketData) {
  updateTicket(ticketId, ticketData, (error) => {
    if (!error) {
      // Обновляем список тикетов
      getAllTickets((error, tickets) => {
        if (error) {
          console.error("Не удалось обновить список тикетов", error);
          return;
        }
        displayTickets(tickets);
      });
    } else {
      console.error("Ошибка при редактировании тикета:", error);
    }
  });
}

document.getElementById("add-ticket-btn").addEventListener("click", () => {
  showModal("add-ticket-modal");
});

document
  .getElementById("add-ticket-form")
  .addEventListener("submit", (event) => {
    event.preventDefault();

    // Получим значения из полей формы
    const name = document.getElementById("new-ticket-name").value;
    const description = document.getElementById("new-ticket-description").value;

    handleCreateTicket(name, description);
    hideModal("add-ticket-modal");
  });

document.addEventListener("DOMContentLoaded", initializeApp);
