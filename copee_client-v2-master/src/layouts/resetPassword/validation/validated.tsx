import { Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const ResetUserPasswordValidated = () => {
  const navigate = useNavigate();
  return (
    <div>
      <Typography variant="body1">
        Votre mot de passe a été réinitialisé avec succès. Vous pouvez désormais
        vous connecter avec votre nouveau mot de passe.
      </Typography>
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
        color={"secondary"}
        onClick={() => navigate("/signin")}
      >
        Annuler
      </Button>
    </div>
  );
};

export default ResetUserPasswordValidated;
