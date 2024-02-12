import {
  COPEE_APPLI_CLIENT,
  COPEE_APPLI_INSTALLATION,
} from "@/components/store/types";
import { useLoaderData, useNavigate } from "react-router-dom";
import { Box, Button, Container, Typography } from "@mui/material";
import dayjs from "dayjs";
import "dayjs/locale/fr";
import { clientsLoader } from "../clients/loader";
import { useEffect, useState } from "react";
import { Clients } from "@/lib/Clients";

export default function Installation() {
  const install: COPEE_APPLI_INSTALLATION | undefined =
    useLoaderData() as COPEE_APPLI_INSTALLATION;
  const installCreationDate = dayjs(install?.ci_created_at);
  const [client, setClient] = useState<COPEE_APPLI_CLIENT | undefined>();
  const navigate = useNavigate();

  const getClientName = (): string | undefined => {
    if (client) {
      return `${client?.client_last_name} ${client?.client_first_name}`;
    }
  };

  useEffect(() => {
    (async () => {
      const clientsRes = await clientsLoader();
      if (clientsRes?.ok) {
        const clients: Clients = new Clients(clientsRes.clients);
        const clientFound: COPEE_APPLI_CLIENT | undefined =
          clients.findClientById(install?.ci_client_id);
        setClient(clientFound);
      }
    })();
  });

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box>
        <div className="installation-container space-y-6">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <Typography
                variant="h3"
                gutterBottom
                style={{
                  fontFamily: "lato",
                  marginTop: "10px",
                }}
              >
                dossier
              </Typography>
              <p className="text-sm text-muted-foreground">
                N°{`${install?.ci_id ?? ""}`}
              </p>
            </div>
            <Button
              onClick={() => {
                navigate(
                  `/dashboard/dossiers/${String(install?.ci_id)}/versions`
                );
              }}
            >
              Versions
            </Button>
          </div>
          <hr />
          <h4>Client</h4>
          <p className="text-sm text-muted-foreground">
            {getClientName() ? getClientName() : install?.ci_client_id}
          </p>
          <hr />
          <h4>Créé le</h4>
          <p className="text-sm text-muted-foreground">
            {String(installCreationDate.format("dddd, D MMMM YYYY")) ?? ""}
          </p>
          <hr />
        </div>
      </Box>
    </Container>
  );
}
