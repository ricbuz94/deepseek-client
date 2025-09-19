import { mount } from "svelte";
import { browser } from "$app/environment";
import { it } from "date-fns/locale";
import { format } from "date-fns";
import Popup from "$lib/components/Popup.svelte";

export function sleep(ms) {
    return new Promise((r) => setTimeout(r, ms));
}

export function showPopup(title, message, options) {
    if (!title || !message) {
        return showPopup("Errore", "Titolo o messaggio mancanti!");
    }

    let popupProps = { title, children: message };

    if (!!options && Array.isArray(options)) {
        popupProps.options = options;
    }

    mount(Popup, { target: document.body, props: popupProps });
}

export function closePopup() {
    const popups = browser && document.getElementsByClassName("popup");
    popups[popups.length - 1].remove();
}

export function copyToClipboard(text) {
    try {
        if (browser && typeof text === "string" && text.length > 0) {
            window.navigator.clipboard.writeText(text);
            return "yes";
        }
        return "no";
    } catch (error) {
        alert(error);
    }
}

export function getTimeString(ms) {
    return format(new Date(ms), 'HH:mm', { locale: it });
}

export function getTimeAgoString(ms) {
    const secondsFromNow = (Date.now() - ms) * 0.001;

    if (secondsFromNow < 60) {
        return "ora";
    } else if (secondsFromNow >= 60 && secondsFromNow < 120) {
        return "1 min fa";
    } else if (secondsFromNow >= 120 && secondsFromNow < 1800) {
        return `${(secondsFromNow / 60).toFixed(0)} minuti fa`;
    } else if (secondsFromNow >= 1800 && secondsFromNow < 3600) {
        return "30 min fa";
    } else if (secondsFromNow >= 3600 && secondsFromNow < 5400) {
        return "1 ora fa";
    } else if (secondsFromNow >= 5400 && secondsFromNow < 7200) {
        return "1 ora e 30 min fa";
    } else if (secondsFromNow >= 7200 && secondsFromNow < 86400) {
        return `${(secondsFromNow / 3600).toFixed(0)} ore fa`;
    } else if (secondsFromNow >= 86400 && secondsFromNow < 172800) {
        return "1 giorno fa";
    } else if (secondsFromNow >= 172800 && secondsFromNow < 604800) {
        return `${(secondsFromNow / 86400).toFixed(0)} giorni fa`;
    } else {
        return format(new Date(ms), 'dd MMMM yyyy', { locale: it });
    }
}

export function getLocalStorageKey(key) {
    if (browser)
        return localStorage.getItem(key);
}

export function setLocalStorageKey(key, value) {
    if (browser)
        return localStorage.setItem(key, value);
}

export function deleteLocalStorageKey(key) {
    if (browser)
        return localStorage.removeItem(key);
}

export const isMobile = {
    Android: function () {
        return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function () {
        return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function () {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function () {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function () {
        return navigator.userAgent.match(/IEMobile/i) || navigator.userAgent.match(/WPDesktop/i);
    },
    any: function () {
        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
    }
};