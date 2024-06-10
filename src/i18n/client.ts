'use client';
import { useEffect, useState } from 'react';
import i18next, { TOptions } from 'i18next';
import { initReactI18next, useTranslation as useTranslationOrg } from 'react-i18next';
import { useCookies } from 'react-cookie';
import resourcesToBackend from 'i18next-resources-to-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import { getOptions, languages, cookieName, defaultNS, fallbackLng } from '@/i18n/settings';

const runsOnServerSide = typeof window === 'undefined';

i18next
  .use(initReactI18next)
  .use(LanguageDetector)
  .use(
    resourcesToBackend((language: string, namespace: string) => import(`@/i18n/locales/${language}/${namespace}.json`))
  )
  .init({
    ...getOptions(),
    lng: undefined,
    detection: {
      order: ['cookie']
    },
    preload: runsOnServerSide ? languages : []
  });

export const useTranslation = (ns: string = defaultNS, options?: TOptions) => {
  const [cookies] = useCookies([cookieName]);
  const lng =
    options?.lng ||
    (runsOnServerSide ? require('next/headers').cookies().get('lng')?.value : cookies.lng) ||
    fallbackLng;
  const { t, i18n } = useTranslationOrg(ns, {
    ...options,
    lng
  });
  return { t, i18n, lng };
};
