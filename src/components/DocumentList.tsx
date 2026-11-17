import React, { useCallback } from 'react';
import { DocumentFile, formatFileSize } from '../utils/cades';

interface Props {
  documents: DocumentFile[];
  onAddFiles: (files: File[]) => void;
  onRemoveFile: (id: string) => void;
  onClearAll: () => void;
}

export const DocumentList: React.FC<Props> = ({
  documents,
  onAddFiles,
  onRemoveFile,
  onClearAll,
}) => {
  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        onAddFiles(files);
      }
    },
    [onAddFiles]
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      onAddFiles(files);
    }
    e.target.value = '';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <i className="fas fa-file-alt text-emerald-200 text-xl"></i>
          <h2 className="text-white font-semibold text-lg">Документы</h2>
          {documents.length > 0 && (
            <span className="bg-white/20 text-white text-sm px-2 py-0.5 rounded-full">
              {documents.length}
            </span>
          )}
        </div>
        {documents.length > 0 && (
          <button
            onClick={onClearAll}
            className="text-white/80 hover:text-white text-sm transition-colors"
          >
            <i className="fas fa-trash-alt mr-1"></i>Очистить
          </button>
        )}
      </div>

      <div className="p-6">
        {/* Drop zone */}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-emerald-400 hover:bg-emerald-50/50 transition-all cursor-pointer"
          onClick={() => document.getElementById('file-input')?.click()}
        >
          <i className="fas fa-cloud-upload-alt text-4xl text-gray-400 mb-3"></i>
          <p className="text-gray-600 font-medium">
            Перетащите файлы сюда или нажмите для выбора
          </p>
          <p className="text-gray-400 text-sm mt-1">
            Поддерживаются любые форматы файлов
          </p>
          <input
            id="file-input"
            type="file"
            multiple
            onChange={handleFileInput}
            className="hidden"
          />
        </div>

        {/* File list */}
        {documents.length > 0 && (
          <div className="mt-4 space-y-2 max-h-96 overflow-y-auto">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className={`flex items-center gap-3 p-3 rounded-lg border ${
                  doc.signed
                    ? 'border-green-200 bg-green-50'
                    : doc.error
                    ? 'border-red-200 bg-red-50'
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  doc.signed
                    ? 'bg-green-100 text-green-600'
                    : doc.error
                    ? 'bg-red-100 text-red-600'
                    : 'bg-blue-100 text-blue-600'
                }`}>
                  {doc.signed ? (
                    <i className="fas fa-file-signature"></i>
                  ) : doc.error ? (
                    <i className="fas fa-exclamation-triangle"></i>
                  ) : (
                    <i className="fas fa-file"></i>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{doc.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-gray-500">{formatFileSize(doc.size)}</span>
                    {doc.signed && (
                      <span className="text-xs text-green-600 font-medium">
                        <i className="fas fa-check-circle mr-1"></i>Подписан
                      </span>
                    )}
                    {doc.error && (
                      <span className="text-xs text-red-600 font-medium">
                        <i className="fas fa-times-circle mr-1"></i>{doc.error}
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => onRemoveFile(doc.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors p-1"
                  title="Удалить"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
