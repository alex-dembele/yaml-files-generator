/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback, useEffect } from 'react';
import { DateRange } from 'react-day-picker';
import { Button } from '@/components/ui/button';
import { DatePickerWithRange } from '@/components/ui/daterangepicker';
// import { Input } from '@/components/ui/input'; // Import Input
import { Search, X } from 'lucide-react'; // Import Search and X icons
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { convertDateFormat } from '@/helpers/string-helper';
import { FiltersHook } from '@/types';
// import { useTranslation } from 'react-i18next';

// Define types for filter configurations
interface DateRangeFilterConfig {
    type: 'date-range';
    key: string; // Base key for date range (e.g., 'dateRange') - will result in 'dateRangeFrom' and 'dateRangeTo'
    label: string;
}

interface SelectFilterOption {
    value: string | string;
    label: string;
}

interface SelectFilterConfig {
    type: 'select';
    key: string;
    label?: string;
    options: SelectFilterOption[];
    placeholder?: string;
    defaultValue?: string; // Optional default value for the select
}

interface SearchFilterConfig {
    type: 'search';
    key: string;
    placeholder?: string;
}

// Union type for all possible filter configurations
export type FilterConfig = DateRangeFilterConfig | SelectFilterConfig | SearchFilterConfig;

// Define props for the reusable DataTableToolbar component
interface DataTableToolbarProps<TQueryParams> {
    filters: FiltersHook<TQueryParams>;
    filterConfigs: FilterConfig[];
}

