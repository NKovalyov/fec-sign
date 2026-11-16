import React from 'react';
import { CertificateInfo, DocumentFile } from '../utils/cades';

interface Props {
  selectedCert: CertificateInfo | null;
  documents: DocumentFile[];
  signingMode: 'detached' | 'attached';
  onSigningModeChange: (mode: 'detached' | 'attached') => void;
  onSignAll: () => void;
  onSignSelected: (ids: string[]) => void;
  onDownloadAll: () => void;
  onDownloadSelected: (id: string) => void;
  isSigning: boolean;
  progress: number;
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
  onSelectAll: () => void;
}

export const SigningPanel: React.FC<Props> = ({
  selectedCert,
  documents,
  signingMode,
  onSigningModeChange,
  onSignAll,
  onSignSelected,
  onDownloadAll,
  onDownloadSelected,
  isSigning,
  progress,
  selectedIds,
  onToggleSelect,
  onSelectAll,
}) => {
  const unsignedDocs = documents.filter((d) => !d.signed);
  const signedDocs = documents.filter((d) => d.signed);
  const canSign = selectedCert && unsignedDocs.length > 0 && !isSigning;

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4 flex items-center gap-3">
        <i className="fas fa-signature text-purple-200 text-xl"></i>
        <h2 className="text-white font-semibold text-lg">Подписание</h2>
      </div>

      <div className="p-6 space-y-6">
        {/* Режим подписи */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Тип подписи (согласно ФЗ-63)
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={() => onSigningModeChange('detached')}
              className={`p-3 rounded-lg border-2 text-left transition-all ${
                signingMode === 'detached'
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-200 hover:border-purple-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <i className={`fas fa-unlink ${signingMode === 'detached' ? 'text-purple-600' : 'text-gray-400'}`}></i>
                <span className="font-medium text-sm">Отсоединённая</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Подпись в отдельном файле (.sig)
              </p>
            </button>
            <button
              onClick={() => onSigningModeChange('attached')}
              className={`p-3 rounded-lg border-2 text-left transition-all ${
                signingMode === 'attached'
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-200 hover:border-purple-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <i className={`fas fa-link ${signingMode === 'attached' ? 'text-purple-600' : 'text-gray-400'}`}></i>
                <span className="font-medium text-sm">Присоединённая</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Подпись внутри файла (.sig)
              </p>
            </button>
          </div>
        </div>

        {/* Прогресс подписания */}
        {isSigning && (
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Подписание документов...</span>
              <span className="text-purple-600 font-medium">{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-purple-600 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Кнопки действий */}
        <div className="space-y-3">
          {/* Выбор документов */}
          {documents.length > 0 && (
            <div className="border rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Выбор документов ({selectedIds.length}/{unsignedDocs.length})
                </span>
                <button
                  onClick={onSelectAll}
                  className="text-xs text-purple-600 hover:text-purple-800"
                >
                  {selectedIds.length === unsignedDocs.length ? 'Снять все' : 'Выбрать все'}
                </button>
              </div>
              <div className="max-h-32 overflow-y-auto space-y-1">
                {unsignedDocs.map((doc) => (
                  <label
                    key={doc.id}
                    className="flex items-center gap-2 p-1.5 rounded hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(doc.id)}
                      onChange={() => onToggleSelect(doc.id)}
                      className="rounded text-purple-600 focus:ring-purple-500"
                    />
                    <span className="text-xs text-gray-700 truncate">{doc.name}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Кнопки подписания */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onSignAll}
              disabled={!canSign}
              className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {isSigning ? (
                <>
                  <i className="fas fa-spinner animate-spin"></i>
                  Подписание...
                </>
              ) : (
                <>
                  <i className="fas fa-file-signature"></i>
                  Подписать все ({unsignedDocs.length})
                </>
              )}
            </button>
            {selectedIds.length > 0 && (
              <button
                onClick={() => onSignSelected(selectedIds)}
                disabled={!canSign}
                className="flex-1 bg-purple-500 hover:bg-purple-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <i className="fas fa-check-double"></i>
                Подписать выбранные ({selectedIds.length})
              </button>
            )}
          </div>
        </div>

        {/* Скачивание подписанных */}
        {signedDocs.length > 0 && (
          <div className="border-t pt-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-700">
                <i className="fas fa-check-circle text-green-500 mr-2"></i>
                Подписано: {signedDocs.length}
              </span>
              <button
                onClick={onDownloadAll}
                className="text-sm text-green-600 hover:text-green-800 font-medium flex items-center gap-1"
              >
                <i className="fas fa-download"></i>
                Скачать все
              </button>
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {signedDocs.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-2 bg-green-50 rounded-lg border border-green-200"
                >
                  <span className="text-xs text-gray-700 truncate flex-1">{doc.name}</span>
                  <button
                    onClick={() => onDownloadSelected(doc.id)}
                    className="text-green-600 hover:text-green-800 text-xs ml-2 flex items-center gap-1 flex-shrink-0"
                  >
                    <i className="fas fa-download"></i>
                    Скачать
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
