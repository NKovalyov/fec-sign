// Type definitions for CryptoPro CAdESCOM Browser Plugin
declare namespace CAPICOM {
  const CAPICOM_STORE_OPEN_READ_ONLY: number;
  const CAPICOM_CURRENT_USER_STORE: string;
  const CAPICOM_CERTIFICATE_FIND_SHA1_HASH: number;
  const CAPICOM_CERTIFICATE_FIND_SUBJECT_NAME: number;
}

declare namespace CADESCOM {
  const CADESCOM_BASE64_TO_BINARY: number;
  const CADESCOM_XML_SIGNATURE_TYPE_ENVELOPED: number;
  const CADESCOM_XML_SIGNATURE_TYPE_ENVELOPING: number;
  const CADESCOM_XML_SIGNATURE_TYPE_TEMPLATE: number;
  const CADESCOM_CADES_BES: number;
  const CADESCOM_CADES_X_LONG_TYPE_1: number;
  const CADESCOM_ENCODE_BASE64: number;
  const CADESCOM_ENCODE_ANY: number;
  const CADESCOM_HASH_ALG_SHA256: number;
  const CADESCOM_HASH_ALG_SHA512: number;
}

interface ICertificate {
  SubjectName: string;
  IssuerName: string;
  SerialNumber: string;
  Thumbprint: string;
  ValidFromDate: string;
  ValidToDate: string;
  HasPrivateKey(): boolean;
  Export(encodingType: number): string;
}

interface ICertificates {
  readonly Count: number;
  Item(index: number): ICertificate;
  Find(findType: number, criteria: string, validOnly: boolean): ICertificates;
}

interface IStore {
  Open(storeLocation: number, storeName: string, mode: number): void;
  Close(): void;
  readonly Certificates: ICertificates;
}

interface ISigner {
  Certificate: ICertificate;
  Options: number;
  KeyPin: string;
  CheckCertificate: boolean;
}

interface ISignedData {
  Content: string;
  DisplayData(): void;
  SignCades(signer: ISigner, cadesType: number, bDetached: boolean): string;
  SignXML(signer: ISigner, signatureType: number): string;
  VerifyCades(signer: ISigner, cadesType: number, bDetached: boolean): void;
}

interface ISignedXML {
  Content: string;
  Sign(signer: ISigner, signatureType: number): string;
}

interface IHashedData {
  DataHash: string;
  HashAlgorithm: number;
  SetHashValue(hashValue: string): void;
}

interface IRawSignature {
  SignHash(hashData: IHashedData, signer: ISigner): string;
}

interface IAbout {
  readonly Version: string;
  readonly PluginVersion: string;
  CSPVersion(): string;
}

interface ICadesPlugin {
  CreateObjectAsync(className: string): Promise<any>;
  readonly About: IAbout;
  CAPICOM_STORE_OPEN_READ_ONLY: number;
  CAPICOM_CURRENT_USER_STORE: string;
  CAPICOM_CERTIFICATE_FIND_SHA1_HASH: number;
  CAPICOM_CERTIFICATE_FIND_SUBJECT_NAME: number;
  CADESCOM_BASE64_TO_BINARY: number;
  CADESCOM_XML_SIGNATURE_TYPE_ENVELOPED: number;
  CADESCOM_XML_SIGNATURE_TYPE_ENVELOPING: number;
  CADESCOM_XML_SIGNATURE_TYPE_TEMPLATE: number;
  CADESCOM_CADES_BES: number;
  CADESCOM_CADES_X_LONG_TYPE_1: number;
  CADESCOM_ENCODE_BASE64: number;
  CADESCOM_ENCODE_ANY: number;
  CADESCOM_HASH_ALG_SHA256: number;
  CADESCOM_HASH_ALG_SHA512: number;
  CAPICOM_CERTIFICATE_FIND_EXTENDED_PROPERTY: number;
  CAPICOM_PROPID_ENHKEY_USAGE: number;
  CAPICOM_CERTIFICATE_FIND_KEY_USAGE: number;
  CAPICOM_CERTIFICATE_FIND_KEY_USAGE_MASK: number;
  CAPICOM_CERTIFICATE_INCLUDE_WHOLE_CHAIN: number;
  CAPICOM_CERTIFICATE_INCLUDE_END_ENTITY_ONLY: number;
}

interface Window {
  cadesplugin: ICadesPlugin | Promise<ICadesPlugin>;
}
