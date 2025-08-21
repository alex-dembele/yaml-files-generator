import { useState, useEffect, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FiltersHook, QueryParamValue } from '@/types';
import { cn } from '@/lib/utils';

export interface SearchFilterConfig {
    key: string;
    placeholder?: string;
}
interface DataTableSearchProps<TQueryParams extends Record<string, QueryParamValue>> {
    filters: FiltersHook<TQueryParams>;
    searchConfig: SearchFilterConfig;
    debounceTime?: number; // Optional debounce time in milliseconds
    className?: string
}

export const DataTableSearch = <TQueryParams extends Record<string, QueryParamValue>>({ // eslint-disable-line @typescript-eslint/no-explicit-any
    filters,
    searchConfig,
    className = "bg-white w-[250px]",
    debounceTime = 500, // Default debounce time
}: DataTableSearchProps<TQueryParams>) => {
    const [searchValue, setSearchValue] = useState(filters.queryParams[searchConfig.key] ?? '');

    // Effect for debouncing the search input
    useEffect(() => {
        const handler = setTimeout(() => {
            // Apply the search filter using the filters hook
            if (searchValue !== filters.queryParams[searchConfig.key]) {
                filters.setQueryParam(searchConfig.key, searchValue === '' ? undefined : searchValue);
            }
        }, debounceTime);

        // Cleanup function to clear the timeout
        return () => {
            clearTimeout(handler);
        };
    }, [searchValue, debounceTime, filters, searchConfig.key]);

    // Update local state when the filter in the URL changes (e.g., from reset)
    useEffect(() => {
        setSearchValue(filters.queryParams[searchConfig.key] ?? '');
    }, [filters.queryParams, searchConfig.key]);


    const handleClearSearch = useCallback(() => {
        setSearchValue('');
        filters.setQueryParam(searchConfig.key, undefined);
    }, [filters, searchConfig.key]);

    return (
        <div className={cn("relative flex items-center rounded ", className)}>
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
                id={`${searchConfig.key}-search`}
                placeholder={searchConfig.placeholder ?? "Search..."}
                value={String(searchValue ?? '')} // Ensure value is a string
                onChange={(e) => setSearchValue(e.target.value)}
                className="pl-8 pr-8 w-full"
            />
            {searchValue && (
                <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 h-6 w-6 -translate-y-1/2 p-0"
                    onClick={handleClearSearch}
                >
                    <X className="h-4 w-4" />
                </Button>
            )}
        </div>
    );
};