export const DataTableToolbar = <TQueryParams extends Record<string, any>>({
    filters,
    filterConfigs,
}: DataTableToolbarProps<TQueryParams>) => {

    // const { t } = useTranslation();
    // const translationKey = 'layout.app.components.datatable.filters'
    // const translate = (key: string) => {
    //     return t(`${translationKey}.${key}`);
    // };

    // Local state to hold filter values, keyed by filter key
    const [localFilters, setLocalFilters] = useState<Record<string, any>>({});

    // Initialize local filters from hook's queryParams on mount
    useEffect(() => {
        const initialLocalFilters: Record<string, any> = {};
        filterConfigs.forEach(config => {
            if (config.type === 'date-range') {
                // Initialize date range from hook's queryParams if available
                const fromDate = filters.queryParams[`${config.key}From`];
                const toDate = filters.queryParams[`${config.key}To`];
                if (fromDate || toDate) {
                    initialLocalFilters[config.key] = {
                        from: typeof fromDate === 'string' || typeof fromDate === 'number' ? new Date(fromDate) : undefined,
                        to: typeof toDate === 'string' || typeof toDate === 'number' ? new Date(toDate) : undefined,
                    };
                } else {
                    initialLocalFilters[config.key] = undefined;
                }
            } else if (config.type === 'select') {
                // Initialize select from hook's queryParams or default value
                initialLocalFilters[config.key] = filters.queryParams[config.key] ?? config.defaultValue;
            } else if (config.type === 'search') {
                // Initialize search from hook's queryParams
                initialLocalFilters[config.key] = filters.queryParams[config.key] ?? '';
            }
        });
        setLocalFilters(initialLocalFilters);
    }, [filterConfigs, filters.queryParams]);


    // Handle changes for different filter types
    const handleFilterChange = useCallback((key: string, value: any) => {
        setLocalFilters(prev => ({
            ...prev,
            [key]: value,
        }));
    }, []);

    // Handle applying filters
    const handleApplyFilters = useCallback(() => {
        const newFilters: TQueryParams = {} as TQueryParams;

        filterConfigs.forEach(config => {
            const localValue = localFilters[config.key];

            if (config.type === 'date-range') {
                const dateRangeValue = localValue as DateRange | undefined;
                if (dateRangeValue?.from && dateRangeValue?.to) {
                    newFilters[`${config.key}From` as keyof TQueryParams] = convertDateFormat(dateRangeValue.from) as TQueryParams[keyof TQueryParams];
                    newFilters[`${config.key}To` as keyof TQueryParams] = convertDateFormat(dateRangeValue.to) as TQueryParams[keyof TQueryParams];
                }
                // If date range is cleared, explicitly set to undefined in newFilters
                if (!dateRangeValue?.from && !dateRangeValue?.to) {
                    newFilters[`${config.key}From` as keyof TQueryParams] = undefined as TQueryParams[keyof TQueryParams];
                    newFilters[`${config.key}To` as keyof TQueryParams] = undefined as TQueryParams[keyof TQueryParams];
                }

            } else if (config.type === 'select') {
                // Only add select value if it's not the default value or undefined
                if (localValue !== undefined && localValue !== config.defaultValue) {
                    newFilters[config.key as keyof TQueryParams] = localValue as TQueryParams[keyof TQueryParams];
                } else if (localValue === config.defaultValue) {
                    // If it's the default value, explicitly set to undefined to remove from URL if it was there
                    newFilters[config.key as keyof TQueryParams] = undefined as TQueryParams[keyof TQueryParams];
                }
            } else if (config.type === 'search') {
                // Only add search value if it's not empty
                if (localValue !== '') {
                    newFilters[config.key as keyof TQueryParams] = localValue as TQueryParams[keyof TQueryParams];
                } else {
                    newFilters[config.key as keyof TQueryParams] = undefined as TQueryParams[keyof TQueryParams];
                }
            }
        });

        filters.setMultipleParams(newFilters);
    }, [filterConfigs, localFilters, filters]);

    // Reset all filters
    const resetFilters = useCallback(() => {
        // Reset local state to initial values based on configs
        const initialLocalFilters: Record<string, any> = {};
        filterConfigs.forEach(config => {
            if (config.type === 'date-range') {
                initialLocalFilters[config.key] = undefined;
            } else if (config.type === 'select') {
                initialLocalFilters[config.key] = config.defaultValue;
            } else if (config.type === 'search') {
                initialLocalFilters[config.key] = '';
            }
        });
        setLocalFilters(initialLocalFilters);


        // Reset API filters using the hook's resetFilters
        filters.resetFilters();
    }, [filterConfigs, filters]);

    // Determine if any filter has a non-default value to show the Reset button
    const isFiltered = Object.entries(localFilters).some(([key, value]) => {
        const config = filterConfigs.find(c => c.key === key);
        if (!config) return false;

        if (config.type === 'date-range') {
            const dateRangeValue = value as DateRange | undefined;
            return dateRangeValue?.from !== undefined || dateRangeValue?.to !== undefined;
        } else if (config.type === 'select') {
            return value !== undefined && value !== config.defaultValue;
        } else if (config.type === 'search') {
            return value !== '';
        }
        return false;
    });


    return (
        <div className=" rounded-lg border-none bg-none  flex items-center pr-2 gap-x-2 ">
            {/* Render other filters below if needed */}
            <div className="flex flex-wrap gap-4 w-full items-center">
                {filterConfigs.map(config => (
                    <div key={config.key} className='rounded'>
                        {config.type === 'select' && (
                            <>
                                {config.label && (
                                    <label htmlFor={`${config.key}-filter`} className="mb-1 block text-sm font-medium text-muted-foreground">
                                        {config.label}
                                    </label>
                                )}

                                <Select

                                    value={localFilters[config.key] ?? ''} // Use empty string for uncontrolled select if value is undefined
                                    onValueChange={(value) => handleFilterChange(config.key, value)}
                                >
                                    <SelectTrigger id={`${config.key}-filter`} className="px-3 py-6   outline-none focus:border-none focus:outline-none bg-white rounded-[16px] text-[#A3AED0]" >
                                        <SelectValue className='bg-white' placeholder={config.placeholder} />
                                    </SelectTrigger>
                                    <SelectContent className='bg-white'>
                                        {config.options.map(option => (
                                            <SelectItem key={option.value} value={option.value}>
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </>
                        )}
                        {config.type === 'date-range' && (
                            <DatePickerWithRange
                                className='bg-white'
                                id={`${config.key}-filter`}
                                onRangeSelect={(range) => handleFilterChange(config.key, range)}
                                initialDate={localFilters[config.key] as DateRange | undefined}
                                placeholder={config.label} // Use label as placeholder
                            />
                        )}
                        {config.type === 'search' && (
                            <div className='col-span-2'>
                                <div className="  flex space-x-2 bg-white rounded-xl items-center py-2 px-4">
                                    <Search color="#A3AED0" size={18} />
                                    <input
                                        id={`${config.key}-filter`}
                                        placeholder={config.placeholder ?? "Search..."}
                                        value={localFilters[config.key] ?? ''}
                                        onChange={(e) => handleFilterChange(config.key, e.target.value)}
                                        className="border-none py-1 hover:border-none outline-none hover:outline-none focus:border-none focus:outline-none " />
                                    {localFilters[config.key] && (
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className=""
                                            onClick={() => handleFilterChange(config.key, '')}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
            <div className='flex gap-x-2'>
                {isFiltered && (
                    <Button
                        className='px-3 py-6  border-none  outline-none focus:border-none focus:outline-none rounded-[16px] '
                        variant="destructive" onClick={resetFilters}>
                        Annuler
                    </Button>
                )}

                {/* Show Apply button if any filter has a value (even default for select) */}
                {Object.values(localFilters).some(value => value !== undefined && value !== '' && value !== null && !(typeof value === 'object' && Object.keys(value).length === 0)) && (
                    <Button
                        className='px-3 py-6  border-none  outline-none focus:border-none focus:outline-none rounded-[16px] '

                        onClick={handleApplyFilters}
                    >
                        Appliquer
                    </Button>
                )}
            </div>
        </div>
    );
};
