// src/components/TaskForm.jsx
import React, { useState } from "react";
import { useTasks } from "../context/TaskContext";

export default function TaskForm() {
  const { dispatch } = useTasks();
  const [text, setText] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [reminder, setReminder] = useState(""); // optional time HH:MM
  const [priority, setPriority] = useState("MEDIUM");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    dispatch({
      type: "ADD_TASK",
      payload: {
        text: text.trim(),
        dueDate: dueDate || null,
        reminder: reminder || null,
        priority,
      },
    });

    // reset inputs
    setText("");
    setDueDate("");
    setReminder("");
    setPriority("MEDIUM");
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <input
        type="text"
        value={text}
        placeholder="Enter a task..."
        onChange={(e) => setText(e.target.value)}
      />

      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
      />

      <input
        type="time"
        value={reminder}
        onChange={(e) => setReminder(e.target.value)}
      />

      {/* ✅ Priority select */}
      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
        className="priority-select"
        aria-label="Priority"
      >
        <option value="HIGH">High</option>
        <option value="MEDIUM">Medium</option>
        <option value="LOW">Low</option>
      </select>

      <button type="submit">Add Task</button>
    </form>
  );
}
