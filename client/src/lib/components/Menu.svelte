<script>
    import { Menu, X } from "lucide-svelte";
    import Button from "./Button.svelte";
    import { scale } from "svelte/transition";

    let { actions } = $props();

    let isOpen = $state(false);

    function toggleMenu() {
        isOpen = !isOpen;
    }
</script>

<div id="menu-toggle" class:open={isOpen}>
    <Button
        title={isOpen ? "Chiudi" : "Menu"}
        onClick={toggleMenu}
        onBlur={() => (isOpen = false)}
    >
        {#key isOpen}
            <span style="max-height:16px;" in:scale>
                {#if isOpen}
                    <X size={16} color="var" />
                {:else}
                    <Menu size={16} />
                {/if}
            </span>
        {/key}
    </Button>
    <ul id="menu-list" class:open={isOpen}>
        {#each actions as { title, icon: Icon, action }, index ([title, index].join("-"))}
            <li>
                <Button {title} onMouseDown={action}>
                    <Icon size={16} />
                </Button>
            </li>
        {/each}
    </ul>
</div>

<style>
    #menu-toggle {
        padding-top: 1rem;
        padding-left: 23%;
        position: absolute;
        top: 0px;
        left: 0px;
        z-index: 8;

        display: flex;
        gap: 1rem;
        align-items: flex-start;
    }

    #menu-toggle.open {
        width: 100%;
        height: 100%;
        backdrop-filter: blur(4px);
        background-color: var(--overlay-light);
    }

    #menu-list {
        list-style: none;
        overflow: hidden;

        display: flex;
        gap: 1rem;
        flex-direction: row;
        align-items: center;
        margin: 0px;
        padding: 0px;
        transform-origin: left;
        transform: scale(0.4);
        opacity: 0;
        transition-property: transform, opacity, background-color;
        transition-duration: var(--tr-200);
        transition-timing-function: ease;
    }

    #menu-list.open {
        opacity: 1;
        transform: scale(1);
    }

    @media only screen and (max-width: 600px) {
        #menu-toggle {
            padding-left: 1rem;
        }
    }
</style>
