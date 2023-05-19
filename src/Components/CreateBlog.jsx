import { Box, Button, TextField, Typography } from "@mui/material";
// import Grid from "@mui/material/Unstable_Grid2";
import Grid from "@mui/material/Grid";
import { useState } from "react";
import LoadingButton from "@mui/lab/LoadingButton";
import {
  addBlog,
  addBlogToDatabase,
  addLike,
  addLikeToDatabase,
} from "../redux.js";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { nanoid } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { SendRounded } from "@mui/icons-material";
import { useSelector } from "react-redux";

const CreateBlog = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);

  const state = useSelector((state) => state.blogs);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (event) => {
    const { value, name } = event.target;
    setFormData((prevData) => {
      return {
        ...prevData,
        [name]: value,
      };
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (formData.title !== "" && formData.description !== "") {
      // const id = nanoid();
      setLoading(true);
      const idForBlog = await addBlogToDatabase({
        date: new Date().toLocaleString(),
        title: formData.title,
        description: formData.description,
      });

      console.log("creating new Blog");

      if (!idForBlog.fail) {
        // toast.success("Post Saved Successfully");
        const idForLike = await addLikeToDatabase(idForBlog);
        // console.log(res, "id");
        if (!idForLike.fail) {
          setLoading(false);
          // dispatch(
          //   addBlog({
          //     id: idForBlog,
          //     date: new Date().toLocaleDateString(),
          //     title: formData.title,
          //     description: formData.description,
          //   })
          // );
          dispatch(addBlog(idForBlog, formData.title, formData.description));
          // dispatch(
          //   addLike({
          //     blogId: idForBlog,
          //     id: idForLike,
          //     checked: false,
          //   })
          // );

          dispatch(addLike(idForBlog, idForLike));

          navigate("/BLogs");
          toast.success("Post Created Successfully");
        } else {
          setLoading(false);
          toast.error(`${resp},Please Check Your Internet Connection`);
        }
      } else {
        setLoading(false);
        toast.error(`${resp},Please Check Your Internet Connection`);
      }
    } else {
      setLoading(false);
      toast.error("Fill out the form");
    }
  };
  return (
    <>
      <Box>
        <Typography textAlign={"center"} variant="h6">
          Create A New Blog
        </Typography>
        <Typography
          onSubmit={handleSubmit}
          component={"form"}
          autoComplete="false"
        >
          <Grid
            container
            rowSpacing={2}
            columns={12}
            justifyContent={"center"}
            mt={3}
          >
            <Grid item xs={8}>
              <TextField
                fullWidth
                variant="filled"
                size="small"
                label="Title"
                placeholder="Title Here ..."
                color="secondary"
                type="text"
                name="title"
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={8}>
              <TextField
                fullWidth
                variant="filled"
                size="small"
                label="Description"
                placeholder="Description Here..."
                color="secondary"
                type="text"
                name="description"
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={6}>
              <LoadingButton
                disabled={state.failed}
                fullWidth
                size="small"
                type="submit"
                endIcon={<SendRounded />}
                loading={loading}
                loadingPosition="end"
                variant="contained"
              >
                {state.failed
                  ? "Internet Disconneted"
                  : loading
                  ? "Creating Your Post ..."
                  : "Save Post"}
              </LoadingButton>
            </Grid>
          </Grid>
        </Typography>
      </Box>
    </>
  );
};
export default CreateBlog;
