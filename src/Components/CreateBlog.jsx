import { Box, Button, TextField, Typography } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import { useState } from "react";

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
const CreateBlog = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

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
      const id = nanoid();
      const resp = await addBlogToDatabase({
        id,
        date: new Date().toLocaleDateString(),
        title: formData.title,
        description: formData.description,
      });

      if (resp === 201) {
        // toast.success("Post Saved Successfully");
        const res = await addLikeToDatabase(id);
        if (res === 201) {
          dispatch(
            addBlog({
              id,
              date: new Date().toLocaleDateString(),
              title: formData.title,
              description: formData.description,
            })
          );
          dispatch(
            addLike({
              id,
              checked: false,
            })
          );
          navigate("/BLogs");
        }
      } else {
        toast.error(`${resp},Please Check Your Internet Connection`);
      }
    } else {
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
            <Grid xs={8}>
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

            <Grid xs={8}>
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
            <Grid xs={6}>
              <Button type="submit" variant="contained" fullWidth>
                Save Post
              </Button>
            </Grid>
          </Grid>
        </Typography>
      </Box>
    </>
  );
};
export default CreateBlog;
