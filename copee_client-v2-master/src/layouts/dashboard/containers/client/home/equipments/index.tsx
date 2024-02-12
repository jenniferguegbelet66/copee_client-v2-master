import { useLoaderData, useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import dayjs from "dayjs";
import "dayjs/locale/fr";
dayjs.locale("fr");
import { ApiResponse, ClientHomeEquipmentsApiResponse } from "@/layouts/types";
import { useEffect, useState } from "react";
import {
  COPEE_APPLI_CLIENT_HOME_EQUIPMENT_LIST,
  COPEE_CLIENT_HOME_APPLI_EQUIPMENT,
} from "@/components/store/types";
import {
  StateMessage,
  deleteMessage,
  findStateMessage,
} from "@/components/store/slices/applicationSlice";
import { usePageLoader } from "@/layouts/dashboard/root";
import { ContextType } from "@/layouts/dashboard/types";
import { filterApiResponseFromReduxErrors } from "@/components/store/functions";
import { RootState, store } from "@/components/store";
import SnackbarAction from "@/components/ui/snackbar";
import { useSelector } from "react-redux";
import React from "react";
import { useFetchClientHomeEquipmentsByHomeQuery } from "@/components/store/api/copee/clientsHomeEquipmentApiSlice";
import HotTubIcon from "@mui/icons-material/HotTub";
import PoolIcon from "@mui/icons-material/Pool";

export default function ClientHomeEquipments() {
  const clientHomeEqmntsApiRes: ClientHomeEquipmentsApiResponse | undefined =
    useLoaderData() as ClientHomeEquipmentsApiResponse;
  const [clientHomeEquipments, setClientHomeEquipments] =
    useState<COPEE_APPLI_CLIENT_HOME_EQUIPMENT_LIST>();
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const params = useParams();
  const navigate = useNavigate();
  const loader: ContextType = usePageLoader();
  const { refetch } = useFetchClientHomeEquipmentsByHomeQuery({
    homeID: params.home_id ?? "",
  });
  const [actionData, setActionData] = useState<ApiResponse | undefined>();
  const token = useSelector((state: RootState) => state.auth.firebase.token);
  const messages = useSelector(
    (state: RootState) => state.application.messages
  );

  const refetchClientHomeEquipments = async (
    refetchMessage: StateMessage | null
  ) => {
    if (refetchMessage) {
      const clientHomeEqmtRes = await refetch();
      let apiResponse: ApiResponse | undefined;
      apiResponse = {
        message: refetchMessage.message,
        ok: true,
        status: "200",
      };
      if (clientHomeEqmtRes.error) {
        apiResponse = filterApiResponseFromReduxErrors(clientHomeEqmtRes.error);
      }
      const deleteMessageAction: {
        payload: StateMessage;
        type: "application/deleteMessage";
      } = deleteMessage(refetchMessage);
      store.dispatch(deleteMessageAction);
      if (clientHomeEqmtRes.data) {
        setClientHomeEquipments(clientHomeEqmtRes.data);
        clientHomeEqmntsApiRes.clientHomeEquipments =
          clientHomeEqmntsApiRes?.clientHomeEquipments;
      }
      setActionData(apiResponse);
      loader.toggleLoader(false);
    } else {
      setClientHomeEquipments(clientHomeEqmntsApiRes.clientHomeEquipments);
      setActionData(clientHomeEqmntsApiRes);
    }
  };

  const handleOnRefetch = async (refetchMessage: StateMessage | null) => {
    loader.toggleLoader(true);
    refetchClientHomeEquipments(refetchMessage)
      .then(() => {
        loader.toggleLoader(false);
        setSnackbarOpen(true);
      })
      .catch((e) => {
        console.log(e);
        setSnackbarOpen(true);
      });
  };

  const handleSnackBarClose = (reason: any) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  useEffect(() => {
    const refetchMessage: StateMessage | undefined = findStateMessage(
      messages,
      "homeEquipments"
    );
    if (token === "") {
      loader.toggleLoader(true);
    }

    (async () => {
      if (token !== "") {
        await handleOnRefetch(refetchMessage ?? null);
      }
    })();
  }, [clientHomeEqmntsApiRes, messages]);

  const renderClientHomeEquipmentList = () => {
    if (clientHomeEquipments && clientHomeEquipments.length > 0) {
      return (
        <List>
          {clientHomeEquipments.map(
            (eqmt: COPEE_CLIENT_HOME_APPLI_EQUIPMENT) => {
              return (
                <ListItem
                  alignItems="flex-start"
                  key={eqmt.che_id}
                  sx={{ textAlign: "center" }}
                >
                  <ListItemText
                    primary={eqmt.che_equipment_type}
                    secondary={
                      <React.Fragment>
                        <Typography
                          sx={{ display: "inline" }}
                          component="span"
                          variant="body2"
                          color="text.primary"
                        >
                          {eqmt.che_description}
                        </Typography>
                      </React.Fragment>
                    }
                  />
                  {eqmt.che_equipment_type.includes("Piscine") ? (
                    <PoolIcon />
                  ) : eqmt.che_equipment_type.includes("Jaccuzi") ? (
                    <HotTubIcon />
                  ) : (
                    ""
                  )}
                </ListItem>
              );
            }
          )}
        </List>
      );
    } else {
      return <></>;
    }
  };

  return (
    <Container
      maxWidth="lg"
      sx={{
        mt: 4,
        mb: 4,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box>
        <SnackbarAction
          snackbarOpen={snackbarOpen}
          actionData={actionData}
          handleSnackBarClose={handleSnackBarClose}
        />
        <div className="client-home-equipments-container space-y-6">
          <Button
            className="custom-button"
            style={{
              background: "rgb(59, 130, 246, 0.1)",
            }}
            onClick={async () => {
              const message: StateMessage = {
                date: String(dayjs()),
                action: "update",
                message: "Les équipements du logement ont été rechargés",
                component: "homeEquipments",
              };
              await handleOnRefetch(message);
            }}
          >
            <RefreshIcon />
          </Button>
          <Typography
            variant="h3"
            gutterBottom
            style={{
              fontFamily: "lato",
              marginTop: "10px",
            }}
          >
            Equipements du logement
          </Typography>
          <hr />
          {renderClientHomeEquipmentList()}
        </div>
      </Box>
    </Container>
  );
}
