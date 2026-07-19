import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Pencil, Trash2, Eye } from "lucide-react";

import { ClientDataTable } from "./ClientDataTable";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Project = {
  id: string;
  name: string;
  environment: "Production" | "Staging" | "Development";
  status: "Active" | "Inactive";
};

const data: Project[] = [
  {
    id: "1",
    name: "Sentinel",
    environment: "Production",
    status: "Active",
  },
  {
    id: "2",
    name: "Billing Service",
    environment: "Staging",
    status: "Active",
  },
  {
    id: "3",
    name: "Auth Service",
    environment: "Development",
    status: "Inactive",
  },
  {
    id: "4",
    name: "Payments",
    environment: "Production",
    status: "Active",
  },
];

const columns: ColumnDef<Project>[] = [
  {
    accessorKey: "name",
    header: "Project",
  },
  {
    accessorKey: "environment",
    header: "Environment",
    meta: {
      filter: {
        type: "select",
        options: [
          { label: "Production", value: "Production" },
          { label: "Staging", value: "Staging" },
          { label: "Development", value: "Development" },
        ],
      },
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    meta: {
      filter: {
        type: "select",
        options: [
          { label: "Active", value: "Active" },
          { label: "Inactive", value: "Inactive" },
        ],
      },
    },
    cell: ({ row }) => (
      <Badge variant={row.original.status === "Active" ? "default" : "secondary"}>
        {row.original.status}
      </Badge>
    ),
  },
  {
    id: "actions",
    header: "",
    enableSorting: false,
    enableHiding: false,
    cell: () => (
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuItem>
            <Eye className="mr-2 h-4 w-4" />
            View
          </DropdownMenuItem>

          <DropdownMenuItem>
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>

          <DropdownMenuItem className="text-destructive">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

export default function ExampleDatatable() {
  return <ClientDataTable data={data} columns={columns} emptyMessage="No projects found." />;
}
