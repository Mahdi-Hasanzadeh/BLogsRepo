import { useState, useEffect, useCallback } from "react";

import "./App.css";
import { getBlogs } from "./redux.js";
import { Route, Routes } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  Navbar,
  Blogs,
  Index,
  SingleBlog,
  CreateBlog,
} from "./Components/Items.js";
import { ThemeProvider, createTheme, useMediaQuery } from "@mui/material";
import { ToastContainer } from "react-toastify";

function App() {
  //const darkTheme = useMediaQuery(`(prefers-color-scheme: dark)`);
  const blogs = useSelector((state) => state.blogs);
  // console.log(blogs);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getBlogs());
  }, []);

  const theme = createTheme({
    palette: {
      mode: "dark",
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <Routes>
        <Route path="/" element={<Navbar />}>
          <Route index element={<Index />} />
          <Route path="BLogs" element={<Blogs blogs={blogs} />} />
          <Route path="Blogs/:BlogId" element={<SingleBlog />} />
          <Route path="Blogs/Create-blog" element={<CreateBlog />} />
          <Route path="*" element={<h3>Not Found</h3>} />
        </Route>
      </Routes>
      <ToastContainer />
    </ThemeProvider>
  );
}

export default App;
