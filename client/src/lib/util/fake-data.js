import { differenceInCalendarDays, format } from "date-fns";
import { it } from "date-fns/locale";

export const fakeMessages = [
    {
        "time": 1738790087731,
        "text": "ciao",
        "right": true
    },
    {
        "author": "DeepSeek R1",
        "time": 1738791097731,
        "text": "Ciao! Come posso aiutarti oggi?",
        "refText": "ciao"
    },
    {
        "time": 1738860919024,
        "text": "ciao",
        "right": true
    },
    {
        "author": "DeepSeek R1",
        "time": 1738861050024,
        "text": "Ciao! Come posso aiutarti oggi?",
        "refText": "ciao"
    }
].concat([
    {
        "time": 1738790087731,
        "text": "ciao",
        "right": true
    },
    {
        "author": "DeepSeek R1",
        "time": 1738791097731,
        "text": "Ciao! Come posso aiutarti oggi?",
        "refText": "ciao"
    },
    {
        "time": 1738860919024,
        "text": "ciao",
        "right": true
    },
    {
        "author": "DeepSeek R1",
        "time": 1739861050024,
        "text": "Ciao! Come posso aiutarti oggoooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo?",
        "refText": "ciao"
    }
]);

export const fakeHistory = Array.from({ length: 30 }, () => {
    const timeDate = fakeMessages[fakeMessages.length - 1].time;
    const dateFormat = differenceInCalendarDays(timeDate, new Date()) > 7 ? "d MMMM yyyy" : "EEEE";
    return ({
        title: fakeMessages[fakeMessages.length - 1].text,
        date: format(timeDate, dateFormat, { locale: it }),
        messages: fakeMessages
    });
});