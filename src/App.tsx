import React, { useState, useEffect } from 'react';
import { CertificateSelector } from './components/CertificateSelector';
import { DocumentList } from './components/DocumentList';
import { SigningPanel } from './components/SigningPanel';
import { StatusBar } from './components/StatusBar';
import { SetupGuide } from './components/SetupGuide';
import {
  CertificateInfo,
  DocumentFile,
  getCertificates,
  getCryptoProVersion,
  fileToBase64,
  signDocument,
  signDocumentAttached,
  generateId,
  downloadFile,
} from './utils/cades';

function App() {
  const [pluginStatus, setPluginStatus] = useState<'checking' | 'ok' | 'error'>('checking');
  const [cryptoProVersion, setCryptoProVersion] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [certificates, setCertificates] = useState<CertificateInfo[]>([]);
  const [selectedCert, setSelectedCert] = useState<CertificateInfo | null>(null);
  const [documents, setDocuments] = useState<DocumentFile[]>([]);
  const [signingMode, setSigningMode] = useState<'detached' | 'attached'>('detached');
  const [isSigning, setIsSigning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [loadingCerts, setLoadingCerts] = useState(false);

  // Проверка подключения к CryptoPro
  useEffect(() => {
    checkPlugin();
  }, []);

  const checkPlugin = async () => {
    setPluginStatus('checking');
    setError(null);
    try {
      const version = await getCryptoProVersion();
      setCryptoProVersion(version);
      setPluginStatus('ok');
      loadCertificates();
    } catch (e: any) {
      setPluginStatus('error');
      setError(e.message || 'Плагин не найден');
    }
  };

  // Загрузка сертификатов
  const loadCertificates = async () => {
    setLoadingCerts(true);
    try {
      const certs = await getCertificates();
      setCertificates(certs);
      if (certs.length > 0 && !selectedCert) {
        setSelectedCert(certs[0]);
      }
    } catch (e: any) {
      console.error('Ошибка загрузки сертификатов:', e);
      setError('Не удалось загрузить сертификаты: ' + e.message);
    } finally {
      setLoadingCerts(false);
    }
  };

  // Добавление файлов
  const handleAddFiles = async (files: File[]) => {
    const newDocs: DocumentFile[] = [];
    for (const file of files) {
      const base64 = await fileToBase64(file);
      newDocs.push({
        id: generateId(),
        file,
        name: file.name,
        size: file.size,
        content: base64,
        signed: false,
      });
    }
    setDocuments((prev) => [...prev, ...newDocs]);
    setSelectedIds((prev) => [...prev, ...newDocs.map((d) => d.id)]);
  };

  // Удаление файла
  const handleRemoveFile = (id: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
    setSelectedIds((prev) => prev.filter((sid) => sid !== id));
  };

  // Очистить все
  const handleClearAll = () => {
    setDocuments([]);
    setSelectedIds([]);
  };

  // Подписание всех документов
  const handleSignAll = async () => {
    if (!selectedCert) return;
    const unsignedDocs = documents.filter((d) => !d.signed);
    await signDocuments(unsignedDocs);
  };

  // Подписание выбранных
  const handleSignSelected = async (ids: string[]) => {
    if (!selectedCert) return;
    const selectedDocs = documents.filter((d) => ids.includes(d.id) && !d.signed);
    await signDocuments(selectedDocs);
  };

  // Процесс подписания
  const signDocuments = async (docsToSign: DocumentFile[]) => {
    if (!selectedCert || docsToSign.length === 0) return;

    setIsSigning(true);
    setProgress(0);

    for (let i = 0; i < docsToSign.length; i++) {
      const doc = docsToSign[i];
      try {
        let signature: string;
        if (signingMode === 'attached') {
          signature = await signDocumentAttached(doc.content, selectedCert.certificate);
        } else {
          signature = await signDocument(doc.content, selectedCert.certificate);
        }

        setDocuments((prev) =>
          prev.map((d) =>
            d.id === doc.id
              ? { ...d, signed: true, signedContent: signature, error: undefined }
              : d
          )
        );
      } catch (e: any) {
        console.error(`Ошибка подписания ${doc.name}:`, e);
        setDocuments((prev) =>
          prev.map((d) =>
            d.id === doc.id
              ? { ...d, error: e.message || 'Ошибка подписания' }
              : d
          )
        );
      }
      setProgress(Math.round(((i + 1) / docsToSign.length) * 100));
    }

    setIsSigning(false);
    setProgress(100);
    setSelectedIds([]);
  };

  // Скачивание подписанного документа
  const handleDownloadSelected = (id: string) => {
    const doc = documents.find((d) => d.id === id);
    if (!doc || !doc.signedContent) return;

    const ext = signingMode === 'detached' ? '.sig' : '.p7m';
    const filename = doc.name + ext;
    downloadFile(doc.signedContent, filename, 'application/octet-stream');
  };

  // Скачивание всех подписанных
  const handleDownloadAll = () => {
    const signedDocs = documents.filter((d) => d.signed && d.signedContent);
    signedDocs.forEach((doc) => {
      const ext = signingMode === 'detached' ? '.sig' : '.p7m';
      const filename = doc.name + ext;
      downloadFile(doc.signedContent!, filename, 'application/octet-stream');
    });
  };

  // Переключение выбора
  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  // Выбрать все неподписанные
  const handleSelectAll = () => {
    const unsignedIds = documents.filter((d) => !d.signed).map((d) => d.id);
    if (selectedIds.length === unsignedIds.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(unsignedIds);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center shadow-lg">
                <i className="fas fa-file-signature text-white text-lg"></i>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Подписание документов</h1>
                <p className="text-xs text-gray-500">
                  Квалифицированная электронная подпись • CryptoPro CSP 5
                </p>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-xs text-gray-500">
              <i className="fas fa-shield-alt text-green-500"></i>
              <span>ФЗ-63 «Об электронной подписи»</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Status */}
        <div className="mb-6">
          <StatusBar
            pluginStatus={pluginStatus}
            cryptoProVersion={cryptoProVersion}
            error={error}
          />
        </div>

        {/* Info banner */}
        {pluginStatus === 'ok' && (
          <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <i className="fas fa-info-circle text-blue-500 mt-0.5"></i>
              <div className="text-sm text-blue-700">
                <p className="font-medium mb-1">Инструкция по подписанию</p>
                <ol className="list-decimal list-inside space-y-1 text-blue-600">
                  <li>Выберите сертификат из списка ниже</li>
                  <li>Загрузите документы для подписания (drag & drop или кнопка)</li>
                  <li>Выберите тип подписи (отсоединённая или присоединённая)</li>
                  <li>Нажмите «Подписать» — файлы будут подписаны форматом CAdES-BES</li>
                  <li>Скачайте подписанные файлы</li>
                </ol>
              </div>
            </div>
          </div>
        )}

        {/* Grid layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - Certificate */}
          <div className="lg:col-span-1">
            <CertificateSelector
              certificates={certificates}
              selectedCert={selectedCert}
              onSelect={setSelectedCert}
              onRefresh={loadCertificates}
              loading={loadingCerts}
            />
          </div>

          {/* Right column - Documents and Signing */}
          <div className="lg:col-span-2 space-y-6">
            <DocumentList
              documents={documents}
              onAddFiles={handleAddFiles}
              onRemoveFile={handleRemoveFile}
              onClearAll={handleClearAll}
            />

            <SigningPanel
              selectedCert={selectedCert}
              documents={documents}
              signingMode={signingMode}
              onSigningModeChange={setSigningMode}
              onSignAll={handleSignAll}
              onSignSelected={handleSignSelected}
              onDownloadAll={handleDownloadAll}
              onDownloadSelected={handleDownloadSelected}
              isSigning={isSigning}
              progress={progress}
              selectedIds={selectedIds}
              onToggleSelect={handleToggleSelect}
              onSelectAll={handleSelectAll}
            />
          </div>
        </div>

        {/* Setup Guide */}
        <div className="mt-8">
          <SetupGuide />
        </div>

        {/* Footer info */}
        <div className="mt-12 border-t border-gray-200 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-600">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <i className="fas fa-lock text-blue-600 text-sm"></i>
              </div>
              <div>
                <p className="font-medium text-gray-800">CAdES-BES</p>
                <p className="text-xs text-gray-500">
                  Формат подписи соответствует ГОСТ Р 34.10-2012 и ФЗ-63
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <i className="fas fa-certificate text-green-600 text-sm"></i>
              </div>
              <div>
                <p className="font-medium text-gray-800">Квалифицированная подпись</p>
                <p className="text-xs text-gray-500">
                  Используется сертификат из хранилища CryptoPro CSP
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <i className="fas fa-server text-purple-600 text-sm"></i>
              </div>
              <div>
                <p className="font-medium text-gray-800">CryptoPro CSP 5</p>
                <p className="text-xs text-gray-500">
                  Криптографический провайдер с поддержкой ГОСТ алгоритмов
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
