import React from 'react';
import Icon from './AppIcon';
import Input from './ui/Input';
import Select from './ui/Select';
import Button from './ui/Button';
import { FilterOptions } from './types';

interface FilterBarProps {
  filters: FilterOptions;
  searchQuery: string;
  onFilterChange: (filters: FilterOptions) => void;
  onSearchChange: (query: string) => void;
  onClearFilters: () => void;
  totalFiles: number;
  selectedCount: number;
}

const FilterBar = ({
  filters,
  searchQuery,
  onFilterChange,
  onSearchChange,
  onClearFilters,
  totalFiles,
  selectedCount,
}: FilterBarProps) => {
  const hasActiveFilters =
    searchQuery !== '' ||
    filters.status !== 'all' ||
    filters.type !== 'all' ||
    filters.sortBy !== 'date' ||
    filters.sortOrder !== 'desc';

  return (
    <div className="bg-card border border-border rounded-lg p-4 mb-6 space-y-4">
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <Input
            type="text"
            placeholder="Search files..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            icon={<Icon name="Search" size={18} />}
            className="w-full"
          />
        </div>

        <div className="flex flex-wrap gap-3">
          <Select
            value={filters.status}
            onChange={(value) =>
              onFilterChange({ ...filters, status: value as FilterOptions['status'] })
            }
            options={[
              { value: 'all', label: 'All Status' },
              { value: 'success', label: 'Success' },
              { value: 'processing', label: 'Processing' },
              { value: 'failed', label: 'Failed' },
            ]}
            className="w-[150px]"
          />

          <Select
            value={filters.type}
            onChange={(value) =>
              onFilterChange({ ...filters, type: value as FilterOptions['type'] })
            }
            options={[
              { value: 'all', label: 'All Types' },
              { value: 'image', label: 'Images' },
              { value: 'video', label: 'Videos' },
              { value: 'document', label: 'Documents' },
            ]}
            className="w-[150px]"
          />

          <Select
            value={filters.sortBy}
            onChange={(value) =>
              onFilterChange({ ...filters, sortBy: value as FilterOptions['sortBy'] })
            }
            options={[
              { value: 'date', label: 'Date' },
              { value: 'name', label: 'Name' },
              { value: 'size', label: 'Size' },
            ]}
            className="w-[130px]"
          />

          <Button
            variant="outline"
            size="default"
            onClick={() =>
              onFilterChange({
                ...filters,
                sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc',
              })
            }
            iconName={filters.sortOrder === 'asc' ? 'ArrowUp' : 'ArrowDown'}
            aria-label={`Sort ${filters.sortOrder === 'asc' ? 'ascending' : 'descending'}`}
          />

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="default"
              onClick={onClearFilters}
              iconName="X"
              iconPosition="left"
            >
              Clear
            </Button>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">
          Showing {totalFiles} {totalFiles === 1 ? 'file' : 'files'}
        </span>
        {selectedCount > 0 && (
          <span className="text-primary font-medium">
            {selectedCount} {selectedCount === 1 ? 'file' : 'files'} selected
          </span>
        )}
      </div>
    </div>
  );
};

export default FilterBar;