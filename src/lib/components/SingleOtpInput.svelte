<script>
	let {showInput, inputType} = $props()
</script>

{#if showInput}
	<input type="{inputType}" />
{/if}