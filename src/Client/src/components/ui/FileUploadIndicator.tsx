import React from 'react';
import Icon from '../AppIcon';

interface FileUploadItem {
  id: string;
  name: string;
  size: number;
  progress: number;
  status: 'uploading' | 'processing' | 'complete' | 'error';
  errorMessage?: string;
}

interface FileUploadIndicatorProps {
  files: FileUploadItem[];
  onCancel?: (fileId: string) => void;
  onRetry?: (fileId: string) => void;
  className?: string;
}

const FileUploadIndicator = ({
  files,
  onCancel,
  onRetry,
  className = '',
}: FileUploadIndicatorProps) => {
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getStatusIcon = (status: FileUploadItem['status']) => {
    switch (status) {
      case 'complete':
        return <Icon name="CheckCircle2" size={20} color="var(--color-success)" />;
      case 'error':
        return <Icon name="XCircle" size={20} color="var(--color-error)" />;
      case 'uploading': case'processing':
        return (
          <div className="animate-spin">
            <Icon name="Loader2" size={20} color="var(--color-primary)" />
          </div>
        );
      default:
        return null;
    }
  };

  const getStatusText = (status: FileUploadItem['status']) => {
    switch (status) {
      case 'uploading':
        return 'Uploading...';
      case 'processing':
        return 'Processing...';
      case 'complete':
        return 'Complete';
      case 'error':
        return 'Failed';
      default:
        return '';
    }
  };

  if (files.length === 0) return null;

  return (
    <div className={`space-y-3 ${className}`}>
      {files.map((file) => (
        <div
          key={file.id}
          className="bg-card border border-border rounded-lg p-4 shadow-elevation-sm"
        >
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5">
              {getStatusIcon(file.status)}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-1">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {formatFileSize(file.size)}
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  {file.status === 'error' && onRetry && (
                    <button
                      onClick={() => onRetry(file.id)}
                      className="p-1 rounded hover:bg-muted transition-colors duration-micro"
                      aria-label="Retry upload"
                    >
                      <Icon name="RotateCw" size={16} />
                    </button>
                  )}
                  {(file.status === 'uploading' || file.status === 'processing') &&
                    onCancel && (
                      <button
                        onClick={() => onCancel(file.id)}
                        className="p-1 rounded hover:bg-muted transition-colors duration-micro"
                        aria-label="Cancel upload"
                      >
                        <Icon name="X" size={16} />
                      </button>
                    )}
                </div>
              </div>

              {file.status === 'error' && file.errorMessage && (
                <p className="text-xs text-error mt-1">{file.errorMessage}</p>
              )}

              {(file.status === 'uploading' || file.status === 'processing') && (
                <div className="mt-2">
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                    <span>{getStatusText(file.status)}</span>
                    <span>{file.progress}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-primary h-full transition-all duration-standard ease-smooth"
                      style={{ width: `${file.progress}%` }}
                    />
                  </div>
                </div>
              )}

              {file.status === 'complete' && (
                <p className="text-xs text-success mt-1">
                  {getStatusText(file.status)}
                </p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FileUploadIndicator;