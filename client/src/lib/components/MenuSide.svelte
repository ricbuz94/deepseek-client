<script>
    import { X, Pencil, Trash } from "lucide-svelte";
    // import { getLocalStorageKey } from "$lib/util/helpers.js";
    import Button from "./Button.svelte";
    import MenuSelect from "./MenuSelect.svelte";
    import { fakeHistory } from "$lib/util/fake-data.js";

    let { isOpen = false, toggleOpen } = $props();

    let history = $state(fakeHistory); // (JSON.parse(getLocalStorageKey("history") || "[]"));
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<div
    id="menu-side-overlay"
    class:open={isOpen}
    onmousedown={(e) => {
        if (e.target.id === "menu-side-overlay") {
            toggleOpen(false);
        }
    }}
>
    <aside>
        <div>
            <Button
                title="Chiudi"
                classes="transparent"
                onClick={() => toggleOpen(false)}
            >
                <X size={16} color="var" />
            </Button>
        </div>
        <ul id="menu-side-list" class:open={isOpen}>
            {#each history as { title, date }, index ([title, index].join("-"))}
                <li class="menu-side-item">
                    <div>
                        <p class="menu-side-item-time">
                            {date}
                        </p>
                        <p>
                            {title}
                        </p>
                    </div>
                    <MenuSelect
                        options={[
                            {
                                icon: Pencil,
                                title: "Rinomina",
                                action: () => {},
                            },
                            {
                                icon: Trash,
                                isError: true,
                                title: "Elimiina",
                                action: () => {},
                            },
                        ]}
                    />
                </li>
            {/each}
        </ul>
    </aside>
</div>

<style>
    #menu-side-overlay {
        margin: 0px;
        padding: 0px;
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0px;
        left: 0px;
        z-index: 8;
        width: 0px;
        height: 0px;
        visibility: hidden;
    }

    #menu-side-overlay.open {
        visibility: visible;
        width: 100%;
        height: 100%;
        backdrop-filter: blur(4px);
        background-color: var(--overlay-light);
    }

    #menu-side-overlay > aside {
        opacity: 0;
        visibility: hidden;
        overflow-y: auto;
        max-height: 100vh;
        transform: translateX(250px);
        transition-property: transform, opacity;
        transition-duration: var(--tr-200);
        transition-timing-function: ease;
    }

    #menu-side-overlay.open > aside {
        opacity: 1;
        visibility: visible;
        transform: translateX(0px);
        position: relative;
        float: right;
        height: 100%;
        padding-left: 0.5rem;
        background-color: var(--cd-color);
    }

    #menu-side-overlay > aside > div {
        width: fit-content;
    }

    #menu-side-overlay.open > aside > div {
        position: sticky;
        top: 0.5rem;
        left: 0.5rem;
        z-index: 8;
    }

    #menu-side-list {
        display: none;
        list-style: none;
        flex-direction: column;
        gap: 0.5rem;
        align-items: flex-start;
        margin: 0px;
        padding-top: 0px;
        padding-bottom: 6rem;
        padding-right: 0px;
        padding-left: 2rem;
    }

    #menu-side-list.open {
        display: flex;
    }

    .menu-side-item {
        width: 100%;
        padding: 0.5rem 0.75rem;
        display: flex;
        gap: 1rem;
        align-items: center;
        justify-content: space-between;
    }

    .menu-side-item > div:hover {
        cursor: pointer;
    }
    .menu-side-item > div > p:last-child {
        max-width: 240px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .menu-side-item > div:hover > p:last-child {
        color: var(--fg-color-hover);
        text-decoration: underline;
    }

    .menu-side-item-time {
        opacity: 0.8;
        font-size: 12px;
        color: var(--fg-color-hover);
    }

    .menu-side-item > div > p {
        margin: 0px;
    }

    @media only screen and (min-width: 601px) {
        #menu-side-overlay > aside::-webkit-scrollbar {
            width: 0.25rem;
        }
        #menu-side-overlay > aside::-webkit-scrollbar-thumb {
            background-color: var(--overlay);
        }
        #menu-side-overlay > aside::-webkit-scrollbar-thumb:hover {
            background-color: var(--fg-color-hover);
        }
        #menu-side-overlay > aside::-webkit-scrollbar-track {
            background-color: var(--overlay-light);
        }
    }

    @media only screen and (max-width: 600px) {
        #menu-side-list {
            padding-left: auto;
        }
        .menu-side-item > div > p:last-child {
            max-width: calc(80vw - 2rem);
        }

        #menu-side-overlay.open > aside {
            width: 100%;
        }
    }
</style>
