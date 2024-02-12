import { useLoaderData, useNavigate, useParams } from "react-router-dom";
import { Box, Button, Container, Typography } from "@mui/material";
import dayjs from "dayjs";
import "dayjs/locale/fr";
dayjs.locale("fr");
import {
  ApiResponse,
  ClientHomeWithDependenciesApiResponse,
} from "@/layouts/types";
import { useEffect, useState } from "react";
import { COPEE_APPLI_CLIENT_HOME_WITH_DEPENDENCIES } from "@/components/store/types";
import {
  StateMessage,
  deleteMessage,
  findStateMessage,
} from "@/components/store/slices/applicationSlice";
import RefreshIcon from "@mui/icons-material/Refresh";
import { usePageLoader } from "@/layouts/dashboard/root";
import { ContextType } from "@/layouts/dashboard/types";
import { useFetchClientHomeWithDependenciesByClientQuery } from "@/components/store/api/copee/clientsHomeApiSlice";
import { filterApiResponseFromReduxErrors } from "@/components/store/functions";
import { RootState, store } from "@/components/store";
import SnackbarAction from "@/components/ui/snackbar";
import { useSelector } from "react-redux";
import { styled } from "@mui/material/styles";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import MuiAccordion, { AccordionProps } from "@mui/material/Accordion";
import MuiAccordionSummary, {
  AccordionSummaryProps,
} from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import "./index.css";

const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  "&:not(:last-child)": {
    borderBottom: 0,
  },
  "&:before": {
    display: "none",
  },
}));

const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: "0.9rem" }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === "dark"
      ? "rgba(255, 255, 255, .05)"
      : "rgba(0, 0, 0, .03)",
  flexDirection: "row-reverse",
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(90deg)",
  },
  "& .MuiAccordionSummary-content": {
    marginLeft: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: "1px solid rgba(0, 0, 0, .125)",
}));

