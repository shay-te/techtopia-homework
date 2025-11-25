import React from 'react';
import Icon from './AppIcon';
import Button from './ui/Button';

interface EmptyStateProps {
  hasFilters: boolean;
  onClearFilters: () => void;
}

const EmptyState = ({ hasFilters, onClearFilters }: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="p-6 rounded-full bg-muted mb-6">
        <Icon
          name={hasFilters ? 'SearchX' : 'FolderOpen'}
          size={64}
          className="text-muted-foreground"
        />
      </div>

      <h3 className="text-xl font-semibold text-foreground mb-2">
        {hasFilters ? 'No files found' : 'No files yet'}
      </h3>

      <p className="text-muted-foreground text-center max-w-md mb-6">
        {hasFilters
          ? 'Try adjusting your filters or search query to find what you\'re looking for.'
          : 'Start by uploading your first file to see it appear here.'}
      </p>

      {hasFilters ? (
        <Button
          variant="outline"
          onClick={onClearFilters}
          iconName="X"
          iconPosition="left"
        >
          Clear Filters
        </Button>
      ) : (
        <Button variant="default" iconName="Upload" iconPosition="left">
          Upload Files
        </Button>
      )}
    </div>
  );
};

export default EmptyState;