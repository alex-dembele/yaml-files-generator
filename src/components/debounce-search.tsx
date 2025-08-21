import { Search, X } from 'lucide-react';
import { FC, useState, useEffect, useCallback } from "react";

type DebounceSearchProps = {
    label?: string;
    placeholder?: string;
    currentValue?: string | undefined;
    onChange?: (newValue: string | undefined) => void;
    debounceMs?: number;
    minLength?: number;
    disabled?: boolean;
    showClearButton?: boolean;
    className?: string;
    inputClassName?: string;
    onFocus?: () => void;
    onBlur?: () => void;
    onClear?: () => void;
}

export const DebounceSearch: FC<DebounceSearchProps> = ({
    label,
    placeholder = "Rechercher...",
    currentValue = "",
    onChange,
    debounceMs = 300,
    minLength = 0,
    disabled = false,
    showClearButton = true,
    className = "",
    inputClassName = "",
    onFocus,
    onBlur,
    onClear
}) => {
    const [searchTerm, setSearchTerm] = useState(currentValue || '');
    const [isDebouncing, setIsDebouncing] = useState(false);

    // Sync internal state with external currentValue
    useEffect(() => {
        if (currentValue !== searchTerm) {
            setSearchTerm(currentValue || '');
        }
    }, [currentValue]);

    // Debounced onChange effect
    useEffect(() => {
        if (!onChange) return;

        setIsDebouncing(true);
        const timeoutId = setTimeout(() => {
            // Only call onChange if the search term meets minimum length requirement
            if (searchTerm.length >= minLength || searchTerm.length === 0) {
                onChange(searchTerm || undefined);
            }
            setIsDebouncing(false);
        }, debounceMs);

        return () => {
            clearTimeout(timeoutId);
            setIsDebouncing(false);
        };
    }, [searchTerm, onChange, debounceMs, minLength]);

    const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    }, []);

    const handleClear = useCallback(() => {
        setSearchTerm('');
        onClear?.();
        onChange?.(undefined);
    }, [onChange, onClear]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Escape') {
            handleClear();
        }
    }, [handleClear]);

    const shouldShowClearButton = showClearButton && searchTerm.length > 0 && !disabled;

    return (
        <div className={`relative ${className}`}>
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    {label}
                </label>
            )}
            <div className="relative">
                <Search className={`w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 ${disabled ? 'text-gray-300' : isDebouncing ? 'text-blue-400' : 'text-gray-400'
                    }`} />
                <input
                    type="text"
                    placeholder={placeholder}
                    value={searchTerm}
                    onChange={handleSearch}
                    onKeyDown={handleKeyDown}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    disabled={disabled}
                    className={`pl-10 ${shouldShowClearButton ? 'pr-10' : 'pr-4'} py-2 w-80 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 ${disabled
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-white hover:border-gray-400'
                        } ${isDebouncing ? 'ring-1 ring-blue-200' : ''
                        } ${inputClassName}`}
                />
                {shouldShowClearButton && (
                    <button
                        type="button"
                        onClick={handleClear}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200 p-0.5 rounded-full hover:bg-gray-100"
                        aria-label="Clear search"
                    >
                        <X className="w-4 h-4" />
                    </button>
                )}
            </div>
            {minLength > 0 && searchTerm.length > 0 && searchTerm.length < minLength && (
                <p className="text-sm text-gray-500 mt-1">
                    Minimum {minLength} caractères requis
                </p>
            )}
        </div>
    );
}