import React from 'react';
import Icon from './AppIcon';
import Button from './ui/Button';
import type { FileUploadItem } from './types';

interface FileManagementControlsProps {
  files: FileUploadItem[];
  onRemoveFile: (fileId: string) => void;
  onClearAll: () => void;
  disabled?: boolean;
}

const FileManagementControls = ({
  files,
  onRemoveFile,
  onClearAll,
  disabled = false,
}: FileManagementControlsProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-foreground">
          Uploaded Files ({files.length})
        </h3>
        {files.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearAll}
            disabled={disabled}
            iconName="Trash2"
            iconPosition="left"
            className="text-destructive hover:text-destructive"
          >
            Clear All
          </Button>
        )}
      </div>

      <div className="space-y-2">
        {files.map((file) => (
          <div
            key={file.id}
            className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <Icon name="File" size={20} className="text-muted-foreground flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {file.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemoveFile(file.id)}
              disabled={disabled}
              iconName="X"
              className="flex-shrink-0 ml-2"
              aria-label={`Remove ${file.name}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default FileManagementControls;