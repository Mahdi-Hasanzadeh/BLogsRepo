import { Link, useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Grid from "@mui/material/Unstable_Grid2";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardHeader,
  Checkbox,
  Fade,
  Grow,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Slide,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import {
  ArrowDownwardRounded,
  Comment,
  Favorite,
  FavoriteBorder,
  SendSharp,
} from "@mui/icons-material";

import {
  changeLike,
  chagneLikeOfABlog,
  addCommentOfBlogToDatabase,
  addComment,
  getComments,
} from "../redux";

import LoadingButton from "@mui/lab/LoadingButton";

import { toast } from "react-toastify";
import { useEffect, useState } from "react";

const SingleProduct = () => {
  const [disabled, setDisabled] = useState(false);
  const [showComment, setShowComment] = useState(false);

  const [loadingButton, setLoadingButton] = useState(false);

  const navigate = useNavigate();
  const params = useParams();
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));
  const dispatch = useDispatch();

  const stateOfBlogs = useSelector((state) => state.blogs);

  // console.log(stateOfBlogs.likes);

  const singleBlog = stateOfBlogs.blogs.find(
    (blog) => blog.id === params.BlogId
  );

  // console.log(singleBlog);

  const like = stateOfBlogs.likes.find((blog) => blog.blogId === params.BlogId);

  const [formData, setFormData] = useState({
    fullname: "",
    comment: "",
  });

  const handleChange = (event) => {
    const { value, type, name } = event.target;
    setFormData((prevData) => {
      return {
        ...prevData,
        [name]: value,
      };
    });
  };

  const handleSubmit = async () => {
    if (formData.fullname !== "" && formData.comment !== "") {
      setLoadingButton(true);
      // console.log("blog id: ", singleBlog.id);
      // console.log("like id:", like.id);
      const commentId = await addCommentOfBlogToDatabase(
        singleBlog.id,
        formData.fullname,
        formData.comment,
        new Date().toLocaleString()
      );
      if (commentId !== false) {
        console.log("Comment Id: ", commentId);
        dispatch(
          addComment({
            id: commentId,
            blogId: singleBlog.id,
            fullName: formData.fullname,
            comment: formData.comment,
            date: new Date().toLocaleString(),
          })
        );
        toast.success("Comment submitted successfully");
        setShowComment((prevData) => !prevData);
        setLoadingButton(false);
        navigate(`/Blogs/${singleBlog.id}`);
      } else {
        toast.error("Sorry,something gone wrong");
      }
      return;
    }
    toast.error("Fill out the form");
  };

  // console.log(like, "single");

  const hanldeChecked = async () => {
    setDisabled(true);
    // console.log("handleChecked");
    // console.log("id: ", like.id);
    const resp = await chagneLikeOfABlog({
      id: like.id,
      checked: !like.checked,
    });

    if (resp) {
      setDisabled(false);
      dispatch(
        changeLike({
          id: like.blogId,
        })
      );
    } else {
      setDisabled(false);
      toast.error("Please Check Your Internet Connection");
    }
  };

  useEffect(() => {
    dispatch(getComments());
  }, []);

  const commentsState = useSelector((state) => state.comments);

  console.log(commentsState, "single Blog");

  const commentsOfBlog = commentsState.comments.filter(
    (comment) => comment.blogId === params.BlogId
  );

  useEffect(() => {
    if (isMdUp) {
      setShowComment(false);
    }
  }, [isMdUp]);

  return (
    <Box mt={2} mx={2}>
      {stateOfBlogs.loading ? (
        <h3>Loading</h3>
      ) : singleBlog === undefined ? (
        <h3>Not fount</h3>
      ) : stateOfBlogs.failed ? (
        <h3>Please Check Your Internet Connection</h3>
      ) : (
        <>
          <Grid container columns={12}>
            <Grid xs={12} sm={12} md={6}>
              <Fade
                in={true}
                style={{
                  transitionDelay: true ? "500ms" : "0ms",
                }}
              >
                <Card
                  sx={{
                    // width: "350px",
                    padding: 2,
                    borderTopRightRadius: "20%",
                  }}
                  elevation={24}
                >
                  <CardActionArea>
                    <CardHeader
                      title={singleBlog.title}
                      subheader={singleBlog.date}
                    />
                    <CardContent>{singleBlog.description}</CardContent>
                    <Tooltip title="Like" placement="top" arrow>
                      <Checkbox
                        disabled={disabled}
                        icon={<FavoriteBorder />}
                        checked={like.checked}
                        onClick={hanldeChecked}
                        checkedIcon={
                          <Favorite
                            sx={{
                              color: "red",
                            }}
                          />
                        }
                      />
                    </Tooltip>
                    <Tooltip
                      placement="right-start"
                      arrow
                      title="toggle between Comments & Write Comment section"
                    >
                      <Button
                        className="commentButton"
                        onClick={() => {
                          setShowComment((prevData) => !prevData);
                        }}
                        variant="text"
                      >
                        Comment
                      </Button>
                    </Tooltip>

                    <Typography display={"inline-block"} color="text.secondary">
                      {commentsOfBlog.length} comments
                    </Typography>
                  </CardActionArea>
                  <CardActions>
                    <Link to="/BLogs">
                      <Button type="button" variant="contained">
                        Back to Blogs
                      </Button>
                    </Link>
                  </CardActions>
                </Card>
              </Fade>
            </Grid>
            <Grow
              in={isMdUp ? true : !showComment}
              style={{
                transitionDelay: showComment ? "750ms" : "0ms",
              }}
            >
              <Grid
                mt={3}
                display={isMdUp ? "block" : showComment ? "none" : "block"}
                xs={12}
                sm={12}
                md={6}
                sx={{
                  overflowY: "scroll",
                  height: isMdUp ? "39dvh" : "50dvh",

                  position: "relative",
                }}
              >
                <Typography textAlign={"center"} variant="h5">
                  Comments
                </Typography>
                <List sx={{ width: "100%" }}>
                  {commentsState.loading ? (
                    <h3>loading...</h3>
                  ) : commentsState.failed ? (
                    <h3>Loading Failed ,click here to reload</h3>
                  ) : commentsOfBlog.length === 0 ? (
                    <h3>There is no comment</h3>
                  ) : (
                    commentsOfBlog.map((comment, index) => {
                      return (
                        <ListItem alignItems="flex-start">
                          <ListItemAvatar>
                            <Avatar src="" alt="img" />
                          </ListItemAvatar>
                          <ListItemText
                            primary={
                              <>
                                <Typography variant="h6">
                                  {comment.fullName}
                                </Typography>
                                <Typography
                                  variant="subtitle1"
                                  color="text.secondary"
                                >
                                  {comment.date}
                                </Typography>
                              </>
                            }
                            secondary={
                              <Typography variant="h6" color="secondary">
                                {comment.comment}
                              </Typography>
                            }
                          />
                        </ListItem>
                      );
                    })
                  )}
                </List>
              </Grid>
            </Grow>
          </Grid>

          <Grow
            in={showComment}
            style={{
              transitionDelay: showComment ? "500ms" : "0ms",
            }}
          >
            <Grid
              display={
                isMdUp && showComment ? "flex" : showComment ? "flex" : "none"
              }
              container
              spacing={1}
              justifyContent={"center"}
              mx={4}
            >
              <Grid xs={10} mt={3}>
                <Typography variant="h6" textAlign={"center"}>
                  Write your comment here{" "}
                  {
                    <ArrowDownwardRounded
                      sx={{
                        verticalAlign: "middle",
                      }}
                    />
                  }
                </Typography>
              </Grid>
              <Grid xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="fullname"
                  placeholder="Full Name"
                  variant="filled"
                  size="small"
                  label="fullName"
                  value={formData.fullname}
                  onChange={handleChange}
                />
              </Grid>
              <Grid xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="comment"
                  placeholder="Your Comment Here..."
                  variant="filled"
                  size="small"
                  label="Comment"
                  value={formData.comment}
                  onChange={handleChange}
                />
              </Grid>
              <Grid xs={6} display={"flex"} justifyContent={"center"}>
                <LoadingButton
                  loading={loadingButton}
                  variant="contained"
                  color="success"
                  fullWidth
                  endIcon={<SendSharp />}
                  loadingPosition="end"
                  onClick={handleSubmit}
                >
                  {loadingButton ? "Submitting" : "Submit"}
                </LoadingButton>
              </Grid>
            </Grid>
          </Grow>
        </>
      )}
    </Box>
  );
};
export default SingleProduct;
