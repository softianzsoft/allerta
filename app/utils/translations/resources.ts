/* eslint import/order:0 */
/* SCREENS */

import * as Home from "../../screens/Home/translations";

/* COMPONENTS */

/* UTILS */
import * as UI from "utils/ui/translations";

const en = {
  ...UI.en,
  ...Home.en,
};

const fr = {
  ...UI.fr,
};

const es = {
  ...UI.es,
};

const de = {
  ...UI.de,
};

const ru = {
  ...UI.ru,
};

const pt = {
  ...UI.pt,
};

const it = {
  ...UI.it,
};

export interface TranslationKeys
  extends UI.TranslationKeys,
    Home.TranslationKeys {}

export { en, fr, es, de, ru, pt, it };
