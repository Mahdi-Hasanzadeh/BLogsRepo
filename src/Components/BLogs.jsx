import { Create, DeleteForeverRounded } from "@mui/icons-material";
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
} from "@mui/material";

import LoadingButton from "@mui/lab/LoadingButton";

import Grid from "@mui/material/Unstable_Grid2";
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
const Blogs = ({ blogs }) => {
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
    console.log(like.id);
  };

  const handleDialog = () => {
    setDialogOpen((prevData) => !prevData);
    setConfirmDelete(true);
  };

  return (
    <>
      {blogs.loading ? (
        <h3>Loading</h3>
      ) : blogs.failed ? (
        <h3>Please Check Your Internet Connection</h3>
      ) : (
        <Box mt={2}>
          <Grid container justifyContent={"center"}>
            <Grid xs={6}>
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
          <Grid
            container
            spacing={1}
            justifyContent={"space-around"}
            py={1}
            mx={2}
          >
            {blogs.blogs.length === 0 ? (
              <h3>There is no blog</h3>
            ) : (
              blogs.blogs.map((blog, index) => {
                return (
                  <Grid key={index} xs={12} sm={12} md={6} lg={5} xl={5}>
                    <Card className="card-blog" elevation={10} key={index}>
                      <CardActionArea>
                        <CardHeader
                          title={blog.title}
                          subheader={blog.date}
                          color="text.secondary"
                        />
                        <CardContent>{blog.description}</CardContent>
                      </CardActionArea>
                      <CardActions>
                        <Link to={`/Blogs/${blog.id}`}>
                          <Button variant="outlined">View Post</Button>
                        </Link>
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
              <DialogContentText>
                <Typography
                  variant="body1"
                  fontFamily={"san-serif"}
                  fontSize={19}
                  mb={2}
                >
                  Confirm you want to delete this post by typing post:
                </Typography>
                <TextField
                  placeholder="post"
                  size="small"
                  fullWidth
                  onChange={handleChangeDeleteWord}
                />
              </DialogContentText>
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
