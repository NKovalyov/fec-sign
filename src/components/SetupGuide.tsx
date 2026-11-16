import React, { useState } from 'react';

export const SetupGuide: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-4 flex items-center justify-between text-white"
      >
        <div className="flex items-center gap-3">
          <i className="fas fa-tools text-amber-100 text-xl"></i>
          <h2 className="font-semibold text-lg">Требования и настройка</h2>
        </div>
        <i className={`fas fa-chevron-${isOpen ? 'up' : 'down'} transition-transform`}></i>
      </button>

      {isOpen && (
        <div className="p-6 space-y-6">
          {/* Требования */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <i className="fas fa-clipboard-check text-amber-500"></i>
              Необходимое ПО
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                    <span className="text-blue-600 font-bold text-sm">1</span>
                  </div>
                  <h4 className="font-medium text-gray-800">CryptoPro CSP 5.0</h4>
                </div>
                <p className="text-xs text-gray-500 mb-2">
                  Криптографический провайдер для работы с ГОСТ алгоритмами
                </p>
                <a
                  href="https://www.cryptopro.ru/products/csp"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 hover:text-blue-800 underline"
                >
                  Скачать с cryptopro.ru →
                </a>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-green-100 rounded flex items-center justify-center">
                    <span className="text-green-600 font-bold text-sm">2</span>
                  </div>
                  <h4 className="font-medium text-gray-800">CAdESCOM Browser Plugin</h4>
                </div>
                <p className="text-xs text-gray-500 mb-2">
                  Расширение для браузера, обеспечивающее работу с ЭЦП
                </p>
                <a
                  href="https://www.cryptopro.ru/products/cades/plugin"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 hover:text-blue-800 underline"
                >
                  Скачать с cryptopro.ru →
                </a>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-purple-100 rounded flex items-center justify-center">
                    <span className="text-purple-600 font-bold text-sm">3</span>
                  </div>
                  <h4 className="font-medium text-gray-800">Расширение для браузера</h4>
                </div>
                <p className="text-xs text-gray-500 mb-2">
                  Установите расширение для вашего браузера
                </p>
                <div className="space-y-1">
                  <a
                    href="https://chrome.google.com/webstore/detail/cryptopro-extension-for-c/iifchhfnnmpdbibifmljnfjporifaedf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:text-blue-800 underline block"
                  >
                    Chrome / Яндекс.Браузер →
                  </a>
                  <a
                    href="https://addons.mozilla.org/ru/firefox/addon/cryptopro-extension-for-cades/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:text-blue-800 underline block"
                  >
                    Firefox →
                  </a>
                </div>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-amber-100 rounded flex items-center justify-center">
                    <span className="text-amber-600 font-bold text-sm">4</span>
                  </div>
                  <h4 className="font-medium text-gray-800">Квалифицированный сертификат</h4>
                </div>
                <p className="text-xs text-gray-500 mb-2">
                  Сертификат КЭП, выпущенный аккредитованным удостоверяющим центром
                </p>
                <p className="text-xs text-gray-400">
                  Убедитесь, что сертификат установлен в хранилище «Личное» (My)
                </p>
              </div>
            </div>
          </div>

          {/* Порядок настройки */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <i className="fas fa-list-ol text-amber-500"></i>
              Порядок настройки
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <span className="w-6 h-6 bg-amber-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">1</span>
                <div>
                  <p className="text-sm font-medium text-gray-800">Установите CryptoPro CSP 5.0</p>
                  <p className="text-xs text-gray-500">Запустите установщик и следуйте инструкциям. Лицензия должна быть активирована.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <span className="w-6 h-6 bg-amber-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">2</span>
                <div>
                  <p className="text-sm font-medium text-gray-800">Установите CAdESCOM Browser Plugin</p>
                  <p className="text-xs text-gray-500">Запустите установщик плагина для обеспечения работы ЭЦП в браузере.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <span className="w-6 h-6 bg-amber-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">3</span>
                <div>
                  <p className="text-sm font-medium text-gray-800">Установите расширение для браузера</p>
                  <p className="text-xs text-gray-500">Добавьте расширение CryptoPro в ваш браузер и разрешите взаимодействие со страницами.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <span className="w-6 h-6 bg-amber-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">4</span>
                <div>
                  <p className="text-sm font-medium text-gray-800">Установите сертификат</p>
                  <p className="text-xs text-gray-500">Установите квалифицированный сертификат в хранилище «Личное» текущего пользователя.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <span className="w-6 h-6 bg-amber-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">5</span>
                <div>
                  <p className="text-sm font-medium text-gray-800">Перезапустите браузер</p>
                  <p className="text-xs text-gray-500">После установки всех компонентов перезапустите браузер и обновите эту страницу.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Соответствие законодательству */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
              <i className="fas fa-balance-scale text-green-600"></i>
              Соответствие законодательству РФ
            </h3>
            <ul className="text-sm text-green-700 space-y-1">
              <li className="flex items-start gap-2">
                <i className="fas fa-check text-green-500 mt-0.5 flex-shrink-0"></i>
                <span>Федеральный закон №63-ФЗ «Об электронной подписи»</span>
              </li>
              <li className="flex items-start gap-2">
                <i className="fas fa-check text-green-500 mt-0.5 flex-shrink-0"></i>
                <span>ГОСТ Р 34.10-2012 — алгоритмы электронной подписи</span>
              </li>
              <li className="flex items-start gap-2">
                <i className="fas fa-check text-green-500 mt-0.5 flex-shrink-0"></i>
                <span>Формат подписи CAdES-BES (CMS Advanced Electronic Signatures)</span>
              </li>
              <li className="flex items-start gap-2">
                <i className="fas fa-check text-green-500 mt-0.5 flex-shrink-0"></i>
                <span>Квалифицированная электронная подпись (КЭП)</span>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
