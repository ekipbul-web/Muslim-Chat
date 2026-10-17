import { I18n } from "i18n-js";
import * as Localization from "expo-localization";

const i18n = new I18n({
  tr: { welcome: "Hoş Geldiniz", chats: "Sohbetler", channels: "Kanallar" },
  en: { welcome: "Welcome", chats: "Chats", channels: "Channels" },
  ar: { welcome: "مرحبا", chats: "الدردشات", channels: "القنوات" },
});

i18n.locale = Localization.getLocales()[0].languageCode ?? "tr";
i18n.enableFallback = true;
export default i18n;
