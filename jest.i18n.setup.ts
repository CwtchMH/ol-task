// import i18n from 'i18next';
// import { initReactI18next } from 'react-i18next';

jest.mock('react-i18next', () => {
  const useMock = [k => k, {}];
  // @ts-ignore
  useMock.t = k => k;

  return {
    useTranslation: () => useMock,
    initReactI18next: () => {}
  };
});