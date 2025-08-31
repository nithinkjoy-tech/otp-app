<script>
	import { onMount } from 'svelte';
	import {
		applyFocusStyle,
		getInputFocusStyles,
		getInputStyles,
		getInputType,
		isSnippet,
		removeFocusStyle,
		validateInput
	} from '../helpers/utils.js';

	import {
		OnInputClass,
		KeyDownClass,
		OnFocusClass,
		OnBlurClass,
		OnPasteClass,
	} from '../helpers/eventHandlers.js';

	let {
		showInput,
		inputType = 'number',
		numInputs = 4,
		separator = '-',
		groupSeparator = '||',
		shouldAutoFocus = false,
		placeholder = '',
		group = null,
		isError = false,
		containerStyles = ``,
		inputStyles = ``,
		inputFocusStyle = ``,
		inputErrorStyle = ``,
		focusIndex,
		inputRefs,
		inputValues,
		keyDown,
		onInput,
		onFocus,
		onBlur,
		onPaste,
	} = $props();

	// helper setter
	const setFocusIndex = (i) => (focusIndex = i);

	// instantiate handlers
	const onInputInstance = new OnInputClass({ numInputs, setFocusIndex });
	const onFocusInstance = new OnFocusClass({ inputRefs, inputFocusStyle, setFocusIndex });
	const onBlurInstance = new OnBlurClass({ inputRefs, inputFocusStyle });
	const onPasteInstance = new OnPasteClass({ numInputs, inputValues, setFocusIndex, inputType });
	const keyDownInstance = new KeyDownClass({
		numInputs,
		inputRefs,
		setFocusIndex,
		onInputInstance,
		onFocusInstance,
		inputType
	});

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

	$effect(() => {
		if (group) {
			let groupSum = group.reduce((acc, curr) => acc + curr);
			if (groupSum !== numInputs) throw new Error('Sum of groups must be equal to numInputs');
		}
	});

	let groupHelper = $derived(() => {
		if (
			!group ||
			!Array.isArray(group) ||
			!group.every(Number.isInteger) ||
			group.reduce((sum, n) => sum + n, 0) !== numInputs
		) {
			return [];
		}
		return group.reduce((arr, n) => {
			arr.push((arr.at(-1) || 0) + n);
			return arr;
		}, []);
	});
</script>

{#snippet renderSeparator(index)}
	{@const validGroup = groupHelper().includes(index + 1)}
	{@const sep = Array.isArray(separator) ? separator[index] : separator}

	{#if index !== numInputs - 1}
		{#if validGroup}
			{#if groupSeparator}
				{#if isSnippet(groupSeparator)}
					{@render groupSeparator()}
				{:else}
					<span>{groupSeparator}</span>
				{/if}
			{/if}
		{:else if Array.isArray(separator)}
			{#if isSnippet(sep)}
				{@render sep()}
			{:else}
				<span>{sep}</span>
			{/if}
		{:else if isSnippet(sep)}
			{@render sep()}
		{:else}
			<span>{sep}</span>
		{/if}
	{/if}
{/snippet}

{#if showInput}
	<div class="otp-input-lib-container" style={containerStyles}>
		{#each Array(numInputs).fill() as _, index}
			{@const type = getInputType(inputType, index)}
			{@const ph = placeholder[index] || ''}
			{@const inputStyle = getInputStyles(isError, inputErrorStyle, inputStyles, index)}

			<input
				class={['single-otp-input', isError && 'otp-input-error']}
				style={inputStyle}
				{type}
				bind:this={inputRefs[index]}
				bind:value={
					() => inputValues[index],
					(v) => {
						inputValues[index] = v?.toString()?.substring(0, 1);
					}
				}
				autoComplete="off"
				placeholder={ph}
				aria-label={`Please enter OTP character ${index + 1}`}
				onkeydown={(e) => keyDownInstance.handleKeyDown(e, index, keyDown)}
				oninput={(e) => onInputInstance.handleOnInput(e, index, onInput)}
				onfocus={(e) => onFocusInstance.handleInputFocus(e, index, onFocus)}
				onblur={(e) => onBlurInstance.handleInputBlur(e, index, onBlur)}
				onpaste={(e) => onPasteInstance.handleInputPaste(e, index, onPaste)}
			/>
			{@render renderSeparator(index)}
		{/each}
	</div>
{/if}

<style>
	input:focus {
		outline: none;
	}

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

	.otp-input-error {
		border: 2px solid red;
	}

	.single-otp-input::-webkit-inner-spin-button,
	.single-otp-input::-webkit-outer-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}
</style>
