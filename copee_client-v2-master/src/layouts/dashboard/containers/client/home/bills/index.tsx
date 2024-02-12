import { useLoaderData, useNavigate, useParams } from "react-router-dom";
import {
  Avatar,
  Box,
  Button,
  Container,
  Divider,
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import "dayjs/locale/fr";
dayjs.locale("fr");
import { ApiResponse, ClientHomeBillsApiResponse } from "@/layouts/types";
import { useEffect, useState } from "react";
import { COPEE_APPLI_CLIENT_HOME_BILLS } from "@/components/store/types";
import {
  StateMessage,
  deleteMessage,
  findStateMessage,
} from "@/components/store/slices/applicationSlice";
import { usePageLoader } from "@/layouts/dashboard/root";
import { ContextType } from "@/layouts/dashboard/types";
import { useFetchClientHomeBillByHomeQuery } from "@/components/store/api/copee/clientsHomeBillApiSlice";
import { filterApiResponseFromReduxErrors } from "@/components/store/functions";
import { RootState, store } from "@/components/store";
import SnackbarAction from "@/components/ui/snackbar";
import { useSelector } from "react-redux";
import RefreshIcon from "@mui/icons-material/Refresh";
import React from "react";
import ElectricBoltIcon from "@mui/icons-material/ElectricBolt";
import PropaneTankIcon from "@mui/icons-material/PropaneTank";
import OilBarrel from "@mui/icons-material/OilBarrel";
import GasMeter from "@mui/icons-material/GasMeter";
import Forest from "@mui/icons-material/Forest";

export default function ClientHomeBills() {
  const clientHomeBillsApiRes: ClientHomeBillsApiResponse | undefined =
    useLoaderData() as ClientHomeBillsApiResponse;
  const [clientHomeBills, setClientHomeBills] =
    useState<COPEE_APPLI_CLIENT_HOME_BILLS>();
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const params = useParams();
  const navigate = useNavigate();
  const loader: ContextType = usePageLoader();
  const { refetch } = useFetchClientHomeBillByHomeQuery({
    homeID: params.home_id ?? "",
  });
  const [actionData, setActionData] = useState<ApiResponse | undefined>();
  const token = useSelector((state: RootState) => state.auth.firebase.token);
  const messages = useSelector(
    (state: RootState) => state.application.messages
  );
  const [year, setYear] = useState<number>(dayjs().year());

  const refetchClientHomeBills = async (
    refetchMessage: StateMessage | null
  ) => {
    if (refetchMessage) {
      const clientHomeBillRes = await refetch();
      let apiResponse: ApiResponse | undefined;
      apiResponse = {
        message: refetchMessage.message,
        ok: true,
        status: "200",
      };
      if (clientHomeBillRes.error) {
        apiResponse = filterApiResponseFromReduxErrors(clientHomeBillRes.error);
      }
      const deleteMessageAction: {
        payload: StateMessage;
        type: "application/deleteMessage";
      } = deleteMessage(refetchMessage);
      store.dispatch(deleteMessageAction);
      if (clientHomeBillRes.data) {
        setClientHomeBills(clientHomeBillRes.data);
        clientHomeBillsApiRes.clientHomeBills =
          clientHomeBillsApiRes?.clientHomeBills;
      }
      setActionData(apiResponse);
      loader.toggleLoader(false);
    } else {
      setClientHomeBills(clientHomeBillsApiRes.clientHomeBills);
      setActionData(clientHomeBillsApiRes);
    }
  };

  const handleOnRefetch = async (refetchMessage: StateMessage | null) => {
    loader.toggleLoader(true);
    refetchClientHomeBills(refetchMessage)
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
      "homeBills"
    );
    if (token === "") {
      loader.toggleLoader(true);
    }

    (async () => {
      if (token !== "") {
        await handleOnRefetch(refetchMessage ?? null);
      }
    })();
  }, [clientHomeBillsApiRes, messages]);

  const handleChangeYear = () => {
    console.log("change year");
  };
  return (
    <Container
      maxWidth="lg"
      sx={{ mt: 4, mb: 4, display: "flex", justifyContent: "center" }}
    >
      <Box>
        <SnackbarAction
          snackbarOpen={snackbarOpen}
          actionData={actionData}
          handleSnackBarClose={handleSnackBarClose}
        />
        <div className="client-home-bills-container space-y-6">
          <Button
            className="custom-button"
            style={{
              background: "rgb(59, 130, 246, 0.1)",
            }}
            onClick={async () => {
              const message: StateMessage = {
                date: String(dayjs()),
                action: "update",
                message: "Les factures du logement ont été rechargées",
                component: "bills",
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
            Factures
          </Typography>
          <Button
            onClick={() => {
              navigate(``);
            }}
          >
            Editer
          </Button>

          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Année</InputLabel>
            <Select
              labelId="year-select-label"
              value={year}
              label="Year"
              onChange={handleChangeYear}
            >
              <MenuItem value={year}>{year}</MenuItem>
              <MenuItem value={year - 1}>{year - 1}</MenuItem>
              <MenuItem value={year - 2}>{year - 2}</MenuItem>
            </Select>
          </FormControl>

          <List
            sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
          >
            <ListItem alignItems="flex-start">
              <ListItemAvatar>
                <ElectricBoltIcon />
              </ListItemAvatar>
              <ListItemText
                primary="Electricité"
                secondary={
                  <React.Fragment>
                    <Typography
                      sx={{ display: "inline" }}
                      component="span"
                      variant="body2"
                      color="text.primary"
                    >
                      {clientHomeBills?.chb_electricity ?? 0}€
                    </Typography>
                    {clientHomeBills?.chb_electricity
                      ? clientHomeBills.chb_electricity <= 0
                        ? " (pas de consommation d'électricité)"
                        : ""
                      : " (pas de consommation d'électricité)"}
                  </React.Fragment>
                }
              />
            </ListItem>
            <Divider variant="inset" component="li" />
            <ListItem alignItems="flex-start">
              <ListItemAvatar>
                <GasMeter />
              </ListItemAvatar>
              <ListItemText
                primary="Gaz naturel"
                secondary={
                  <React.Fragment>
                    <Typography
                      sx={{ display: "inline" }}
                      component="span"
                      variant="body2"
                      color="text.primary"
                    >
                      {clientHomeBills?.chb_natural_gas ?? 0}€
                    </Typography>
                    {clientHomeBills?.chb_natural_gas
                      ? clientHomeBills.chb_natural_gas <= 0
                        ? " (pas de consommation de gaz naturel)"
                        : ""
                      : " (pas de consommation de gaz naturel)"}
                  </React.Fragment>
                }
              />
            </ListItem>
            <Divider variant="inset" component="li" />
            <ListItem alignItems="flex-start">
              <ListItemAvatar>
                <PropaneTankIcon />
              </ListItemAvatar>
              <ListItemText
                primary="Gaz propane"
                secondary={
                  <React.Fragment>
                    <Typography
                      sx={{ display: "inline" }}
                      component="span"
                      variant="body2"
                      color="text.primary"
                    >
                      {clientHomeBills?.chb_propane_gas ?? 0}€
                    </Typography>
                    {clientHomeBills?.chb_propane_gas
                      ? clientHomeBills.chb_propane_gas <= 0
                        ? " (pas de consommation de gaz propane)"
                        : ""
                      : " (pas de consommation de gaz propane)"}
                  </React.Fragment>
                }
              />
            </ListItem>
            <Divider variant="inset" component="li" />
            <ListItem alignItems="flex-start">
              <ListItemAvatar>
                <Forest />
              </ListItemAvatar>
              <ListItemText
                primary="Bois"
                secondary={
                  <React.Fragment>
                    <Typography
                      sx={{ display: "inline" }}
                      component="span"
                      variant="body2"
                      color="text.primary"
                    >
                      {clientHomeBills?.chb_wood ?? 0}€
                    </Typography>
                    {clientHomeBills?.chb_wood
                      ? clientHomeBills.chb_wood <= 0
                        ? " (pas de consommation de bois)"
                        : ""
                      : " (pas de consommation de bois)"}
                  </React.Fragment>
                }
              />
            </ListItem>
            <Divider variant="inset" component="li" />
            <ListItem alignItems="flex-start">
              <ListItemAvatar>
                <OilBarrel />
              </ListItemAvatar>
              <ListItemText
                primary="Fuel"
                secondary={
                  <React.Fragment>
                    <Typography
                      sx={{ display: "inline" }}
                      component="span"
                      variant="body2"
                      color="text.primary"
                    >
                      {clientHomeBills?.chb_heating_oil}€
                    </Typography>
                    {clientHomeBills?.chb_heating_oil
                      ? clientHomeBills.chb_heating_oil <= 0
                        ? " (pas de consommation de fuel)"
                        : ""
                      : " (pas de consommation de fuel)"}
                  </React.Fragment>
                }
              />
            </ListItem>
          </List>
        </div>
      </Box>
    </Container>
  );
}
