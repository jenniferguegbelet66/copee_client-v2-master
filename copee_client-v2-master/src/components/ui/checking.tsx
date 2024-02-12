import React from "react";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";

interface CheckingProps {
  title: string;
  path: string;
  message?: string;
}

const Checking: React.FC<CheckingProps> = ({ title, path, message }) => {
  const navigate = useNavigate();

  return (
    <div>
      <Typography
        variant="h5"
        gutterBottom
        style={{
          fontFamily: "lato",
          marginTop: "10px",
        }}
      >
        {title}
      </Typography>
      {path !== "" ? (
        <Button onClick={() => navigate(path)}>Consulter</Button>
      ) : (
        <>
          <p>{message}</p>
          <Button disabled>Consulter</Button>
        </>
      )}
    </div>
  );
};

export default Checking;
