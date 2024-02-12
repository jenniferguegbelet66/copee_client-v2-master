import { store } from "@/components/store";
import {
  COPEE_APPLI_INSTALLATION_VERSION,
  COPEE_APPLI_USER,
} from "@/components/store/types";
import { useLoaderData } from "react-router-dom";
import { Box, Container, Typography } from "@mui/material";
import dayjs from "dayjs";
import "dayjs/locale/fr";
import { useEffect, useState } from "react";
import { installationsVersionsApi } from "@/components/store/api/copee/installationsVersionsApiSlice";
import { userLoader } from "../../user/loader";

export const loader = async (
  ivID: string
): Promise<COPEE_APPLI_INSTALLATION_VERSION | null> => {
  try {
    const installRes = await store.dispatch(
      installationsVersionsApi.endpoints.fetchInstallationVersionByID.initiate({
        ivID,
      })
    );
    return installRes.data ?? null;
  } catch (e) {
    console.log(e);
    return null;
  }
};

export default function InstallationVersion() {
  const iv: COPEE_APPLI_INSTALLATION_VERSION | undefined =
    useLoaderData() as COPEE_APPLI_INSTALLATION_VERSION;
  const ivCreationDate = dayjs(iv?.civ_created_at);
  const [user, setUser] = useState<COPEE_APPLI_USER | undefined>();
  useEffect(() => {
    (async () => {
      const userRes = await userLoader(String(iv?.civ_user_id));
      if (userRes?.ok) {
        setUser(userRes.user);
      }
    })();
  });

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box>
        <div className="installation-version-container space-y-6">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography
              variant="h3"
              gutterBottom
              style={{
                fontFamily: "lato",
                marginTop: "10px",
              }}
            >
              Version
            </Typography>
            <p className="text-sm text-muted-foreground">
              N°{`${iv?.civ_id ?? ""}`}
            </p>
          </div>
          <hr />
          <h4>Description</h4>
          <p className="text-sm text-muted-foreground">{iv?.civ_description}</p>
          <hr />
          <h4>Statut</h4>
          <p className="text-sm text-muted-foreground">{iv?.civ_status}</p>
          <hr />
          <h4>N° de version</h4>
          <p className="text-sm text-muted-foreground">
            {iv?.civ_version_number}
          </p>
          <hr />
          <h4>Utilisateur</h4>
          <p className="text-sm text-muted-foreground">
            {user
              ? `${user.user_lastname} ${user.user_firstname}`
              : iv?.civ_user_id}
          </p>
          <hr />
          <h4>Date de création</h4>
          <p className="text-sm text-muted-foreground">
            {String(ivCreationDate.format("dddd, D MMMM YYYY")) ?? ""}
          </p>
        </div>
      </Box>
    </Container>
  );
}
