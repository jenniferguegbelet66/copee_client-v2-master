import { COPEE_APPLI_INSTALLATION_VERSION } from "@/components/store/types";
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
dayjs().format();

const statusTranslationTable: Map<string, string> = new Map();
statusTranslationTable.set("WAITING", "En Attente");

const getStatusTranslation = (status: string) => {
  return statusTranslationTable.get(status) ?? "";
};

export function getColumns(): ColumnDef<COPEE_APPLI_INSTALLATION_VERSION>[] {
  let submit = useSubmit();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const handleClickOpenDeleteDialog = () => {
    setOpenDeleteDialog(true);
  };

  const columns: ColumnDef<COPEE_APPLI_INSTALLATION_VERSION>[] = [
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
      accessorKey: "civ_id",
      header: () => <div className="text-center">N°</div>,
    },
    {
      accessorKey: "civ_installation_id",
      header: () => <div className="text-center">N° installation</div>,
    },
    {
      accessorKey: "civ_user_id",
      header: () => <div className="text-center">N° utilisateur</div>,
    },
    {
      accessorKey: "civ_version_number",
      header: () => <div className="text-center">N° de version</div>,
    },
    {
      accessorKey: "civ_description",
      header: () => <div className="text-center">Description</div>,
    },
    {
      accessorKey: "ci_created_at",
      header: () => <div className="text-center">Créé le</div>,
      cell: ({ cell }) => dayjs(cell.getValue() as string).format("DD/MM/YYYY"),
    },
    {
      accessorKey: "civ_updated_at",
      header: () => <div className="text-center">Date mise à jour</div>,
      cell: ({ cell }) => dayjs(cell.getValue() as string).format("DD/MM/YYYY"),
    },
    {
      accessorKey: "civ_status",
      header: () => <div className="text-center">Statut</div>,
      cell: ({ cell }) => getStatusTranslation(cell.getValue() as string),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const installationVersion = row.original;
        const path = `/dashboard/dossiers/${
          installationVersion.civ_installation_id
        }/versions/${String(installationVersion.civ_id)}`;

        return (
          <>
            <Dialog
              open={openDeleteDialog}
              onClose={handleCloseDeleteDialog}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">
                {"Suppression de la version"}
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
                      action: `/installation/delete/${installationVersion.civ_id}`,
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
