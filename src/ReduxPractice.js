import {
  configureStore,
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";

export const getCounter = createAsyncThunk(
  "counter/getItems",
  async (arg, thunkAPI) => {
    try {
      throw "something gone wrong";
    } catch (err) {
      return thunkAPI.rejectWithValue(err);
    }
  }
);

const counterSlice = createSlice({
  name: "counter/increment",
  initialState: {
    value: 0,
    loading: false,
    failed: false,
    failResponse: "",
  },
  reducers: {
    increment: (state, action) => {
      state.value = state.value + action.payload;
    },
    decrement: (state, action) => {
      state.value = state.value - action.payload;
    },
  },
  extraReducers: {
    [getCounter.pending]: (state, action) => {
      state.loading = true;
    },
    [getCounter.fulfilled]: (state, action) => {
      state.value = action.payload;
      state.loading = false;
    },
    [getCounter.rejected]: (state, action) => {
      state.loading = false;
      state.failed = true;
      console.log(action.payload);
      state.failResponse = action.payload;
    },
  },
});

export const { increment, decrement } = counterSlice.actions;

export const store = configureStore({
  reducer: counterSlice.reducer,
});
