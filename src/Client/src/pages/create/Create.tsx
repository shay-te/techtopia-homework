import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import TopNavigationBar from '../../components/ui/TopNavigationBar';
import FileUploadIndicator from '../../components/ui/FileUploadIndicator';
import FileUploadZone from '../../components/FileUploadZone';
import FileManagementControls from '../../components/FileManagementControls';
import CanvasPanel from '../../components/CanvasPanel';
import type { FileUploadItem, ProcessingStatus } from '../../components/types';
import { Draw, DrawClient } from '../../client/Client';

const client = new DrawClient();


const Create = () => {
  const [draw, setDraw] = useState<Draw | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<FileUploadItem[]>([]);
  const [processingStatus, setProcessingStatus] = useState<ProcessingStatus>({
    isVisible: false,
    status: 'processing',
    progress: 0,
  });

  const handleFilesSelected = (files: File[]) => {
    const newFiles: FileUploadItem[] = files.map((file) => ({
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: file.name,
      size: file.size,
      progress: 0,
      status: 'uploading',
      file,
    }));

    setUploadedFiles((prev) => [...prev, ...newFiles]);

    newFiles.forEach((fileItem) => {
      updateFile(fileItem);
    });
  };

  const updateFile = async (fileItem: FileUploadItem) => {
    const draw = await client.create(fileItem.name, fileItem.file);
    setDraw(draw);
  };

  const handleRemoveFile = (fileId: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== fileId));
  };

  const handleClearAll = () => {
    setUploadedFiles([]);
  };

  const handleCancelUpload = (fileId: string) => {
    setUploadedFiles((prev) =>
      prev.map((f) =>
        f.id === fileId
          ? { ...f, status: 'error', errorMessage: 'Upload cancelled' }
          : f
      )
    );
  };

  const handleRetryUpload = (fileId: string) => {
    const file = uploadedFiles.find((f) => f.id === fileId);
    if (file) {
      setUploadedFiles((prev) =>
        prev.map((f) =>
          f.id === fileId ? { ...f, status: 'uploading', progress: 0 } : f
        )
      );
      updateFile(file);
    }
  };


  return (
    <>
      <Helmet>
        <title>Create - File Canvas Processor</title>
        <meta
          name="description"
          content="Upload and visualize files through canvas-based rendering with real-time processing feedback"
        />
      </Helmet>

      <div className="min-h-screen bg-background">
        <TopNavigationBar />

        <main className="pt-[60px]">
          <div className="h-[calc(100vh-60px)] flex flex-col lg:flex-row">
            <div className="w-full lg:w-2/5 border-r border-border bg-card overflow-y-auto">
              <div className="p-6 space-y-6">
                <div>
                  <h1 className="text-2xl font-semibold text-foreground mb-2">
                    Upload Files
                  </h1>
                </div>

                <FileUploadZone
                  onFilesSelected={handleFilesSelected}
                  disabled={processingStatus.isVisible}
                />

                {uploadedFiles.length > 0 && (
                  <div className="space-y-4">
                    <FileUploadIndicator
                      files={uploadedFiles}
                      onCancel={handleCancelUpload}
                      onRetry={handleRetryUpload}
                    />

                    <FileManagementControls
                      files={uploadedFiles}
                      onRemoveFile={handleRemoveFile}
                      onClearAll={handleClearAll}
                      disabled={processingStatus.isVisible}
                    />
                  </div>
                )}

                {uploadedFiles.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-sm text-muted-foreground">
                      No files uploaded yet. Start by uploading files above.
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex-1 bg-background">
              <CanvasPanel draw={draw}/>
            </div>
          </div>
        </main>

      </div>
    </>
  );
};

export default Create;