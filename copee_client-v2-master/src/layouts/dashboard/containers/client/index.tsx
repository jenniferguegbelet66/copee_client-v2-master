import { Link, useLoaderData, useNavigate } from "react-router-dom";
import {
  Avatar,
  Box,
  Button,
  Container,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import dayjs from "dayjs";
import "dayjs/locale/fr";
dayjs.locale("fr");
import "./index.css";
import Home from "@mui/icons-material/Home";
import RequestQuoteOutlinedIcon from "@mui/icons-material/RequestQuoteOutlined";
import ConstructionOutlinedIcon from "@mui/icons-material/ConstructionOutlined";
import AddBusinessIcon from "@mui/icons-material/AddBusiness";
import { ClientsWithDependenciesApiResponse } from "@/layouts/types";
import { useEffect, useState } from "react";
import {
  COPEE_APPLI_CLIENT,
  COPEE_APPLI_CLIENT_WITH_DEPENDENCIES,
} from "@/components/store/types";
import React from "react";

export default function Client() {
  const clientApiRes: ClientsWithDependenciesApiResponse | undefined =
    useLoaderData() as ClientsWithDependenciesApiResponse;
  const [client, setClient] = useState<COPEE_APPLI_CLIENT>();
  const [clientHomePath, setClientHomePath] = useState<string>("");
  const [clientHomeBillPath, setClientHomeBillPath] = useState<string>("");
  const [clientHomeEqmtPath, setClientHomeEqmtPath] = useState<string>("");
  const [clientAssPath, setClientAssPath] = useState<string>("");
  const [clientInstallPath, setClientInstallPath] = useState<string>("");
  const [clientBirthdate, setClientBirthDate] = useState<dayjs.Dayjs>();
  const [clientCreationDate, setClientCreationDate] = useState<dayjs.Dayjs>();
  const [clientWithDependencies, setClientWithDependencies] = useState<
    COPEE_APPLI_CLIENT_WITH_DEPENDENCIES | undefined
  >();
  const navigate = useNavigate();
  const basePath = "/dashboard";
  const [actions, setActions] = useState<
    {
      icon: JSX.Element;
      name: string;
    }[]
  >([]);
  const homeAction = { icon: <Home />, name: "Logement" };
  const billAction = { icon: <RequestQuoteOutlinedIcon />, name: "Factures" };
  const equipmentAction = {
    icon: <ConstructionOutlinedIcon />,
    name: "Equipements",
  };
  const installationAction = { icon: <AddBusinessIcon />, name: "Dossier" };
  const assAction = { icon: <AddBusinessIcon />, name: "SAV" };
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    if (clientApiRes.ok) {
      setClientWithDependencies(clientApiRes.clientWithDependencies);

      const newActions: {
        icon: JSX.Element;
        name: string;
      }[] = [];
      const birhtdate: string =
        clientApiRes.clientWithDependencies?.client.client_birthdate ?? "";
      const dayBirthdate: dayjs.Dayjs = dayjs(birhtdate);
      const clientCreationDate: dayjs.Dayjs = dayjs(
        client?.client_date_created
      );
      setClientCreationDate(clientCreationDate);
      setClientBirthDate(dayBirthdate);
      setClient(clientApiRes.clientWithDependencies?.client);
      if (clientApiRes.clientWithDependencies?.client_home) {
        setClientHomePath(
          `${basePath}/clients/${clientApiRes.clientWithDependencies.client_home.ch_id}/home`
        );
      } else {
        newActions.push(homeAction);
      }
      if (clientApiRes.clientWithDependencies?.client_home_bill) {
        setClientHomeBillPath(
          `${basePath}/clients/${clientApiRes.clientWithDependencies.client.client_id}/home/${clientApiRes.clientWithDependencies.client_home?.ch_id}/bills`
        );
      } else {
        newActions.push(billAction);
      }
      if (clientApiRes.clientWithDependencies?.client_home_equipment) {
        setClientHomeEqmtPath(
          `${basePath}/clients/${clientApiRes.clientWithDependencies?.client.client_id}/home/${clientApiRes.clientWithDependencies?.client_home?.ch_id}/equipments`
        );
      } else {
        newActions.push(equipmentAction);
      }
      if (clientApiRes.clientWithDependencies?.client_ass) {
        setClientAssPath(
          `${basePath}/clients/${clientApiRes.clientWithDependencies?.client.client_id}/ass`
        );
      } else {
        newActions.push(assAction);
      }
      if (clientApiRes.clientWithDependencies?.client_installation) {
        setClientInstallPath(
          `${basePath}/dossiers/${clientApiRes.clientWithDependencies?.client_installation?.ci_id}/versions`
        );
      } else {
        newActions.push(installationAction);
      }
      setActions(newActions);
    }
  }, [clientApiRes]);

  return (
    <Container
      maxWidth="lg"
      sx={{
        mt: 4,
        mb: 4,
        display: "flex",
        flexDirection: isSmallScreen ? "column-reverse" : "row",
        alignItems: "center",
      }}
    >
      {actions.length > 0 ? (
        <SpeedDial
          ariaLabel="client speed dial"
          sx={{ position: "absolute", bottom: 16, right: 16 }}
          icon={<SpeedDialIcon />}
        >
          {actions.map((action) => (
            <SpeedDialAction
              key={action.name}
              icon={action.icon}
              tooltipTitle={action.name}
              onClick={() => {
                switch (action.name) {
                  case "Logement":
                    break;
                  case "Dossier":
                    break;
                  case "Factures":
                    break;
                  case "Equipements":
                    break;
                  case "SAV":
                    break;
                }
              }}
            />
          ))}
        </SpeedDial>
      ) : (
        <></>
      )}
      <List
        sx={{
          bgcolor: "background.paper",
          width: isSmallScreen ? "100%" : 300,
          maxWidth: isSmallScreen ? "100%" : 300,
          marginTop: isSmallScreen ? "60px" : 0,
        }}
      >
        <Typography variant="h5" color="text.primary">
          Options client
        </Typography>
        <hr />
        <ListItem alignItems="flex-start">
          <ListItemAvatar>
            <Avatar alt="Remy Sharp" src="" />
          </ListItemAvatar>
          <ListItemText
            primary="Dossier"
            secondary={
              <React.Fragment>
                {clientWithDependencies?.client_installation ? (
                  <Link to={clientInstallPath}>
                    <Typography
                      sx={{ display: "inline" }}
                      component="span"
                      variant="body2"
                      color="text.primary"
                    >
                      Consulter
                    </Typography>
                    {" — Les installations ..."}
                  </Link>
                ) : (
                  "Aucune installation créée"
                )}
              </React.Fragment>
            }
          />
        </ListItem>
        <Divider variant="inset" component="li" />
        <ListItem alignItems="flex-start">
          <ListItemAvatar>
            <Avatar alt="Remy Sharp" src="" />
          </ListItemAvatar>
          <ListItemText
            primary="Logement"
            secondary={
              <React.Fragment>
                {clientWithDependencies?.client_home ? (
                  <Link to={clientHomePath}>
                    <Typography
                      sx={{ display: "inline" }}
                      component="span"
                      variant="body2"
                      color="text.primary"
                    >
                      Consulter
                    </Typography>
                    {" — Logement ..."}
                  </Link>
                ) : (
                  "Aucun logement créé"
                )}
              </React.Fragment>
            }
          />
        </ListItem>
        <Divider variant="inset" component="li" />
        <ListItem alignItems="flex-start">
          <ListItemAvatar>
            <Avatar alt="Remy Sharp" src="" />
          </ListItemAvatar>
          <ListItemText
            primary="Factures"
            secondary={
              <React.Fragment>
                {clientWithDependencies?.client_home_bill ? (
                  <Link to={clientHomeBillPath}>
                    <Typography
                      sx={{ display: "inline" }}
                      component="span"
                      variant="body2"
                      color="text.primary"
                    >
                      Consulter
                    </Typography>
                    {" — Factures énérgétiques ..."}
                  </Link>
                ) : (
                  "Aucune facture encore enregistrée"
                )}
              </React.Fragment>
            }
          />
        </ListItem>
        <Divider variant="inset" component="li" />
        <ListItem alignItems="flex-start">
          <ListItemAvatar>
            <Avatar alt="Remy Sharp" src="" />
          </ListItemAvatar>
          <ListItemText
            primary="Equipements"
            secondary={
              <React.Fragment>
                {clientWithDependencies?.client_home_equipment ? (
                  <Link to={clientHomeEqmtPath}>
                    <Typography
                      sx={{ display: "inline" }}
                      component="span"
                      variant="body2"
                      color="text.primary"
                    >
                      Consulter
                    </Typography>
                    {" — Piscine, sauna, jacuzzi..."}
                  </Link>
                ) : (
                  "Aucun équipement enregistré"
                )}
              </React.Fragment>
            }
          />
        </ListItem>
        <Divider variant="inset" component="li" />
        <ListItem alignItems="flex-start">
          <ListItemAvatar>
            <Avatar alt="Remy Sharp" src="" />
          </ListItemAvatar>
          <ListItemText
            primary="SAV"
            secondary={
              <React.Fragment>
                {clientWithDependencies?.client_ass ? (
                  <Link to={clientAssPath}>
                    <Typography
                      sx={{ display: "inline" }}
                      component="span"
                      variant="body2"
                      color="text.primary"
                    >
                      Consulter
                    </Typography>
                    {" — Service après vente ..."}
                  </Link>
                ) : (
                  <>
                    Pas de SAV enregistré{" "}
                    <Button onClick={() => {}}>Créer</Button>
                  </>
                )}
              </React.Fragment>
            }
          />
        </ListItem>
      </List>
      <Box
        sx={{
          textAlign: "center",
          mx: "auto",
        }}
      >
        <div
          className="client-container space-y-6"
          style={{ marginLeft: "100px" }}
        >
          <div style={{ marginBottom: "50px", borderBottom: "1px solid" }}>
            <Typography
              variant="h3"
              gutterBottom
              style={{
                fontFamily: "lato",
                marginTop: "10px",
              }}
            >
              Client
            </Typography>
            <p className="text-muted-foreground">
              {`${client?.client_last_name ?? ""} ${
                client?.client_first_name ?? ""
              }`}
            </p>
            <p className="text-sm text-muted-foreground">
              Créé le:{" "}
              {String(clientCreationDate?.format("dddd, D MMMM YYYY")) ?? ""}
            </p>
            <Button
              onClick={() => {
                navigate(
                  `/dashboard/clients/${String(client?.client_id)}/edit`
                );
              }}
            >
              Editer
            </Button>
          </div>
          <h4>Adresse mail</h4>
          <p className="text-sm text-muted-foreground">
            {client?.client_email}
          </p>
          <hr />
          <h4>Né le</h4>
          <p className="text-sm text-muted-foreground">
            {String(clientBirthdate?.format("dddd, D MMMM YYYY")) ?? ""}
          </p>
          <hr />
          <h4>Téléphone</h4>
          <p className="text-sm text-muted-foreground">
            {client?.client_phone}
          </p>
          <hr />
          <h4>Revenu fiscal de référence</h4>
          <p className="text-sm text-muted-foreground">
            {client?.client_fiscal_year_income}€
          </p>
        </div>
      </Box>
    </Container>
  );
}
