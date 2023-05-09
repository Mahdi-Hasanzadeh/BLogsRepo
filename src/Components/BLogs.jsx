import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardHeader,
  Typography,
} from "@mui/material";

import Grid from "@mui/material/Unstable_Grid2";
import { Link } from "react-router-dom";

const Blogs = ({ blogs }) => {
  //   console.log(blogs.blogs[0].title || "not found");
  return (
    <>
      {blogs.loading ? (
        <h3>Loading</h3>
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
                <Button fullWidth size="large" variant="contained">
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
            {blogs.blogs.map((blog, index) => {
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
                    </CardActions>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Box>
      )}
    </>
  );
};
export default Blogs;
