import Checking from "@/components/ui/checking";
import {
  ListSubheader,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  List,
} from "@mui/material";
import { SendIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

export type ClientPaths = {
  clientInstallPath: string;
  clientHomePath: string;
  clientAssPath: string;
  clientHomeBillPath: string;
  clientHomeEqmtPath: string;
};

export interface ClientOptionsProps {
  paths: ClientPaths;
}

const ClientOptions: React.FC<ClientOptionsProps> = ({ paths }) => {
  const navigate = useNavigate();

  return (
    <>
      <List
        sx={{
          width: "100%",
          maxWidth: 360,
          bgcolor: "#fdfdfd",
          margin: "0 auto",
          border: "1px solid #dddddd",
        }}
        component="nav"
        aria-labelledby="nested-list-subheader"
        subheader={
          <ListSubheader component="div" id="nested-list-subheader">
            Options
          </ListSubheader>
        }
      >
        <ListItemButton>
          <ListItemIcon>
            <SendIcon />
          </ListItemIcon>
          <ListItemText
            primary="Dossier"
            onClick={() => {
              navigate(paths.clientInstallPath);
            }}
          ></ListItemText>
        </ListItemButton>
        <ListItemButton>
          <ListItemIcon>
            <SendIcon />
          </ListItemIcon>
          <ListItemText
            primary="Logement"
            onClick={() => {
              navigate(paths.clientHomePath);
            }}
          ></ListItemText>
        </ListItemButton>
        <ListItemButton>
          <ListItemIcon>
            <SendIcon />
          </ListItemIcon>
          <ListItemText primary="SAV">
            <Checking
              title="SAV"
              path={paths.clientAssPath}
              message="Aucun sav en cours"
            />
          </ListItemText>
        </ListItemButton>
        <ListItemButton>
          <ListItemIcon>
            <SendIcon />
          </ListItemIcon>
          <ListItemText primary="Factures énergétiques">
            <Checking
              title="Factures énergétiques"
              path={paths.clientHomeBillPath}
              message="Aucun sav en cours"
            />
          </ListItemText>
        </ListItemButton>
        <ListItemButton>
          <ListItemIcon>
            <SendIcon />
          </ListItemIcon>
          <ListItemText primary="Equipements">
            <Checking
              title="Equipements"
              path={paths.clientHomeEqmtPath}
              message="Aucun sav en cours"
            />
          </ListItemText>
        </ListItemButton>
      </List>
    </>
  );
};

export default ClientOptions;
