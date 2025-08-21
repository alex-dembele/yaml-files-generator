import { Button } from "@/components/ui/button";
import { FiltersHook, PaginationHook, QueryParams } from "@/types";
import { Link } from "react-router-dom";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table/data-table";
import { Eye } from "lucide-react";
import { IOrgOnboarding } from "./api";

export const GotoDashboardBtn = () => {
    return (
        <Link to={`/dashboard`}>
            <Button variant={'secondary'}>View Dashboard</Button>
        </Link>
    );
}


export const DashboardStatCards = ({ data }) => {
    return (
        data.map((stat, index) => <DashboardStatCard data={stat} key={`stats-${index}`} />)
    );
}

export const DashboardStatCard = ({ data }) => {
    const stat = data;
    const IconComponent = stat.icon;
    return (
        <div
            key={stat.id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
        >
            <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <IconComponent className={`w-6 h-6 ${stat.textColor}`} />
                </div>
                <div className={`flex items-center text-sm font-medium ${stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                    }`}>
                    <span>{stat.change}</span>
                    <svg
                        className={`w-4 h-4 ml-1 ${stat.changeType === 'positive' ? 'rotate-0' : 'rotate-180'
                            }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 10l7-7m0 0l7 7m-7-7v18"
                        />
                    </svg>
                </div>
            </div>

            <div>
                <h3 className="text-3xl font-bold text-gray-900 mb-1">
                    {stat.value}
                </h3>
                <p className="text-gray-600 text-sm font-medium">
                    {stat.title}
                </p>
            </div>

            <div className="mt-4">
                <div className={`w-full bg-gray-200 rounded-full h-2`}>
                    <div
                        className={`h-2 rounded-full ${stat.color} transition-all duration-300`}
                        style={{
                            width: stat.id === 1 ? '100%' :
                                stat.id === 2 ? '75%' :
                                    stat.id === 3 ? '25%' : '95%'
                        }}
                    ></div>
                </div>
            </div>
        </div>
    );
}

export const DashboardOrganisationOnboardingsDataTable = (
    {
        pagination,
        filters,
        data,
        loading
    }: {
        data: IOrgOnboarding[];
        pagination: PaginationHook;
        filters: FiltersHook<QueryParams>;
        loading: boolean
    }
) => {
    const columns: ColumnDef<IOrgOnboarding>[] = [
        {
            header: "Clients",
            cell: ({ row }) => {
                const obj = row.original;
                return (
                    <td className=" py-4 ">
                        <div className="text-sm font-medium text-gray-900">{obj.orgName}</div>
                    </td>
                )
            },
        },
        {
            header: "Service",
            cell: ({ row }) => {
                const obj = row.original;
                return (
                    <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-700">{obj.serviceName}</div>
                    </td>
                )
            },
        },
        {
            header: "Date de soumission",
            cell: ({ row }) => {
                const obj = row.original;
                return (
                    <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                            {obj.dateSummited}
                        </span>
                    </td>
                )
            },
        },

        {
            header: "Statut",
            cell: ({ row }) => {
                const obj = row.original;
                return (
                    <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                            <span className="text-sm text-gray-900">{obj.status}</span>
                        </div>
                    </td>
                )
            },
        },
        {
            header: "Actions",
            cell: ({ row }) => {
                const obj = row.original;
                return (
                    <td className="px-6 py-4 whitespace-nowrap">
                        <Link to={`/onboarding/${obj.uuid}`}>
                            <button className="flex items-center space-x-1 px-3 py-1 text-sm text-purple-600 hover:text-purple-800 hover:bg-purple-50 rounded transition-colors">
                                <Eye className="w-4 h-4" />
                                <span>Détails</span>
                            </button>
                        </Link>
                    </td>
                )
            },
        },


    ];


    return (

        <DataTable
            loading={loading}
            title={
                <div className=" py-4">
                    <h2 className="text-xl font-semibold text-gray-900">Liste des onboarding des entreprise</h2>
                </div>
            }
            columns={columns}
            data={data}
            hasColumnVisibility={false}
            pagination={pagination}
            filters={filters}
        />
    );
};

