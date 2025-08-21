import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { capitalizeWords, getInitial } from '@/helpers/string-helper';
import * as XLSX from "xlsx";

import env from '@/env';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { FiltersHook, PaginationHook, QueryParams } from '@/types';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable, ExpanderComponentProps } from '@/components/data-table/data-table';
import { useClients } from '@/modules/clients/hooks';
import { DataTableToolbar, FilterConfig } from '@/components/data-table/data-table-toolbar';

const colors = {
    primary: {
        default: `#${env.APP_COLOR_PRIMARY_DEFAULT}`,
    },
    secondary: `#${env.APP_COLOR_SECONDARY_DEFAULT}`

}
export type IPerson = {
    id: number,
    name: string,
    telephone: string
}

export type IRecommendedPerson = IPerson;


export type IClient = {
    no: any,
    id: number,
    name: string,
    telephone: string
    IDClient: string,
    date: string,
    persons: IRecommendedPerson[],
};


const RecommendPerson: FC<ExpanderComponentProps<IClient>> = ({ data, isExpanded, toggleExpanded }) => {
    return (
        <div className='p-4'>
            <div className='flex items-center justify-between mb-3'>
                <h4 className='text-sm font-semibold text-gray-700'>Recommended Persons</h4>
                <span className='text-xs text-gray-500'>
                    {data.persons?.length || 0} person(s)
                </span>
            </div>
            <div className='flex items-center gap-2 flex-grow flex-wrap'>
                {data.persons && data.persons.length > 0 ? (
                    data.persons.map((person: IPerson, index: number) => (
                        <Person key={index} person={person} />
                    ))
                ) : (
                    <div className='text-sm text-gray-500 italic'>No recommended persons available</div>
                )}
            </div>
        </div>
    );
}

const Person = (props: any) => {
    return (
        <div className="flex items-center bg-slate-50 px-2 space-x-3 border rounded-md py-2 w-full my-1 max-w-60">
            <Avatar className='h-8 w-8 text-black'>
                <AvatarImage src='/avatars/01.png' alt='@shadcn' />
                <AvatarFallback>{getInitial(props?.person?.name ?? "A")}</AvatarFallback>
            </Avatar>
            <div className='flex flex-col justify-center text-left'>
                <span className="text-md font-semibold">{capitalizeWords(props.person?.name)}</span>
                <span className='text-sm text-gray-600'>{props.person?.telephone}</span>
            </div>
        </div>
    );
};


const ClientsPage = () => {
    const { t } = useTranslation();
    const { useGetClients, pagination, filters } = useClients();
    const { data: clients, isLoading } = useGetClients();

    const downloadButton = React.useMemo(
        () => (
            <button
                className='text-xs px-3 text-white rounded-md py-2 mr-2'
                style={{ backgroundColor: `${colors.primary.default}` }}
                onClick={(e: any) => downloadExcel(clients)}
            >
                Download
            </button>
        ),
        [clients]
    );

    function downloadExcel(array: any[]) {
        const formattedDataArr = array.map((data: any) => {

            const personData = data.persons?.reduce((acc: any, person: any, index: number) => {
                acc[`person${index + 1}-Name`] = person?.name ?? "";
                acc[`person${index + 1}-Phone`] = person?.telephone ?? "";
                return acc;
            }, {});

            return {
                no: data.no,
                client_name: data.name,
                client_id: data.IDClient,
                date: data.date,
                ...personData
            }

        });

        // Create a worksheet
        const worksheet = XLSX.utils.json_to_sheet(formattedDataArr);

        // Create a workbook
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Clients");

        // Convert the workbook to a Blob
        const excelBuffer = XLSX.write(workbook, {
            bookType: "xlsx",
            type: "array",
        });

        // Create a Blob from the Excel buffer
        const blob = new Blob([excelBuffer], {
            type: "application/octet-stream",
        });

        // Create a link element and download the file
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = "clients.xlsx";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    const filtersConfigs: FilterConfig[] = [
        {
            type: "date-range",
            key: "d",
            label: "Date Range",
        }
    ]

    return (
        <div className='lg:container w-full mx-auto py-3 px-2'>
            <div className="py-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Liste des clients</h2>
                {clients?.length !== 0 && downloadButton}
            </div>

            <div className="">
                <div className="space-y-2">
                    {/* Header with filters and search */}
                    <div className="flex bg-white rounded-xl shadow-sm items-center justify-between p-6 border-b border-gray-200">
                        <div className="flex items-center space-x-4">
                            {/* Filter dropdowns */}
                            <div className='flex items-center space-x-2'>
                                <span>Filters</span>
                                <DataTableToolbar filterConfigs={filtersConfigs} filters={filters} />
                            </div>
                        </div>
                    </div>

                    {/* Table */}
                    <ClientsDatatable
                        loading={isLoading}
                        data={clients ?? []}
                        pagination={pagination}
                        filters={filters}
                    />
                </div>
            </div>
        </div>
    );
}

export default ClientsPage;

export const ClientsDatatable = (
    {
        pagination,
        filters,
        data,
        loading
    }: {
        data: IClient[];
        pagination: PaginationHook;
        filters: FiltersHook<QueryParams>;
        loading: boolean
    }
) => {
    const columns: ColumnDef<IClient>[] = [
        {
            header: "No",
            cell: ({ row }) => {
                const obj = row.original;
                return (
                    <div className="text-sm font-medium text-gray-900">{obj.no}</div>
                )
            },
        },
        {
            header: "Client",
            cell: ({ row }) => {
                const obj = row.original;
                return (
                    <div className="text-sm font-medium text-gray-900">{obj.IDClient}</div>
                )
            },
        },
        {
            header: "Date",
            cell: ({ row }) => {
                const obj = row.original;
                return (
                    <div className="text-sm font-medium text-gray-900">{obj.date}</div>
                )
            },
        },
        {
            header: "Number of Persons",
            cell: ({ row }) => {
                const obj = row.original;
                return (
                    <div className="text-sm font-medium text-gray-900">
                        {obj?.persons ? obj.persons.length : 0}
                    </div>
                )
            },
        },
    ];

    // Function to determine if a row can be expanded
    const canExpand = (row: IClient) => {
        return row.persons && row.persons.length > 0;
    };

    return (
        <DataTable
            loading={loading}
            columns={columns}
            data={data}
            hasColumnVisibility={false}
            pagination={pagination}
            filters={filters}
            expanderComponent={RecommendPerson}
            canExpand={canExpand}
        />
    );
};