import {
  configureStore,
  createSlice,
  createAsyncThunk,
} from "@reduxjs/toolkit";

const url = "http://localhost:9000/";

export const getBlogs = createAsyncThunk(
  "blogs/getBlogs",
  async (arg, thunkAPI) => {
    try {
      const response = await fetch(`${url}blogs`);
      const responseForLikes = await fetch(`${url}likes`);
      if (response.status === 200 && responseForLikes.status === 200) {
        const blogs = await response.json();
        const likes = await responseForLikes.json();
        // console.log(blogs);
        return {
          blogs,
          likes,
        };
      } else {
        throw "something Wrong happened";
      }
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);
export const addLikeToDatabase = async (id) => {
  try {
    const resp = await fetch(`${url}likes`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        id,
        checked: false,
      }),
    });
    return resp.status;
  } catch (err) {
    return err.message;
  }

  // console.log("creating likes")
};

export const addBlogToDatabase = async (newBlog) => {
  try {
    const response = await fetch(`${url}blogs`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(newBlog),
    });
    return response.status;
  } catch (err) {
    return err.message;
  }
};

export const chagneLikeOfABlog = async (arg) => {
  try {
    const response = await fetch(`${url}likes/${arg.id}`, {
      method: "PUT",

      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(arg),
    });

    return response.status;
  } catch (err) {
    return err.message;
  }
};

const blogsSlice = createSlice({
  name: "blogs",
  initialState: {
    loading: true,
    blogs: [],
    likes: [],
  },
  reducers: {
    addBlog: (state, action) => {
      // console.log(action);
      state.blogs.push(action.payload);
    },
    changeLike: (state, action) => {
      const like = state.likes.find((item) => item.id === action.payload.id);
      like.checked = !like.checked;
    },
    addLike: (state, action) => {
      state.likes.push(action.payload);
    },
  },

  extraReducers: {
    [getBlogs.pending]: (state) => {
      state.loading = true;
    },
    [getBlogs.fulfilled]: (state, action) => {
      state.loading = false;

      state.blogs = action.payload.blogs;
      state.likes = action.payload.likes;
    },
    [getBlogs.rejected]: (state, action) => {
      state.loading = false;
      console.log(action.payload);
    },
  },
});

// const blogLikeSlice = createSlice({
//   name:'blogLike',
//   initialState:{

//   }
// })

export const { addBlog, changeLike, addLike } = blogsSlice.actions;

export const store = configureStore({
  reducer: {
    blogs: blogsSlice.reducer,
  },
});

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
