import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import {
  firebaseGetCurrentUserIdToken,
  firebaseSigninWithEmailAndPassword,
  processFirebaseAuthError,
} from "../../components/api/Google/Firebase";
import { Form, redirect, useActionData, Link } from "react-router-dom";
import { UserCredential } from "firebase/auth";
import { FirebaseError } from "firebase/app";
import Snackbar from "@mui/material/Snackbar";
import { useEffect, useState } from "react";
import { Alert, LinearProgress } from "@mui/material";
import { setToken } from "../../components/store/slices/firebaseSlice";
import { store } from "../../components/store";
import { Copyright } from "../../components/ui/copyright/copyright";
import { ApiResponse } from "../types";
import localforage from "localforage";
import "./index.css";

export async function action({ request }: { request: Request }) {
  const formData: FormData = await request.formData();
  const email: FormDataEntryValue | null = formData.get("email");
  const password: FormDataEntryValue | null = formData.get("password");
  const rememberMe: FormDataEntryValue | null = formData.get("rememberMe");
  const response: ApiResponse = {
    message: "",
    ok: false,
    status: "",
  };

  try {
    const userCredential: UserCredential =
      await firebaseSigninWithEmailAndPassword(
        email as string,
        password as string
      );
    if (userCredential.user) {
      const token: string | null = await firebaseGetCurrentUserIdToken();
      const firebaseTokenAction: {
        payload: any;
        type: string;
      } = setToken(token);
      store.dispatch(firebaseTokenAction);

      await localforage.setItem("token", token);
      // save user credentials in local storage for future connection
      if (rememberMe === "remember" && token) {
        await localforage.setItem("email", email);
        await localforage.setItem("password", password);
      }
      return redirect("/dashboard");
    }
  } catch (e: any) {
    if (e instanceof FirebaseError) {
      const errorMessage = processFirebaseAuthError(e.code);
      response.message = errorMessage;
      response.status = e.code;
    }
  }
  return response;
}

export default function SignInSide() {
  const actionData: ApiResponse = useActionData() as ApiResponse;
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [loader, toggleLoader] = useState<boolean>(false);
  const [passwordView, togglePasswordView] = useState<boolean>(false);

  useEffect(() => {
    if (actionData && !actionData.ok) {
      toggleLoader(false);
      setSnackbarOpen(actionData ? !actionData.ok : false);
    }
  }, [actionData]);

  const handleSnackBarClose = (reason: any) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  return (
    <div id="signin-container">
      <Grid container component="main">
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          open={snackbarOpen}
          autoHideDuration={6000}
          message={actionData ? actionData.message : ""}
          onClose={handleSnackBarClose}
        >
          <Alert
            onClose={handleSnackBarClose}
            severity="error"
            sx={{ width: "100%" }}
          >
            {actionData ? actionData.message : ""}
          </Alert>
        </Snackbar>
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage:
              "url(https://source.unsplash.com/random?wallpapers)",
            backgroundRepeat: "no-repeat",
            backgroundColor: (t) =>
              t.palette.mode === "light"
                ? t.palette.grey[50]
                : t.palette.grey[900],
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Connexion
            </Typography>
            <Form method="post">
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Adresse email"
                name="email"
                autoComplete="email"
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Mot de passe"
                type={passwordView ? "text" : "password"}
                id="password"
                autoComplete="current-password"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    value="remember"
                    color="primary"
                    onClick={() => togglePasswordView(!passwordView)}
                  />
                }
                label="Voir le mot de passe"
                name="seePassword"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                onClick={() => {
                  toggleLoader(true);
                }}
              >
                Connexion
              </Button>
              {loader ? <LinearProgress /> : <></>}
              <Grid container>
                <Grid item xs>
                  <Link to="/reset-password" className="signin-link">
                    Mot de passe oublié?
                  </Link>
                </Grid>
                <Grid item>
                  <Link to="#" className="signin-link">
                    {"Vous n'avez pas encore compte?"}
                  </Link>
                </Grid>
              </Grid>
              <Copyright sx={{ mt: 5 }} />
              {/* </Box> */}
            </Form>
          </Box>
        </Grid>
      </Grid>
    </div>
  );
}
