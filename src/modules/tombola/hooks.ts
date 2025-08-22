import { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { PaginationState, QueryOptions, QueryParams, QueryParamValue, ServiceOptions } from '@/types';
import ClientApi from './api';
import { IClient } from '@/routes/clients-page';


/**
 * Comprehensive hook for managing payment labels data, combining pagination, query parameters, and API calls
 * with direct URL synchronization
 *
 * @param {ServiceOptions} options - Configuration options
 * @returns {Object} Combined payments service with CRUD, pagination, and filtering capabilities
 */
export const useClients = ({
    paginate = 1,
    initialPage = 1,
    initialLimit = 10,
    initialTotal = 0,
    pageSizeOptions = [10, 25, 50, 100],
    initialFilters = {}
}: ServiceOptions = {}) => {
    // const queryClient = useQueryClient();
    const search = Object.fromEntries(new URLSearchParams(window.location.search).entries());

    // ---- Initialize State from URL or Defaults ----
    const [pagination, setPagination] = useState<PaginationState>({
        page: Number(search.page) || initialPage,
        limit: Number(search.limit) || initialLimit,
        total: initialTotal,
        totalPages: Math.ceil(initialTotal / initialLimit)
    });

    const [queryParams, setQueryParams] = useState<QueryParams>(() => {
        const params: QueryParams = { ...initialFilters };

        Object.entries(search).forEach(([key, value]) => {
            if (key !== 'page' && key !== 'limit') {
                params[key] = value as QueryParamValue;
            }
        });

        return params;
    });

    // ---- Combined params for API calls ----
    const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...queryParams
    };

    // ---- Helper for URL updates ----
    const updateUrl = useCallback((updates: Record<string, unknown>) => {
        const newParams = new URLSearchParams();

        Object.entries(updates).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== 'undefined' && value !== '') {
                newParams.set(key, String(value));
            }
        });
        window.history.replaceState({}, '', `${window.location.pathname}?${newParams}`);
    }, []);

    // ---- Update total pages when total or limit changes ----
    useEffect(() => {
        setPagination(prev => ({
            ...prev,
            totalPages: Math.ceil(prev.total / prev.limit)
        }));
    }, [pagination.total, pagination.limit]);

    // ---- Pagination Methods with Direct URL Updates ----

    // Set total count (usually called after data fetch)
    const setTotal = useCallback((total: number): void => {
        setPagination(prev => ({
            ...prev,
            total: total,
            totalPages: Math.ceil(total / prev.limit)
        }));
    }, []);

    // Go to specific page - with URL update
    const goToPage = useCallback((page: number): void => {
        if (page >= 1 && (pagination.totalPages === 0 || page <= pagination.totalPages)) {
            setPagination(prev => ({
                ...prev,
                page
            }));
            updateUrl({ page });
        }
    }, [pagination.totalPages, updateUrl]);

    // Go to next page - with URL update
    const nextPage = useCallback((): void => {
        if (pagination.page < pagination.totalPages || pagination.totalPages === 0) {
            const nextPageNum = pagination.page + 1;
            setPagination(prev => ({
                ...prev,
                page: nextPageNum
            }));
            updateUrl({ page: nextPageNum });
        }
    }, [pagination.page, pagination.totalPages, updateUrl]);

    // Go to previous page - with URL update
    const prevPage = useCallback((): void => {
        if (pagination.page > 1) {
            const prevPageNum = pagination.page - 1;
            setPagination(prev => ({
                ...prev,
                page: prevPageNum
            }));
            updateUrl({ page: prevPageNum });
        }
    }, [pagination.page, updateUrl]);

    // Change items per page - with URL update
    const setPageSize = useCallback((limit: number): void => {
        if (pageSizeOptions.includes(limit)) {
            setPagination(prev => ({
                ...prev,
                limit,
                page: 1, // Reset to page 1 when changing limit
                totalPages: Math.ceil(prev.total / limit)
            }));
            updateUrl({ limit, page: 1 });
        }
    }, [pageSizeOptions, updateUrl]);

    // ---- Query Parameters Methods with Direct URL Updates ----

    // Set a single query parameter - with URL update
    const setQueryParam = useCallback((key: string, value: QueryParamValue) => {
        setQueryParams(prev => ({
            ...prev,
            [key]: value
        }));

        // Only add to URL if value is not empty
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const urlUpdate: Record<string, any> = {};
        if (value !== undefined && value !== null && value !== '') {
            urlUpdate[key] = String(value);
        } else {
            urlUpdate[key] = undefined; // Remove from URL if empty
        }
        updateUrl(urlUpdate);
    }, [updateUrl]);

    // Set multiple query parameters at once - with URL update
    const setMultipleParams = useCallback((newParams: QueryParams) => {
        setQueryParams(prev => ({
            ...prev,
            ...newParams
        }));

        // Prepare URL updates
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const urlUpdates: Record<string, any> = {};
        Object.entries(newParams).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                urlUpdates[key] = String(value);
            } else {
                urlUpdates[key] = undefined; // Remove from URL if empty
            }
        });
        updateUrl(urlUpdates);
    }, [updateUrl]);

    // Reset all query parameters to initial values - with URL update
    const resetQueryParams = useCallback(() => {
        setQueryParams(initialFilters);

        // Remove all current params from URL and add initialFilters
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const urlUpdates: Record<string, any> = {};

        // First set all current params to undefined to remove them
        Object.keys(queryParams).forEach(key => {
            urlUpdates[key] = undefined;
        });

        // Then add initialFilters that aren't empty
        Object.entries(initialFilters).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                urlUpdates[key] = String(value);
            }
        });

        updateUrl(urlUpdates);
    }, [initialFilters, queryParams, updateUrl]);

    // ---- Filter/Search/Sort Methods ----

    const setSearch = useCallback((searchText: string) => {
        setQueryParams(prev => ({
            ...prev,
            search: searchText
        }));

        setPagination(prev => ({
            ...prev,
            page: 1 // Reset to first page when searching
        }));

        updateUrl({
            search: searchText || undefined,
            page: 1
        });
    }, [updateUrl]);

    const setSort = useCallback((field: string, order: string) => {
        setQueryParams(prev => ({
            ...prev,
            sortBy: field,
            sortOrder: order
        }));

        updateUrl({
            sortBy: field || undefined,
            sortOrder: order || undefined
        });
    }, [updateUrl]);

    const setFilter = useCallback((key: string, value: QueryParamValue) => {
        setQueryParams(prev => ({
            ...prev,
            [key]: value
        }));

        setPagination(prev => ({
            ...prev,
            page: 1 // Reset to first page when filtering
        }));

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const urlUpdate: Record<string, any> = { page: 1 };
        if (value !== undefined && value !== null && value !== '') {
            urlUpdate[key] = String(value);
        } else {
            urlUpdate[key] = undefined; // Remove from URL if empty
        }

        updateUrl(urlUpdate);
    }, [updateUrl]);

    const resetFilters = useCallback(() => {
        setQueryParams(initialFilters);

        setPagination(prev => ({
            ...prev,
            page: 1
        }));

        // Prepare URL updates - remove specific filter params and reset to page 1
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const urlUpdates: Record<string, any> = { page: 1 };

        // // Explicitly set known filter keys to undefined to remove them from URL
        // const filterKeys: (keyof taxesQueryParams)[] = ['search', 'sortBy', 'sortOrder', 'fromDate', 'toDate',];
        // filterKeys.forEach(key => {
        //     urlUpdates[key] = undefined;
        // });


        // Add back initial filters that aren't empty
        Object.entries(initialFilters).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                urlUpdates[key] = String(value);
            }
        });

        updateUrl(urlUpdates);
    }, [initialFilters, updateUrl]); // Removed queryParams from dependencies as we no longer iterate over its keys

    const useGetClients = (options: QueryOptions = {}) => {
        // console.log('Fetching payment history list with params:', pagination, queryParams);
        return useQuery<IClient[]>({ // Corrected return type
            queryKey: [`client-list`, params], // Changed query key action to 'list'
            queryFn: async () => {
                const data = await ClientApi.getMany({
                    paginate: Boolean(paginate),
                    params,
                    queryParams,
                });
                setTotal(data.total)
                return data.data; // Return the clients array directly
            },
            ...options
        });
    };

    const useGetTotalClients = (options: QueryOptions = {}) => {
        return useQuery<any>({ // Corrected return type
            queryKey: [`get-total-clients`], // Changed query key action to 'list'
            queryFn: async () => {

                const data = await ClientApi.getTotalClients();
                return data.data;
            },
            ...options
        });
    };

    const useGetTotalRecommendations = (options: QueryOptions = {}) => {
        return useQuery<any>({ // Corrected return type
            queryKey: [`get-total-recommendations`], // Changed query key action to 'list'
            queryFn: async () => {

                const data = await ClientApi.getTotalRecommendations();
                return data.data;
            },
            ...options
        });
    };


    return {
        useGetClients,
        useGetTotalClients,
        useGetTotalRecommendations,
        // Pagination state and methods
        pagination: {
            page: pagination.page,
            limit: pagination.limit,
            total: pagination.total,
            totalPages: pagination.totalPages,
            goToPage,
            nextPage,
            prevPage,
            setPageSize,
            setTotal,
            pageSizeOptions
        },

        // Query params state and methods
        filters: {
            queryParams,
            setQueryParam,
            setMultipleParams,
            resetQueryParams,

            // Specialized filter methods
            setSearch,
            setSort,
            setFilter,
            resetFilters
        },

        // Current combined params
        params
    };
};
