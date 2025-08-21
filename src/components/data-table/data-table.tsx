import { useState, useEffect, ReactNode } from 'react'
import {
    ColumnDef,
    ColumnFiltersState,
    RowData,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFacetedRowModel,
    getFacetedUniqueValues,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { DataTablePagination } from '@/components/data-table/data-table-pagination'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FiltersHook, PaginationHook, QueryParams } from '@/types'
import { DataTableViewOptions } from './data-table-view-options'
import { useTranslation } from 'react-i18next'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { ChevronDown, ChevronRight } from 'lucide-react'

declare module '@tanstack/react-table' {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface ColumnMeta<TData extends RowData, TValue> {
        className: string
    }
}

export interface ExpanderComponentProps<T extends RowData> {
    data: T;
    isExpanded: boolean;
    toggleExpanded: () => void;
}

interface DataTableProps<T extends RowData> {
    title?: string | ReactNode,
    columns: ColumnDef<T, unknown>[]
    data: T[],
    hasColumnVisibility?: boolean,
    hasPagination?: boolean,
    primaryButtons?: ReactNode
    pagination: PaginationHook
    filters: FiltersHook<QueryParams>
    loading?: boolean
    n_loading_rows?: number
    expanderComponent?: React.ComponentType<ExpanderComponentProps<T>>
    canExpand?: (row: T) => boolean
}

