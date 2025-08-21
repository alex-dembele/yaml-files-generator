import {
    ChevronLeftIcon,
    ChevronRightIcon,
    DoubleArrowLeftIcon,
    DoubleArrowRightIcon,
} from '@radix-ui/react-icons'
import { Table } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { PaginationHook } from '@/types'
import { useTranslation } from 'react-i18next'

interface DataTablePaginationProps<TData> {
    table: Table<TData>,
    pagination: PaginationHook
}

export function DataTablePagination<TData>({
    table,
    pagination
}: DataTablePaginationProps<TData>) {
    const { t } = useTranslation();
    const translationKey = 'layout.app.components.datatable.pagination';
    const translate = (key: string) => {
        return t(`${translationKey}.${key}`);
    };

    // Get available page size options from the pagination hook if available
    const pageSizeOptions = pagination.pageSizeOptions || [10, 20, 30, 40, 50];

    // The total row count comes from the API
    const totalRowCount = pagination.total || 0;

    return (
        <div
            className='flex items-center justify-between overflow-clip px-2'
            style={{ overflowClipMargin: 1 }}
        >
            <div className='hidden flex-1 text-sm text-muted-foreground sm:block'>
                {/* {table.getFilteredSelectedRowModel().rows.length} of{' '} */}
                {translate('total_data')} {' '}  ({totalRowCount})
            </div>
            <div className='flex items-center sm:space-x-6 lg:space-x-8'>
                <div className='flex items-center space-x-2'>
                    <p className='hidden text-sm font-medium sm:block'>{translate('rows_per_page')}</p>
                    <Select
                        value={`${table.getState().pagination.pageSize}`}
                        onValueChange={(value) => {
                            const newSize = Number(value);
                            // Update both table and API pagination
                            table.setPageSize(newSize);
                            pagination.setPageSize(newSize);
                        }}
                    >
                        <SelectTrigger className='h-8 w-[70px]'>
                            <SelectValue placeholder={table.getState().pagination.pageSize} />
                        </SelectTrigger>
                        <SelectContent side='top'>
                            {pageSizeOptions.map((pageSize) => (
                                <SelectItem key={pageSize} value={`${pageSize}`}>
                                    {pageSize}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className='flex w-[100px] items-center justify-center text-sm font-medium'>
                    {translate('page')} {pagination.page} {translate('of')}{' '}
                    {pagination.totalPages || 1}
                </div>
                <div className='flex items-center space-x-2'>
                    <Button
                        variant='outline'
                        className='hidden h-8 w-8 p-0 lg:flex'
                        onClick={() => pagination.goToPage(1)}
                        disabled={pagination.page <= 1}
                    >
                        <span className='sr-only'>{translate('go_to_first_page')}</span>
                        <DoubleArrowLeftIcon className='h-4 w-4' />
                    </Button>
                    <Button
                        variant='outline'
                        className='h-8 w-8 p-0'
                        onClick={() => pagination.goToPage(pagination.page - 1)}
                        disabled={pagination.page <= 1}
                    >
                        <span className='sr-only'>{translate('previous')}</span>
                        <ChevronLeftIcon className='h-4 w-4' />
                    </Button>
                    <Button
                        variant='outline'
                        className='h-8 w-8 p-0'
                        onClick={() => pagination.goToPage(pagination.page + 1)}
                        disabled={pagination.page >= pagination.totalPages}
                    >
                        <span className='sr-only'>{translate('next')}</span>
                        <ChevronRightIcon className='h-4 w-4' />
                    </Button>
                    <Button
                        variant='outline'
                        className='hidden h-8 w-8 p-0 lg:flex'
                        onClick={() => pagination.goToPage(pagination.totalPages)}
                        disabled={pagination.page >= pagination.totalPages}
                    >
                        <span className='sr-only'>{translate('go_to_last_page')}</span>
                        <DoubleArrowRightIcon className='h-4 w-4' />
                    </Button>
                </div>
            </div>
        </div>
    )
}