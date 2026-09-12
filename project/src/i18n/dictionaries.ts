import { en, type Messages } from './messages/en';
import { fa } from './messages/fa';
import {
  DEFAULT_LOCALE,
  isLocale,
  type Locale,
} from './types';

const dictionaries: Record<Locale, Messages> = { en, fa };

export function getDictionary(locale: Locale): Messages {
  return dictionaries[locale] ?? dictionaries[DEFAULT_LOCALE];
}

export function resolveLocale(value: string | null | undefined): Locale {
  return isLocale(value) ? value : DEFAULT_LOCALE;
}

export type { Messages };
export type MessageKey = {
  [K in keyof Messages]: {
    [P in keyof Messages[K] & string]: `${K & string}.${P}`;
  }[keyof Messages[K] & string];
}[keyof Messages];
