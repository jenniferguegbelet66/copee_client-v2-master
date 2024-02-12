import Button from "@mui/material/Button";
import { Form, useNavigate } from "react-router-dom";
import { TextField, Typography } from "@mui/material";
import { email_regex } from "@/lib/validation";
import { SubmitHandler, useForm } from "react-hook-form";

interface Inputs {
  email: string;
}

interface ResetUserPasswordFormProps {
  onPasswordResetResult: (email: string) => void;
}

const ResetUserPasswordForm: React.FC<ResetUserPasswordFormProps> = ({
  onPasswordResetResult,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    onPasswordResetResult(data.email);
  };

  return (
    <Form method="post" onSubmit={handleSubmit(onSubmit)}>
      <Typography variant="h5">Entrez votre adresse mail</Typography>

      <TextField
        fullWidth
        margin="normal"
        id="email"
        label="Adresse email"
        autoComplete="email"
        autoFocus
        // name="email"
        {...register("email", {
          required: {
            value: true,
            message: "Adresse mail requise",
          },
          pattern: {
            value: email_regex,
            message: "Adresse invalide",
          },
        })}
      />
      {errors.email && (
        <Typography className="custom-form-element-error-message">
          {errors.email.message}
        </Typography>
      )}
      <Button fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} type="submit">
        Valider
      </Button>

      <Button
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
        type="submit"
        color="warning"
        onClick={() => {
          navigate("/signin");
        }}
      >
        Annuler
      </Button>
    </Form>
  );
};

export default ResetUserPasswordForm;
