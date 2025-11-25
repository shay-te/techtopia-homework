export interface FileUploadItem {
  id: string;
  name: string;
  size: number;
  progress: number;
  status: 'uploading' | 'processing' | 'complete' | 'error';
  errorMessage?: string;
  file: File;
}

export interface CanvasPoint {
  x: number;
  y: number;
}

export interface CanvasDrawing {
  points: CanvasPoint[];
  color: string;
  width: number;
}

export interface CanvasState {
  scale: number;
  offsetX: number;
  offsetY: number;
  isDrawing: boolean;
  isPanning: boolean;
  drawings: CanvasDrawing[];
  currentColor: string;
  currentWidth: number;
}

export interface ProcessingStatus {
  isVisible: boolean;
  status: 'processing' | 'complete' | 'error';
  message?: string;
  progress?: number;
}


// ---LIST TYPES --

export interface FileItem {
  id: string;
  name: string;
  size: number;
  uploadDate: Date;
  status: 'success' | 'processing' | 'failed';
  type: string;
  thumbnail: string;
  thumbnailAlt: string;
  processedUrl?: string;
}

export interface FilterOptions {
  status: 'all' | 'success' | 'processing' | 'failed';
  type: 'all' | 'image' | 'document' | 'video';
  sortBy: 'date' | 'name' | 'size';
  sortOrder: 'asc' | 'desc';
}

export interface BulkAction {
  type: 'download' | 'delete' | 'reprocess';
  fileIds: string[];
}