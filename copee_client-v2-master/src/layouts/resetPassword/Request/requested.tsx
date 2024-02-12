import { Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";

const ResetPasswordRequested = () => {
  const navigate = useNavigate();

  return (
    <div>
      <EmailOutlinedIcon sx={{ fontSize: "50px" }} />
      <Typography
        variant="body2"
        sx={{
          marginTop: "10px",
          padding: "10px",
          color: "#cc801e",
          fontWeight: "bold",
        }}
      >
        Vous allez recevoir un lien à votre adresse mail pour réinitialiser
        votre mot de passe
      </Typography>

      <Button
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
        type="submit"
        color="primary"
        onClick={() => {
          navigate("/signin");
        }}
      >
        Revenir
      </Button>
    </div>
  );
};

export default ResetPasswordRequested;
