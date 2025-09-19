<script>
    import { File, X } from "lucide-svelte";

    let { name = "", action } = $props();
</script>

<button title="Riumovi" class="file transparent" onclick={action}>
    <File size={12} />
    {name}
    <X size={12} />
</button>

<style>
    .file {
        display: flex;
        gap: 0.5rem;
        align-items: center;
        font-size: 10px;
        border-radius: 25px;
        border: none;
        padding: 0.5rem;
        cursor: pointer;
        color: inherit;
        background-color: var(--overlay-light);
        transition-property: background-color;
        transition-duration: var(--tr-200);
        transition-timing-function: ease;
    }
    .file:hover {
        background-color: var(--overlay);
    }
</style>
