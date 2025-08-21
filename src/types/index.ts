
export type QueryParamValue = string | number | boolean | null | undefined;

// Types from the existing hooks
export type QueryParams = {
    search?: QueryParamValue;
    sortBy?: QueryParamValue;
    sortOrder?: QueryParamValue;
    paginate?: QueryParamValue,
    [key: string]: QueryParamValue; // Allow for other dynamic properties
};

export type FiltersHook<QueryParamsType> = {
    queryParams: QueryParamsType;
    setQueryParam: (key: string, value: QueryParamValue) => void;
    setMultipleParams: (newParams: QueryParams) => void;
    resetQueryParams: () => void;
    setSearch: (searchText: string) => void;
    setSort: (field: string, order: string) => void;
    setFilter: (key: string, value: QueryParamValue) => void;
    resetFilters: () => void;
}

export type PaginationHook = {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    goToPage: (page: number) => void;
    nextPage: () => void;
    prevPage: () => void;
    setPageSize: (limit: number) => void;
    setTotal: (total: number) => void;
    pageSizeOptions: number[];
}

export type PaginationState = {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}


// type QueryOptions = {
//     onSuccess?: (data: unknown, variables: unknown, context: unknown) => void;
//     onError?: (error: Error, variables: unknown, context: unknown) => void;
//     [key: string]: unknown;
// }

export interface QueryOptions<TData = unknown, TError = unknown, TVariables = unknown, TContext = unknown> {
    enabled?: boolean;
    onSuccess?: (data: TData, variables: TVariables, context: TContext | undefined) => void;
    onError?: (error: TError, variables: TVariables, context: TContext | undefined) => void;
    staleTime?: number;
    cacheTime?: number;
    refetchOnMount?: boolean;
    refetchOnWindowFocus?: boolean;
    refetchInterval?: number | false;
    [key: string]: unknown;
}

export interface ServiceOptions {
    paginate?: QueryParamValue;
    initialPage?: number;
    initialLimit?: number;
    initialTotal?: number;
    pageSizeOptions?: number[];
    initialFilters?: QueryParams;
}
