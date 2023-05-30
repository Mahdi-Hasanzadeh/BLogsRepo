import { Link, useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
// import Grid from "@mui/material/Unstable_Grid2";
import Grid from "@mui/material/Grid";

import {
  Avatar,
  Box,
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
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
  addLikeForASpecificUser,
  changeLikeOfUser,
  addLikeOfUser,
} from "../redux";

import LoadingButton from "@mui/lab/LoadingButton";

import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import Loading from "./Loading";
import FailedComponent from "./FailedComp";

import waterSplash from "../assets/water-splash.jpg";
import { formatDistanceToNow } from "date-fns";
const SingleProduct = ({ userInfo }) => {
  const navigate = useNavigate();
  const params = useParams();
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));
  const dispatch = useDispatch();

  const [disabled, setDisabled] = useState(false);
  const [showComment, setShowComment] = useState(false);
  const [loadingButton, setLoadingButton] = useState(false);
  const [formData, setFormData] = useState({
    // fullname: "",
    comment: "",
  });

  const stateOfBlogs = useSelector((state) => state.blogs);

  const singleBlog = stateOfBlogs.blogs.find(
    (blog) => blog.id === params.BlogId
  );

  const like = stateOfBlogs.likes.find((blog) => blog.blogId === params.BlogId);

  const user = stateOfBlogs.users.find(
    (user) => user.uid === userInfo.uid && user.blogId === params.BlogId
  );

  const totalLike = stateOfBlogs.users.filter(
    (user) => user.blogId === params.BlogId && user.checked === true
  );
  // console.log(totalLike, "likes");

  const commentsState = useSelector((state) => state.comments);

  // console.log(commentsState, "single Blog");

  const commentsOfBlog = commentsState.comments.filter(
    (comment) => comment.blogId === params.BlogId
  );

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
    if (formData.comment !== "") {
      setLoadingButton(true);
      // console.log("blog id: ", singleBlog.id);
      // console.log("like id:", like.id);
      const commentId = await addCommentOfBlogToDatabase(
        singleBlog.id,
        userInfo.displayName,
        formData.comment,
        new Date().toLocaleString()
      );
      if (commentId !== false) {
        console.log("Comment Id: ", commentId);
        dispatch(
          addComment({
            id: commentId,
            blogId: singleBlog.id,
            fullName: userInfo.displayName,
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
  // console.log(user, "user Like");

  const hanldeChecked = async () => {
    setDisabled(true);
    // console.log("handleChecked");
    // console.log("id: ", like.id);

    if (!user) {
      const res = await addLikeForASpecificUser({
        uid: userInfo.uid,
        likeId: like.id,
        blogId: like.blogId,
        checked: false,
      });

      if (res) {
        dispatch(
          addLikeOfUser({
            id: res,
            uid: userInfo.uid,
            likeId: like.id,
            blogId: like.blogId,
            checked: false,
          })
        );
        // console.log("user added,id: ", res);
        const resp = await chagneLikeOfABlog({
          id: res,
          checked: true,
        });
        if (resp) {
          dispatch(
            changeLikeOfUser({
              uid: userInfo.uid,
              blogId: like.blogId,
            })
          );
          setDisabled(false);
        } else {
          setDisabled(false);
          toast.error("Something gone wrong,try again");
        }
      } else {
        setDisabled(false);
        toast.error("Something gone wrong,try again");
      }
    } else {
      // console.log("user exitsted for this blog");
      // console.log("userId: ", user.uid);
      const resp = await chagneLikeOfABlog({
        id: user.id,
        checked: !user.checked,
      });
      if (resp) {
        dispatch(
          changeLikeOfUser({
            uid: user.uid,
            blogId: user.blogId,
          })
        );
        setDisabled(false);
      } else {
        setDisabled(false);
        toast.error("Something gone wrong,check you internet connection");
      }
    }
  };

  useEffect(() => {
    // console.log("getComments");
    dispatch(getComments());
  }, []);

  useEffect(() => {
    if (isMdUp) {
      setShowComment(false);
    }
  }, [isMdUp]);

  return (
    <Box mt={2} mx={2}>
      {stateOfBlogs.loading ? (
        <Box
          sx={{
            textAlign: "center",
          }}
        >
          <Loading />
        </Box>
      ) : singleBlog === undefined ? (
        <h3>Not fount</h3>
      ) : stateOfBlogs.failed ? (
        <FailedComponent />
      ) : (
        <>
          <Grid container columns={12}>
            {/* Card Grid */}
            <Grid item xs={12} sm={12} md={6}>
              <Fade
                in={true}
                style={{
                  transitionDelay: true ? "500ms" : "0ms",
                }}
              >
                <Card
                  sx={{
                    // width: "350px",
                    borderTopRightRadius: "20%",
                  }}
                  elevation={12}
                >
                  <CardActionArea>
                    <CardHeader
                      title={singleBlog.displayName}
                      subheader={
                        formatDistanceToNow(new Date(singleBlog.date)) + " ago"
                      }
                    />
                    <CardMedia
                      component={"img"}
                      height="140"
                      src={waterSplash}
                    />
                    <CardContent>
                      <Typography variant="h6">{singleBlog.title}</Typography>
                      <Typography variant="body1">
                        {singleBlog.description}
                      </Typography>
                    </CardContent>

                    <Tooltip title="Like" placement="top" arrow>
                      <Checkbox
                        disabled={disabled}
                        icon={<FavoriteBorder />}
                        checked={
                          params.BlogId === user?.blogId &&
                          userInfo.uid === user?.uid
                            ? user.checked
                            : false
                        }
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

                    <Typography
                      mr={1}
                      display={"inline-block"}
                      color="text.secondary"
                    >
                      {totalLike.length} like
                      {totalLike.length <= 1 ? null : "s"}
                    </Typography>

                    <Typography
                      mr={1}
                      display={"inline-block"}
                      color="text.secondary"
                    >
                      {commentsOfBlog.length} comment
                      {commentsOfBlog.length <= 1 ? null : "s"}
                    </Typography>

                    <Tooltip
                      placement="bottom"
                      arrow
                      title="toggle between Comments & Write Comment section"
                    >
                      <Button
                        className="commentButton"
                        onClick={() => {
                          setShowComment((prevData) => !prevData);
                          // window.scrollBy(0, 1000);
                          window.scrollTo(1000, 1000);
                        }}
                        variant="outlined"
                      >
                        Comment
                      </Button>
                    </Tooltip>
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
                item
                mt={3}
                display={isMdUp ? "block" : showComment ? "none" : "block"}
                xs={12}
                sm={12}
                md={6}
                sx={{
                  overflowY: "scroll",
                  height: isMdUp ? "50dvh" : "50dvh",

                  position: "relative",
                }}
              >
                <Typography textAlign={"center"} variant="h5">
                  Comments
                </Typography>
                <List sx={{ width: "100%" }}>
                  {commentsState.loading ? (
                    <Box
                      sx={{
                        textAlign: "center",
                      }}
                    >
                      <Loading />
                    </Box>
                  ) : commentsState.failed ? (
                    <h3>Loading Failed ,click here to reload</h3>
                  ) : commentsOfBlog.length === 0 ? (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <Typography textAlign={"center"} variant="h6">
                        No Comments, write your comment by clicking on comment
                        button
                      </Typography>
                    </Box>
                  ) : (
                    commentsOfBlog.map((comment, index) => {
                      return (
                        <ListItem key={index} alignItems="flex-start">
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
            >
              <Grid item xs={10} mt={3}>
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
              {/* <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  name="fullname"
                  placeholder="Full Name"
                  variant="filled"
                  label="FullName"
                  value={formData.fullname}
                  onChange={handleChange}
                />
              </Grid> */}
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  name="comment"
                  placeholder="Your Comment Here..."
                  variant="filled"
                  label="Comment"
                  value={formData.comment}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={6} display={"flex"} justifyContent={"center"}>
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
