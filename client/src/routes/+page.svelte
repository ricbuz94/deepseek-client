<script>
    import "../app.css";
    import { onMount } from "svelte";
    import { scale } from "svelte/transition";
    import { Paperclip, ArrowUp, Loader, History, Trash } from "lucide-svelte";

    import { browser } from "$app/environment";
    import {
        Button,
        FileButton,
        ChatMessage,
        Menu,
    } from "$lib/components/index.js";
    import {
        closePopup,
        deleteLocalStorageKey,
        getLocalStorageKey,
        isMobile,
        setLocalStorageKey,
        showPopup,
        sleep,
    } from "$lib/util/helpers.js";
    import { fakeMessages } from "$lib/util/fake-data.js";
    import MenuSide from "$lib/components/MenuSide.svelte";

    let files = $state();
    let messages = $state(fakeMessages); // (JSON.parse(getLocalStorageKey("messages") || "[]"));
    let isSideMenuOpen = $state(false);
    let isDisabled = $state(true);
    let isLoading = $state(false);

    const actions = [
        {
            title: "Elimina chat",
            icon: Trash,
            action: () =>
                showPopup(
                    "Attenzione",
                    "Vuoi eliminare definitivamente tutti i messaggi?",
                    [
                        {
                            title: "Conferma",
                            action: () => {
                                deleteLocalStorageKey("messages");
                                messages = [];
                                closePopup();
                            },
                        },
                    ],
                ),
        },
        {
            title: "Storico",
            icon: History,
            action: () => toggleSideMenuOpen(true),
        },
    ];

    function textareaAutoGrow(e) {
        e.target.style.height = "initial";
        e.target.style.height = e.target.scrollHeight + "px";
    }

    function clickFileInput() {
        document.getElementById("file-input").click();
    }

    function fileCanceled(filename) {
        const data = new DataTransfer();
        Array.from(files).forEach((f) => {
            if (f.name !== filename) {
                data.items.add(f);
            }
        });
        files = data.files;
    }

    function filesChanged(e) {
        if (files.length > 4) {
            const data = new DataTransfer();
            Array.from(files)
                .slice(0, 4)
                .forEach((f) => {
                    data.items.add(f);
                });
            files = data.files;
        }
    }

    function scrollChat() {
        const chat = browser && document.getElementById("chat");
        if (!!chat) {
            setTimeout(() => {
                chat.scrollTo(0, document.getElementById("chat").scrollHeight);
            }, 100);
        }
    }

    function selectOnFocus(e) {
        e.target.select();
    }

    function toggleSubmitButtonOnKeyUp(e) {
        if (
            !isDisabled &&
            (!e.target.value.length || e.target.value.length < 2)
        ) {
            isDisabled = true;
        } else if (!!isDisabled && e.target.value.length > 2) {
            isDisabled = false;
        }
    }

    function toggleSubmitButtonOnKeyDown(e) {
        if (!e.shiftKey && e.key === "Enter") {
            e.preventDefault();
            const message = browser && document.getElementById("message");
            if (message?.value?.length < 3) return;
            sendMessage();
        }
    }

    function toggleSideMenuOpen(value) {
        if (typeof value === "boolean") {
            return (isSideMenuOpen = value);
        }
        isSideMenuOpen = !isSideMenuOpen;
    }

    async function sendMessage(refText) {
        isLoading = true;

        const message = browser && document.getElementById("message");
        message.blur();

        const text = refText || message?.value || "";

        if (text?.replace(/[^A-Za-z0-9]/g, "")?.length < 2) {
            isLoading = false;
            return showPopup("Errore", "Testo non valido.", [
                {
                    title: "Conferma",
                    action: () => {
                        closePopup();
                        message.focus();
                    },
                },
            ]);
        }

        isDisabled = true;
        message.value = null;
        message.style.height = "initial";
        message.style.height = message.scrollHeight + "px";
        messages = messages.concat([
            {
                time: Date.now(),
                text,
            },
            {
                author: "DeepSeek R1",
                time: Date.now(),
                refText: text,
            },
        ]);
        setLocalStorageKey("messages", JSON.stringify(messages));
        scrollChat();

        try {
            const serverOrgin = `https://${window.location.hostname}`;
            const headers = {
                "Content-Type": "application/json",
            };

            let response;
            if (files?.length > 0) {
                let data = new FormData();
                data.append("mex", text);
                data.append("files", input.files);

                response = await fetch(`${serverOrgin}/chat`, {
                    method: "POST",
                    body: data,
                    headers,
                });
            } else {
                response = await fetch(
                    `${serverOrgin}/chat?fake=true&mex=${encodeURI(text)}`,
                    {
                        headers,
                    },
                );
            }

            const res = await response.json();
            isLoading = false;
            console.log(res);

            const tags = ["<think>", "</think>"];
            let resultText = res.mex;
            if (resultText.includes(tags[0])) {
                resultText = res.mex.slice(
                    res.mex.indexOf(tags[0]),
                    res.mex.indexOf(tags[1]),
                );
            }

            console.log("mex text: %s", resultText);

            messages[messages?.length - 1].text = resultText;
            messages[messages?.length - 1].time = Date.now();
            messages = messages.slice();
            setLocalStorageKey("messages", JSON.stringify(messages));
            scrollChat();
        } catch (error) {
            isLoading = false;
            console.error(error);
            alert(error);
        }
    }

    onMount(() => {
        if (browser && messages?.length > 0) {
            scrollChat();
        }

        if (isMobile.any()) {
            const chat = browser && document.getElementById("chat");
            const message = browser && document.getElementById("message");

            function blurMessage(e) {
                message.blur();
            }

            chat.addEventListener("touchstart", blurMessage);
            return () => chat.removeEventListener("touchstart", blurMessage);
        }
    });
