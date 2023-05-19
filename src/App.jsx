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
  LoginPage,
} from "./Components/Items.js";
import { Box, ThemeProvider, createTheme, useMediaQuery } from "@mui/material";
import { ToastContainer } from "react-toastify";
import { auth } from "./firebaseConfig";
import { onAuthStateChanged, signOut } from "firebase/auth";
import Loading from "./Components/Loading";

function App() {
  const [userInfo, setUserInfo] = useState(null);

  const [showLoginPage, setShowLoginPage] = useState(true);

  useEffect(() => {
    const listen = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserInfo(user);
        setShowLoginPage(false);
        console.log(user.email);
      } else {
        setUserInfo(null);
        setShowLoginPage(false);
      }
    });
  }, []);

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

  if (!userInfo) {
    if (showLoginPage) {
      return (
        <Box
          sx={{
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Loading />
        </Box>
      );
    }
    return <LoginPage />;
  }

  return (
    <ThemeProvider theme={theme}>
      <ToastContainer />
      <Routes>
        {/* <Route path="/login" element={LoginPage}> */}
        {/* <ProtectedRoute> */}
        <Route path="/" element={<Navbar userInfo={userInfo} />}>
          <Route index element={<Index />} />
          <Route path="BLogs" element={<Blogs blogs={blogs} />} />
          <Route path="Blogs/:BlogId" element={<SingleBlog />} />
          <Route path="Blogs/Create-blog" element={<CreateBlog />} />
          <Route path="*" element={<h3>Not Found</h3>} />
        </Route>
        {/* </ProtectedRoute> */}
        {/* </Route> */}
      </Routes>
    </ThemeProvider>
  );
}

export default App;
