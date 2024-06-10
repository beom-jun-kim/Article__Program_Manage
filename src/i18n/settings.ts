export const fallbackLng = 'ko';
export const languages = [fallbackLng, 'en'] as const;
export const defaultNS = 'translation';
export const cookieName = 'lng';

export function getOptions(lng = fallbackLng, ns = defaultNS) {
  return {
    // debug: true,
    supportedLngs: languages,
    fallbackLng,
    lng,
    fallbackNS: defaultNS,
    defaultNS,
    ns
  };
}
