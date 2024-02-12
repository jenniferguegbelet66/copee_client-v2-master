import React from "react";
import { Outlet } from "react-router-dom";
import "./index.css";
import "../../App.css";
import { Box, Grid } from "@mui/material";

const Root: React.FC = () => {
  return (
    <div id="root">
      <Grid
        container
        component="main"
        sx={{ xs: 10, height: "100vh", width: "70vw" }}
      >
        <Box sx={{ display: "flex" }}></Box>
        <Outlet />
      </Grid>
    </div>
  );
};

export default Root;
