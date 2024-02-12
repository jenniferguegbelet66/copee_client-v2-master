import { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";

export type ContextType = {
  toggleLoader: React.Dispatch<React.SetStateAction<boolean>>;
  loader: boolean;
};

export interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}
