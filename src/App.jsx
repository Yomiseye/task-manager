import React from "react";
import { TaskProvider } from "./context/TaskContext";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import TaskFilter from "./components/TaskFilter";
import "./style.css"; // ✅ import styles

function App() {
  return (
    <TaskProvider>
      <div className="app">
        <h1>Task Manager</h1>
        <TaskForm />
        <TaskFilter /> {/* ✅ Add filter here */}
        <TaskList />
      </div>
    </TaskProvider>
  );
}

export default App;
