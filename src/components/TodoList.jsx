import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  removeTodoTaskFromFirestore,
  fetchTodosFromFirestore,
  editTodoTaskInFirestore,
  toggleTodoTaskInFirestore,
} from "../redux/todoSlice";
import "../styling/todoList_component.scss";

const TodoList = () => {
  const [edit, setEdit] = useState(false);
  const [text, setText] = useState("");
  const [todoId, setTodoId] = useState();
  const todos = useSelector((state) => state.todoList);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchTodosFromFirestore());
  }, [dispatch]);

  //handling edit button and setting id of task user want to edit
  const handleEdit = (todoId) => {
    setEdit(true);
    setTodoId(todoId);
  };

  const handleChange = (e) => {
    setText(e.target.value);
  };

  //handling update button to store updated data in firestore
  const handleSubmit = (e, todoId) => {
    e.preventDefault();
    if (!text.trim()) return; // Do not submit empty todo

    //using reducer to add value to store
    // console.log(text);
    // dispatch(editTodo({ id: todoId, text }));

    try {
      dispatch(editTodoTaskInFirestore({ id: todoId, newText: text }));
      setEdit(false);
      setText("");
    } catch (error) {
      console.error("Error editing todo:", error);
      // Handle error (e.g., display error message)
    }
    setEdit(false);
    setText("");
  };

  const handleToggleTodo = (todoId) => {
    try {
      dispatch(toggleTodoTaskInFirestore(todoId));
    } catch (error) {
      console.error("Error toggling todo:", error);
    }
  };
  return (
    <div className="todo-list">
      {todos.map((todo) => (
        <li key={todo.id} className="todo-item">
          {edit && todo.id === todoId ? (
            <>
              {" "}
              <form onSubmit={(e) => handleSubmit(e, todo.id)}>
                <input
                  type="text"
                  placeholder="Add a new todo"
                  value={text}
                  onChange={handleChange}
                />
                <div className="todo-actions">
                  <button className="complete-button" type="submit">
                    Update
                  </button>
                </div>
              </form>
            </>
          ) : (
            <>
              <p className="todo-text">
                {todo.completed ? (
                  <>
                    <h2 className="completed">{todo.text}</h2>
                  </>
                ) : (
                  <>
                    <h2>{todo.text}</h2>
                  </>
                )}
              </p>
              <div className="todo-actions">
                {todo.completed ? (
                  <>
                    <button
                      className="complete-button"
                      onClick={() => handleToggleTodo(todo.id)}
                    >
                      UnFinish
                    </button>
                  </>
                ) : (
                  <>
                    {" "}
                    <button
                      className="complete-button"
                      onClick={() => handleToggleTodo(todo.id)}
                    >
                      Finish
                    </button>
                  </>
                )}

                <button
                  className="delete-button"
                  onClick={() => dispatch(removeTodoTaskFromFirestore(todo.id))}
                >
                  Remove
                </button>
                <button
                  className="delete-button"
                  onClick={() => handleEdit(todo.id)}
                >
                  Edit
                </button>
              </div>
            </>
          )}
        </li>
      ))}
    </div>
  );
};

export default TodoList;
