import React from 'react';
import Icon from '../AppIcon';

interface ProcessingStatusOverlayProps {
  isVisible: boolean;
  status: 'processing' | 'complete' | 'error';
  message?: string;
  progress?: number;
  onClose?: () => void;
  className?: string;
}

const ProcessingStatusOverlay = ({
  isVisible,
  status,
  message,
  progress,
  onClose,
  className = '',
}: ProcessingStatusOverlayProps) => {
  if (!isVisible) return null;

  const getStatusContent = () => {
    switch (status) {
      case 'processing':
        return {
          icon: (
            <div className="animate-spin">
              <Icon name="Loader2" size={48} color="var(--color-primary)" />
            </div>
          ),
          title: 'Processing Canvas',
          description: message || 'Please wait while we process your file...',
          showProgress: true,
        };
      case 'complete':
        return {
          icon: <Icon name="CheckCircle2" size={48} color="var(--color-success)" />,
          title: 'Processing Complete',
          description: message || 'Your file has been processed successfully',
          showProgress: false,
        };
      case 'error':
        return {
          icon: <Icon name="XCircle" size={48} color="var(--color-error)" />,
          title: 'Processing Failed',
          description: message || 'An error occurred while processing your file',
          showProgress: false,
        };
      default:
        return null;
    }
  };

  const content = getStatusContent();
  if (!content) return null;

  return (
    <div
      className={`fixed inset-0 z-[200] flex items-center justify-center ${className}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="processing-status-title"
    >
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={status !== 'processing' ? onClose : undefined}
      />

      <div className="relative bg-card border border-border rounded-lg shadow-elevation-md p-8 max-w-md w-full mx-4 animate-in fade-in zoom-in-95 duration-standard">
        <div className="flex flex-col items-center text-center">
          <div className="mb-4">{content.icon}</div>

          <h2
            id="processing-status-title"
            className="text-xl font-semibold text-foreground mb-2"
          >
            {content.title}
          </h2>

          <p className="text-sm text-muted-foreground mb-6">
            {content.description}
          </p>

          {content.showProgress && typeof progress === 'number' && (
            <div className="w-full mb-6">
              <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                <span>Progress</span>
                <span className="font-mono">{progress}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                <div
                  className="bg-primary h-full transition-all duration-standard ease-smooth"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {status !== 'processing' && onClose && (
            <button
              onClick={onClose}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-md font-medium text-sm hover:opacity-90 transition-opacity duration-micro min-h-[44px]"
            >
              {status === 'error' ? 'Try Again' : 'Continue'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProcessingStatusOverlay;