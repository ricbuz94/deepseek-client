<script>
    let {
        title,
        type,
        onClick,
        onMouseDown,
        onMouseLeave,
        onBlur,
        classes = "opaque",
        disabled = false,
        children,
    } = $props();
</script>

<button
    {title}
    {type}
    class={classes.split(" ")}
    onclick={onClick}
    onmousedown={onMouseDown}
    onmouseleave={onMouseLeave}
    onblur={onBlur}
    {disabled}
>
    {@render children()}
</button>

<style>
    button {
        user-select: none;
        color: inherit;
        min-width: 32px;
        width: min-content;
        min-height: 32px;
        height: 32px;
        padding: 0px 0.5rem;
        transition-property: background-color, color;
        transition-duration: var(--tr-200);
        transition-timing-function: ease;
    }
    button:focus-visible {
        outline-width: 1px;
        outline-offset: 3px;
        outline-style: dashed;
        outline-color: var(--fg-color);
    }
    button:disabled {
        opacity: 0.5;
    }
    button:not(:disabled) {
        cursor: pointer;
    }

    button.relative {
        position: relative;
    }

    button.transparent {
        display: flex;
        align-items: center;
        justify-content: center;
        border: none;
        border-radius: 25px;
        background-color: transparent;
    }
    button.transparent:not(:disabled):hover {
        background-color: var(--overlay);
    }

    button.opaque {
        display: flex;
        align-items: center;
        justify-content: center;
        border: none;
        border-radius: 25px;
        color: var(--bg-color);
        background-color: var(--fg-color);
    }
    button.opaque.error {
        background-color: var(--error);
    }
    button.opaque.success {
        background-color: var(--success);
    }
    button.opaque:not(:disabled):hover {
        background-color: var(--fg-color-hover);
    }
</style>
