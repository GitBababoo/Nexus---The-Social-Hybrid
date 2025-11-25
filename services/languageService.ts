import i18n from './i18n';
import { SupportedLanguage } from '../types';
import { db } from './db';

// This service now acts as a bridge to i18next
// ensuring all existing components still work while gaining i18next powers.

class LanguageService {
  
  public setLanguage(lang: SupportedLanguage) {
    i18n.changeLanguage(lang);
    // Update DB persistence
    const settings = db.getSettings();
    db.saveSettings({ ...settings, language: lang });
  }

  public getCurrentLanguage(): SupportedLanguage {
    return i18n.language as SupportedLanguage;
  }

  /**
   * Uses i18next directly. 
   * Supports interpolation: t('key', { name: 'value' })
   */
  t(key: string, options?: any): string {
    return i18n.t(key, options) as string;
  }
}

export const languageService = new LanguageService();

// Export the t function directly for ease of use
export const t = (key: string, options?: any) => i18n.t(key, options);