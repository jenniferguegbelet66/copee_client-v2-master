import { COPEE_APPLI_CLIENT } from "@/components/store/types";
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
import { MoreHorizontal, ArrowUpDown } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Link, useSubmit } from "react-router-dom";
import Dialog from "@mui/material/Dialog";
import { useState } from "react";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import dayjs from "dayjs";
import { capitalizeFirstLetter } from "@/lib/string";
dayjs().format();

export function getColumns(): ColumnDef<COPEE_APPLI_CLIENT>[] {
  let submit = useSubmit();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const handleClickOpenDeleteDialog = () => {
    setOpenDeleteDialog(true);
  };

  const columns: ColumnDef<COPEE_APPLI_CLIENT>[] = [
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
      accessorKey: "client_id",
      header: () => <div className="text-center">id</div>,
    },
    {
      accessorKey: "client_first_name",
      header: () => <div className="text-center">Prénom</div>,
      cell: ({ cell }) => capitalizeFirstLetter(cell.getValue() as string),
    },
    {
      accessorKey: "client_last_name",
      header: () => <div className="text-center">Nom</div>,
      cell: ({ cell }) => capitalizeFirstLetter(cell.getValue() as string),
    },
    {
      accessorKey: "client_email",
      header: ({ column }) => {
        return (
          <Button
            className="button-table-sort"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <span style={{ float: "left" }}>Email</span>
            <ArrowUpDown className="ml-2 h-4 w-4" style={{ float: "right" }} />
          </Button>
        );
      },
    },
    {
      accessorKey: "client_fiscal_year_income",
      header: () => <div className="text-center">Revenu</div>,
      cell: ({ cell }) => cell.getValue() + " €",
    },
    {
      accessorKey: "client_birthdate",
      header: () => <div className="text-center">Date de naissance</div>,
      cell: ({ cell }) => {
        const date: string = dayjs(cell.getValue() as string).format(
          "DD/MM/YYYY"
        );
        return date === "Invalid date" ? "date invalide" : date;
      },
    },
    {
      accessorKey: "client_date_created",
      header: () => <div className="text-center">Date de création</div>,
      cell: ({ cell }) => dayjs(cell.getValue() as string).format("DD/MM/YYYY"),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const client = row.original;
        const editPath = `/dashboard/clients/${String(client.client_id)}/edit`;
        const getPath = `/dashboard/clients/${String(client.client_id)}`;

        return (
          <>
            <Dialog
              open={openDeleteDialog}
              onClose={handleCloseDeleteDialog}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">
                {"Suppression du client"}
              </DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  Souhaitez vous réellement supprimer ce client? Attention La
                  suppression du client entrainera la suppression de
                  l'installation liée à ce dernier!
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseDeleteDialog}>Non</Button>
                <Button
                  onClick={() => {
                    submit(null, {
                      method: "delete",
                      action: `/dashboard/clients/${client.client_id}/delete`,
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
                  <Link
                    to={getPath}
                    style={{ width: "100%", display: "block" }}
                  >
                    Consulter
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link
                    to={editPath}
                    style={{ width: "100%", display: "block" }}
                  >
                    Editer
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

// const handleDeleteRow = useCallback(
//   (row: MRT_Row<COPEE_APPLI_CLIENT>) => {
//     if (
//       !confirm(
//         `Êtes vous sur de vouloir supprimer le client ${row.getValue(
//           "client_id"
//         )}`
//       )
//     ) {
//       return;
//     }
//     //send api delete request here, then refetch or update local table data for re-render
//     setTableData([...tableData]);
//   },
//   [tableData]
// );
