<script>
	import SingleOtpInput from '$lib/components/SingleOtpInput.svelte';

	// Fix 1: Use $state for reactive array
	let inputRefs = $state([])

	// Fix 2: Proper props destructuring
	let {
		showInput,
		inputType = "number",
		numInputs = 4,
		separatorSnippet = null,
		separator = '-'
	} = $props();

	// Fix 3: Initialize refs array when numInputs changes
	$effect(() => {
		inputRefs = Array(numInputs).fill(null);
	});

	// Fix 4: Focus first input when component is shown
	$effect(() => {
		setTimeout(()=>{
			console.log({inputRefs})
		}, 20)
		if (showInput && inputRefs.length > 0) {
			// Small delay to ensure DOM is ready
			setTimeout(() => {
				inputRefs[0]?.focus();
			}, 0);
		}
	});
</script>

{#snippet renderSeparator(index)}
	{#if index !== numInputs - 1}
		{#if separatorSnippet}
			{@render separatorSnippet()}
		{:else if separator}
			<span>{separator}</span>
		{/if}
	{/if}
{/snippet}

{#if showInput}
	<div class="otp-input-lib-container">
		{#each Array(numInputs).fill().map((_, i) => i) as index}
			<SingleOtpInput
				{showInput}
				{inputType}
				{index}
				bind:ref={inputRefs[index]}
			/>
			{@render renderSeparator(index)}
		{/each}
	</div>
{/if}

<style>
    .otp-input-lib-container {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 8px;
    }
</style>