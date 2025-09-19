<script>
    import { closePopup } from "$lib/util/helpers.js";
    import { X } from "lucide-svelte";
    import { Button } from "./index.js";

    let {
        title = "Popup",
        options = [],
        children = "This is a message.",
    } = $props();
</script>

<div class="popup">
    <dialog class="dialog" open>
        <h3>{title}</h3>
        {#if !!children && typeof children !== "string"}
            {@render children()}
        {:else}
            <p>{children}</p>
        {/if}
        <div class="dialog-options">
            <Button
                classes="dialog-cancel transparent"
                type="reset"
                onClick={closePopup}>Chiudi</Button
            >
            {#each options as { title, action }, index ([title, index].join("-"))}
                <Button type="reset" onClick={action}>{title}</Button>
            {/each}
        </div>
        <span>
            <Button
                title="Chiudi"
                classes="dialog-close transparent"
                onClick={closePopup}
            >
                <X size={16} />
            </Button>
        </span>
    </dialog>
</div>

<style>
    .popup {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0px;
        left: 0px;
        backdrop-filter: blur(4px);
        background-color: var(--overlay-light);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10;
    }

    .dialog {
        color: inherit;
        position: relative;
        max-width: 60%;
        min-width: 350px;
        min-height: 150px;
        height: auto;
        background-color: var(--cd-color);
        border-radius: 1rem;
        border: none;
        box-sizing: border-box;
        padding: 1.5rem 2rem;
        box-shadow:
            0 2px 5px -1px rgba(50, 50, 93, 0.25),
            0 1px 3px -1px rgba(0, 0, 0, 0.3);
    }

    .dialog > h3 {
        margin: 0px;
        margin-bottom: 0.5rem;
    }

    .dialog > p {
        margin: 0.25rem 0px;
    }
    .dialog > span {
        position: absolute;
        top: 0.5rem;
        right: 0.75rem;
    }

    .dialog-options {
        display: flex;
        gap: 0.5rem;
        padding-top: 2rem;
        align-items: center;
        justify-content: flex-end;
    }
    @media only screen and (max-width: 600px) {
        .dialog {
            min-width: 300px;
        }
    }
</style>
