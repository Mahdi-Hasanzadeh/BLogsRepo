import {
  AccountCircleRounded,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import {
  Box,
  Card,
  Typography,
  TextField,
  Button,
  InputAdornment,
  IconButton,
} from "@mui/material";

import { auth } from "../firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);

  const [userInfo, setUserInfo] = useState({
    email: "",
    password: "",
    focused: {
      email: false,
      password: false,
    },
  });

  const handleUserInfo = (event) => {
    const { name, value } = event.target;
    setUserInfo((prevData) => {
      return {
        ...prevData,
        [name]: value,
      };
    });
  };

  const handleBlur = (event) => {
    const { name, value } = event.target;
    setUserInfo((prevData) => {
      return {
        ...prevData,
        focused: {
          ...prevData.focused,
          [name]: true,
        },
      };
    });
  };

  const validation = (email, password) => {
    const errors = {
      email: "",
      password: "",
    };

    if (userInfo.focused.password && password.length < 6) {
      errors.password = "Password Should be at least 6 characters ";
    }

    // const reg = /^\d+$/;
    // if (formData.touched.telephone && !reg.test(telephone)) {
    //   errors.telephone = "Telephone number Should Contain only numbers ";
    // } else if (formData.touched.telephone && telephone.length < 10) {
    //   errors.telephone = "too short";
    // } else if (formData.touched.telephone && telephone.length > 12) {
    //   errors.telephone = "too long";
    // }

    let mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (userInfo.focused.email && !mailformat.test(email)) {
      errors.email = "Invalid Email ";
    }

    // const urlPattern =
    //   /(?:https?):\/\/(\w+:?\w*)?(\S+)(:\d+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
    // if (formData.touched.photo && !urlPattern.test(photo)) {
    //   errors.photo = "Invalid URL. URL starts with (http://) ";
    // }
    return errors;
  };

  let validate = validation(userInfo.email, userInfo.password);

  const handleShowPassword = () => {
    setShowPassword((prevData) => !prevData);
  };

  const signIn = () => {
    if (userInfo.email === "" && userInfo.password === "") {
      toast.error("Please Fill out the Form", {
        autoClose: 1500,
      });
      setUserInfo((prevData) => {
        return {
          ...prevData,
          focused: {
            email: true,
            password: true,
          },
        };
      });
    } else {
      if (!validate.email && !validate.password) {
        createUserWithEmailAndPassword(auth, userInfo.email, userInfo.password)
          .then((userCredential) => {
            console.log(userCredential);
            toast.success(userCredential.user.uid);
            toast.info(`Account Created Successfully`, {
              position: "top-right",
            });
            setUserInfo({
              email: "",
              password: "",
              focused: {
                email: false,
                password: false,
              },
            });
          })
          .catch((reason) => {
            toast.error(reason.message);
          });
      }
    }
  };

  return (
    <>
      <ToastContainer />
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Card
          sx={{
            width: "75%",
            height: "75%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          elevation={24}
        >
          <Box
            sx={{
              width: "75%",
              height: "75%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Typography variant="h5" fontStyle={"italic"}>
              Login
            </Typography>
            <TextField
              name="email"
              onChange={handleUserInfo}
              onBlur={handleBlur}
              value={userInfo.email}
              error={validate.email ? true : false}
              helperText={validate.email ? validate.email : null}
              variant="standard"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AccountCircleRounded />
                  </InputAdornment>
                ),
              }}
              fullWidth
              label="Email"
              type="email"
              autoComplete="off"
              placeholder="Email Address"
              sx={{
                backgroundColor: "white",
              }}
            />
            <TextField
              name="password"
              onChange={handleUserInfo}
              onBlur={handleBlur}
              value={userInfo.password}
              error={validate.password ? true : false}
              helperText={validate.password ? validate.password : null}
              variant="standard"
              InputProps={{
                startAdornment: (
                  <IconButton
                    onClick={handleShowPassword}
                    sx={{
                      p: 0,
                      m: 0,
                    }}
                  >
                    <InputAdornment position="start">
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </InputAdornment>
                  </IconButton>
                ),
              }}
              fullWidth
              autoComplete="off"
              label="Password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              sx={{
                backgroundColor: "white",
              }}
            />
            <Button onClick={signIn} fullWidth variant="contained">
              Login
            </Button>
          </Box>
        </Card>
      </Box>
    </>
  );
};

export default LoginPage;
