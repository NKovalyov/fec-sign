import React from 'react';

interface Props {
  pluginStatus: 'checking' | 'ok' | 'error';
  cryptoProVersion: string;
  error: string | null;
}

export const StatusBar: React.FC<Props> = ({ pluginStatus, cryptoProVersion, error }) => {
  return (
    <div className={`rounded-lg px-4 py-3 flex items-center gap-3 ${
      pluginStatus === 'ok'
        ? 'bg-green-50 border border-green-200'
        : pluginStatus === 'error'
        ? 'bg-red-50 border border-red-200'
        : 'bg-blue-50 border border-blue-200'
    }`}>
      {pluginStatus === 'checking' && (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          <span className="text-sm text-blue-700">Проверка подключения к CryptoPro...</span>
        </>
      )}
      {pluginStatus === 'ok' && (
        <>
          <i className="fas fa-shield-alt text-green-600"></i>
          <span className="text-sm text-green-700">
            CryptoPro подключён
            {cryptoProVersion && <span className="ml-2 text-green-600">({cryptoProVersion})</span>}
          </span>
        </>
      )}
      {pluginStatus === 'error' && (
        <>
          <i className="fas fa-exclamation-triangle text-red-600"></i>
          <div className="text-sm text-red-700">
            <p>{error || 'CryptoPro Browser Plugin не обнаружен'}</p>
            <p className="text-xs text-red-500 mt-1">
              Установите <a href="https://www.cryptopro.ru/products/cades/plugin" target="_blank" rel="noopener noreferrer" className="underline">CAdESCOM Browser Plugin</a> и 
              <a href="https://www.cryptopro.ru/products/csp/" target="_blank" rel="noopener noreferrer" className="underline">CryptoPro CSP 5</a>
            </p>
          </div>
        </>
      )}
    </div>
  );
};
