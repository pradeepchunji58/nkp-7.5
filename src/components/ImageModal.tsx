import React from 'react';
import { X, Download, ZoomIn, ExternalLink } from 'lucide-react';
import { QuestionImageAttachment } from '../types';

interface ImageModalProps {
  image: QuestionImageAttachment | null;
  onClose: () => void;
}

export const ImageModal: React.FC<ImageModalProps> = ({ image, onClose }) => {
  if (!image) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative max-w-5xl w-full max-h-[90vh] bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-slate-950 border-b border-slate-800 text-white">
          <div className="flex items-center gap-2 truncate pr-4">
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
              {image.questionId.toUpperCase()}
            </span>
            <span className="text-xs font-medium text-slate-200 truncate">
              {image.caption || image.fileName}
            </span>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <a
              href={image.imageUrl}
              download={image.fileName || 'screenshot.png'}
              target="_blank"
              rel="noreferrer"
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              title="Download image"
            >
              <Download className="w-4 h-4" />
            </a>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Close image preview"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Image View */}
        <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-slate-950/60 min-h-[300px]">
          <img
            src={image.imageUrl}
            alt={image.caption || 'Question screenshot reference'}
            className="max-h-[75vh] w-auto max-w-full object-contain rounded-lg shadow-lg border border-slate-800"
          />
        </div>

        {/* Modal Bottom Footer */}
        {image.caption && (
          <div className="px-5 py-3 bg-slate-900 border-t border-slate-800 text-xs text-slate-300 flex items-center justify-between">
            <p className="font-medium text-slate-200">{image.caption}</p>
            <span className="text-[11px] text-slate-500 font-mono">
              {image.fileSize ? `${Math.round(image.fileSize / 1024)} KB` : ''}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
