// TodoForm.js
import React, { useState } from "react";
import "../styling/todoForm_component.scss"; // Import the SCSS file for styling
import { useDispatch } from "react-redux";
import { addTodoTaskToFirestore } from "../redux/todoSlice";
import TodoList from "./TodoList";

const TodoForm = () => {
  const [text, setText] = useState("");
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setText(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return; // Do not submit empty todo

    //using reducer to add value to store
    //dispatch(addTodo(text));
    dispatch(addTodoTaskToFirestore(text));
    setText("");
  };

  return (
    <>
      <h1>Tasks</h1>
      <div className="todo-list-container">
        <TodoList />
      </div>

      <form className="todo-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Add a new todo"
          value={text}
          onChange={handleChange}
        />
        <button type="submit">Add</button>
      </form>
    </>
  );
};

export default TodoForm;
