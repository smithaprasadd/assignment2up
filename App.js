import React, { useState, useEffect } from "react";

function App() {
 
  const [todoList, setTodoList] = useState([]);


  const [newTask, setNewTask] = useState("");


  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");


  const [filter, setFilter] = useState("all");

 
  useEffect(() => {
    const saved = localStorage.getItem("tasks");
    if (saved) {
      setTodoList(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(todoList));
  }, [todoList]);


  const handleChange = (e) => {
    setNewTask(e.target.value);
  };

  const addTask = () => {
    if (newTask.trim() === "") return;

    const task = {
      id: Date.now(),
      taskName: newTask,
      completed: false,
    };

    setTodoList([...todoList, task]);
    setNewTask("");
  };

  const deleteTask = (id) => {
    setTodoList(todoList.filter((task) => task.id !== id));
  };

  const completeTask = (id) => {
    setTodoList(
      todoList.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const startEdit = (id, text) => {
    setEditingId(id);
    setEditText(text);
  };

  const saveEdit = (id) => {
    if (editText.trim() === "") return;
    setTodoList(
      todoList.map((task) =>
        task.id === id ? { ...task, taskName: editText } : task
      )
    );
    setEditingId(null);
    setEditText("");
  };


  const filteredTasks = todoList.filter((task) => {
    if (filter === "active") return !task.completed;
    if (filter === "completed") return task.completed;
    return true;
  });

  return (
    <div className="App" style={{ padding: 20, maxWidth: 700, margin: "0 auto" }}>
      <h1>To-Do List</h1>

      {/* Input */}
      <div style={{ display: "flex", gap: 8 }}>
        <input
          value={newTask}
          onChange={handleChange}
          placeholder="Enter task"
          style={{ flex: 1, padding: 8 }}
        />
        <button onClick={addTask}>Add</button>
      </div>

      {/* Filter buttons */}
      <div style={{ marginTop: 10 }}>
        <button onClick={() => setFilter("all")}>All</button>
        <button onClick={() => setFilter("active")}>Active</button>
        <button onClick={() => setFilter("completed")}>Completed</button>
      </div>

      {/* NO TASKS UI */}
      {filteredTasks.length === 0 && <h3 style={{ marginTop: 20 }}>No Tasks Yet</h3>}

      {/* Task list */}
      <div className="list" style={{ marginTop: 10 }}>
        {filteredTasks.map((task) => (
          <div key={task.id} style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 8 }}>
            {/* Checkbox */}
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => completeTask(task.id)}
            />

            {/* If editing */}
            {editingId === task.id ? (
              <>
                <input
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  style={{ flex: 1, padding: 6 }}
                />
                <button onClick={() => saveEdit(task.id)}>Save</button>
                <button onClick={() => setEditingId(null)}>Cancel</button>
              </>
            ) : (
              <>
                <span
                  style={{
                    textDecoration: task.completed ? "line-through" : "none",
                    marginLeft: 10,
                    flex: 1,
                  }}
                >
                  {task.taskName}
                </span>

                <button onClick={() => startEdit(task.id, task.taskName)}>
                  Edit
                </button>
                <button onClick={() => deleteTask(task.id)}>Delete</button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
