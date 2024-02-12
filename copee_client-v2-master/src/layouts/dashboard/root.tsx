import * as React from "react";
import { styled, useTheme, alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import LogoutIcon from "@mui/icons-material/Logout";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import {
  Link,
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";
import PeopleIcon from "@mui/icons-material/People";
import InputBase from "@mui/material/InputBase";
import { useOutletContext } from "react-router-dom";
import { Grid, LinearProgress } from "@mui/material";
import { AppBarProps, ContextType } from "./types";
import "./index.css";
import { useEffect } from "react";
import Logo from "../../components/ui/logo";
import { handleLogout } from "@/lib/logout";
import { AccountBox, Folder, Settings, Dashboard } from "@mui/icons-material";
import Catalog from "./containers/catalog";

const drawerWidth = 240;

export function usePageLoader() {
  return useOutletContext<ContextType>();
}

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha("#ccc", 0.15),
  "&:hover": {
    backgroundColor: alpha("#ccc", 0.25),
  },
  borderStartEndRadius: 10,
  borderEndEndRadius: 10,
  borderTopLeftRadius: 10,
  borderTopRightRadius: 10,
  borderBottomLeftRadius: 10,
  borderBottomRightRadius: 10,
  border: "1px solid #ccc",
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

export default function DashboardPanel() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [loader, toggleLoader] = React.useState<boolean>(false);
  const urlRoutes: string[] = ["Dashboard", "Clients", "Dossiers", "Catalogue"];
  const location = useLocation();
  const navigate = useNavigate();
  const pathname = location.pathname;

  const buildBreadcrumbs = (): JSX.Element[] => {
    const pathNameSplited = pathname.split("/");
    const pathNameFiltered = pathNameSplited.filter((pathName) => {
      return pathName !== "" && pathName !== "new";
    });
    const translatePathName = (pathName: string) => {
      if (pathName === "bills") {
        return "factures";
      }
      if (pathName === "home") {
        return "logement";
      }
      if (pathName === "ass") {
        return "sav";
      }
      return pathName;
    };

    if (pathNameFiltered) {
      let path = "";
      const pathNameSplitedLen = pathNameFiltered.length;
      if (pathNameSplitedLen > 0 && pathNameSplitedLen < 2) {
        return [
          <React.Fragment key={"0"}>{pathNameSplited[0]}</React.Fragment>,
        ];
      }
      return pathNameFiltered.map((pathName, index) => {
        path = `${path}/${pathName}`;
        const link = (
          <Link to={path} style={{ color: "rgb(24,82,220)" }}>
            {translatePathName(pathName.toLocaleLowerCase())}
          </Link>
        );
        if (!pathName.includes("dashboard")) {
          return (
            <span key={index}>
              {" / "}
              {index === pathNameFiltered.length - 1
                ? translatePathName(pathName)
                : link}
              &nbsp;
            </span>
          );
        }
        return <span key={index}>{link} &nbsp;</span>;
      });
    }
    return [];
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (location.pathname === "/dashboard") {
      toggleLoader(false);
    }
  }, [location.pathname]);

  return (
    <Box sx={{ display: "flex", width: "100%" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        open={open}
        sx={{ backgroundColor: "white", color: "black" }}
      >
        <Toolbar>
          <Grid item sx={{ marginRight: "30px" }}>
            <Link to="#">
              <Logo />
            </Link>
          </Grid>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: "none" }) }}
          >
            <MenuIcon />
          </IconButton>
          {buildBreadcrumbs()}
          {/* <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ "aria-label": "search" }}
            />
          </Search> */}
        </Toolbar>
        {loader ? <LinearProgress /> : <></>}
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "ltr" ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {urlRoutes.map((text, index) => (
            <ListItem key={text} disablePadding>
              <NavLink
                style={{ width: "100%", display: "block" }}
                onClick={() => toggleLoader(true)}
                to={index === 0 ? "" : text}
                key={text}
                className={({ isActive, isPending }) => {
                  {
                    if (
                      location.pathname != "/dashboard" &&
                      text == "Dashboard"
                    ) {
                      return "unactive";
                    }
                    return isActive
                      ? "active"
                      : isPending
                      ? "pending"
                      : "unactive";
                  }
                }}
              >
                <ListItemButton>
                  <ListItemIcon>
                    {text === "Clients" ? (
                      <PeopleIcon />
                    ) : text === "Dossiers" ? (
                      <Folder />
                    ) : text === "Dashboard" ? (
                      <Dashboard />
                    ) : text === "Catalogue" ? (
                      <Dashboard />
                    ) : (
                      <></>
                    )}
                  </ListItemIcon>
                  <ListItemText>
                    <Typography
                      fontSize={"0.875rem"}
                      fontWeight={"400"}
                      lineHeight={"1.334em"}
                      fontFamily={"Roboto, sans-serif"}
                    >
                      {text}
                    </Typography>
                  </ListItemText>
                </ListItemButton>
              </NavLink>
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          <ListItem key={"profile"} disablePadding>
            <ListItemButton
              onClick={() => {
                handleLogout();
                navigate("/profile");
              }}
            >
              <ListItemIcon>
                <AccountBox />
              </ListItemIcon>
              <ListItemText>
                <Typography
                  fontSize={"0.875rem"}
                  fontWeight={"400"}
                  lineHeight={"1.334em"}
                  fontFamily={"Roboto, sans-serif"}
                >
                  Profil
                </Typography>
              </ListItemText>
            </ListItemButton>
          </ListItem>
          <ListItem key={"settings"} disablePadding>
            <ListItemButton
              onClick={() => {
                handleLogout();
                navigate("/settings");
              }}
            >
              <ListItemIcon>
                <Settings />
              </ListItemIcon>
              <ListItemText>
                <Typography
                  fontSize={"0.875rem"}
                  fontWeight={"400"}
                  lineHeight={"1.334em"}
                  fontFamily={"Roboto, sans-serif"}
                >
                  Paramètres
                </Typography>
              </ListItemText>
            </ListItemButton>
          </ListItem>
          <ListItem key={"logout"} disablePadding>
            <ListItemButton
              onClick={() => {
                handleLogout();
                navigate("/signin");
              }}
            >
              <ListItemIcon>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText>
                <Typography
                  fontSize={"0.875rem"}
                  fontWeight={"400"}
                  lineHeight={"1.334em"}
                  fontFamily={"Roboto, sans-serif"}
                >
                  Se déconnecter
                </Typography>
              </ListItemText>
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
      <Main open={open} className="main">
        <Outlet context={{ toggleLoader, loader } satisfies ContextType} />
      </Main>
    </Box>
  );
}
