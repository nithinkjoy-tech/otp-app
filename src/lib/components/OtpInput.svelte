<script>
	import { onMount } from 'svelte';

	let {
		showInput,
		inputType = 'number',
		numInputs = 4,
		separatorSnippet = null,
		separator = '-',
		shouldAutoFocus = false,
		placeholder = ''
	} = $props();

	let focusIndex = $state(null);
	let inputRefs = Array(numInputs).fill(null);
	let inputValues = $state(Array(numInputs).fill(''));

	onMount(() => {
		if (shouldAutoFocus) focusIndex = 0;
	});

	$effect(() => {
		if (focusIndex !== null && inputRefs[focusIndex]) {
			setTimeout(() => {
				inputRefs[focusIndex]?.focus();
				inputRefs[focusIndex]?.select();
			});
		}
	});

	function handleInputChange(event, index) {
		const isDelete =
			event.inputType === 'deleteContentBackward' ||
			event.key === 'Backspace' ||
			event.key === 'deleteContentCut';

		focusIndex = isDelete ? index - 1 : Math.min(index + 1, numInputs - 1);

		if (focusIndex === numInputs - 1) {
			setTimeout(() => inputRefs[focusIndex]?.select());
		}
	}

	function handleInputFocus(_, index) {
		focusIndex = index;
	}

	function handleInputPaste(event, index) {
		event.preventDefault();
		const pastedData = event.clipboardData
			.getData('text/plain')
			.slice(0, numInputs)
			.split('');

		// Prevent pasting if the clipboard data contains non-numeric values for number inputs
		if (inputType === 'number' && pastedData.some((value) => isNaN(Number(value)))) return;

		const totalPastedChars = pastedData.length;

		// If the user is pasting data in the middle of the input, check whether previous inputs are empty and fill them with pasted data
		const hasNonEmptyInput = inputValues.slice(0, index).some(Boolean);
		const startPos = !hasNonEmptyInput ? 0 : index;
		const endPos = Math.min(numInputs, startPos + totalPastedChars);

		for (let pos = startPos; pos < endPos; pos++) {
			if (pastedData.length > 0) {
				inputValues[pos] = pastedData.shift() ?? '';
				focusIndex = Math.min(numInputs - 1, pos + 1);
			} else {
				break;
			}
		}
	}

	function isInvalidNumberKey(key) {
		return ['e', 'E', '+', '-', '.'].includes(key);
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
		{#each Array(numInputs).fill() as _, index}
			<input
				class="single-otp-input"
				type={inputType}
				bind:this={inputRefs[index]}
				bind:value={
					() => inputValues[index],
					(v) => {
						inputValues[index] = v?.toString()?.substring(0, 1);
					}
				}
				maxlength="1"
				placeholder={placeholder[index] || ''}
				onkeydown={(e) => {
					if (inputType === 'number' && isInvalidNumberKey(e.key)) {
						e.preventDefault();
					}

					switch (e.key) {
						case 'Backspace':
							inputRefs[index].value
								? handleInputChange(e, index - 1)
								: handleInputFocus(e, index - 1);
							break;
						case 'ArrowLeft':
							index > 0 ? handleInputFocus(e, index - 1) : e.preventDefault();
							break;
						case 'ArrowRight':
							index < numInputs - 1 ? handleInputFocus(e, index + 1) : e.preventDefault();
							break;
						case 'ArrowUp':
						case 'ArrowDown':
							e.preventDefault();
							break;
					}
				}}
				oninput={(e) => handleInputChange(e, index)}
				onfocus={(e) => handleInputFocus(e, index)}
				onpaste={(e) => handleInputPaste(e, index)}
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

	.single-otp-input {
		height: 60px;
		width: 60px;
		border-radius: 5px;
		text-align: center;
		font-size: 40px;
		line-height: 60px;
		margin: 0 12px;
		border: 2px solid #6f6e6c;
		box-sizing: border-box;
		-moz-appearance: textfield;
		appearance: textfield;
	}

	.single-otp-input::-webkit-inner-spin-button,
	.single-otp-input::-webkit-outer-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}
</style>
