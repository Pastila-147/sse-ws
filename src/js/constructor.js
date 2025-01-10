import {openEditTicketModal, openDeleteConfirmationModal, toggleDescription } from "./app";

export function createTicketElement(ticket) {
  const ticketElement = document.createElement("div");
  ticketElement.className = "ticket";
  ticketElement.setAttribute("data-ticket-id", ticket.id);

  const ticketMain = document.createElement("div");
  ticketMain.className = "ticket_main";

  const ticketName = document.createElement("h3");
  ticketName.textContent = ticket.name;
  ticketName.style.cursor = "pointer";
  ticketMain.appendChild(ticketName);

  const ticketDate = document.createElement("h6");
  ticketDate.className = "date";
  ticketDate.textContent = timeConverter(ticket.created);
  ticketMain.appendChild(ticketDate);

  const editButton = document.createElement("button");
  editButton.className = "edit-ticket-btn";
  editButton.textContent = "✎";
  editButton.onclick = function(e) {
    e.stopPropagation();
    const ticketData = {
      name: ticket.name,
      description: ticket.description,
    };
    openEditTicketModal(ticket.id, ticketData);
  };
  ticketMain.appendChild(editButton);

  const deleteButton = document.createElement("button");
  deleteButton.className = "delete-ticket-btn";
  deleteButton.textContent = "✗";
  deleteButton.onclick = function(e) {
    e.stopPropagation();
    openDeleteConfirmationModal(ticket.id);
  };
  ticketMain.appendChild(deleteButton);

  ticketElement.appendChild(ticketMain);

  const ticketDescriptionBlock = document.createElement("div");
  ticketDescriptionBlock.className = "ticket_sub";
  ticketDescriptionBlock.style.display = "none";
  const ticketDescription = document.createElement("p");
  ticketDescription.className = "ticket-description";
  ticketDescription.textContent = ticket.description;
  ticketDescriptionBlock.appendChild(ticketDescription);
  ticketElement.appendChild(ticketDescriptionBlock);

  ticketElement.addEventListener('click', (e) => {
    if (!e.target.classList.contains('edit-ticket-btn') && !e.target.classList.contains('delete-ticket-btn')) {
      toggleDescription(ticketElement);
    }
  });

  return ticketElement;
}

// Функция для отображения списка тикетов
export function displayTickets(tickets) {
  const ticketsContainer = document.getElementById("tickets");
  ticketsContainer.innerHTML = ""; // Очистить текущий список

  tickets.forEach((ticket) => {
    const ticketElement = createTicketElement(ticket);
    ticketsContainer.appendChild(ticketElement);
  });
}

// Функция для показа окна
export function showModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = "flex";
  }
}

// Функция для скрытия окна
export function hideModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = "none";
  }
}

// Функция для обработки событий
export function initializeUI() {

  const addTicketButton = document.getElementById("add-ticket-btn");
  addTicketButton.addEventListener("click", () => {
    showModal("add-ticket-modal");
  });

  const closeButtons = document.querySelectorAll(".modal .close");
  closeButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      const modal = event.target.closest(".modal");
      if (modal) {
        modal.style.display = "none";
      }
    });
  });
}

// Функция для отображения даты
function timeConverter(UNIX_timestamp) {
  const date = new Date(UNIX_timestamp);
  return date.toLocaleString("ru-RU");
}
