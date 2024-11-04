// KanbanCard.jsx
import React from 'react';
import "./KanbanCard.css";

const KanbanCard = ({ ticket, users, toggleTaskCompletion }) => {
  const user = users.find((user) => user.id === ticket.userId);

  return (
    <div className="kanban-card">
      <div className="card-header">
        {/* Checkbox to toggle task completion */}
        <input
          type="checkbox"
          className="task-checkbox"
          checked={ticket.status === "Completed"}
          onChange={() => toggleTaskCompletion(ticket.id)}
        />
        <span className="ticket-id">{ticket.id}</span>

        {/* User avatar in the top right */}
        {user && (
          <div className="user-avatar">
            <img src={user.profilePictureUrl} alt={user.name} />
          </div>
        )}
      </div>

      {/* Card content */}
      <h4>{ticket.title}</h4>

      {/* Ticket tags */}
      <div className="ticket-tags">
        {ticket.tag.map((tag, idx) => (
          <div key={idx} className="ticket-tag">
            <p className='ticket-tag-name'>⚪ {tag}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KanbanCard;
