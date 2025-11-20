import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';

// Smart Button with async loading state
export const SmartButton: React.FC<{
    onClick?: (e: React.MouseEvent) => Promise<void> | void;
    children: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'danger';
    className?: string;
    isLoading?: boolean;
    disabled?: boolean;
    type?: 'button' | 'submit' | 'reset';
}> = ({ onClick, children, variant = 'primary', className = '', isLoading = false, disabled, type = 'button' }) => {
    const [internalLoading, setInternalLoading] = useState(false);

    const handleClick = async (e: React.MouseEvent) => {
        if (type === 'submit') return;
        if (onClick) {
            setInternalLoading(true);
            try {
                await onClick(e);
            } finally {
                setInternalLoading(false);
            }
        }
    };

    const baseStyles = "px-4 py-2 rounded-lg font-bold text-sm transition-all duration-200 flex items-center justify-center relative overflow-hidden focus:outline-none focus:ring-2 focus:ring-offset-1";
    const variants = {
        primary: "bg-greatlakes-blue text-white hover:bg-greatlakes-blue/90 focus:ring-greatlakes-blue shadow-sm hover:shadow-md",
        secondary: "bg-white text-greatlakes-gray-dark border border-greatlakes-gray-medium hover:bg-greatlakes-gray-light focus:ring-greatlakes-gray-medium",
        danger: "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 focus:ring-red-500"
    };

    const loadingState = isLoading || internalLoading;

    return (
        <button
            type={type}
            onClick={handleClick}
            disabled={loadingState || disabled}
            className={`${baseStyles} ${variants[variant]} ${className} ${loadingState || disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
        >
            {loadingState && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {children}
        </button>
    );
};

// Validated Input with real-time validation
export const ValidatedInput: React.FC<{
    type: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    validation?: (value: string) => boolean | string;
    className?: string;
}> = ({ type, value, onChange, placeholder, validation, className = '' }) => {
    const [error, setError] = useState<string | null>(null);
    const [touched, setTouched] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        onChange(newValue);

        if (validation && touched) {
            const result = validation(newValue);
            if (typeof result === 'string') {
                setError(result);
            } else if (!result) {
                setError('Invalid input');
            } else {
                setError(null);
            }
        }
    };

    const handleBlur = () => {
        setTouched(true);
        if (validation) {
            const result = validation(value);
            if (typeof result === 'string') {
                setError(result);
            } else if (!result) {
                setError('Invalid input');
            } else {
                setError(null);
            }
        }
    };

    return (
        <div className="w-full">
            <input
                type={type}
                value={value}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder={placeholder}
                className={`gl-input ${error && touched ? 'border-red-500' : ''} ${className}`}
            />
            {error && touched && (
                <p className="text-red-500 text-xs mt-1">{error}</p>
            )}
        </div>
    );
};

// Advanced Table with sorting and filtering
export const AdvancedTable: React.FC<{
    columns: Array<{ key: string; label: string; sortable?: boolean }>;
    data: any[];
    onRowClick?: (row: any) => void;
    className?: string;
}> = ({ columns, data, onRowClick, className = '' }) => {
    const [sortKey, setSortKey] = useState<string | null>(null);
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

    const handleSort = (key: string) => {
        if (sortKey === key) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortKey(key);
            setSortOrder('asc');
        }
    };

    const sortedData = sortKey
        ? [...data].sort((a, b) => {
              const aVal = a[sortKey];
              const bVal = b[sortKey];
              if (aVal === bVal) return 0;
              if (sortOrder === 'asc') {
                  return aVal > bVal ? 1 : -1;
              } else {
                  return aVal < bVal ? 1 : -1;
              }
          })
        : data;

    return (
        <div className={`overflow-x-auto ${className}`}>
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-greatlakes-gray-light">
                    <tr>
                        {columns.map((col) => (
                            <th
                                key={col.key}
                                className={`px-6 py-3 text-left text-xs font-medium text-greatlakes-gray-darker uppercase tracking-wider ${
                                    col.sortable ? 'cursor-pointer hover:bg-gray-200' : ''
                                }`}
                                onClick={() => col.sortable && handleSort(col.key)}
                            >
                                {col.label}
                                {col.sortable && sortKey === col.key && (
                                    <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                                )}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {sortedData.map((row, idx) => (
                        <tr
                            key={idx}
                            onClick={() => onRowClick?.(row)}
                            className={`${onRowClick ? 'cursor-pointer hover:bg-gray-50' : ''}`}
                        >
                            {columns.map((col) => (
                                <td key={col.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {row[col.key]}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
