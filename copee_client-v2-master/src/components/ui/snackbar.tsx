import React from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { ApiResponse } from "@/layouts/types";

type SnackbarActionProps = {
  snackbarOpen: boolean;
  actionData: ApiResponse | undefined;
  handleSnackBarClose: (reason: any) => void;
};

const SnackbarAction: React.FC<SnackbarActionProps> = ({
  snackbarOpen,
  actionData,
  handleSnackBarClose,
}) => {
  return (
    <Snackbar
      open={snackbarOpen}
      autoHideDuration={6000}
      message={actionData ? actionData.message : ""}
      onClose={handleSnackBarClose}
    >
      <Alert
        onClose={handleSnackBarClose}
        severity={actionData ? (actionData.ok ? "success" : "error") : "info"}
        sx={{ width: "100%" }}
      >
        {actionData ? actionData.message : ""}
      </Alert>
    </Snackbar>
  );
};

export default SnackbarAction;
