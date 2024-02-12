import React from "react";
import ReactDOM from "react-dom/client";
import {
  createRoutesFromElements,
  createBrowserRouter,
  Route,
  RouterProvider,
} from "react-router-dom";
import "./index.css";
import CssBaseline from "@mui/material/CssBaseline";
import Signin, { action as signinAction } from "./layouts/signin/index.tsx";
import Root from "./layouts/root/index.tsx";
import Dashboard from "./layouts/dashboard/root.tsx";
import { Provider } from "react-redux";
import { store } from "./components/store";
import DashboardContainer from "./layouts/dashboard/containers/index/index.tsx";
import ClientsContainer from "./layouts/dashboard/containers/clients/index.tsx";
import InstallationsContainer from "./layouts/dashboard/containers/installations/index.tsx";
import InstallationsVersionsContainer from "./layouts/dashboard/containers/installations/versions/index.tsx";
import InstallationVersionContainer from "./layouts/dashboard/containers/installation/version/index.tsx";
import { clientsLoader } from "./layouts/dashboard/containers/clients/loader.ts";
import { loader as installationsLoader } from "./layouts/dashboard/containers/installations/loader.ts";
import { versionsByInstallationLoader } from "./layouts/dashboard/containers/installations/versions/loader.ts";
import { loader as installationVersionLoader } from "./layouts/dashboard/containers/installation/version/index.tsx";
import EditClient from "./layouts/dashboard/containers/client/edit.tsx";
import {
  editClientAction,
  deleteClientAction,
} from "./layouts/dashboard/containers/client/actions.ts";
import { loader as clientEditLoader } from "./layouts/dashboard/containers/client/edit.tsx";
import { loader as clientLoader } from "./layouts/dashboard/containers/client/loader.ts";
import { clientHomeByClientLoader } from "./layouts/dashboard/containers/client/home/loader.ts";
import { clientHomeBillsByHomeLoader } from "./layouts/dashboard/containers/client/home/bills/loader.ts";
import { loader as installationLoader } from "./layouts/dashboard/containers/installation/loader.ts";
import "./index.css";
import { AnimatePresence } from "framer-motion";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { frFR } from "@mui/material/locale";
import PrivateRoutes from "./layouts/authentication/index.tsx";
import ResetUserPassword, {
  action as ResetUserPasswordAction,
} from "./layouts/resetPassword/Request/index.tsx";
import ResetUserPasswordValidation, {
  action as resetUserPasswordValidationAction,
} from "./layouts/resetPassword/validation/index.tsx";
import Client from "./layouts/dashboard/containers/client/index.tsx";
import Installation from "./layouts/dashboard/containers/installation/index.tsx";
import ClientHome from "./layouts/dashboard/containers/client/home/index.tsx";
import ClientHomeBills from "./layouts/dashboard/containers/client/home/bills/index.tsx";
import { clientHomeEquipmentsByHomeLoader } from "./layouts/dashboard/containers/client/home/equipments/loader.ts";
import ClientHomeEquipments from "./layouts/dashboard/containers/client/home/equipments/index.tsx";
import ClientAss from "./layouts/dashboard/containers/client/ass/index.tsx";
import { clientAssListByClientLoader } from "./layouts/dashboard/containers/client/ass/loader.ts";
import Catalog from "./layouts/dashboard/containers/catalog/index.tsx";
import { catalogueLoader } from "./layouts/dashboard/containers/catalog/loader.tsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Root />}>
      <Route path="signin" element={<Signin />} action={signinAction} />
      <Route
        path="reset-password"
        element={<ResetUserPassword />}
        action={ResetUserPasswordAction}
      />
      <Route
        path="reset-password/validation"
        element={<ResetUserPasswordValidation />}
        action={resetUserPasswordValidationAction}
      />
      <Route element={<PrivateRoutes />} id="auth">
        <Route path="dashboard" element={<Dashboard />}>
          <Route index element={<DashboardContainer />} />
          <Route
            path="clients"
            element={<ClientsContainer />}
            loader={clientsLoader}
          />
          <Route
            path="clients/:client_id"
            element={<Client />}
            loader={({ params }) => clientLoader(params.client_id ?? "")}
          />
          <Route
            path="clients/:client_id/home"
            element={<ClientHome />}
            loader={({ params }) =>
              clientHomeByClientLoader(params.client_id ?? "")
            }
          />
          <Route
            path="clients/:client_id/ass"
            element={<ClientAss />}
            loader={({ params }) =>
              clientAssListByClientLoader(params.client_id ?? "")
            }
          />
          <Route
            path="clients/:client_id/home/:home_id"
            element={<ClientHome />}
            loader={({ params }) =>
              clientHomeByClientLoader(params.client_id ?? "")
            }
          />
          <Route
            path="clients/:client_id/home/:home_id/bills"
            element={<ClientHomeBills />}
            loader={({ params }) =>
              clientHomeBillsByHomeLoader(params.home_id ?? "")
            }
          />
          <Route
            path="clients/:client_id/home/:home_id/equipments"
            element={<ClientHomeEquipments />}
            loader={({ params }) =>
              clientHomeEquipmentsByHomeLoader(params.home_id ?? "")
            }
          />
          <Route
            path="clients/:client_id/edit"
            element={<EditClient />}
            action={editClientAction}
            loader={({ params }) => clientEditLoader(params.client_id ?? "")}
          />
          <Route
            path="clients/new"
            element={<EditClient />}
            action={editClientAction}
          />
          <Route
            path="clients/:client_id/delete"
            element={<EditClient />}
            action={deleteClientAction}
          />
          <Route
            path="catalogue"
            element={<Catalog />}
            loader={catalogueLoader}
          />
          <Route
            path="dossiers"
            element={<InstallationsContainer />}
            loader={installationsLoader}
          />
          <Route
            path="dossiers/:installation_id"
            element={<Installation />}
            loader={({ params }) =>
              installationLoader(params.installation_id ?? "")
            }
          />
          <Route
            path="dossiers/:installation_id/versions"
            element={<InstallationsVersionsContainer />}
            loader={({ params }) =>
              versionsByInstallationLoader(params.installation_id ?? "")
            }
          />
          <Route
            path="dossiers/:installation_id/versions/:version_id"
            element={<InstallationVersionContainer />}
            loader={({ params }) =>
              installationVersionLoader(params.version_id ?? "")
            }
          />
        </Route>
      </Route>
    </Route>
  )
);

const primary = {
  main: "#1976d2",
  light: "#42a5f5",
  dark: "#1565c0",
  contrastText: "#fff",
};

const theme = createTheme(
  {
    palette: {
      primary,
    },
  },
  frFR
);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <CssBaseline enableColorScheme />
        <AnimatePresence>
          <RouterProvider router={router} />
        </AnimatePresence>
      </Provider>
    </ThemeProvider>
  </React.StrictMode>
);
