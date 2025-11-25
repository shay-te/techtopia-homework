import React from 'react';
import Button from './ui/Button';

interface BulkActionBarProps {
  selectedCount: number;
  onDownloadSelected: () => void;
  onDeleteSelected: () => void;
  onReprocessSelected: () => void;
  onClearSelection: () => void;
}

const BulkActionBar = ({
  selectedCount,
  onDownloadSelected,
  onDeleteSelected,
  onReprocessSelected,
  onClearSelection,
}: BulkActionBarProps) => {
  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-slide-up">
      <div className="bg-card border border-border rounded-full shadow-2xl px-6 py-3">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-foreground">
            {selectedCount} {selectedCount === 1 ? 'file' : 'files'} selected
          </span>

          <div className="w-px h-6 bg-border" />

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onDownloadSelected}
              iconName="Download"
              iconPosition="left"
            >
              Download
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={onReprocessSelected}
              iconName="RefreshCw"
              iconPosition="left"
            >
              Reprocess
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={onDeleteSelected}
              iconName="Trash2"
              iconPosition="left"
              className="text-destructive hover:text-destructive"
            >
              Delete
            </Button>

            <div className="w-px h-6 bg-border" />

            <Button
              variant="ghost"
              size="sm"
              onClick={onClearSelection}
              iconName="X"
              aria-label="Clear selection"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkActionBar;