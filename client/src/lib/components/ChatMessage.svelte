<script>
    import showdown from "showdown";
    import { scale } from "svelte/transition";
    import { it } from "date-fns/locale";
    import { format, isSameDay } from "date-fns";
    import { Copy, Share, RotateCw, Check, X } from "lucide-svelte";
    import { copyToClipboard, getTimeString } from "$lib/util/helpers.js";

    import Button from "./Button.svelte";

    let {
        author,
        time = Date.now(),
        text,
        refText,
        messages = [],
        index = 0,
        sendMessage,
    } = $props();

    const converter = new showdown.Converter();

    let isCopied = $state(false);
    let htmlText = $derived(converter.makeHtml(text || ""));

    const timeString = $derived(getTimeString(time));
    const isFirstOfToday = $derived(
        !isSameDay(messages[index]?.time, messages[index - 1]?.time),
    );

    function copyText() {
        isCopied = copyToClipboard(text);
        setTimeout(() => {
            isCopied = false;
        }, 800);
    }

    function shareMessages() {
        showPopup("Condividi", "", [
            {
                title: "Conferma",
                action: () => {
                    closePopup();
                },
            },
        ]);
    }

    async function reSendMessage() {
        await sendMessage(refText);
    }
</script>

{#if isFirstOfToday}
    <li class="first-today">
        {format(new Date(time), "d MMMM yyyy", { locale: it })}
    </li>
{/if}
<li class:right={!author}>
    <div class={["chat-message", !author ? "right" : ""]}>
        <span aria-hidden="true"
            ><svg viewBox="0 0 8 13" height="13" width="8" x="0px" y="0px"
                ><path
                    fill={!author ? "var(--overlay-light)" : "var(--overlay)"}
                    d="M1.533,2.568L8,11.193V0L2.812,0C1.042,0,0.474,1.156,1.533,2.568z"
                ></path></svg
            ></span
        >
        {#if !!author}
            <p class="chat-header">{author}</p>
        {/if}
        <p class:chat-message-loader={!text}>{@html htmlText}</p>
        <div class="chat-footer">
            {#if !!author}
                <ul class="chat-actions">
                    <li>
                        <Button
                            title="Copia"
                            classes="transparent"
                            onClick={copyText}
                        >
                            {#key isCopied}
                                <span style="max-height:16px;" in:scale>
                                    {#if isCopied === "yes"}
                                        <Check size={14} />
                                    {:else if isCopied === "no"}
                                        <X size={14} />
                                    {:else}
                                        <Copy size={14} />
                                    {/if}
                                </span>
                            {/key}
                        </Button>
                    </li>
                    <li>
                        <Button
                            title="Condividi"
                            classes="transparent"
                            onClick={shareMessages}
                        >
                            <Share size={14} />
                        </Button>
                    </li>
                    <li>
                        <Button
                            title="Rigenera"
                            classes="transparent"
                            onClick={reSendMessage}
                        >
                            <RotateCw size={14} />
                        </Button>
                    </li>
                </ul>
            {/if}
            <p>{timeString}</p>
        </div>
    </div>
</li>

<style>
    li {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        padding: 0.5rem 0px;
    }

    li.first-today {
        user-select: none;
        border-radius: 25px;
        margin: 0.5rem auto;
        margin-bottom: 0px;
        padding: 0.5rem 1.25rem;
        width: fit-content;
        align-items: center;
        font-weight: 400;
        font-size: 12px;
        opacity: 0.6;
        color: var(--fg-color-hover);
        background-color: rgba(255, 255, 255, 0.05);
    }

    li.right {
        align-items: flex-end;
    }

    .chat-message {
        max-width: 100%;
        min-width: 180px;
        position: relative;
        padding: 1rem 1.5rem;
        float: left;
        text-align: left;
        display: flex;
        flex-direction: column;
        border-radius: 1rem;
        background-color: var(--overlay);
    }

    .chat-message:not(.right) {
        border-top-left-radius: 0px;
        padding-bottom: 0.5rem;
    }

    .chat-message.right {
        float: right;
        min-width: 120px;
        border-top-right-radius: 0px;
        color: var(--fg-color-hover);
        background-color: var(--overlay-light);
    }

    .chat-message:not(.right) > span:first-child {
        width: fit-content;
        position: absolute;
        top: 0px;
        left: -8px;
    }

    .chat-message.right > span:first-child {
        width: fit-content;
        position: absolute;
        top: 0px;
        right: -8px;
        transform: scaleX(-1);
    }

    .chat-message > p {
        margin: 0.25rem 0px;
        word-break: break-all;
    }

    .chat-message > p.chat-header {
        font-size: 12px;
        user-select: none;
        color: var(--fg-color-hover);
    }

    .chat-message.right > p.chat-header {
        text-align: right;
    }

    .chat-message:not(.right) > p.chat-header {
        color: var(--ac-color);
        font-weight: 600;
    }

    .chat-footer {
        display: flex;
        align-items: baseline;
        user-select: none;
    }

    .chat-footer > p:last-child {
        margin: 0px;
        margin-left: auto;
        margin-right: -0.5rem;
        font-size: 12px;
        font-weight: 400;
    }

    .chat-actions {
        margin-left: -0.5rem;
        padding: 0px;
        display: flex;
        gap: 0.25rem;
        align-items: center;
    }
    .chat-actions > li {
        padding: 0px;
    }

    @media only screen and (max-width: 600px) {
        .chat-message {
            max-width: 100%;
        }
    }
    @media only screen and (max-width: 1200px) {
        .chat-message {
            max-width: 80%;
        }
    }

    .chat-message-loader {
        width: 0.5rem;
        aspect-ratio: 1;
        margin-top: 0.75rem !important;
        margin-bottom: 1rem !important;
        border-radius: 50%;
        transform: translateX(1rem);
        animation: l5 1200ms infinite linear alternate;
    }

    @keyframes l5 {
        0% {
            box-shadow:
                0.75rem 0 var(--fg-color),
                -0.75rem 0 var(--overlay);
            background: var(--fg-color);
        }
        33% {
            box-shadow:
                0.75rem 0 var(--fg-color),
                -0.75rem 0 var(--overlay);
            background: var(--overlay);
        }
        66% {
            box-shadow:
                0.75rem 0 var(--overlay),
                -0.75rem 0 var(--fg-color);
            background: var(--overlay);
        }
        100% {
            box-shadow:
                0.75rem 0 var(--overlay),
                -0.75rem 0 var(--fg-color);
            background: var(--fg-color);
        }
    }
</style>
