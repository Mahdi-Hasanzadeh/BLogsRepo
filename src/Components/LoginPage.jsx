import {
  AccountCircleRounded,
  CircleRounded,
  Create,
  LoginRounded,
  Person2Rounded,
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
import { LoadingButton } from "@mui/lab";
import { auth } from "../firebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const [signUp, setSignUp] = useState(false);

  const [userInfo, setUserInfo] = useState({
    displayName: "",
    email: "",
    password: "",
    focused: {
      displayName: false,
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

  const validation = (email, password, displayName) => {
    const errors = {
      displayName: "",
      email: "",
      password: "",
    };

    if (userInfo.focused.displayName && displayName.length < 4) {
      errors.displayName = signUp ? "Name should be at least 4 characters" : "";
    }

    if (userInfo.focused.password && password.length === 0) {
      errors.password = "Enter your password";
    } else if (userInfo.focused.password && password.length < 6) {
      errors.password = signUp
        ? "Password Should be at least 6 characters"
        : "";
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

  let validate = validation(
    userInfo.email,
    userInfo.password,
    userInfo.displayName
  );

  const handleShowPassword = () => {
    setShowPassword((prevData) => !prevData);
  };

  const signIn = () => {
    setLoading(true);
    if (userInfo.email === "" || userInfo.password === "") {
      toast.error("Please Fill out the Form", {
        autoClose: 1500,
      });
      setUserInfo((prevData) => {
        return {
          ...prevData,
          focused: {
            displayName: true,
            email: true,
            password: true,
          },
        };
      });
      setLoading(false);
    } else {
      if (!validate.email && !validate.password) {
        if (signUp) {
          if (userInfo.displayName === "") {
            toast.error("please Enter your name");
            setUserInfo((prevData) => {
              return {
                ...prevData,
                focused: {
                  displayName: true,
                  email: true,
                  password: true,
                },
              };
            });
            setLoading(false);
            return;
          }
          createUserWithEmailAndPassword(
            auth,
            userInfo.email,
            userInfo.password
          )
            .then((userCredential) => {
              updateProfile(auth.currentUser, {
                displayName: userInfo.displayName,
              });

              // toast.success(userCredential.user.uid);
              toast.info(`Account Created Successfully`, {
                position: "top-right",
                autoClose: 1500,
              });
              setUserInfo({
                displayName: "",
                email: "",
                password: "",
                focused: {
                  displayName: false,
                  email: false,
                  password: false,
                },
              });
              setLoading(false);
            })
            .catch((reason) => {
              toast.error(reason.message);
              setLoading(false);
            });
          return;
        }

        signInWithEmailAndPassword(auth, userInfo.email, userInfo.password)
          .then((userCredential) => {
            console.log("sign in user credential");
            // toast.success(userCredential.user.uid);
            toast.info(`Login successfully`, {
              position: "top-right",
              autoClose: 1500,
            });
            setUserInfo({
              email: "",
              password: "",
              focused: {
                email: false,
                password: false,
              },
            });
            setLoading(false);
          })
          .catch((err) => {
            // const f = "firebase user-not-found";
            if (err.message.includes("user-not-found")) {
              toast.error("User not found");
              setLoading(false);
              return;
            }
            toast.error(err.message);
            setLoading(false);
          });
      }
    }
  };

  return (
    <>
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
            width: { xs: "99%", sm: "75%" },
            height: "75%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexWrap: "wrap",
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
              {signUp ? "Create your account" : "Welcome back"}
            </Typography>
            <Typography variant="body2">Please enter your details.</Typography>
            {signUp ? (
              <TextField
                name="displayName"
                onChange={handleUserInfo}
                onBlur={handleBlur}
                value={userInfo.displayName}
                error={validate.displayName ? true : false}
                helperText={validate.displayName ? validate.displayName : null}
                variant="standard"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person2Rounded />
                    </InputAdornment>
                  ),
                }}
                fullWidth
                label="FullName"
                type="text"
                autoComplete="off"
                placeholder="Enter your name"
                sx={{
                  backgroundColor: "white",
                }}
              />
            ) : null}

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
            <LoadingButton
              loadingPosition="end"
              loading={loading}
              endIcon={signUp ? <Create /> : <LoginRounded />}
              onClick={signIn}
              fullWidth
              variant="contained"
            >
              {signUp ? "Login" : "SIGN IN"}
            </LoadingButton>

            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <Typography variant="body1">
                {signUp
                  ? "Already have an account, "
                  : "Don't have an account,"}
              </Typography>
              <Button
                onClick={() => {
                  setSignUp((prevData) => !prevData);
                  setUserInfo((prevData) => {
                    return {
                      ...prevData,
                      focused: {
                        email: false,
                        password: false,
                      },
                    };
                  });
                }}
                type="button"
              >
                {signUp ? "Sign in" : "sign up"}
              </Button>
            </Box>
          </Box>
        </Card>
      </Box>
    </>
  );
};

export default LoginPage;
