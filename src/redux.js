import {
  configureStore,
  createSlice,
  createAsyncThunk,
} from "@reduxjs/toolkit";

import { database } from "./firebaseConfig";

import {
  getFirestore,
  addDoc,
  collection,
  doc,
  getDocs,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import "firebase/firestore";
const url = "http://localhost:9000/";

export const getBlogs = createAsyncThunk(
  "blogs/getBlogs",
  async (arg, thunkAPI) => {
    try {
      const dbInstance = collection(database, "blogs");
      const dbInstactForLike = collection(database, "likes");
      const response = await getDocs(dbInstance);
      const respForLike = await getDocs(dbInstactForLike);

      if (response.docs.length === 0) {
        return {
          blogs: [],
          likes: [],
        };
      } else if (response.docs.length > 0 && respForLike.docs.length > 0) {
        const blogs = response.docs.map((item) => {
          // console.log("blog ID: ", item.id);
          return {
            id: item.id,
            ...item.data(),
          };
        });
        const likes = respForLike.docs.map((item) => {
          // console.log("like ID: ", item.id);
          return {
            id: item.id,
            ...item.data(),
          };
        });
        return {
          blogs,
          likes,
        };
      } else {
        throw "something gone wrong";
      }
    } catch (err) {
      // console.log(err, "error part");
      return thunkAPI.rejectWithValue(err);
    }
  }
);

export const addLikeToDatabase = async (id) => {
  try {
    const dbInstance = collection(database, "likes");
    const response = await addDoc(dbInstance, {
      blogId: id,
      checked: false,
    });

    if (response.id) {
      // console.log(response.id);
      return response.id;
    } else {
      throw "something gone wrong";
    }
  } catch (err) {
    console.log(err);
    return false;
  }
  // const resp = await fetch(`${url}likes`, {
  //   method: "POST",
  //   headers: {
  //     "Content-type": "application/json",
  //   },
  //   body: JSON.stringify({
  //     id,
  //     checked: false,
  //   }),
  // });
  // return resp.status;
  // console.log("creating likes")
};

export const addBlogToDatabase = async (newBlog) => {
  try {
    const dbInstance = collection(database, "blogs");

    const response = await addDoc(dbInstance, newBlog);
    // console.log(response.id);
    if (response.id) {
      return response.id;
    } else {
      return false;
    }
  } catch (err) {
    return false;
  }

  // const response = await fetch(`${url}blogs`, {
  //   method: "POST",
  //   headers: {
  //     "Content-type": "application/json",
  //   },
  //   body: JSON.stringify(newBlog),
  // });
  // return response.status;
};

export const chagneLikeOfABlog = async (arg) => {
  try {
    const docRef = doc(database, "likes", arg.id);
    console.log(docRef);
    updateDoc(docRef, {
      checked: arg.checked,
    });

    return true;
  } catch (err) {
    // console.log(err.message);
    return false;
  }
  // const response = await updateDoc(dbInstance, "likes", 1, {
  //   checked: true,
  // });

  // try {
  //   const response = await fetch(`${url}likes/${arg.id}`, {
  //     method: "PUT",

  //     headers: {
  //       "Content-type": "application/json",
  //     },
  //     body: JSON.stringify(arg),
  //   });

  //   return response.status;
  // } catch (err) {
  //   return err.message;
  // }
};

export const deleteBLogById = async (id) => {
  try {
    const docRef = doc(database, "blogs", id);
    const response = await deleteDoc(docRef);
    // console.log(response);
    return true;
  } catch (err) {
    console.log("not deleted");
    return false;
  }
};

export const deleteLikeById = async (id) => {
  try {
    const docRef = doc(database, "likes", id);
    const response = await deleteDoc(docRef);
    return true;
  } catch (err) {
    return false;
  }
};

const blogsSlice = createSlice({
  name: "blogs",
  initialState: {
    loading: true,
    blogs: [],
    likes: [],
    failed: false,
  },
  reducers: {
    addBlog: (state, action) => {
      console.log(action);
      state.blogs.push(action.payload);
    },
    changeLike: (state, action) => {
      console.log("changeLike: ", action.payload);
      console.log("state data: ", state.likes);
      const like = state.likes.find(
        (item) => item.blogId === action.payload.id
      );
      console.log(like, "change Like");
      like.checked = !like.checked;
    },
    addLike: (state, action) => {
      state.likes.push(action.payload);
    },
    deleteBlog: (state, action) => {
      state.blogs = state.blogs.filter((blog) => blog.id !== action.payload);
    },
    deleteLike: (state, action) => {
      state.likes = state.likes.filter((like) => like.id !== action.payload);
    },
  },

  extraReducers: {
    [getBlogs.pending]: (state) => {
      state.loading = true;
    },
    [getBlogs.fulfilled]: (state, action) => {
      state.loading = false;
      console.log("fullfilled", action.payload);
      state.blogs = action.payload.blogs;
      state.likes = action.payload.likes;
    },
    [getBlogs.rejected]: (state, action) => {
      (state.blogs = []), (state.likes = []), (state.loading = false);
      state.failed = true;
      console.log(action.payload);
    },
  },
});

export const { addBlog, changeLike, addLike, deleteBlog, deleteLike } =
  blogsSlice.actions;

export const store = configureStore({
  reducer: {
    blogs: blogsSlice.reducer,
  },
});

// (() => {
//   const dbInstance = collection(database, "blogs");
//   addDoc(dbInstance, {
//     date: "5/8/2023",
//     title: "First Post",
//     description: "Hello everyone, this is my first post",
//   });
// })();

// () => {
//   const dbInstance = collection(database, "likes");
//   addDoc(dbInstance,{

//   })
// };

//Actions
// const actions01 = {
//   type: "cunter/increment",
//   payload: 1,
// };

// //actions creator

// export const increment = (number) => {
//   return {
//     type: "counter/increment",
//     payload: number,
//   };
// };

// export const decrement = (number) => {
//   return { type: "counter/decrement", payload: number };
// };

// export const incrementByOne = () => {
//   return {
//     type: "counter/incrementByOne",
//     payload: 1,
//   };
// };

// //Reducer (state,action) => newState

// const initialState = {
//   value: 0,
//   name: "mahdi",
// };

// const counterReducer = (state = initialState, action) => {
//   if (action.type === "counter/increment") {
//     // const copyOfState = { ...state };

//     const newState = {
//       ...state,
//       value: state.value + action.payload,
//     };
//     return newState;
//   } else if (action.payload === "counter/decrement") {
//     const newState = {
//       ...state,
//       value: state.value - action.payload,
//     };
//   }

//   return state;
// };

// //Store : holde the state of the applicatins

// export const store = configureStore({
//   reducer: {
//     counter: counterReducer,
//   },
// });

//createSlice:

// export const getItems = createAsyncThunk(
//   "counter/getItems",
//   async (argument, thunkAPI) => {
//     try {
//       //   const response = await fetch("https://localhost:9000/names");
//       //   const data = response.json();
//       return 2;
//     } catch (err) {
//       return thunkAPI.rejectWithValue(err.message);
//     }
//   }
// );

// const counterSlice = createSlice({
//   name: "c",
//   initialState: {
//     value: 0,
//     name: "mahdi",
//   },
//   reducers: {
//     increment: (state, action) => {
//       state.value = state.value + action.payload;
//     },
//     decrement: (state, action) => {
//       state.value = state.value - action.payload;
//     },
//   },
//   extraReducers: {
//     [getItems.pending]: (state, action) => {
//       //   console.log(action);
//     },
//     [getItems.fulfilled]: (state, action) => {
//       state.value = 2;
//     },
//     [getItems.rejected]: (state, action) => {
//       console.log(action);
//     },
//   },
// });

// export const { increment, decrement } = counterSlice.actions;

// export const store = configureStore({
//   reducer: {
//     counter: counterSlice.reducer,
//   },
// });

// export const value = store.getState().counter.value;
