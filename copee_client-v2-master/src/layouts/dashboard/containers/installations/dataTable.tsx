"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  SortingState,
  getSortedRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
  VisibilityState,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import "./index.css";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { Link } from "react-router-dom";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [filter, setFilter] = useState<string>("ci_id");
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  // const [globalFilter, setGlobalFilter] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    // onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      // globalFilter,
      columnVisibility,
      rowSelection,
    },
  });

  interface TranslationTable {
    [key: string]: string;
  }

  const translationTable: TranslationTable = {
    ci_id: "N°",
    ci_client_id: "N° client",
    full_client_name: "Nom Client",
    ci_created_at: "date de création",
  };

  const setRowBackgroundColor = (index: number, row: any) => {
    return index % 2 === 0
      ? { background: "rgb(248,247,247)" }
      : { background: "#rgb(234,234,250)" };
  };

  const getFilterSelectMenuItems = () => {
    return table
      .getAllColumns()
      .filter((column) => {
        const id = column.id as string;
        return id !== "select" && id !== "action";
      })
      .map((column) => {
        const id = column.id as string;
        return (
          <MenuItem key={column.id} value={id}>
            {translationTable[id]}
          </MenuItem>
        );
      });
  };

  return (
    <div id="installations-table-container">
      <div className="flex items-center py-2">
        <Input
          placeholder={`Recherche par ${translationTable[filter]}`}
          value={
            (table.getColumn(`${filter}`)?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn(`${filter}`)?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <FormControl sx={{ m: 1, minWidth: 100 }}>
          <InputLabel
            id="demo-select-small-label"
            sx={{ marginTop: "-7px", marginLeft: "-10px" }}
          >
            Filtre
          </InputLabel>
          <Select
            value={filter}
            labelId="demo-select-small-label"
            onChange={(e: SelectChangeEvent) => {
              setFilter(e.target.value);
            }}
          >
            {getFilterSelectMenuItems()}
          </Select>
        </FormControl>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Colonnes
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter(
                (column) => column.getCanHide() && column.id in translationTable
              )
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {translationTable[column.id]}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="flex-1 text-sm text-muted-foreground">
        {table.getFilteredSelectedRowModel().rows.length} sur{" "}
        {table.getFilteredRowModel().rows.length} lignes(s) sélectionées.
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader id="table-header">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, index) => {
                const installationPath = `/dashboard/dossiers/${row._valuesCache.ci_id}`;
                const clientPath = `/dashboard/clients/${row._valuesCache.ci_client_id}`;
                return (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    style={setRowBackgroundColor(index, row)}
                  >
                    {row.getVisibleCells().map((cell) => {
                      return (cell.id.includes("full_client_name") &&
                        row._valuesCache.ci_client_id) ||
                        (cell.id.includes("ci_id") &&
                          row._valuesCache.ci_id) ? (
                        <TableCell key={cell.id}>
                          <Link
                            to={
                              cell.id.includes("ci_id")
                                ? installationPath
                                : clientPath
                            }
                            style={{
                              textDecoration: "underline",
                              color: "rgb(24,82,220)",
                              fontWeight: "bold",
                            }}
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </Link>
                        </TableCell>
                      ) : (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Aucun résultat.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <div className="flex items-center justify-end space-x-2 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Précédent
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Suite
          </Button>
        </div>
      </div>
    </div>
  );
}
