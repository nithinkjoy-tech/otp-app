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

	class EventHandler {
		constructor(eventName) {
			this.eventName = eventName;
		}

		_handle(event, index, config) {
			if (Array.isArray(config)) {
				const [fn, mode] = config;

				if (typeof fn !== "function") {
					throw new TypeError(
						`Expected '${this.eventName}' array's first index to be a function, but got ${typeof fn}`
					);
				}

				switch (mode) {
					case "before":
						fn(event, index);
						this.defaultHandler(event, index);
						break;
					case "after":
						this.defaultHandler(event, index);
						fn(event, index);
						break;
					case "replace":
						fn(event, index);
						break;
					default:
						throw new TypeError(
							`Expected '${this.eventName}' array's second index to be one of: before, after, replace, but got ${mode}`
						);
				}
			} else if (config) {
				throw new TypeError(
					`Expected '${this.eventName}' to be an array, but got ${typeof config}`
				);
			} else {
				this.defaultHandler(event, index);
			}
		}
	}

	class OnInputClass extends EventHandler {
		constructor() {
			super("onInput");
		}

		defaultHandler(event, index) {
			const isDelete =
				event.inputType === "deleteContentBackward" ||
				event.key === "Backspace" ||
				event.key === "deleteContentCut";

			focusIndex = isDelete ? index - 1 : Math.min(index + 1, numInputs - 1);
		}

		handleOnInput(event, index) {
			this._handle(event, index, onInput);
		}
	}

	class KeyDownClass extends EventHandler {
		constructor() {
			super("keyDown");
		}

		defaultHandler(event, index) {
			switch (event.key) {
				case "Backspace":
					inputRefs[index].value
						? onInputInstance.handleOnInput(event, index)
						: onFocusInstance.handleInputFocus(event, index);
					break;
				case "ArrowLeft":
					focusIndex = index > 0 ? index - 1 : index;
					if (index === 0) event.preventDefault();
					break;
				case "ArrowRight":
					focusIndex = index < numInputs - 1 ? index + 1 : index;
					if (index === numInputs - 1) event.preventDefault();
					break;
				case "ArrowUp":
				case "ArrowDown":
					event.preventDefault();
					break;
				default:
					validateInput(event, index, inputType);
			}
		}

		handleKeyDown(event, index) {
			this._handle(event, index, keyDown);
		}
	}

	class OnFocusClass extends EventHandler {
		constructor() {
			super("onFocus");
		}

		defaultHandler(event, index) {
			focusIndex = index;
			if (inputFocusStyle) {
				applyFocusStyle(
					inputRefs[focusIndex],
					getInputFocusStyles(inputFocusStyle, focusIndex)
				);
			}
		}

		handleInputFocus(event, index) {
			this._handle(event, index, onFocus);
		}
	}

	class OnBlurClass extends EventHandler {
		constructor() {
			super("onBlur");
		}

		defaultHandler(event, index) {
			if (inputFocusStyle) {
				removeFocusStyle(inputRefs[index]);
			}
		}

		handleInputBlur(event, index) {
			this._handle(event, index, onBlur);
		}
	}

	class OnPasteClass extends EventHandler {
		constructor() {
			super("onPaste");
		}

		defaultHandler(event, index) {
			console.log("default handler get called")
			event.preventDefault();
			const pastedData = event.clipboardData
				.getData("text/plain")
				.slice(0, numInputs)
				.split("");

			if (inputType === "number" && pastedData.some((v) => isNaN(Number(v)))) return;

			const totalPastedChars = pastedData.length;
			const hasNonEmptyInput = inputValues.slice(0, index).some(Boolean);
			const startPos = !hasNonEmptyInput ? 0 : index;
			const endPos = Math.min(numInputs, startPos + totalPastedChars);

			for (let pos = startPos; pos < endPos; pos++) {
				if (pastedData.length > 0) {
					inputValues[pos] = pastedData.shift() ?? "";
					focusIndex = Math.min(numInputs - 1, pos + 1);
				} else {
					break;
				}
			}
		}

		handleInputPaste(event, index) {
			this._handle(event, index, onPaste);
		}
	}

	const onInputInstance = new OnInputClass();
	const keyDownInstance = new KeyDownClass();
	const onFocusInstance = new OnFocusClass();
	const onBlurInstance = new OnBlurClass();
	const onPasteInstance = new OnPasteClass();

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