export function DataTable<T extends RowData>({
    columns,
    data,
    hasColumnVisibility = true,
    hasPagination = true,
    pagination,
    filters,
    title,
    primaryButtons,
    loading = false,
    n_loading_rows = 10,
    expanderComponent: ExpanderComponent,
    canExpand = () => true
}: DataTableProps<T>) {

    const { t } = useTranslation();
    const translationKey = 'layout.app.components.datatable';
    const translate = (key: string) => {
        return t(`${translationKey}.${key}`);
    };

    const [rowSelection, setRowSelection] = useState({})
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [sorting, setSorting] = useState<SortingState>([])
    const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())

    // Handle sorting changes to update API
    useEffect(() => {
        if (sorting.length > 0) {
            const { id, desc } = sorting[0];
            filters.setSort(id, desc ? 'desc' : 'asc');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sorting]);

    // Toggle row expansion
    const toggleRowExpansion = (rowId: string) => {
        setExpandedRows(prev => {
            const newSet = new Set(prev);
            if (newSet.has(rowId)) {
                newSet.delete(rowId);
            } else {
                newSet.add(rowId);
            }
            return newSet;
        });
    };

    // Create columns with expander if needed
    const enhancedColumns = ExpanderComponent ? [
        {
            id: 'expander',
            header: '',
            cell: ({ row }) => {
                const canExpandRow = canExpand(row.original);
                const isExpanded = expandedRows.has(row.id);

                return canExpandRow ? (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            toggleRowExpansion(row.id);
                        }}
                        className="flex items-center justify-center p-1 hover:bg-gray-100 rounded"
                    >
                        {isExpanded ? (
                            <ChevronDown className="h-4 w-4" />
                        ) : (
                            <ChevronRight className="h-4 w-4" />
                        )}
                    </button>
                ) : null;
            },
            meta: {
                className: 'w-8'
            }
        },
        ...columns
    ] : columns;

    const table = useReactTable({
        data,
        columns: enhancedColumns,
        rowCount: pagination.total,
        pageCount: pagination.totalPages,
        state: {
            pagination: {
                pageIndex: pagination.page - 1,
                pageSize: pagination.limit,
            },
            sorting,
            columnVisibility,
            rowSelection,
            columnFilters,
        },
        onPaginationChange: (updater) => {
            const newPagination =
                typeof updater === 'function'
                    ? updater({
                        pageIndex: pagination.page - 1,
                        pageSize: pagination.limit,
                    })
                    : updater;

            // Update pagination via our hook (which updates URL)
            pagination.goToPage(newPagination.pageIndex + 1);
            pagination.setPageSize(newPagination.pageSize);
        },
        onSortingChange: (updater) => {
            // First update the TanStack table sorting state
            setSorting(updater);

            // The API sorting will be handled by the useEffect above
        },
        manualPagination: true, // Tell TanStack we're handling pagination server-side
        manualSorting: true, // Tell TanStack we're handling sorting server-side
        manualFiltering: true, // Tell TanStack we're handling filtering server-side

        enableRowSelection: true,
        onRowSelectionChange: setRowSelection,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
    })

    // Generate skeleton rows for loading state
    const renderSkeletonRows = () => {
        return Array.from({ length: n_loading_rows }, (_, index) => (
            <TableRow key={`skeleton-${index}`} className='group/row'>
                {table.getVisibleLeafColumns().map((column) => (
                    <TableCell
                        key={`skeleton-${index}-${column.id}`}
                        className={column.columnDef.meta?.className ?? ''}
                    >
                        <Skeleton height={20} />
                    </TableCell>
                ))}
            </TableRow>
        ));
    };

    return (
        <div>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div className='w-full'>{title && typeof title === "string" ? (
                        <CardTitle>{title}</CardTitle>
                    ) : (
                        title
                    )}</div>
                    <div className='flex items-center space-x-2'>
                        {primaryButtons && primaryButtons}
                        {hasColumnVisibility && <DataTableViewOptions table={table} />}
                    </div>

                </CardHeader>
                <CardContent>
                    <div className='space-y-4'>
                        <div className='rounded-md border'>
                            <Table>
                                <TableHeader>
                                    {table.getHeaderGroups().map((headerGroup) => (
                                        <TableRow key={headerGroup.id} className='group/row'>
                                            {headerGroup.headers.map((header) => {
                                                return (
                                                    <TableHead
                                                        key={header.id}
                                                        colSpan={header.colSpan}
                                                        className={header.column.columnDef.meta?.className ?? ''}
                                                    >
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
                                    {loading ? (
                                        renderSkeletonRows()
                                    ) : table.getRowModel().rows?.length ? (
                                        table.getRowModel().rows.map((row) => {
                                            const isExpanded = expandedRows.has(row.id);
                                            const canExpandRow = ExpanderComponent && canExpand(row.original);

                                            return (
                                                <>
                                                    <TableRow
                                                        key={row.id}
                                                        data-state={row.getIsSelected() && 'selected'}
                                                        className={`group/row ${canExpandRow ? 'cursor-pointer hover:bg-gray-50' : ''}`}
                                                        onClick={() => {
                                                            if (canExpandRow) {
                                                                toggleRowExpansion(row.id);
                                                            }
                                                        }}
                                                    >
                                                        {row.getVisibleCells().map((cell) => (
                                                            <TableCell
                                                                key={cell.id}
                                                                className={cell.column.columnDef.meta?.className ?? ''}
                                                            >
                                                                {flexRender(
                                                                    cell.column.columnDef.cell,
                                                                    cell.getContext()
                                                                )}
                                                            </TableCell>
                                                        ))}
                                                    </TableRow>
                                                    {isExpanded && ExpanderComponent && (
                                                        <TableRow key={`${row.id}-expanded`}>
                                                            <TableCell
                                                                colSpan={enhancedColumns.length}
                                                                className="p-0 border-b-0"
                                                            >
                                                                <div className="bg-gray-50/50 border-t">
                                                                    <ExpanderComponent
                                                                        data={row.original}
                                                                        isExpanded={isExpanded}
                                                                        toggleExpanded={() => toggleRowExpansion(row.id)}
                                                                    />
                                                                </div>
                                                            </TableCell>
                                                        </TableRow>
                                                    )}
                                                </>
                                            );
                                        })
                                    ) : (
                                        <TableRow>
                                            <TableCell
                                                colSpan={enhancedColumns.length}
                                                className='h-24 text-center'
                                            >
                                                {translate('no_data')}
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                        {hasPagination && <DataTablePagination pagination={pagination} table={table} />}

                    </div>
                </CardContent>
            </Card>
        </div>


    )
}