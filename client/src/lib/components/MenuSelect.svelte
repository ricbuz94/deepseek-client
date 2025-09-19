<script>
    import { Ellipsis } from "lucide-svelte";
    import Button from "./Button.svelte";

    let { options = [] } = $props();

    let isOpen = $state(false);

    function toggleOpen(value) {
        if (typeof value === "boolean") {
            return (isOpen = value);
        }
        isOpen = !isOpen;
    }
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div id="menu-select-container" onmouseleave={() => toggleOpen(false)}>
    <Button title="Altro" classes="transparent" onClick={toggleOpen}>
        <Ellipsis size={16} />
    </Button>
    <ul id="menu-select-list" class:open={isOpen}>
        {#each options as { title, icon: Icon, action, isError }, index ([title, index].join("-"))}
            <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
            <li
                class={["menu-select-item", isError ? "error" : ""]}
                onmousedown={() => {
                    toggleOpen(false);
                    action();
                }}
                style:justify-content={!!Icon ? "flex-start" : "center"}
            >
                {#if !!Icon}
                    <Icon size={12} />
                {/if}
                {#if !!title}
                    <p>{title}</p>
                {/if}
            </li>
        {/each}
    </ul>
</div>

<style>
    #menu-select-container {
        position: relative;
    }

    #menu-select-list {
        user-select: none;
        position: absolute;
        top: 1.5rem;
        right: 0.5rem;
        list-style: none;
        overflow: hidden;
        display: flex;
        gap: 0.5rem;
        flex-direction: column;
        margin: 0px;
        padding: 0px;
        border-radius: 0.5rem;
        box-shadow: var(--cd-shadow);
        border: 1px solid var(--bg-color);
        background-color: var(--bg-color);
        transform-origin: top right;
        transform: scale(0.4);
        opacity: 0;
        visibility: hidden;
        transition-property: transform, opacity, background-color;
        transition-duration: var(--tr-200);
        transition-timing-function: ease;
        z-index: 9;
    }

    #menu-select-list.open {
        width: initial;
        height: initial;
        opacity: 1;
        visibility: visible;
        transform: scale(1);
    }

    .menu-select-item {
        width: 100%;
        display: flex;
        gap: 1rem;
        align-items: center;
        min-width: 100px;
        cursor: pointer;
        font-size: 12px;
        padding: 0.75rem 1rem;
    }
    .menu-select-item > p {
        margin: 0px;
    }
    .menu-select-item:hover {
        background-color: var(--overlay);
    }
    .menu-select-item.error:hover {
        background-color: var(--overlay-error);
    }
</style>
