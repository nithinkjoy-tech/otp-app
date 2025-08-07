<script>
	import SingleOtpInput from '$lib/components/SingleOtpInput.svelte';
	import { onMount } from 'svelte';
	let {
		showInput,
		inputType = "number",
		numInputs = 4,
		separatorSnippet = null,
		separator = '-',
		shouldAutoFocus = false,
		onChange = () => {},
	} = $props();


	let focusIndex = $state(null);
	let inputRefs
		= $state(Array(numInputs).fill(''));

	// $inspect("value: ",value)

	onMount(() => {
		if (shouldAutoFocus) {
			focusIndex = 0;
		}
	})

	// $effect(() => {
	// 	if (focusIndex !== null && inputRefs[focusIndex]) {
	// 		inputRefs[focusIndex].focus();
	// 		inputRefs[focusIndex].select();
	// 	}
	// });


	function handleInputChange(event, index) {
		console.log("handleInputChange: ", event, index)
		// onChange(event);
		if (event.key === 'Backspace') {
			if (inputRefs[index] === '') {
				if (index > 0) {
					inputRefs[index] = inputRefs[index - 1];
					inputRefs[index - 1] = '';
					focusIndex = index - 1;
				}
			}
		} else {
			if (index < numInputs - 1) {
				focusIndex = index + 1;
			} else {
				focusIndex = null;
			}
		}
	}

	function handleInputFocus(event, index) {
		// console.log("handleInputFocus: ",event, index)
		console.log("need to focus", index)
		focusIndex = index;
	}
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
				value={inputRefs[index]}
				{shouldAutoFocus}
				{focusIndex}
				{handleInputChange}
				{handleInputFocus}
				{numInputs}
				bind:inputRef={inputRefs[index]}
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