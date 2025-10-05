import React, { createContext, useReducer, useContext, useEffect } from "react";

const TaskContext = createContext();

const initialState = {
  tasks: [],
  filter: "ALL",
};

function taskReducer(state, action) {
  switch (action.type) {
    case "ADD_TASK":
      return {
        ...state,
        tasks: [
          ...state.tasks,
          {
            id: Date.now(),
            text: action.payload.text,
            completed: false,
            dueDate: action.payload.dueDate || null,
            reminder: action.payload.reminder || null,
            priority: action.payload.priority || "MEDIUM",
          },
        ],
      };

    case "TOGGLE_TASK":
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.payload
            ? { ...task, completed: !task.completed }
            : task
        ),
      };

    case "DELETE_TASK":
      return {
        ...state,
        tasks: state.tasks.filter((task) => task.id !== action.payload),
      };

    case "CLEAR_TASKS":
      return {
        ...state,
        tasks: [],
      };

    case "EDIT_TASK":
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.payload.id
            ? {
                ...task,
                text: action.payload.text ?? task.text,
                dueDate: action.payload.dueDate ?? task.dueDate,
                reminder: action.payload.reminder ?? task.reminder,
                priority: action.payload.priority ?? task.priority,
              }
            : task
        ),
      };

    case "SET_FILTER":
      return {
        ...state,
        filter: action.payload,
      };

    case "REORDER_TASKS": {
      const { fromIndex, toIndex } = action.payload;
      if (fromIndex === toIndex || fromIndex < 0 || toIndex < 0) return state;

      const next = [...state.tasks];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);

      return { ...state, tasks: next };
    }

    default:
      return state;
  }
}

export function TaskProvider({ children }) {
  const [state, dispatch] = useReducer(taskReducer, initialState, (initial) => {
    const localData = localStorage.getItem("tasks");
    return localData ? { ...initial, tasks: JSON.parse(localData) } : initial;
  });

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(state.tasks));
  }, [state.tasks]);

  return (
    <TaskContext.Provider
      value={{ tasks: state.tasks, filter: state.filter, dispatch }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export const useTasks = () => useContext(TaskContext);
