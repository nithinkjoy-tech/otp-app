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

	class OnInputClass {
		constructor() { }

		defaultOnInput(event, index) {
			const isDelete =
				event.inputType === 'deleteContentBackward' ||
				event.key === 'Backspace' ||
				event.key === 'deleteContentCut';

			focusIndex = isDelete ? index - 1 : Math.min(index + 1, numInputs - 1);
		}

		handleOnInput(event, index) {
			if (Array.isArray(onInput)) {
				if (!typeof onInput[0] === 'function') {
					throw new TypeError(
						"Expected 'onInput' array's first index to be a function, but got " + typeof onInput[0]
					);
				}
				switch (onInput[1]) {
					case 'before':
						onInput[0](event, index);
						this.defaultOnInput(event, index);
						break;
					case 'after':
						this.defaultOnInput(event, index);
						onInput[0](event, index);
						break;
					case 'replace':
						onInput[0](event, index);
						break;
					default:
						throw new TypeError(
							"Expected 'onInput' array's second index to be one of the following: " +
							'before, after, replace, but got ' +
							onInput[1]
						);
				}
			} else if (onInput) {
				throw new TypeError("Expected 'keyDown' to be an array, but got " + typeof onInput);
			} else {
				this.defaultOnInput(event, index);
			}
		}
	}

	class KeyDownClass {
		constructor() { }

		defaultKeydown(event, index) {
			console.log('default keydown runnign');
			switch (event.key) {
				case 'Backspace':
					inputRefs[index].value
						? onInputInstance.handleOnInput(event, index - 1)
						: onFocusInstance.handleInputFocus(event, index - 1);
					break;
				case 'ArrowLeft':
					if (index > 0) {
						focusIndex = index - 1;
					} else {
						event.preventDefault();
					}
					break;
				case 'ArrowRight':
					if (index < numInputs - 1) {
						focusIndex = index + 1;
					} else {
						event.preventDefault();
					}
					break;
				case 'ArrowUp':
				case 'ArrowDown':
					event.preventDefault();
					break;
				default:
					validateInput(event, index, inputType);
			}
		}

		handleKeyDown(event, index) {
			if (Array.isArray(keyDown)) {
				if (!typeof keyDown[0] === 'function') {
					throw new TypeError(
						"Expected 'keyDown' array's first index to be a function, but got " + typeof keyDown[0]
					);
				}
				switch (keyDown[1]) {
					case 'before':
						keyDown[0](event, index);
						this.defaultKeydown(event, index);
						break;
					case 'after':
						this.defaultKeydown(event, index);
						keyDown[0](event, index);
						break;
					case 'replace':
						keyDown[0](event, index);
						break;
					default:
						throw new TypeError(
							"Expected 'keyDown' array's second index to be one of the following: " +
							'before, after, replace, but got ' +
							keyDown[1]
						);
				}
			} else if (keyDown) {
				throw new TypeError("Expected 'keyDown' to be an array, but got " + typeof keyDown);
			} else {
				this.defaultKeydown(event, index);
			}
		}
	}

	class OnFocusClass {
		constructor() { }

		defaultOnFocus(event, index) {
			focusIndex = index;
			if (inputFocusStyle) {
				applyFocusStyle(inputRefs[focusIndex], getInputFocusStyles(inputFocusStyle, focusIndex));
			}
		}

		handleInputFocus(event, index) {
			if (Array.isArray(onFocus)) {
				if (!typeof onFocus[0] === 'function') {
					throw new TypeError(
						"Expected 'onFocus' array's first index to be a function, but got " + typeof onFocus[0]
					);
				}
				switch (onFocus[1]) {
					case 'before':
						onFocus[0](event, index);
						this.defaultOnFocus(event, index);
						break;
					case 'after':
						this.defaultOnFocus(event, index);
						onFocus[0](event, index);
						break;
					case 'replace':
						onFocus[0](event, index);
						break;
					default:
						throw new TypeError(
							"Expected 'onInput' array's second index to be one of the following: " +
							'before, after, replace, but got ' +
							onFocus[1]
						);
				}
			} else if (onFocus) {
				throw new TypeError("Expected 'keyDown' to be an array, but got " + typeof onInput);
			} else {
				this.defaultOnFocus(event, index);
			}
		}
	}

	class OnBlurClass {
		constructor() { }

		defaultOnBlur(event, index) {
			if (inputFocusStyle) {
				removeFocusStyle(inputRefs[index]);
			}
		}

		handleInputBlur(event, index) {
			if (Array.isArray(onBlur)) {
				if (!typeof onBlur[0] === 'function') {
					throw new TypeError(
						"Expected 'onBlur' array's first index to be a function, but got " + typeof onBlur[0]
					);
				}
				switch (onBlur[1]) {
					case 'before':
						onBlur[0](event, index);
						this.defaultOnBlur(event, index);
						break;
					case 'after':
						this.defaultOnBlur(event, index);
						onBlur[0](event, index);
						break;
					case 'replace':
						onBlur[0](event, index);
						break;
					default:
						throw new TypeError(
							"Expected 'onBlur' array's second index to be one of the following: " +
							'before, after, replace, but got ' +
							onBlur[1]
						);
				}
			} else if (onBlur) {
				throw new TypeError("Expected 'keyDown' to be an array, but got " + typeof onInput);
			} else {
				this.defaultOnBlur(event, index);
			}
		}
	}

	class OnPasteClass {
		constructor() { }

		defaultOnPaste(event, index) {
			event.preventDefault();
			const pastedData = event.clipboardData.getData('text/plain').slice(0, numInputs).split('');

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

		handleInputPaste(event, index) {
			if (Array.isArray(onPaste)) {
				if (!typeof onPaste[0] === 'function') {
					throw new TypeError(
						"Expected 'onPaste' array's first index to be a function, but got " + typeof onPaste[0]
					);
				}
				switch (onPaste[1]) {
					case 'before':
						onPaste[0](event, index);
						this.defaultOnPaste(event, index);
						break;
					case 'after':
						this.defaultOnPaste(event, index);
						onPaste[0](event, index);
						break;
					case 'replace':
						onPaste[0](event, index);
						break;
					default:
						throw new TypeError(
							"Expected 'onPaste' array's second index to be one of the following: " +
							'before, after, replace, but got ' +
							onPaste[1]
						);
				}
			} else if (onPaste) {
				throw new TypeError("Expected 'keyDown' to be an array, but got " + typeof onPaste);
			} else {
				this.defaultOnPaste(event, index);
			}
		}
	}

	let onPasteInstance = new OnPasteClass();
	let onBlurInstance = new OnBlurClass();
	let onFocusInstance = new OnFocusClass();
	let onInputInstance = new OnInputClass();
	let keyDownInstance = new KeyDownClass();

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
				onkeydown={(e) => keyDownInstance.handleKeyDown(e, index)}
				oninput={(e) => onInputInstance.handleOnInput(e, index)}
				onfocus={(e) => onFocusInstance.handleInputFocus(e, index)}
				onblur={(e) => onBlurInstance.handleInputBlur(e, index)}
				onpaste={(e) => onPasteInstance.handleInputPaste(e, index)}
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
