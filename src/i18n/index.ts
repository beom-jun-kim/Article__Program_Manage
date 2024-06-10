import { TOptions, createInstance } from 'i18next';
import resourcesToBackend from 'i18next-resources-to-backend';
import { initReactI18next } from 'react-i18next/initReactI18next';
import { defaultNS, getOptions, languages } from '@/i18n/settings';
import { cookies } from 'next/headers';

const initI18next = async (lng: string, ns: string) => {
  const i18nInstance = createInstance();
  await i18nInstance
    .use(initReactI18next)
    .use(
      resourcesToBackend(
        (language: string, namespace: string) => import(`@/i18n/locales/${language}/${namespace}.json`)
      )
    )
    .init(getOptions(lng, ns));
  return i18nInstance;
};

export const useServerTranslation = async (
  lng?: (typeof languages)[number],
  ns: string = defaultNS,
  options?: TOptions
) => {
  const cookieStore = cookies();
  const lang = lng || cookieStore.get('lng')?.value || defaultNS;
  const i18nextInstance = await initI18next(lang, ns);
  return {
    t: i18nextInstance.getFixedT(lang, ns, options?.keyPrefix as string | undefined),
    i18n: i18nextInstance
  };
};
