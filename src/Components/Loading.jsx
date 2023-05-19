import { Box, CircularProgress, Typography } from "@mui/material";
const Loading = () => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      <CircularProgress color="primary" />
    </Box>
  );
};
export default Loading;
