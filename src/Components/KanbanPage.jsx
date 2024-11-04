import React, { useEffect, useState } from 'react';
import "./KanbanPage.css";

const KanbanPage = () => {
  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);
  const [grouping, setGrouping] = useState("status");
  const [ordering, setOrdering] = useState("priority");

  // Fetching all the data from the given API - runs only 1 time
  useEffect(() => {
    const loadData = async () => {
      const response = await fetch("https://api.quicksell.co/v1/internal/frontend-assignment");
      const data = await response.json();
      setTickets(data.tickets);
      setUsers(data.users);
    };
    loadData();
  }, []);

  const handleGroupingChange = (event) => {
    setGrouping(event.target.value);
  };

  const handleOrderingChange = (event) => {
    setOrdering(event.target.value);
  };

  const sortedTickets = [...tickets].sort((a, b) => {
    if (ordering === "priority") return b.priority - a.priority;
    if (ordering === "title") return a.title.localeCompare(b.title);
    return 0;
  });

  const groupedTickets = sortedTickets.reduce((acc, ticket) => {
    const key = ticket[grouping] || "Unassigned";
    if (!acc[key]) acc[key] = [];
    acc[key].push(ticket);
    return acc;
  }, {});

  return (
    <div className="kanban-board">
      <div className="controls">
        <select onChange={handleGroupingChange}>
          <option value="status">Status</option>
          <option value="userId">User</option>
          <option value="priority">Priority</option>
        </select>
        <select onChange={handleOrderingChange}>
          <option value="priority">Priority</option>
          <option value="title">Title</option>
        </select>
      </div>
      <div className="kanban-columns">
        {Object.keys(groupedTickets).map((group, idx) => (
          <div key={idx} className="kanban-column">
            <h3>{group}</h3>
            {groupedTickets[group].map((ticket) => (
              <div key={ticket.id} className={`kanban-ticket priority-${ticket.priority}`}>
                <h4>{ticket.title}</h4>
                <p>{ticket.tag.join(", ")}</p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export default KanbanPage