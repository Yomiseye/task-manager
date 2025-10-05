import React, { useState } from "react";
import { useTasks } from "../context/TaskContext";

export default function TaskItem({ task }) {
  const { dispatch } = useTasks();
  const [removing, setRemoving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(task.text);
  const [editDueDate, setEditDueDate] = useState(task.dueDate || "");
  const [editReminder, setEditReminder] = useState(task.reminder || "");
  const [editPriority, setEditPriority] = useState(task.priority || "MEDIUM");

  const handleDelete = () => {
    setRemoving(true); // trigger CSS animation
    setTimeout(() => {
      dispatch({ type: "DELETE_TASK", payload: task.id });
    }, 300); // match animation duration
  };

  const handleSave = () => {
    const text = editText.trim();
    if (!text) return;
    dispatch({
      type: "EDIT_TASK",
      payload: {
        id: task.id,
        text,
        dueDate: editDueDate || null,
        reminder: editReminder || null,
        priority: editPriority,
      },
    });
    setIsEditing(false);
  };

  const isOverdue =
    task.dueDate && new Date(task.dueDate) < new Date() && !task.completed;

  return (
    <li
      className={`task-item ${task.completed ? "completed" : ""} ${
        removing ? "removing" : ""
      } ${isOverdue ? "overdue" : ""}`}
    >
      {/* LEFT: content */}
      <div className="task-content">
        {isEditing ? (
          <div className="edit-section">
            <input
              type="text"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSave()}
              className="edit-input"
              autoFocus
            />
            <div className="edit-row">
              <input
                type="date"
                value={editDueDate}
                onChange={(e) => setEditDueDate(e.target.value)}
                className="edit-date"
                aria-label="Edit due date"
              />
              <input
                type="time"
                value={editReminder}
                onChange={(e) => setEditReminder(e.target.value)}
                className="edit-reminder"
                aria-label="Edit reminder time"
              />
              <select
                value={editPriority}
                onChange={(e) => setEditPriority(e.target.value)}
                className="edit-priority"
              >
                <option value="HIGH">High</option>
                <option value="MEDIUM">Medium</option>
                <option value="LOW">Low</option>
              </select>
            </div>
          </div>
        ) : (
          <>
            <span>{task.text}</span>
            <div className="meta-row">
              <span
                className={`prio prio-${(
                  task.priority || "MEDIUM"
                ).toLowerCase()}`}
              >
                {(task.priority || "MEDIUM").toUpperCase()}
              </span>

              {task.dueDate && (
                <small className={`due-date ${isOverdue ? "overdue" : ""}`}>
                  Due: {new Date(task.dueDate).toLocaleDateString()}
                </small>
              )}
              {task.reminder && (
                <small className="reminder">⏰ {task.reminder}</small>
              )}
            </div>
          </>
        )}
      </div>

      {/* RIGHT: actions */}
      <div className="task-actions">
        {isEditing ? (
          <>
            <button onClick={handleSave} className="save-btn">
              Save
            </button>
            <button onClick={() => setIsEditing(false)} className="cancel-btn">
              Cancel
            </button>
          </>
        ) : (
          <button onClick={() => setIsEditing(true)} className="edit-btn">
            Edit
          </button>
        )}

        <button
          onClick={() => dispatch({ type: "TOGGLE_TASK", payload: task.id })}
          className="toggle-btn"
        >
          {task.completed ? "Undo" : "Complete"}
        </button>

        <button onClick={handleDelete} className="delete-btn">
          Delete
        </button>
      </div>
    </li>
  );
}