export default function ClientHome() {
  const clientHomeApiRes: ClientHomeWithDependenciesApiResponse | undefined =
    useLoaderData() as ClientHomeWithDependenciesApiResponse;
  const [clientHomeWithDeps, setClientHomeWithDeps] =
    useState<COPEE_APPLI_CLIENT_HOME_WITH_DEPENDENCIES>();
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const params = useParams();
  const navigate = useNavigate();
  const loader: ContextType = usePageLoader();
  const { refetch } = useFetchClientHomeWithDependenciesByClientQuery({
    clientId: params.client_id ?? "",
  });
  const [actionData, setActionData] = useState<ApiResponse | undefined>();
  const token = useSelector((state: RootState) => state.auth.firebase.token);
  const messages = useSelector(
    (state: RootState) => state.application.messages
  );
  const [expanded, setExpanded] = useState<string | false>("");

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : false);
    };

  const refetchClientHome = async (refetchMessage: StateMessage | null) => {
    if (refetchMessage) {
      const clientHomeRes = await refetch();
      let apiResponse: ApiResponse | undefined;
      apiResponse = {
        message: refetchMessage.message,
        ok: true,
        status: "200",
      };
      if (clientHomeRes.error) {
        apiResponse = filterApiResponseFromReduxErrors(clientHomeRes.error);
      }
      const deleteMessageAction: {
        payload: StateMessage;
        type: "application/deleteMessage";
      } = deleteMessage(refetchMessage);
      store.dispatch(deleteMessageAction);
      console.log("clientHomeRes");
      console.log(clientHomeRes);
      if (clientHomeRes.data) {
        setClientHomeWithDeps(clientHomeRes.data);
        clientHomeApiRes.clientHome = clientHomeApiRes.clientHome;
      }
      setActionData(apiResponse);
      loader.toggleLoader(false);
    } else {
      setClientHomeWithDeps(clientHomeApiRes.clientHome);
      setActionData(clientHomeApiRes);
    }
  };

  const handleOnRefetch = async (refetchMessage: StateMessage | null) => {
    loader.toggleLoader(true);
    refetchClientHome(refetchMessage)
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
      "home"
    );
    if (token === "") {
      loader.toggleLoader(true);
    }

    (async () => {
      if (token !== "") {
        await handleOnRefetch(refetchMessage ?? null);
      }
    })();
  }, [clientHomeApiRes, messages]);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box>
        <SnackbarAction
          snackbarOpen={snackbarOpen}
          actionData={actionData}
          handleSnackBarClose={handleSnackBarClose}
        />
        <div className="client-home-container space-y-6">
          <div style={{ marginBottom: "50px", borderBottom: "1px solid" }}>
            <Button
              className="custom-button"
              style={{
                background: "rgb(59, 130, 246, 0.1)",
              }}
              onClick={async () => {
                const message: StateMessage = {
                  date: String(dayjs()),
                  action: "update",
                  message: "Le logement a été rechargé",
                  component: "home",
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
              Logement
            </Typography>
            <Button
              onClick={() => {
                navigate(`cl`);
              }}
            >
              Editer
            </Button>
          </div>
          <h4>Année de construction</h4>
          <p className="text-sm text-muted-foreground">
            {clientHomeWithDeps?.client_home?.ch_construction_year}
          </p>
          <hr />
          <h4>Nb résidents</h4>
          <p className="text-sm text-muted-foreground">
            {clientHomeWithDeps?.client_home?.ch_residents}
          </p>
          <hr />
        </div>

        <div>
          <Accordion
            expanded={expanded === "panel1"}
            onChange={handleChange("panel1")}
          >
            <AccordionSummary
              aria-controls="panel1d-content"
              id="panel1d-header"
            >
              <Typography>Coordonnées et localisation du logement</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <div className="home-detail-information-wrapper">
                <h4>Département</h4>
                <p className="text-sm text-muted-foreground">
                  {clientHomeWithDeps?.geo?.g_department}
                </p>
              </div>
              <hr />
              <div className="home-detail-information-wrapper">
                <h4>Zone</h4>
                <p className="text-sm text-muted-foreground">
                  {clientHomeWithDeps?.geo?.g_zone}
                </p>
              </div>
              <hr />
              <div className="home-detail-information-wrapper">
                <h4>Altitude</h4>
                <p className="text-sm text-muted-foreground">
                  {clientHomeWithDeps?.geo?.g_altitude}m
                </p>
              </div>
              <hr />
              <div className="home-detail-information-wrapper">
                <h4>Latitude</h4>
                <p className="text-sm text-muted-foreground">
                  {clientHomeWithDeps?.geo?.g_latitude}
                </p>
              </div>
              <hr />
              <div className="home-detail-information-wrapper">
                <h4>Longitude</h4>
                <p className="text-sm text-muted-foreground">
                  {clientHomeWithDeps?.geo?.g_longitude}
                </p>
              </div>
              <hr />
              <div className="home-detail-information-wrapper">
                <h4>Ville</h4>
                <p className="text-sm text-muted-foreground">
                  {clientHomeWithDeps?.geo?.g_city}
                </p>
              </div>
              <hr />
              <div className="home-detail-information-wrapper">
                <h4>Adresse</h4>
                <p className="text-sm text-muted-foreground">
                  {clientHomeWithDeps?.geo?.g_address}
                </p>
              </div>
              <hr />
              <div className="home-detail-information-wrapper">
                <h4>Code postal</h4>
                <p className="text-sm text-muted-foreground">
                  {clientHomeWithDeps?.geo?.g_postcode}
                </p>
              </div>
            </AccordionDetails>
          </Accordion>
          <Accordion
            expanded={expanded === "panel2"}
            onChange={handleChange("panel2")}
          >
            <AccordionSummary
              aria-controls="panel2d-content"
              id="panel2d-header"
            >
              <Typography>Caractéristiques techniques du logement</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <div className="home-detail-information-wrapper">
                <h4>Angle de la toiture</h4>
                <p className="text-sm text-muted-foreground">
                  {clientHomeWithDeps?.client_home?.ch_roof_slope}°
                </p>
              </div>
              <hr />
              <div className="home-detail-information-wrapper">
                <h4> Orientation de la toiture</h4>
                <p className="text-sm text-muted-foreground">
                  {clientHomeWithDeps?.client_home?.ch_roof_positionning}
                </p>
              </div>
              <hr />
              <div className="home-detail-information-wrapper">
                <h4>Label</h4>
                <p className="text-sm text-muted-foreground">
                  {clientHomeWithDeps?.client_home?.ch_label}
                </p>
              </div>
              <hr />
              <div className="home-detail-information-wrapper">
                <h4>Tr</h4>
                <p className="text-sm text-muted-foreground">
                  {clientHomeWithDeps?.client_home?.ch_tr}
                </p>
              </div>
              <hr />
              <div className="home-detail-information-wrapper">
                <h4>Surface</h4>
                <p className="text-sm text-muted-foreground">
                  {clientHomeWithDeps?.client_home?.ch_area}m2
                </p>
              </div>
              <hr />
              <div className="home-detail-information-wrapper">
                <h4>Hauteur sous plafond</h4>
                <p className="text-sm text-muted-foreground">
                  {clientHomeWithDeps?.client_home?.ch_huc}m
                </p>
              </div>
              <hr />
              <div className="home-detail-information-wrapper">
                <h4>Isolation</h4>
                <p className="text-sm text-muted-foreground">
                  {clientHomeWithDeps?.client_home?.ch_isolation ?? "aucune"}
                </p>
              </div>
              <hr />
            </AccordionDetails>
          </Accordion>
        </div>
      </Box>
    </Container>
  );
}
