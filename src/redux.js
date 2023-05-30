import {
  configureStore,
  createSlice,
  createAsyncThunk,
} from "@reduxjs/toolkit";

import { database } from "./firebaseConfig";

import cors from "cors";

import {
  addDoc,
  collection,
  doc,
  getDocs,
  updateDoc,
  deleteDoc,
  getDoc,
  QuerySnapshot,
} from "firebase/firestore";
// import "firebase/firestore";
// const url = "http://localhost:9000/";

//cors declartation

// const myCors = cors({ origin: true });

// Get Blogs from Database
export const getBlogs = createAsyncThunk(
  "blogs/getBlogs",
  async (arg, thunkAPI) => {
    try {
      const dbInstance = collection(database, "blogs");
      const dbInstactForLike = collection(database, "likes");
      const dbInstanceForUsers = collection(database, "users");
      const response = await getDocs(dbInstance);
      const respForLike = await getDocs(dbInstactForLike);
      const respForUsers = await getDocs(dbInstanceForUsers);
      // console.log(response.docs.length, "Length");
      if (response.docs.length === 0) {
        return {
          blogs: [],
          likes: [],
          users: [],
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
        const users = respForUsers.docs.map((item) => {
          return {
            id: item.id,
            ...item.data(),
          };
        });
        return {
          blogs,
          likes,
          users,
        };
      } else {
        throw "something gone wrong";
      }
    } catch (err) {
      console.log(err, "error part");
      return thunkAPI.rejectWithValue(err);
    }
  }
);

// Add Like to Database
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

// Add Blog to Database
export const addBlogToDatabase = async (newBlog) => {
  try {
    const dbInstance = collection(database, "blogs");
    // console.log(dbInstance);
    const response = await addDoc(dbInstance, newBlog);
    console.log(response.id);
    if (response.id) {
      return response.id;
    } else {
      throw "false";
    }
  } catch (err) {
    // console.log(err.message);
    return false;
  }
};

export const addLikeForASpecificUser = async (arg) => {
  try {
    // console.log("uid: ", arg.uid);
    // const dbInstance = collection(database, "users");
    const docRef = collection(database, "users");
    // const resp = getDoc();
    const resp = await addDoc(docRef, {
      uid: arg.uid,
      likeId: arg.likeId,
      blogId: arg.blogId,
      checked: false,
    });
    // console.log(resp.id, "return");
    return resp.id;
  } catch (err) {
    console.log(err.message);
    return false;
  }
};

// Update Like at Database
export const chagneLikeOfABlog = async (arg) => {
  try {
    // console.log(arg, "arg");
    const docRef = doc(database, "users", arg.id);
    // console.log(docRef);
    const resp = await updateDoc(docRef, {
      checked: arg.checked,
    });

    // console.log(resp, "mmmm");
    return true;
  } catch (err) {
    console.log(err.message);
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

// Add Comment of a Specific Blog to Database

export const addCommentOfBlogToDatabase = async (
  blogId,
  fullName,
  comment,
  date
) => {
  try {
    const docRef = collection(database, "comments");

    const response = await addDoc(docRef, {
      blogId,
      fullName,
      comment,
      date,
    });
    if (response.id) {
      return response.id;
    } else {
      throw "error";
    }
  } catch (err) {
    console.log("error");
    return false;
  }
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
    users: [],
    failed: false,
  },
  reducers: {
    // addBlog: (state, action) => {
    //   console.log(action);
    //   state.blogs.push(action.payload);
    // },

    addBlog: {
      reducer(state, action) {
        state.blogs.push(action.payload);
      },
      prepare(id, title, description, displayName, uid) {
        // The prepare call back return a new payload
        // we can write our logic for making a new payload here...
        return {
          payload: {
            id,
            title,
            description,
            date: new Date().toISOString(),
            displayName,
            uid,
          },
        };
      },
    },

    // addLike: (state, action) => {
    //   state.likes.push(action.payload);
    // },

    addLike: {
      reducer: (state, action) => {
        state.likes.push(action.payload);
      },
      prepare: (blogId, id) => {
        return {
          payload: {
            blogId,
            id,
            checked: false,
          },
        };
      },
    },

    changeLike: (state, action) => {
      // console.log("changeLike: ", action.payload);
      // console.log("state data: ", state.likes);
      const like = state.likes.find(
        (item) => item.blogId === action.payload.id
      );
      // console.log(like, "change Like");
      like.checked = !like.checked;
    },
    deleteBlog: (state, action) => {
      state.blogs = state.blogs.filter((blog) => blog.id !== action.payload);
    },
    deleteLike: (state, action) => {
      state.likes = state.likes.filter((like) => like.id !== action.payload);
    },

    addLikeOfUser: (state, action) => {
      state.users.push(action.payload);
    },

    changeLikeOfUser: (state, action) => {
      const user = state.users.find(
        (user) =>
          user.uid === action.payload.uid &&
          user.blogId === action.payload.blogId
      );
      // console.log("checked: ", user.checked);
      user.checked = !user.checked;
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
      state.users = action.payload.users;
    },
    [getBlogs.rejected]: (state, action) => {
      state.loading = false;
      state.blogs = [];
      state.likes = [];
      state.users = [];
      state.failed = true;
      console.log("rejected");
    },
  },
});

export const getComments = createAsyncThunk(
  "blogs/comments",
  async (arg, thunkAPI) => {
    try {
      const docRef = collection(database, "comments");

      const response = await getDocs(docRef);
      const data = response.docs.map((item) => {
        return {
          id: item.id,
          ...item.data(),
        };
      });
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err);
    }
  }
);

const commentSlice = createSlice({
  name: "comments",
  initialState: {
    loading: false,
    failed: false,
    comments: [],
  },
  reducers: {
    addComment: (state, action) => {
      state.comments.push(action.payload);
    },
  },
  extraReducers: {
    [getComments.pending]: (state, action) => {
      state.loading = true;
    },
    [getComments.fulfilled]: (state, action) => {
      state.loading = false;
      state.comments = action.payload;
      // console.log("comments", action.payload);
    },
    [getComments.rejected]: (state, action) => {
      state.failed = true;
      state.loading = false;
      console.log(action.payload, "rejected");
    },
  },
});

export const {
  addBlog,
  changeLike,
  addLike,
  deleteBlog,
  deleteLike,
  changeLikeOfUser,
  addLikeOfUser,
} = blogsSlice.actions;

export const { addComment } = commentSlice.actions;

export const store = configureStore({
  reducer: {
    blogs: blogsSlice.reducer,
    comments: commentSlice.reducer,
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
