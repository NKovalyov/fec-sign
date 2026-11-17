import React from 'react';
import { CertificateInfo } from '../utils/cades';

interface Props {
  certificates: CertificateInfo[];
  selectedCert: CertificateInfo | null;
  onSelect: (cert: CertificateInfo) => void;
  onRefresh: () => void;
  loading: boolean;
}

export const CertificateSelector: React.FC<Props> = ({
  certificates,
  selectedCert,
  onSelect,
  onRefresh,
  loading,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <i className="fas fa-certificate text-yellow-300 text-xl"></i>
          <h2 className="text-white font-semibold text-lg">Сертификат подписи</h2>
        </div>
        <button
          onClick={onRefresh}
          disabled={loading}
          className="text-white/80 hover:text-white transition-colors disabled:opacity-50"
          title="Обновить список"
        >
          <i className={`fas fa-sync-alt ${loading ? 'animate-spin' : ''}`}></i>
        </button>
      </div>
      
      <div className="p-6">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-500">Загрузка сертификатов...</span>
          </div>
        ) : certificates.length === 0 ? (
          <div className="text-center py-8">
            <i className="fas fa-exclamation-triangle text-yellow-500 text-3xl mb-3"></i>
            <p className="text-gray-500 mb-2">Сертификаты не найдены</p>
            <p className="text-gray-400 text-sm">
              Убедитесь, что CryptoPro CSP установлен и сертификаты загружены в хранилище «Личное»
            </p>
          </div>
        ) : (
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {certificates.map((cert, index) => (
              <div
                key={index}
                onClick={() => onSelect(cert)}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${
                  selectedCert?.thumbprint === cert.thumbprint
                    ? 'border-blue-500 bg-blue-50 shadow-md'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                    selectedCert?.thumbprint === cert.thumbprint
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-gray-300'
                  }`}>
                    {selectedCert?.thumbprint === cert.thumbprint && (
                      <i className="fas fa-check text-white text-xs"></i>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{cert.commonName}</p>
                    {cert.organization && (
                      <p className="text-sm text-gray-600 truncate mt-1">{cert.organization}</p>
                    )}
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-gray-500">
                      {cert.inn && <span>ИНН: {cert.inn}</span>}
                      {cert.snils && <span>СНИЛС: {cert.snils}</span>}
                    </div>
                    <div className="flex items-center gap-2 mt-2 text-xs">
                      <span className="text-gray-400">
                        Действителен: {formatDate(cert.validFrom)} — {formatDate(cert.validTo)}
                      </span>
                      {isExpired(cert.validTo) ? (
                        <span className="text-red-500 font-medium">
                          <i className="fas fa-times-circle mr-1"></i>Истёк
                        </span>
                      ) : (
                        <span className="text-green-600">
                          <i className="fas fa-check-circle mr-1"></i>Действителен
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

function formatDate(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ru-RU');
  } catch {
    return dateStr;
  }
}

function isExpired(validTo: string): boolean {
  try {
    return new Date(validTo) < new Date();
  } catch {
    return false;
  }
}
