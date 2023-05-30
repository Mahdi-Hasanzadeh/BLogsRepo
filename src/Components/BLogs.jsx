import {
  Create,
  DeleteForeverRounded,
  MoreVertRounded,
} from "@mui/icons-material";
import {
  TextField,
  Typography,
  Box,
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardHeader,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  DialogContentText,
  IconButton,
  Avatar,
  CardMedia,
} from "@mui/material";

import LoadingButton from "@mui/lab/LoadingButton";

// import Grid from "@mui/material/Unstable_Grid2";
import Grid from "@mui/material/Grid";
import { Link, useNavigate } from "react-router-dom";
import {
  deleteBLogById,
  deleteLikeById,
  deleteBlog,
  deleteLike,
} from "../redux";
import { toast } from "react-toastify";
import { useState } from "react";
import { useDispatch } from "react-redux";

import Loading from "./Loading";
import FailedComponent from "./FailedComp";

import watersplash from "../assets/water-splash.jpg";

import { formatDistanceToNow, parseISO } from "date-fns";

const Blogs = ({ blogs, userInfo }) => {
  const sortedBlogs = blogs.blogs
    .slice()
    .sort((a, b) => a.date.localeCompare(b.date));

  // console.log("userINfo" + userInfo.uid);
  // console.log("uid In Blog: " + blogs);

  // console.log("blogs section: " + blogs.blogs);

  const [disabled, setDisabled] = useState(false);

  const [dialogOpen, setDialogOpen] = useState(false);

  const [confirmDelete, setConfirmDelete] = useState(true);

  const [id, setId] = useState(null);

  //   console.log(blogs.blogs[0].title || "not found");

  // console.log(blogs);

  const handleChangeDeleteWord = (event) => {
    if (event.target.value === "post") {
      setConfirmDelete(false);
    } else {
      setConfirmDelete(true);
    }
  };

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // console.log(blogs.likes);

  const handleDelete = async (blogId) => {
    console.log("delete", blogId);
    setDisabled(true);

    const response = await deleteBLogById(blogId);
    // console.log("blogs, ", response);
    if (response) {
      const like = blogs.likes.find((like) => like.blogId === blogId);
      const resp = await deleteLikeById(like.id);
      if (resp) {
        // window.location.reload();
        dispatch(deleteBlog(blogId));
        dispatch(deleteLike(like.id));
        toast.success("Deleted Successfully");
        setDisabled(false);
        setConfirmDelete(true);
        navigate("/BLogs");
      } else {
        toast.error("Somthing gone wrong,(not deleted)");
        setDisabled(false);
        setConfirmDelete(true);
      }
    } else {
      toast.error("Somthing gone wrong,(not deleted)");
      setDisabled(false);
      setConfirmDelete(true);
    }
    // console.log(like.id);
  };

  const handleDialog = () => {
    setDialogOpen((prevData) => !prevData);
    setConfirmDelete(true);
  };

  return (
    <>
      {blogs.loading ? (
        <Box
          sx={{
            textAlign: "center",
          }}
        >
          <Loading />
        </Box>
      ) : blogs.failed ? (
        <FailedComponent />
      ) : (
        <Box mt={2}>
          <Grid container justifyContent={"center"}>
            <Grid item xs={6}>
              <Link
                style={{
                  color: "white",
                }}
                to="/Blogs/Create-blog"
              >
                <Button
                  endIcon={<Create />}
                  fullWidth
                  size="large"
                  variant="contained"
                >
                  Create A Post
                </Button>
              </Link>
            </Grid>
          </Grid>
          <Grid container spacing={1} justifyContent={"space-around"} py={1}>
            {blogs.blogs.length === 0 ? (
              <h3>There is no blog to show</h3>
            ) : (
              sortedBlogs.map((blog, index) => {
                return (
                  <Grid
                    mx={2}
                    item
                    key={index}
                    xs={12}
                    sm={12}
                    md={6}
                    lg={5}
                    xl={5}
                  >
                    <Card className="card-blog" elevation={10} key={index}>
                      <CardActionArea>
                        <CardHeader
                          avatar={<Avatar src="" alt={blog.displayName} />}
                          action={
                            // to-do button console error
                            <IconButton aria-label="settings">
                              <MoreVertRounded />
                            </IconButton>
                          }
                          title={blog.displayName}
                          subheader={
                            formatDistanceToNow(new Date(blog.date)) + " ago"
                          } // to-do =>   date-fns
                          color="text.secondary"
                        />
                        <CardMedia
                          component="img"
                          sx={{
                            objectFit: "cover",
                          }}
                          height="190"
                          srcSet={watersplash}
                        />

                        <CardContent>
                          <Typography variant="h6">{blog.title}</Typography>
                          {/* {blog.description} */}
                        </CardContent>
                      </CardActionArea>
                      <CardActions>
                        <Link to={`/Blogs/${blog.id}`}>
                          <Button variant="outlined">View Post</Button>
                        </Link>
                        {blog.uid === userInfo.uid ? (
                          <LoadingButton
                            variant="contained"
                            color="error"
                            loading={disabled}
                            loadingPosition="end"
                            onClick={() => {
                              setDialogOpen(true);
                              setId(blog.id);
                              // handleDelete(blog.id);
                            }}
                            endIcon={<DeleteForeverRounded />}
                            sx={{
                              marginLeft: "auto",
                            }}
                          >
                            {disabled ? "Deleting Post" : "Delete"}
                          </LoadingButton>
                        ) : null}
                      </CardActions>
                    </Card>
                  </Grid>
                );
              })
            )}
          </Grid>
          <Dialog fullWidth open={dialogOpen} onClose={handleDialog}>
            <DialogTitle>Delete Post Confirmation</DialogTitle>
            <DialogContent>
              <DialogContentText
                variant="body1"
                fontFamily={"san-serif"}
                fontSize={19}
                mb={3}
              >
                {/* <Typography
                  // component={"span"}
                  display={"block"}
                  variant="body1"
                  fontFamily={"san-serif"}
                  fontSize={19}
                  mb={3}
                >
                  Confirm you want to delete this post by typing post:
                </Typography> */}
                Confirm you want to delete this post by typing{" "}
                <span
                  style={{
                    fontWeight: 700,
                    color: "orange",
                    textDecoration: "underline",
                    textDecorationThickness: "3px",
                  }}
                >
                  {" "}
                  post
                </span>{" "}
                :
              </DialogContentText>
              <TextField
                placeholder="post"
                size="small"
                fullWidth
                onChange={handleChangeDeleteWord}
                variant="standard"
                label="Delete Confirmation"
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleDialog} variant="contained">
                Cancel
              </Button>

              <Button
                disabled={confirmDelete}
                onClick={() => {
                  handleDelete(id);
                  handleDialog();
                }}
                variant="contained"
                color="error"
              >
                Delete
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      )}
    </>
  );
};
export default Blogs;
