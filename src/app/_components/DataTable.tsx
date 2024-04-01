'use client';

import {CaretSortIcon, ChevronDownIcon, DotsHorizontalIcon, PlusIcon} from "@radix-ui/react-icons";
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable
} from "@tanstack/react-table";
import {Button} from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

import {useQuery} from "convex/react";
import {api} from "../../../convex/_generated/api";
import {useRouter} from "next/navigation";
import Link from "next/link";
import {Input} from "@/components/ui/input";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {IconButton} from "@radix-ui/themes";
import {useMemo, useState} from "react";
import {Badge} from "@/components/ui/badge";
import * as React from "react";
import {DownloadMedicalReport} from "@/app/_components/DownloadMedicalReport";
import {Doc, Id} from "../../../convex/_generated/dataModel";


type PredictionResult = {
    _id: Id<'records'>,
    _creationTime: number;
    risk: number;
    conditionStatus: "deteriorated" | "still" | "improved"
};

const getRiskBadgeClass = (risk: unknown) => {
    if (typeof risk === 'number') {
        if (risk > 70) return 'bg-red-500';    // Red for high risk
        if (risk > 30) return 'bg-yellow-500'; // Yellow for moderate risk
        return 'bg-green-500';                // Green for low risk
    }
    // Handle the case where risk is not a number
    console.error('Invalid risk value:', risk);
    return 'bg-gray-500'; // Default or error case
};


export const columns: ColumnDef<Doc<'records'>>[] = [
    {
        accessorKey: '_id',
        meta: 'ID',
        header: 'ID',
        cell: ({row}) => <div>{row.getValue('_id')}</div>,
    },
    {
        accessorKey: '_creationTime',
        meta: 'Record At',
        header: ({column}) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                Recorded At
                <CaretSortIcon className="ml-2 h-4 w-4"/>
            </Button>
        ),
        cell: ({row}) => {
            const timestamp = row.getValue('_creationTime'); // Unix timestamp in milliseconds
            const dateTime = new Date(timestamp as number)
            const formattedDateTime = dateTime.toLocaleString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false
            });
            return (
                <div>{`${formattedDateTime}`}</div>
            );
        },
    },
    {
        accessorKey: 'risk',
        meta: 'Risk',
        header: ({column}) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                Risk
                <CaretSortIcon className="ml-2 h-4 w-4"/>
            </Button>
        ),
        cell: ({row}) => {
            const risk = row.getValue('risk');
            const safeRisk = typeof risk === 'number' ? risk : null;
            return (
                <Badge className={getRiskBadgeClass(safeRisk)}>
                    {safeRisk !== null ? safeRisk.toFixed(2) : 'N/A'}
                </Badge>);
        },
    },
    {
        accessorKey: 'conditionStatus',
        meta: 'Condition Status',
        header: ({column}) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                Condition Status
                <CaretSortIcon className="ml-2 h-4 w-4"/>
            </Button>
        ),
        cell: ({row}) => <div>{row.getValue('conditionStatus')}</div>,
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({row}) => {
            const record = row.original

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <DotsHorizontalIcon className="h-4 w-4"/>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>

                        <DropdownMenuSeparator/>

                        <DropdownMenuItem>
                            <DownloadMedicalReport recordId={record._id}/>
                        </DropdownMenuItem>

                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    }
];

export function DataTable({patientId}: {
    patientId: Id<'patients'> | null
}) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [pagination, setPagination] = useState({pageIndex: 0, pageSize: 5});
    const router = useRouter();
    const data = useQuery(api.records.getPatientRecords, {patientId: patientId ?? undefined}) ?? [];


    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            pagination
        },
    });


    return (
        <div className="w-full">
            <div className="flex h-full items-center py-4">

                <IconButton onClick={() => router.push(`/dashboard/doctor/record/${patientId}`)}
                            className={'ml-2 mr-4 rounded-full bg-green-500'}>
                    <PlusIcon width="18" height="18"/>
                </IconButton>


                <Input
                    placeholder="Filter date..."
                    value={(table.getColumn("_creationTime")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("_creationTime")?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                />

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="ml-auto">
                            Columns <ChevronDownIcon className="ml-2 h-4 w-4"/>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {table
                            .getAllColumns()
                            .filter((column) => column.getCanHide())
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
                                        {(column.columnDef.meta as string) || column.id}
                                    </DropdownMenuCheckboxItem>
                                )
                            })}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
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
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="flex-1 text-sm text-muted-foreground">
                    {table.getFilteredSelectedRowModel().rows.length} of{" "}
                    {table.getFilteredRowModel().rows.length} row(s) selected.
                </div>
                <div className="space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    )
}
