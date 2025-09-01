<script>
	import { onMount } from 'svelte';
	import { getInputStyles, getInputType, isSnippet } from '../helpers/utils.js';

	import {
		OnInputClass,
		KeyDownClass,
		OnFocusClass,
		OnBlurClass,
		OnPasteClass
	} from '../helpers/eventHandlers.js';

	let {
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
		inputRef,
		value = $bindable(''),
		keyDown,
		onInput,
		onFocus,
		onBlur,
		onPaste,
		onComplete,
		onEnter,
	} = $props();

	function getStatefulArray(inputRefs, numInputs) {
		if (inputRefs) {
			let refArr = $state.snapshot(inputRefs);
			if (Array.isArray(refArr) && refArr.length === numInputs) {
				return inputRefs;
			} else {
				throw new Error(
					'You have passed wrong inputRef type. We expect inputRef of type $state(Array(noOfInputs).fill(null)). Also check noOfInput used while creating inputRef'
				);
			}
		}

		// We give user to pass their own inputRef for more control, If inputRef is not passed, we create one internally
		// we cannot directly return $state() so we are assigning to a local variable
		let _inputRefs = $state(Array(numInputs).fill(null));
		return _inputRefs;
	}

	let focusIndex = $state(null);
	let inputValues = $state(Array(numInputs).fill(''));
	let inputRefs = getStatefulArray(inputRef, numInputs);

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
		inputType,
		onEnter,
		getValue: () => value,
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

	$effect(() => {
		if (value === '') {
			for (let i = 0; i < numInputs; i++) {
				inputValues[i] = '';
			}
		}
	})

	$effect(() => {
		value = inputValues.join('');
	});

	$effect(() => {
		if(value.length === numInputs) {
			if(typeof onComplete === 'function') {
				onComplete(value);
			} else if(onComplete) {
				throw new Error('onComplete must be a function');
			}
		}
	})

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
