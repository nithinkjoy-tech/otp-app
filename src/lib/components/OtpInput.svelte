<script>
	// import SingleOtpInput from '$lib/components/SingleOtpInput.svelte';
	import { onMount } from 'svelte';
	let {
		showInput,
		inputType = 'number',
		numInputs = 4,
		separatorSnippet = null,
		separator = '-',
		shouldAutoFocus = false,
		onChange = () => {}
	} = $props();

	let focusIndex = $state(null);
	let inputRefs = Array(numInputs).fill('');
	let inputValue = Array(numInputs).fill('');

	onMount(() => {
		if (shouldAutoFocus) {
			focusIndex = 0;
		}
	});

	$effect(() => {
		console.log('effect calling: ', focusIndex, inputRefs);
		if (focusIndex !== null && inputRefs[focusIndex]) {
			console.log('focusIndex: ', focusIndex);
			setTimeout(() => {
				inputRefs[focusIndex].focus();
				inputRefs[focusIndex].select();
			});
		}
	});

	function handleInputChange(event, index, source) {
		console.log('source: ', source);
		console.log('handleInputChange: ', event, index);

		if (
			event.inputType === 'deleteContentBackward' ||
			event.key === 'Backspace' ||
			event.key === 'deleteContentCut'
		) {
			focusIndex = index - 1;
		} else {
			if (index < numInputs - 1) {
				focusIndex = index + 1;
			}
		}
		if (focusIndex === numInputs - 1) {
			setTimeout(() => {
				console.log('inside set: ', focusIndex);
				inputRefs[focusIndex].select();
			});
		}
	}

	function handleInputFocus(event, index) {
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
		{#each Array(numInputs)
			.fill()
			.map((_, i) => i) as index}
			<input
				class="single-otp-input"
				bind:this={inputRefs[index]}
				type={inputType}
				bind:value={
					() => inputValue[index],
					(v) =>
						(inputValue[index] = (function (v) {
							console.log('v: ', v);
							return v?.toString()?.substring(0, 1);
						})(v))
				}
				onkeydown={(e) => {
					if (inputType === 'number') {
						if (['e', 'E', '+', '-', '.'].includes(e.key)) {
							e.preventDefault();
						}
					}

					if (e.key === 'Backspace') {
						if (inputRefs[index].value) {
							handleInputChange(e, index - 1);
						} else {
							handleInputFocus(e, index - 1);
						}
					}

					if (e.key === 'ArrowLeft') {
						if (index > 0) handleInputFocus(e, index - 1, true);
						else e.preventDefault();
					}

					if (e.key === 'ArrowRight') {
						if (index < numInputs - 1) handleInputFocus(e, index + 1, true);
						else e.preventDefault();
					}

					if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
						e.preventDefault();
					}
				}}
				onfocus={(e) => handleInputFocus(e, index)}
				oninput={(e) => handleInputChange(e, index, 'evvvnt')}
				maxlength="1"
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
		vertical-align: middle;
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
