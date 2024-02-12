import {
  Button,
  Checkbox,
  FormControlLabel,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Form } from "react-router-dom";

interface Inputs {
  password: string;
  passwordConfirmation: string;
}

interface ResetUserPasswordFormProps {
  onPasswordResetResult: (password: string, oobcode: string) => void;
}

const ResetUserPasswordValidationForm: React.FC<ResetUserPasswordFormProps> = ({
  onPasswordResetResult,
}) => {
  const searchParams: URLSearchParams = new URLSearchParams(location.search);
  const oobcodeParam: string | null = searchParams.get("oobCode");
  const [oobcode, setOobcode] = useState<string>(oobcodeParam ?? "");
  const {
    watch,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();
  const passwordMatchingList = watch(["password", "passwordConfirmation"]);
  const arePasswordMatching: boolean = passwordMatchingList.every(
    (elt) => elt === passwordMatchingList[0]
  );
  const [passwordConfirmationView, togglePasswordConfirmationView] =
    useState<boolean>(false);
  const [hasSubmited, toggleHasSubmited] = useState<boolean>(false);

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    toggleHasSubmited(true);
    if (arePasswordMatching && oobcode) {
      onPasswordResetResult(data.password, oobcode);
    }
  };

  return (
    <>
      <Typography variant="h5">
        Veuillez entrer votre nouveau mot de passe
      </Typography>
      <Form method="post" onSubmit={handleSubmit(onSubmit)}>
        <TextField
          fullWidth
          margin="normal"
          id="password"
          label="Mot de passe"
          autoComplete="password"
          type={passwordConfirmationView ? "text" : "password"}
          autoFocus
          {...register("password", {
            required: {
              value: true,
              message: "Nouveau mot de passe requis",
            },
          })}
        />
        {errors.password && (
          <Typography className="custom-form-element-error-message">
            {errors.password.message}
          </Typography>
        )}
        <TextField
          fullWidth
          margin="normal"
          id="password"
          label="Confirmation du mot de passe"
          autoComplete="password"
          type={passwordConfirmationView ? "text" : "password"}
          {...register("passwordConfirmation", {
            required: {
              value: true,
              message: "Confirmation du mot de passe requise",
            },
          })}
        />
        <FormControlLabel
          control={
            <Checkbox
              value="remember"
              color="primary"
              onClick={() =>
                togglePasswordConfirmationView(!passwordConfirmationView)
              }
            />
          }
          label="Voir le mot de passe"
          name="seePassword"
        />
        {errors.passwordConfirmation && (
          <Typography className="custom-form-element-error-message">
            {errors.passwordConfirmation.message}
          </Typography>
        )}
        {!arePasswordMatching && hasSubmited ? (
          <Typography className="custom-form-element-error-message">
            Les mots de passe ne correspondent pas
          </Typography>
        ) : (
          <></>
        )}
        <Button
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          type="submit"
        >
          Valider
        </Button>
      </Form>
    </>
  );
};

export default ResetUserPasswordValidationForm;
