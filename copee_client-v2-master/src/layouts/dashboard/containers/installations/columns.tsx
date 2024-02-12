import { ColumnDef } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Link, useSubmit } from "react-router-dom";
import Dialog from "@mui/material/Dialog";
import { useState } from "react";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import dayjs from "dayjs";
import { InstallationData } from "./types";
dayjs().format();

export function getColumns(): ColumnDef<InstallationData>[] {
  let submit = useSubmit();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const handleClickOpenDeleteDialog = () => {
    setOpenDeleteDialog(true);
  };

  const columns: ColumnDef<InstallationData>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "ci_id",
      header: () => <div className="text-center">N°</div>,
    },
    {
      accessorKey: "ci_client_id",
      header: () => <div className="text-center">N° client</div>,
    },
    {
      accessorKey: "full_client_name",
      header: () => <div className="text-center">Nom Client</div>,
    },
    {
      accessorKey: "ci_created_at",
      header: () => <div className="text-center">Date de création</div>,
      cell: ({ cell }) => dayjs(cell.getValue() as string).format("DD/MM/YYYY"),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const installation: InstallationData = row.original;
        let path: string = "";
        if (installation && "ci_id" in installation) {
          path = `/dashboard/dossiers/${String(installation?.ci_id)}/versions`;
        }

        return (
          <>
            <Dialog
              open={openDeleteDialog}
              onClose={handleCloseDeleteDialog}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">
                {"Suppression de l'installation"}
              </DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  Souhaitez vous réellement supprimer cette installation? Toute
                  suppression est définitive!
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseDeleteDialog}>Non</Button>
                <Button
                  onClick={() => {
                    submit(null, {
                      method: "delete",
                      // action: `/installation/delete/${installation.ci_id}`,
                    });
                    handleCloseDeleteDialog();
                  }}
                  autoFocus
                >
                  Oui
                </Button>
              </DialogActions>
            </Dialog>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link to={path} style={{ width: "100%", display: "block" }}>
                    Consulter
                    {/* <EditIcon /> */}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span
                    className="danger"
                    onClick={handleClickOpenDeleteDialog}
                  >
                    Supprimer
                  </span>
                  {/* <DeleteIcon /> */}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        );
      },
    },
  ];
  return columns;
}
