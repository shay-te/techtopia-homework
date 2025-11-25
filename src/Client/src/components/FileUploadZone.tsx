import React, { useRef, useState } from 'react';
import Icon from './AppIcon';
import Button from './ui/Button';

interface FileUploadZoneProps {
  onFilesSelected: (files: File[]) => void;
  acceptedFormats?: string;
  maxFiles?: number;
  disabled?: boolean;
}

const FileUploadZone = ({
  onFilesSelected,
  acceptedFormats = '.svg',
  maxFiles = 10,
  disabled = false,
}: FileUploadZoneProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (disabled) return;

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      const validFiles = files.slice(0, maxFiles);
      onFilesSelected(validFiles);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const fileArray = Array.from(files).slice(0, maxFiles);
      onFilesSelected(fileArray);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleChooseFiles = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full">
      <div
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center
          transition-all duration-standard
          ${
            isDragging
              ? 'border-primary bg-primary/5' :'border-border bg-muted/30'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedFormats}
          onChange={handleFileSelect}
          disabled={disabled}
          className="hidden"
          aria-label="File upload input"
        />

        <div className="flex flex-col items-center gap-4">
          <div
            className={`
            p-4 rounded-full transition-colors duration-micro
            ${isDragging ? 'bg-primary/10' : 'bg-muted'}
          `}
          >
            <Icon
              name="Upload"
              size={32}
              color={isDragging ? 'var(--color-primary)' : 'var(--color-muted-foreground)'}
            />
          </div>
          <Button
            variant="outline"
            onClick={handleChooseFiles}
            disabled={disabled}
            iconName="FolderOpen"
            iconPosition="left"
            className="mt-2"
          >
            Choose Files
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FileUploadZone;