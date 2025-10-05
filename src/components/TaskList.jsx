import React, { useMemo, useState } from "react";
import { useTasks } from "../context/TaskContext";
import TaskItem from "./TaskItem";

export default function TaskList() {
  const { tasks, filter, dispatch } = useTasks();
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("CREATED_ASC"); // CREATED_ASC | DUE_ASC | DUE_DESC | PRIO_DESC

  // --- DnD state (use ids to work with filtered/sorted views) ---
  const [dragId, setDragId] = useState(null);
  const [overId, setOverId] = useState(null);

  const prioWeight = { HIGH: 3, MEDIUM: 2, LOW: 1 };

  const filteredTasks = useMemo(() => {
    let list = tasks;

    if (filter === "ACTIVE") list = list.filter((t) => !t.completed);
    if (filter === "COMPLETED") list = list.filter((t) => t.completed);

    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter((t) => t.text.toLowerCase().includes(q));
    }

    const byDate = (a, b) => {
      const da = a.dueDate ? new Date(a.dueDate) : null;
      const db = b.dueDate ? new Date(b.dueDate) : null;
      if (!da && !db) return 0;
      if (!da) return 1;
      if (!db) return -1;
      return da - db;
    };

    const byPrio = (a, b) =>
      (prioWeight[b.priority || "MEDIUM"] ?? 2) -
      (prioWeight[a.priority || "MEDIUM"] ?? 2);

    const byCreated = (a, b) => a.id - b.id;

    const copy = [...list];
    switch (sortBy) {
      case "DUE_ASC":
        copy.sort(byDate);
        break;
      case "DUE_DESC":
        copy.sort((a, b) => -byDate(a, b));
        break;
      case "PRIO_DESC":
        copy.sort(byPrio);
        break;
      default:
        copy.sort(byCreated); // CREATED_ASC
    }
    return copy;
  }, [tasks, filter, query, sortBy]);

  if (filteredTasks.length === 0) {
    return (
      <>
        <div className="list-controls">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tasks…"
          />
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="CREATED_ASC">Sort: Created</option>
            <option value="DUE_ASC">Sort: Due date ↑</option>
            <option value="DUE_DESC">Sort: Due date ↓</option>
            <option value="PRIO_DESC">Sort: Priority</option>
          </select>
        </div>
        <p className="no-task">No tasks match this view.</p>
      </>
    );
  }

  // --- DnD handlers ---
  const handleDragStart = (id) => {
    // Make sure manual ordering is visible
    if (sortBy !== "CREATED_ASC") setSortBy("CREATED_ASC");
    setDragId(id);
  };

  const handleDragEnter = (id) => {
    if (id !== dragId) setOverId(id);
  };

  const handleDragOver = (e) => e.preventDefault(); // allow drop

  const handleDragEnd = () => {
    if (dragId && overId && dragId !== overId) {
      const fromIndex = tasks.findIndex((t) => t.id === dragId);
      const toIndex = tasks.findIndex((t) => t.id === overId);
      if (fromIndex !== -1 && toIndex !== -1) {
        dispatch({
          type: "REORDER_TASKS",
          payload: { fromIndex, toIndex },
        });
      }
    }
    setDragId(null);
    setOverId(null);
  };

  return (
    <div className="task-list-container">
      {/* Controls */}
      <div className="list-controls">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search tasks…"
        />
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="CREATED_ASC">Sort: Created</option>
          <option value="DUE_ASC">Sort: Due date ↑</option>
          <option value="DUE_DESC">Sort: Due date ↓</option>
          <option value="PRIO_DESC">Sort: Priority</option>
        </select>
      </div>

      <ul className="task-list">
        {filteredTasks.map((task) => (
          <li
            key={task.id}
            draggable
            onDragStart={() => handleDragStart(task.id)}
            onDragEnter={() => handleDragEnter(task.id)}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
            className={`drag-wrapper ${overId === task.id ? "drag-over" : ""} ${
              dragId === task.id ? "dragging" : ""
            }`}
          >
            <TaskItem task={task} />
          </li>
        ))}
      </ul>

      <div className="task-footer">
        <p className="task-counter">
          {tasks.filter((t) => !t.completed).length} task(s) remaining
        </p>
        {tasks.length > 0 && (
          <button
            className="clear-btn"
            onClick={() => dispatch({ type: "CLEAR_TASKS" })}
          >
            Clear All Tasks
          </button>
        )}
      </div>
    </div>
  );
}
