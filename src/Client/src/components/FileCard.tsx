import React from 'react';
import Icon from './AppIcon';
import Button from './ui/Button';
import { Checkbox } from './ui/Checkbox';
import { FileItem } from './types';

interface FileCardProps {
  file: FileItem;
  isSelected: boolean;
  onSelect: (fileId: string) => void;
  onView: (fileId: string) => void;
  onDownload: (fileId: string) => void;
  onDelete: (fileId: string) => void;
  onReprocess: (fileId: string) => void;
}

const FileCard = ({
  file,
  isSelected,
  onSelect,
  onView,
  onDownload,
  onDelete,
  onReprocess,
}: FileCardProps) => {
  const getStatusColor = (status: FileItem['status']) => {
    switch (status) {
      case 'success':
        return 'text-green-600 bg-green-50';
      case 'processing':
        return 'text-blue-600 bg-blue-50';
      case 'failed':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getTypeIcon = (type: FileItem['type']) => {
    switch (type) {
      case 'image':
        return 'Image';
      case 'video':
        return 'Video';
      case 'document':
        return 'FileText';
      default:
        return 'File';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  return (
    <div
      className={`
        relative group bg-card border rounded-lg overflow-hidden
        transition-all duration-micro hover:shadow-lg
        ${isSelected ? 'border-primary ring-2 ring-primary/20' : 'border-border'}
      `}
    >
      <div className="absolute top-3 left-3 z-10">
        <Checkbox
          checked={isSelected}
          onChange={() => onSelect(file.id)}
          className="bg-white shadow-md"
        />
      </div>

      <div className="relative aspect-video bg-muted overflow-hidden">
        {file.thumbnail ? (
          <img
            src={file.thumbnail}
            alt={file.thumbnailAlt || `Thumbnail for ${file.name}`}
            className="w-full h-full object-cover transition-transform duration-standard group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Icon
              name={getTypeIcon(file.type)}
              size={48}
              className="text-muted-foreground"
            />
          </div>
        )}

        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-micro flex items-center justify-center opacity-0 group-hover:opacity-100">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onView(file.id)}
            iconName="Eye"
            iconPosition="left"
          >
            View
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-medium text-foreground truncate mb-1">{file.name}</h3>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>{formatFileSize(file.size)}</span>
            <span>•</span>
            <span>{formatDate(file.uploadDate)}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span
            className={`
              inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium
              ${getStatusColor(file.status)}
            `}
          >
            {file.status === 'processing' && (
              <Icon name="Loader" size={12} className="animate-spin" />
            )}
            {file.status === 'success' && <Icon name="CheckCircle" size={12} />}
            {file.status === 'failed' && <Icon name="XCircle" size={12} />}
            {file.status.charAt(0).toUpperCase() + file.status.slice(1)}
          </span>

          <div className="flex items-center gap-1">
            {file.status === 'success' && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDownload(file.id)}
                iconName="Download"
                aria-label="Download file"
              />
            )}
            {file.status === 'failed' && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onReprocess(file.id)}
                iconName="RefreshCw"
                aria-label="Reprocess file"
              />
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(file.id)}
              iconName="Trash2"
              className="text-destructive hover:text-destructive"
              aria-label="Delete file"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileCard;