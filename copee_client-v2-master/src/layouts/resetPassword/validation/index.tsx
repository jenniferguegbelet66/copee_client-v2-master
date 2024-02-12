import { Copyright } from "@/components/ui/copyright/copyright";
import {
  Alert,
  Box,
  Container,
  Grid,
  LinearProgress,
  Snackbar,
} from "@mui/material";
import ResetUserPasswordValidationForm from "./form";
import { useEffect, useState } from "react";
import ResetUserPasswordValidated from "./validated";
import { useActionData, useSubmit } from "react-router-dom";
import { firebaseConfirmPasswordReset } from "@/components/api/Google/Firebase";
import { ApiResponse } from "@/layouts/types";

export const action = async ({ request }: { request: Request }) => {
  const formData: FormData = await request.formData();
  const password: FormDataEntryValue | null = formData.get("password");
  const oobcode: FormDataEntryValue | null = formData.get("oobcode");
  const apiRes: ApiResponse = { message: "", ok: false };

  try {
    if (password !== "" && oobcode !== "") {
      await firebaseConfirmPasswordReset(oobcode as string, password as string);
      apiRes.message = "mot de passe réinitialisé avec succès";
      apiRes.ok = true;
    }
  } catch (e: any) {
    console.log(e);
    apiRes.message = e.message;
  }
  return apiRes;
};

const ResetUserPasswordValidation = () => {
  const [formDisplay, toggleFormDisplay] = useState<boolean>(true);
  const [newPassword, setNewPassword] = useState<string>("");
  const [oobcode, setOobcode] = useState<string>("");
  const [loadingProgress, toggleLoadingProgress] = useState<boolean>(false);
  const [snackbarOpen, toggleSnackbarOpen] = useState<boolean>(false);
  const actionData: ApiResponse = useActionData() as ApiResponse;
  const submit = useSubmit();

  const handleSnackBarClose = (reason: any) => {
    if (reason === "clickaway") {
      return;
    }
    toggleSnackbarOpen(false);
  };

  const handlePasswordResetResult = (newPassword: string, oobcode: string) => {
    setNewPassword(newPassword);
    setOobcode(oobcode);
  };

  useEffect(() => {
    if (actionData && actionData.message !== "") {
      toggleLoadingProgress(false);
      toggleSnackbarOpen(true);
      if (actionData.ok) {
        toggleFormDisplay(false);
      } else {
        //TODO: prévoir le cas d'un échec
      }
    } else {
      if (newPassword !== "" && oobcode !== "") {
        toggleLoadingProgress(true);
        submit(
          { password: newPassword, oobcode },
          {
            method: "post",
            action: `/reset-password/validation`,
          }
        );
        setNewPassword("");
        setOobcode("");
      }
    }
  }, [newPassword, oobcode, actionData]);

  return (
    <Container component="main">
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        message={actionData ? actionData?.message : ""}
        onClose={handleSnackBarClose}
      >
        <Alert
          onClose={handleSnackBarClose}
          severity={actionData?.ok ? "success" : "error"}
          sx={{ width: "100%" }}
        >
          {actionData ? actionData.message : ""}
        </Alert>
      </Snackbar>
      <Grid>
        <Box
          sx={{
            margin: "0 auto",
            alignItems: "center",
            width: "40%",
          }}
        >
          {loadingProgress ? <LinearProgress /> : <></>}
          {formDisplay ? (
            <ResetUserPasswordValidationForm
              onPasswordResetResult={handlePasswordResetResult}
            />
          ) : (
            <ResetUserPasswordValidated />
          )}
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Grid>
    </Container>
  );
};

export default ResetUserPasswordValidation;
