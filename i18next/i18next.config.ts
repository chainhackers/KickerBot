import i18next from 'i18next'

import en from './locales/en.json'

export async function configureI18Next(): Promise<void> {
    await i18next.init({
        lng: 'en',
        debug: false,
        interpolation: { escapeValue: false },
        resources: {
            en: {
                translation: en,
            },
        },
    })
}
