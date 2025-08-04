<script>
	import SingleOtpInput from '$lib/components/SingleOtpInput.svelte';
	// let inputType = $state('number');
	// let numInputs = $state(4);
	// let separator = $state('-');
	let { showInput, inputType = "number", numInputs = 4, separatorSnippet = null, separator = '-' } = $props();
</script>

{#snippet renderSeparator(index)}
	{#if index!==numInputs - 1}
		{#if separatorSnippet}
			{@render separatorSnippet()}
		{:else if separator}
			<span>{separator}</span>
		{/if}
	{/if}
{/snippet}

{#if showInput}
	<div class="otp-input-lib-container">
		{#each Array(numInputs).keys() as index}
			<SingleOtpInput {showInput} {inputType}></SingleOtpInput>
			{@render renderSeparator(index)}
		{/each}
	</div>
{/if}

<style>
	.otp-input-lib-container {
		display: flex;
		flex-direction: row;
		align-items: center;
	}
</style>
