// KanbanPage.jsx
import React, { useEffect, useState } from 'react';
import "./KanbanPage.css";
import KanbanCard from '../reusable/KanbanCard';

const KanbanPage = () => {
  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);
  const [grouping, setGrouping] = useState("status");
  const [ordering, setOrdering] = useState("priority");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Fetch data from the API - runs only once
  useEffect(() => {
    const loadData = async () => {
      const response = await fetch("https://api.quicksell.co/v1/internal/frontend-assignment");
      const data = await response.json();
      setTickets(data.tickets);
      setUsers(data.users);
    };
    loadData();
  }, []);

  // Helper to get the user's name by ID
  const getUserName = (userId) => {
    const user = users.find((user) => user.id === userId);
    return user ? user.name : "Unassigned";
  };

  // Toggle dropdown visibility
  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  // Handle grouping changes
  const handleGroupingChange = (event) => {
    const newGrouping = event.target.value;
    setGrouping(newGrouping);
    localStorage.setItem("grouping", newGrouping);
  };

  // Handle ordering changes
  const handleOrderingChange = (event) => {
    const newOrdering = event.target.value;
    setOrdering(newOrdering);
    localStorage.setItem("ordering", newOrdering);
  };

  // Sort and group tickets
  const sortedTickets = [...tickets].sort((a, b) => {
    if (ordering === "priority") return b.priority - a.priority;
    if (ordering === "title") return a.title.localeCompare(b.title);
    return 0;
  });

  const groupedTickets = sortedTickets.reduce((acc, ticket) => {
    let key = grouping === "User" ? getUserName(ticket.userId) : ticket[grouping] || "Unassigned";
    if (!acc[key]) acc[key] = [];
    acc[key].push(ticket);
    return acc;
  }, {});

  // Toggle task completion
  const toggleTaskCompletion = (ticketId) => {
    setTickets((prevTickets) =>
      prevTickets.map((ticket) =>
        ticket.id === ticketId ? { ...ticket, status: ticket.status === "Completed" ? "Todo" : "Completed" } : ticket
      )
    );
  };

  return (
    <div className="kanban-board">
      {/* Display dropdown for grouping and ordering */}
      <div className="display-dropdown">
        <button className="display-button" onClick={toggleDropdown}>
          <span className="icon">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M9.5 10.5C9.63261 10.5 9.75979 10.5527 9.85355 10.6464C9.94732 10.7402 10 10.8674 10 11V14C10 14.1326 9.94732 14.2598 9.85355 14.3536C9.75979 14.4473 9.63261 14.5 9.5 14.5H8.5C8.36739 14.5 8.24021 14.4473 8.14645 14.3536C8.05268 14.2598 8 14.1326 8 14V11C8 10.8674 8.05268 10.7402 8.14645 10.6464C8.24021 10.5527 8.36739 10.5 8.5 10.5H9.5ZM7 11.5V13H1.75C1.55109 13 1.36032 12.921 1.21967 12.7803C1.07902 12.6397 1 12.4489 1 12.25C1 12.0511 1.07902 11.8603 1.21967 11.7197C1.36032 11.579 1.55109 11.5 1.75 11.5H7ZM14.25 11.5C14.4489 11.5 14.6397 11.579 14.7803 11.7197C14.921 11.8603 15 12.0511 15 12.25C15 12.4489 14.921 12.6397 14.7803 12.7803C14.6397 12.921 14.4489 13 14.25 13H11V11.5H14.25ZM5.5 6C5.63261 6 5.75979 6.05268 5.85355 6.14645C5.94732 6.24021 6 6.36739 6 6.5V9.5C6 9.63261 5.94732 9.75979 5.85355 9.85355C5.75979 9.94732 5.63261 10 5.5 10H4.5C4.36739 10 4.24021 9.94732 4.14645 9.85355C4.05268 9.75979 4 9.63261 4 9.5V6.5C4 6.36739 4.05268 6.24021 4.14645 6.14645C4.24021 6.05268 4.36739 6 4.5 6H5.5ZM3 7.25V8.75H1.75C1.55109 8.75 1.36032 8.67098 1.21967 8.53033C1.07902 8.38968 1 8.19891 1 8C1 7.80109 1.07902 7.61032 1.21967 7.46967C1.36032 7.32902 1.55109 7.25 1.75 7.25H3ZM14.25 7.25C14.4489 7.25 14.6397 7.32902 14.7803 7.46967C14.921 7.61032 15 7.80109 15 8C15 8.19891 14.921 8.38968 14.7803 8.53033C14.6397 8.67098 14.4489 8.75 14.25 8.75H7V7.25H14.25ZM11.5 1.75C11.6326 1.75 11.7598 1.80268 11.8536 1.89645C11.9473 1.99021 12 2.11739 12 2.25V5.25C12 5.38261 11.9473 5.50979 11.8536 5.60355C11.7598 5.69732 11.6326 5.75 11.5 5.75H10.5C10.3674 5.75 10.2402 5.69732 10.1464 5.60355C10.0527 5.50979 10 5.38261 10 5.25V2.25C10 2.11739 10.0527 1.99021 10.1464 1.89645C10.2402 1.80268 10.3674 1.75 10.5 1.75H11.5ZM9 3V4.5H1.75C1.55109 4.5 1.36032 4.42098 1.21967 4.28033C1.07902 4.13968 1 3.94891 1 3.75C1 3.55109 1.07902 3.36032 1.21967 3.21967C1.36032 3.07902 1.55109 3 1.75 3H9ZM14.25 3C14.4489 3 14.6397 3.07902 14.7803 3.21967C14.921 3.36032 15 3.55109 15 3.75C15 3.94891 14.921 4.13968 14.7803 4.28033C14.6397 4.42098 14.4489 4.5 14.25 4.5H13V3H14.25Z" fill="#5C5C5E" />
            </svg>
          </span> Display
        </button>
        {isDropdownOpen && (
          <div className="dropdown-menu">
            <div className="dropdown-item">
              <label htmlFor="grouping-select">Grouping</label>
              <select id="grouping-select" value={grouping} onChange={handleGroupingChange}>
                <option value="status">Status</option>
                <option value="priority">Priority</option>
                <option value="User">User</option>
              </select>
            </div>
            <div className="dropdown-item">
              <label htmlFor="ordering-select">Ordering</label>
              <select id="ordering-select" value={ordering} onChange={handleOrderingChange}>
                <option value="priority">Priority</option>
                <option value="title">Title</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Kanban columns */}
      <div className="kanban-columns">
        {Object.keys(groupedTickets).map((group, idx) => (
          <div key={idx} className="kanban-column">
            <h3 className='kanban-column-header'>
              <div className='kanban-column-header-item'>
                <span>{group}</span>
                <span className='kanban-column-header-number'>{groupedTickets[group].length}</span>
              </div>
              <div className='kanban-column-header-item'>
                <span>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8.75 4C8.75 3.58579 8.41421 3.25 8 3.25C7.58579 3.25 7.25 3.58579 7.25 4V7.25H4C3.58579 7.25 3.25 7.58579 3.25 8C3.25 8.41421 3.58579 8.75 4 8.75H7.25V12C7.25 12.4142 7.58579 12.75 8 12.75C8.41421 12.75 8.75 12.4142 8.75 12V8.75H12C12.4142 8.75 12.75 8.41421 12.75 8C12.75 7.58579 12.4142 7.25 12 7.25H8.75V4Z" fill="#5C5C5E" />
                  </svg>
                </span>
                <span>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 6.5C3.39782 6.5 3.77936 6.65804 4.06066 6.93934C4.34196 7.22064 4.5 7.60218 4.5 8C4.5 8.39782 4.34196 8.77936 4.06066 9.06066C3.77936 9.34196 3.39782 9.5 3 9.5C2.60218 9.5 2.22064 9.34196 1.93934 9.06066C1.65804 8.77936 1.5 8.39782 1.5 8C1.5 7.60218 1.65804 7.22064 1.93934 6.93934C2.22064 6.65804 2.60218 6.5 3 6.5ZM8 6.5C8.39782 6.5 8.77936 6.65804 9.06066 6.93934C9.34196 7.22064 9.5 7.60218 9.5 8C9.5 8.39782 9.34196 8.77936 9.06066 9.06066C8.77936 9.34196 8.39782 9.5 8 9.5C7.60218 9.5 7.22064 9.34196 6.93934 9.06066C6.65804 8.77936 6.5 8.39782 6.5 8C6.5 7.60218 6.65804 7.22064 6.93934 6.93934C7.22064 6.65804 7.60218 6.5 8 6.5ZM13 6.5C13.3978 6.5 13.7794 6.65804 14.0607 6.93934C14.342 7.22064 14.5 7.60218 14.5 8C14.5 8.39782 14.342 8.77936 14.0607 9.06066C13.7794 9.34196 13.3978 9.5 13 9.5C12.6022 9.5 12.2206 9.34196 11.9393 9.06066C11.658 8.77936 11.5 8.39782 11.5 8C11.5 7.60218 11.658 7.22064 11.9393 6.93934C12.2206 6.65804 12.6022 6.5 13 6.5Z" fill="#5C5C5E" />
                  </svg>
                </span>
              </div>
            </h3>
            {groupedTickets[group].map((ticket) => (
              <KanbanCard
                key={ticket.id}
                ticket={ticket}
                users={users}
                toggleTaskCompletion={toggleTaskCompletion}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default KanbanPage;
