import { registerTranslateConfig, use } from 'lit-translate';
import { detectLang } from '../../../utilsForAll/i18nCustomLangDetector';
import { enTranslation } from './en';
import { jaTranslation } from './ja';
import { zhTWTranslation } from './zhTW';

registerTranslateConfig({
  loader: (lang) => {
    switch (lang) {
      case 'ja':
        return jaTranslation;

      case 'zh-TW':
        return zhTWTranslation;
      case 'en':
      default:
        return enTranslation;
    }

    //     // throw new Error(`The language ${lang} is not supported..`);
  },
});

use('en');

detectLang().then((settingLang) => {
  use(settingLang);
});
