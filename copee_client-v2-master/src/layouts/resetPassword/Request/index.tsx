import Box from "@mui/material/Box";
import { Copyright } from "@/components/ui/copyright/copyright";
import { motion } from "framer-motion";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import ResetUserPasswordForm from "./form";
import { useEffect, useState } from "react";
import ResetPasswordRequested from "./requested";
import { firebasePasswordResetEmail } from "@/components/api/Google/Firebase";
import { ApiResponse } from "@/layouts/types";
import { useActionData, useSubmit } from "react-router-dom";
import { Snackbar, Alert, LinearProgress } from "@mui/material";

export const action = async ({ request }: { request: Request }) => {
  const formData: FormData = await request.formData();
  const email: FormDataEntryValue | null = formData.get("email");
  const apiRes: ApiResponse = { message: "", ok: false };

  try {
    await firebasePasswordResetEmail(email as string);
    apiRes.message = "Succès";
    apiRes.ok = true;
  } catch (e: any) {
    console.log(e);
    apiRes.message = e.message;
  }
  return apiRes;
};

export default function ResetUserPassword() {
  const animations = {
    initial: { opacity: 0, x: 1000 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -1000 },
  };
  const [formDisplay, toggleFormDisplay] = useState<boolean>(true);
  const [loadingProgress, toggleLoadingProgress] = useState<boolean>(false);
  const [snackbarOpen, toggleSnackbarOpen] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const submit = useSubmit();
  const actionData: ApiResponse = useActionData() as ApiResponse;

  const handleSnackBarClose = (reason: any) => {
    if (reason === "clickaway") {
      return;
    }
    toggleSnackbarOpen(false);
  };

  const handlePasswordResetResult = (email: string) => {
    setEmail(email);
  };

  useEffect(() => {
    if (actionData && actionData.message !== "") {
      toggleLoadingProgress(false);
      toggleSnackbarOpen(true);
      if (actionData.ok) {
        toggleFormDisplay(false);
      } else {
        toggleLoadingProgress(false);
        //TODO: prévoir le cas d'un échec
      }
    }
    if (email !== "") {
      toggleLoadingProgress(true);
      submit(
        { email },
        {
          method: "post",
          action: `/reset-password`,
        }
      );
      setEmail("");
    }
  }, [email, actionData]);

  return (
    <Container component="main">
      <motion.div
        variants={animations}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.5 }}
      >
        <Grid>
          <Box
            sx={{
              margin: "0 auto",
              alignItems: "center",
              width: "40%",
            }}
          >
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
            {loadingProgress ? <LinearProgress /> : <></>}

            {formDisplay ? (
              <ResetUserPasswordForm
                onPasswordResetResult={handlePasswordResetResult}
              />
            ) : (
              <ResetPasswordRequested />
            )}
          </Box>
          <Copyright sx={{ mt: 5 }} />
        </Grid>
      </motion.div>
    </Container>
  );
}
