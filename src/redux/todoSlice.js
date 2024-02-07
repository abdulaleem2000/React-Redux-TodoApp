import { createSlice, nanoid, createAsyncThunk } from "@reduxjs/toolkit";
import { db } from "../api/firebase";
import {
  addDoc,
  collection,
  getDocs,
  getDoc,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";

export const addTodoTaskToFirestore = createAsyncThunk(
  "todos/addTodoTaskToFirestore",
  async (todoText) => {
    try {
      // Add the todo to Firestore
      const addTodoRef = await addDoc(collection(db, "todoApp"), {
        text: todoText,
        completed: false,
      });

      // Return the newly added todo with its ID
      return { id: addTodoRef.id, text: todoText, completed: false };
    } catch (error) {
      console.error("Error adding todo to Firestore:", error);
      throw error; // Re-throw the error to be caught by the action dispatcher
    }
  }
);

export const removeTodoTaskFromFirestore = createAsyncThunk(
  "todos/removeTodoTaskFromFirestore",
  async (todoId) => {
    try {
      // Get a reference to the todo document in Firestore
      const todoRef = doc(db, "todoApp", todoId);

      // Delete the todo document from Firestore
      await deleteDoc(todoRef);

      // Return the ID of the removed todo
      return todoId;
    } catch (error) {
      console.error("Error removing todo from Firestore:", error);
      throw error; // Re-throw the error to be caught by the action dispatcher
    }
  }
);

export const fetchTodosFromFirestore = createAsyncThunk(
  "todos/fetchTodosFromFirestore",
  async () => {
    try {
      const todos = [];
      const querySnapshot = await getDocs(collection(db, "todoApp"));
      querySnapshot.forEach((doc) => {
        todos.push({ id: doc.id, ...doc.data() });
      });
      return todos;
    } catch (error) {
      console.error("Error fetching todos from Firestore:", error);
      throw error; // Re-throw the error to be caught by the action dispatcher
    }
  }
);

export const editTodoTaskInFirestore = createAsyncThunk(
  "todos/editTodoTaskInFirestore",
  async ({ id, newText }) => {
    try {
      const todoDocRef = doc(db, "todoApp", id);
      await updateDoc(todoDocRef, { text: newText });
      return { id, text: newText };
    } catch (error) {
      console.error("Error updating todo in Firestore:", error);
      throw error; // Re-throw the error to be caught by the action dispatcher
    }
  }
);

export const toggleTodoTaskInFirestore = createAsyncThunk(
  "todos/toggleTodoTaskInFirestore",
  async (todoId) => {
    try {
      const todoDocRef = doc(db, "todoApp", todoId);
      const todoDocSnapshot = await getDoc(todoDocRef);
      const currentCompletedStatus = todoDocSnapshot.data().completed;

      // Update the completed status of the todo document
      await updateDoc(todoDocRef, {
        completed: !currentCompletedStatus, // Toggle the completed status
      });

      return todoId;
    } catch (error) {
      console.error("Error toggling todo status in Firestore:", error);
      throw error; // Re-throw the error to be caught by the action dispatcher
    }
  }
);

export const todoSlice = createSlice({
  name: "todo",
  initialState: {
    todoList: [],
  },

  reducers: {
    addTodo: (state, action) => {
      const newTodo = {
        id: nanoid(),
        text: action.payload,
        completed: false,
      };
      state.todoList.push(newTodo);
    },
    removeTodo: (state, action) => {
      state.todoList = state.todoList.filter(
        (todo) => todo.id !== action.payload
      );
    },
    editTodo: (state, action) => {
      const { id, text } = action.payload;
      // const todo = state.todoList.find((todo) => todo.id === id);
      // if (todo) {
      //   todo.text = newText;
      // }
      console.log(id);
      console.log(text);
      const index = state.todoList.findIndex((todo) => todo.id === id);
      if (index !== -1) {
        // Create a copy of the todo item
        const updatedTodo = {
          ...state.todoList[index],
          text: text,
        };
        // Create a new array with the updated todo item
        const updatedTodoList = [...state.todoList];
        updatedTodoList[index] = updatedTodo;
        // Return the updated state
        state.todoList = updatedTodoList;
      }
    },
    toggleTodo: (state, action) => {
      const index = state.todoList.findIndex(
        (todo) => todo.id === action.payload
      );
      if (index !== -1) {
        // Create a copy of the todo item
        if (state.todoList[index].completed === false) {
          const updatedTodo = {
            ...state.todoList[index],

            completed: true,
          };
          // Create a new array with the updated todo item
          const updatedTodoList = [...state.todoList];
          updatedTodoList[index] = updatedTodo;
          // Return the updated state
          state.todoList = updatedTodoList;
        } else {
          const updatedTodo = {
            ...state.todoList[index],

            completed: false,
          };
          // Create a new array with the updated todo item
          const updatedTodoList = [...state.todoList];
          updatedTodoList[index] = updatedTodo;
          // Return the updated state
          state.todoList = updatedTodoList;
        }
      }
    },
  },

  extraReducers: (builder) => {
    builder.addCase(addTodoTaskToFirestore.fulfilled, (state, action) => {
      state.todoList.push(action.payload); // Add the new todo to the todoList array
    });

    builder.addCase(removeTodoTaskFromFirestore.fulfilled, (state, action) => {
      state.todoList = state.todoList.filter(
        (todo) => todo.id !== action.payload
      );
    });

    builder.addCase(fetchTodosFromFirestore.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.todoList = action.payload;
    });

    builder.addCase(editTodoTaskInFirestore.fulfilled, (state, action) => {
      state.status = "succeeded";
      const { id, text } = action.payload;
      const index = state.todoList.findIndex((todo) => todo.id === id);
      if (index !== -1) {
        state.todoList[index].text = text;
      }
    });

    builder.addCase(toggleTodoTaskInFirestore.fulfilled, (state, action) => {
      state.status = "succeeded";
      const toggledTodoId = action.payload;
      const toggledTodoIndex = state.todoList.findIndex(
        (todo) => todo.id === toggledTodoId
      );
      if (toggledTodoIndex !== -1) {
        state.todoList[toggledTodoIndex].completed =
          !state.todoList[toggledTodoIndex].completed;
      }
    });
  },
});

export const { addTodo, removeTodo, editTodo, toggleTodo } = todoSlice.actions;

export default todoSlice.reducer;
