// Утилита для работы с CryptoPro CAdESCOM Browser Plugin

export interface CertificateInfo {
  certificate: any;
  subjectName: string;
  issuerName: string;
  serialNumber: string;
  thumbprint: string;
  validFrom: string;
  validTo: string;
  organization: string;
  inn: string;
  snils: string;
  commonName: string;
}

export interface DocumentFile {
  id: string;
  file: File;
  name: string;
  size: number;
  content: string; // Base64
  signedContent?: string;
  signed: boolean;
  error?: string;
}

// Получение плагина cadesplugin
export async function getCadesPlugin(): Promise<any> {
  // Ждём до 5 секунд появления плагина
  const maxWait = 5000;
  const interval = 200;
  let elapsed = 0;
  
  while (elapsed < maxWait) {
    const plugin = (window as any).cadesplugin;
    if (plugin) {
      // Если это Promise, ждём его
      if (plugin.then) {
        return await plugin;
      }
      return plugin;
    }
    await new Promise(resolve => setTimeout(resolve, interval));
    elapsed += interval;
  }
  
  throw new Error(
    'Криптопровайдер CAdESCOM Browser Plugin не найден. Убедитесь, что CryptoPro CSP 5 и Browser Plugin установлены, а расширение для браузера активно.'
  );
}

// Получение списка сертификатов из хранилища
export async function getCertificates(): Promise<CertificateInfo[]> {
  const cadesplugin = await getCadesPlugin();
  const store = await cadesplugin.CreateObjectAsync('CAdESCOM.Store');
  
  try {
    store.Open(
      cadesplugin.CAPICOM_CURRENT_USER_STORE,
      'My',
      cadesplugin.CAPICOM_STORE_OPEN_READ_ONLY
    );

    const certificates = store.Certificates;
    const count = await certificates.Count;
    const result: CertificateInfo[] = [];

    for (let i = 1; i <= count; i++) {
      const cert = await certificates.Item(i);
      const hasKey = await cert.HasPrivateKey();
      
      if (hasKey) {
        const subjectName = await cert.SubjectName;
        const issuerName = await cert.IssuerName;
        const serialNumber = await cert.SerialNumber;
        const thumbprint = await cert.Thumbprint;
        const validFrom = await cert.ValidFromDate;
        const validTo = await cert.ValidToDate;

        const info = parseCertificateSubject(subjectName);
        
        result.push({
          certificate: cert,
          subjectName,
          issuerName,
          serialNumber,
          thumbprint,
          validFrom,
          validTo,
          organization: info.O || info.OGRNIP || '',
          inn: info.INN || '',
          snils: info.SNILS || '',
          commonName: info.CN || '',
        });
      }
    }

    store.Close();
    return result;
  } catch (e) {
    store.Close();
    throw e;
  }
}

// Парсинг SubjectName сертификата
function parseCertificateSubject(subjectName: string): Record<string, string> {
  const result: Record<string, string> = {};
  const parts = subjectName.split(',');
  
  for (const part of parts) {
    const trimmed = part.trim();
    const eqIndex = trimmed.indexOf('=');
    if (eqIndex > 0) {
      const key = trimmed.substring(0, eqIndex).trim();
      const value = trimmed.substring(eqIndex + 1).trim();
      result[key] = value;
    }
  }
  
  return result;
}

// Конвертация файла в Base64
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Убираем префикс data:...;base64,
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Подписание одного документа (CAdES-BES, отсоединённая подпись)
export async function signDocument(
  base64Content: string,
  cert: any
): Promise<string> {
  const cadesplugin = await getCadesPlugin();
  
  const signer = await cadesplugin.CreateObjectAsync('CAdESCOM.CPSigner');
  const signedData = await cadesplugin.CreateObjectAsync('CAdESCOM.CadesSignedData');
  
  // Настройка подписанта
  await signer.propset_Certificate(cert);
  await signer.propset_Options(cadesplugin.CAPICOM_CERTIFICATE_INCLUDE_WHOLE_CHAIN);
  
  // Установка содержимого
  await signedData.propset_ContentEncoding(cadesplugin.CADESCOM_BASE64_TO_BINARY);
  await signedData.propset_Content(base64Content);
  
  // Подписание в формате CAdES-BES (отвечает требованиям ФЗ-63)
  const signature = await signedData.SignCades(
    signer,
    cadesplugin.CADESCOM_CADES_BES,
    true // отсоединённая подпись
  );
  
  return signature;
}

// Подписание документа с присоединённой подписью (для совместимости)
export async function signDocumentAttached(
  base64Content: string,
  cert: any
): Promise<string> {
  const cadesplugin = await getCadesPlugin();
  
  const signer = await cadesplugin.CreateObjectAsync('CAdESCOM.CPSigner');
  const signedData = await cadesplugin.CreateObjectAsync('CAdESCOM.CadesSignedData');
  
  await signer.propset_Certificate(cert);
  await signer.propset_Options(cadesplugin.CAPICOM_CERTIFICATE_INCLUDE_WHOLE_CHAIN);
  
  await signedData.propset_ContentEncoding(cadesplugin.CADESCOM_BASE64_TO_BINARY);
  await signedData.propset_Content(base64Content);
  
  // Присоединённая подпись
  const signature = await signedData.SignCades(
    signer,
    cadesplugin.CADESCOM_CADES_BES,
    false // присоединённая подпись
  );
  
  return signature;
}

// Проверка подписи
export async function verifySignature(
  signedContent: string,
  detachedContent: string,
  isDetached: boolean
): Promise<boolean> {
  const cadesplugin = await getCadesPlugin();
  
  const signedData = await cadesplugin.CreateObjectAsync('CAdESCOM.CadesSignedData');
  
  try {
    if (isDetached) {
      await signedData.VerifyCades(
        detachedContent,
        signedContent,
        cadesplugin.CADESCOM_CADES_BES,
        true
      );
    } else {
      await signedData.VerifyCades(
        signedContent,
        cadesplugin.CADESCOM_CADES_BES,
        false
      );
    }
    return true;
  } catch {
    return false;
  }
}

// Получение информации о версии CryptoPro
export async function getCryptoProVersion(): Promise<string> {
  const cadesplugin = await getCadesPlugin();
  const about = cadesplugin.About;
  const cspVersion = await about.CSPVersion();
  const pluginVersion = await about.PluginVersion;
  return `CryptoPro CSP: ${cspVersion}, Plugin: ${pluginVersion}`;
}

// Генерация уникального ID
export function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}

// Форматирование размера файла
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Б';
  const k = 1024;
  const sizes = ['Б', 'КБ', 'МБ', 'ГБ'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Скачивание файла
export function downloadFile(content: string, filename: string, mimeType: string = 'text/plain') {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
