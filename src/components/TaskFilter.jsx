import React from "react";
import { useTasks } from "../context/TaskContext";

export default function TaskFilter() {
  const { tasks, filter, dispatch } = useTasks();

  // Count active (incomplete) tasks
  const activeCount = tasks.filter((t) => !t.completed).length;

  return (
    <div className="task-filter-container">
      {/* Task Counter */}
      <span className="task-counter">
        {activeCount} {activeCount === 1 ? "task" : "tasks"} remaining
      </span>
      <div className="task-filter">
        {["ALL", "ACTIVE", "COMPLETED"].map((f) => (
          <button
            key={f}
            onClick={() => dispatch({ type: "SET_FILTER", payload: f })}
            className={filter === f ? "active" : ""}
          >
            {f}
          </button>
        ))}
      </div>
    </div>
  );
}
