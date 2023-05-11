import {
  Card,
  CardHeader,
  CardContent,
  CardActionArea,
  Box,
  Typography,
} from "@mui/material";

const Index = () => {
  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mx: 3,
          mt: 1,
        }}
      >
        <Card
          elevation={5}
          sx={{
            width: "100vw",
          }}
        >
          <CardActionArea>
            <CardHeader
              sx={{
                padding: 4,
              }}
              title={
                <Typography variant="h6">Author: Mahdi Hasanzadeh</Typography>
              }
              subheader={
                <Typography color="text.secondary" variant="subtitle1">
                  Last Update: {new Date().toLocaleString()}
                </Typography>
              }
            />
            <CardContent>
              <Typography
                textAlign={"left"}
                variant="body1"
                sx={{
                  lineHeight: 2,
                }}
              >
                Hello Friends <br />
                Welcome to my new Project. In this project we are workin on a
                blog where you can add post very easily.
                <br />
                In this project, for designing Part we use{" "}
                <a
                  href=""
                  style={{
                    textDecoration: "underline",
                  }}
                >
                  Material UI
                </a>{" "}
                and for managing the state of the web app, we use{" "}
                <a
                  href=""
                  style={{
                    textDecoration: "underline",
                  }}
                >
                  Redux Toolkit{"  "}
                </a>
                which is very powerfull for managing the state. For Routing of
                our web app pages, we use{" "}
                <a
                  href=""
                  style={{
                    textDecoration: "underline",
                  }}
                >
                  React-Router-Dom
                </a>
                {"  "}
                that we can easily navigate through the pages whithout any
                problem. For database part, We use{" "}
                <a
                  href=""
                  style={{
                    textDecoration: "underline",
                  }}
                >
                  Firebase
                </a>{" "}
                which is a very powerfull free database that we can easily add
                our data to firestore Databases. So you can add your post to
                Database permanently.
                <br />
                <span
                  style={{
                    marginLeft: "5px",
                  }}
                >
                  Thanks
                </span>
                <br />
                <span
                  style={{
                    marginLeft: "10px",
                  }}
                >
                  Developed by: Mahdi Hasanzadeh
                </span>
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      </Box>
    </>
  );
};
export default Index;
