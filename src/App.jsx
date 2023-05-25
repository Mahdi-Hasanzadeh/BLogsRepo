import { useState, useEffect, useCallback } from "react";

import "./App.css";
import { getBlogs } from "./redux.js";
import { Route, Routes } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import Loading from "./Components/Loading";

import {
  Navbar,
  Blogs,
  Index,
  SingleBlog,
  CreateBlog,
  LoginPage,
} from "./Components/Items.js";
import { Box, ThemeProvider, createTheme, useMediaQuery } from "@mui/material";
import { toast } from "react-toastify";
import { auth } from "./firebaseConfig";
import { onAuthStateChanged, signOut } from "firebase/auth";

function App() {
  const [userInfo, setUserInfo] = useState(null);

  const [showLoginPage, setShowLoginPage] = useState(true);

  const dispatch = useDispatch();
  // useEffect(() => {
  //   dispatch(getBlogs());
  // }, []);

  useEffect(() => {
    const listen = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserInfo(user);
        setShowLoginPage(false);
        console.log("userID:" + user.uid);

        setTimeout(() => {
          toast.info("Welcome, " + user.displayName, {
            position: "top-left",
            autoClose: 2000,
          });
          dispatch(getBlogs());
        }, 3500);

        // console.log(user.email);
      } else {
        setUserInfo(null);
        setShowLoginPage(false);
        toast.warning("Please login first", {
          position: "top-left",
          autoClose: 2000,
          limit: 1,
        });
      }
    });
  }, []);

  //const darkTheme = useMediaQuery(`(prefers-color-scheme: dark)`);

  const blogs = useSelector((state) => state.blogs);

  // console.log(blogs);

  const theme = createTheme({
    palette: {
      mode: "dark",
    },
  });

  // return <LoginPage />;

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
      <Routes>
        {/* <Route path="/login" element={LoginPage}> */}
        {/* <ProtectedRoute> */}
        <Route path="/" element={<Navbar userInfo={userInfo} />}>
          <Route index element={<Index />} />
          <Route
            path="BLogs"
            element={<Blogs blogs={blogs} userInfo={userInfo} />}
          />
          <Route path="Blogs/:BlogId" element={<SingleBlog />} />
          <Route
            path="Blogs/Create-blog"
            element={<CreateBlog userInfo={userInfo} />}
          />
          <Route path="*" element={<h3>Not Found</h3>} />
        </Route>
        {/* </ProtectedRoute> */}
        {/* </Route> */}
      </Routes>
    </ThemeProvider>
  );
}

export default App;
