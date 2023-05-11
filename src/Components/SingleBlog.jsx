import { Link, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Grid from "@mui/material/Unstable_Grid2";
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardHeader,
  Checkbox,
  Tooltip,
} from "@mui/material";
import { Favorite, FavoriteBorder } from "@mui/icons-material";

import { changeLike, chagneLikeOfABlog } from "../redux";
import { toast } from "react-toastify";
import { useState } from "react";

const SingleProduct = () => {
  const [disabled, setDisabled] = useState(false);
  const params = useParams();

  const dispatch = useDispatch();

  const stateOfBlogs = useSelector((state) => state.blogs);

  console.log(stateOfBlogs.likes);

  const singleBlog = stateOfBlogs.blogs.find(
    (blog) => blog.id === params.BlogId
  );

  // console.log(singleBlog);

  const like = stateOfBlogs.likes.find((blog) => blog.blogId === params.BlogId);

  console.log(like, "single");

  const hanldeChecked = async () => {
    setDisabled(true);
    console.log("handleChecked");
    console.log("id: ", like.id);
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

  return (
    <Box mt={2} mx={2}>
      {stateOfBlogs.loading ? (
        <h3>Loading</h3>
      ) : singleBlog === undefined ? (
        <h3>Not fount</h3>
      ) : stateOfBlogs.failed ? (
        <h3>Please Check Your Internet Connection</h3>
      ) : (
        <Grid container columns={12} justifyContent={"center"}>
          <Grid xs={12} sm={12} md={10}>
            <Card
              sx={{
                // width: "350px",
                padding: 5,
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
                <Tooltip title="Like" placement="left" arrow>
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
              </CardActionArea>
              <CardActions>
                <Link to="/BLogs">
                  <Button type="button" variant="contained">
                    Back to Blogs
                  </Button>
                </Link>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};
export default SingleProduct;