</script>

<div id="container">
    {#if messages?.length > 0}
        <Menu {actions} />
    {/if}
    <ul id="chat" class:empty={!messages?.length} onloadeddata={scrollChat}>
        {#each messages as mess, index ([mess?.author || "me", index].join("-"))}
            <ChatMessage {...mess} {messages} {index} {sendMessage} />
        {/each}
    </ul>
    <div id="prompt">
        {#if files?.length > 0}
            <div id="files" class="row">
                {#each files as file, index ([file?.name || "file", file?.size || index].join("-"))}
                    <FileButton
                        name={file?.name}
                        onClick={() => fileCanceled(file?.name)}
                    />
                {/each}
            </div>
        {/if}
        <div class="row between">
            <Button
                classes="transparent"
                title="Contenuti"
                onClick={clickFileInput}
            >
                <input
                    id="file-input"
                    type="file"
                    bind:files
                    onchange={filesChanged}
                    accept=".txt,.pdf,.doc"
                    multiple
                />
                <Paperclip size={16} />
            </Button>
            <textarea
                id="message"
                name="message"
                type="text"
                placeholder="Chiedi a DeepSeek R1"
                oninput={textareaAutoGrow}
                oncancel={textareaAutoGrow}
                onfocus={selectOnFocus}
                onkeyup={toggleSubmitButtonOnKeyUp}
                onkeydown={toggleSubmitButtonOnKeyDown}
                rows="1"
            ></textarea>
            <Button
                title="Invia"
                onClick={(e) => {
                    e.preventDefault();
                    sendMessage();
                }}
                disabled={isLoading || isDisabled}
            >
                {#key isLoading}
                    <span style="max-height:16px;" in:scale>
                        {#if isLoading}
                            <Loader size={16} />
                        {:else}
                            <ArrowUp size={16} />
                        {/if}
                    </span>
                {/key}
            </Button>
        </div>
    </div>
    <MenuSide isOpen={isSideMenuOpen} toggleOpen={toggleSideMenuOpen} />
</div>

<style>
    #container {
        width: 100%;
        height: 100%;
        padding: 0px 15%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background-color: transparent;
    }

    #chat {
        width: 80%;
        height: 100%;
        margin: 0px;
        padding: 1rem 2rem;
        overflow-y: auto;
        list-style: none;
        background-color: transparent;
        scroll-behavior: smooth;
        opacity: 1;
        transform: scaleY(1);
        transform-origin: top;
        transition-property: transform, opacity;
        transition-duration: var(--tr-200);
        transition-timing-function: ease;
    }

    #chat.empty {
        height: 0px;
        padding-top: 0px;
        padding-bottom: 0px;
        opacity: 0;
        transform: scaleY(0);
    }

    #prompt {
        flex: 0;
        width: 80%;
        border-radius: 35px;
        padding: 0.5rem 0.75rem;
        border: 4px solid var(--bg-color);
        background-color: var(--cd-color);
        z-index: 1;
    }

    .row {
        display: flex;
        gap: 0.5rem;
        align-items: center;
    }
    .row.between {
        justify-content: space-between;
    }

    #files {
        flex-wrap: wrap;
        padding-top: 0.5rem;
        padding-bottom: 0.75rem;
    }

    input[type="file"] {
        display: none;
    }

    #message {
        border: none;
        outline: none;
        resize: none;
        width: 100%;
        color: var(--fg-color);
        background-color: transparent;
        vertical-align: middle;
        max-height: 450px;
        height: 100%;
        padding: 8px 0.5rem;
    }

    @media only screen and (min-width: 601px) {
        #chat::-webkit-scrollbar {
            width: 0.25rem;
        }
        #chat::-webkit-scrollbar-thumb {
            background-color: var(--overlay);
        }
        #chat::-webkit-scrollbar-thumb:hover {
            background-color: var(--fg-color-hover);
        }
        #chat::-webkit-scrollbar-track {
            background-color: var(--overlay-light);
        }
    }

    @media only screen and (max-width: 600px) {
        #container {
            padding: 0px;
            padding-bottom: 1rem;
        }

        #chat {
            width: 100%;
        }

        #prompt {
            width: 96%;
        }

        #message {
            max-height: 300px;
        }
    }
</style>
