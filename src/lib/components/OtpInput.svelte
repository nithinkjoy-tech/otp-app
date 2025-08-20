<script>
	import { onMount } from 'svelte';

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
		inputFocusStyle = ``
	} = $props();

	let focusIndex = $state(null);
	let inputRefs = $state(Array(numInputs).fill(null));
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

	$effect(() => {
		let groupSum = group?.reduce((acc, curr) => acc + curr);
		if (groupSum !== numInputs) throw new Error('Sum of groups must be equal to numInputs');
	});

	let groupHelper = $derived((group, numInputs) => {
		if (
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

	let isValidGroup = $derived((index) => groupHelper(group, numInputs).includes(index + 1));

	function applyFocusStyle(el, style) {
		el.dataset.prevStyle = el.style.cssText;
		el.style.cssText += style;
	}

	function removeFocusStyle(el) {
		if (el.dataset.prevStyle !== undefined) {
			el.style.cssText = el.dataset.prevStyle;
			delete el.dataset.prevStyle;
		}
	}

	function getInputType(index) {
		if (typeof inputType === 'string') return inputType;
		if (Array.isArray(inputType)) return inputType[index] ?? 'text';
		return 'text';
	}

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

	function getInputStyles(index) {
		if (typeof inputStyles === 'string') return inputStyles;
		if(Array.isArray(inputStyles)) return inputStyles[index]||'#1e1e1e';
	}

	function getInputFocusStyles(index) {
		if (typeof inputFocusStyle === 'string') return inputFocusStyle;
		if(Array.isArray(inputFocusStyle)) return inputFocusStyle[index]||'#1e1e1e';
	}

	function handleInputFocus(_, index) {
		focusIndex = index;
		if(inputFocusStyle) {
			applyFocusStyle(inputRefs[focusIndex], getInputFocusStyles(focusIndex));
		}
	}

	function handleInputBlur(event, index) {
		if(inputFocusStyle) {
			removeFocusStyle(inputRefs[index]);
		}
	}

	function handleInputPaste(event, index) {
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

	function isInvalidNumberKey(key) {
		// Returns true for any key that's not 0-9
		return /[^0-9]/.test(key);
	}

	// As of now svelte doesn't have an inbuilt way to determine whether it is a snippet or not
	// still under discussion https://github.com/sveltejs/svelte/issues/9774
	function isSnippet(fn) {
		return typeof fn === 'function' && fn.toString !== Function.prototype.toString;
	}

	function transformCase(e, input) {
		requestAnimationFrame(() => {
			const { selectionStart, selectionEnd, value } = e.target;
			const before = value.slice(0, selectionStart - 1);
			const after = value.slice(selectionEnd);
			e.target.value = before + input + after;
			e.target.setSelectionRange(selectionStart, selectionStart);
			e.target.dispatchEvent(new Event('input', { bubbles: true }));
		});
	}

	function validateInput(e, index, _inputType = 'text') {
		if (typeof _inputType === 'string') {
			if (_inputType === 'number') {
				if (isInvalidNumberKey(e.key)) {
					e.preventDefault();
				}
			} else if (_inputType === 'alnum') {
				if (!/^[a-zA-Z0-9]$/.test(e.key)) {
					e.preventDefault();
				}
			} else if (_inputType === 'uppercase') {
				if (!/^[a-zA-Z]$/.test(e.key)) {
					e.preventDefault();
					return;
				}
				if (/^[a-z]$/.test(e.key)) {
					transformCase(e, e.key.toUpperCase());
				}
			} else if (_inputType === 'lowercase') {
				if (!/^[a-zA-Z]$/.test(e.key)) {
					e.preventDefault();
					return;
				}
				if (/^[A-Z]$/.test(e.key)) {
					transformCase(e, e.key.toLowerCase());
				}
			} else if (_inputType === 'upper-alnum') {
				if (!/^[a-zA-Z0-9]$/.test(e.key)) {
					e.preventDefault();
					return;
				}
				if (/^[a-z]$/.test(e.key)) {
					transformCase(e, e.key.toUpperCase());
				}
			} else if (_inputType === 'lower-alnum') {
				if (!/^[a-zA-Z0-9]$/.test(e.key)) {
					e.preventDefault();
					return;
				}
				if (/^[A-Z]$/.test(e.key)) {
					transformCase(e, e.key.toLowerCase());
				}
			}
		} else if (Array.isArray(_inputType)) {
			validateInput(e, index, _inputType[index]);
		} else if (_inputType instanceof RegExp) {
			if (!_inputType.test(e.key)) {
				e.preventDefault();
			}
		}
	}
</script>

{#snippet renderSeparator(index)}
	{@const validGroup = isValidGroup(index)}
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
			{@const type = getInputType(index)}
			{@const ph = placeholder[index] || ''}
			{@const inputStyle = getInputStyles(index)}

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
				maxlength="1"
				placeholder={ph}
				onkeydown={(e) => {
					switch (e.key) {
						case 'Backspace':
							inputRefs[index].value
								? handleInputChange(e, index - 1)
								: handleInputFocus(e, index - 1);
							break;
						case 'ArrowLeft':
							if(index > 0) {
								handleInputFocus(e, index - 1)
								handleInputBlur(e, index);
							} else {
								e.preventDefault()
							}
							break;
						case 'ArrowRight':
							if(index < numInputs - 1) {
								handleInputFocus(e, index + 1)
								handleInputBlur(e, index);
							} else {
								e.preventDefault()
							}
							break;
						case 'ArrowUp':
						case 'ArrowDown':
							e.preventDefault();
							break;
						default:
							validateInput(e, index, inputType);
					}
				}}
				oninput={(e) => handleInputChange(e, index)}
				onfocus={(e) => handleInputFocus(e, index)}
				onblur={(e) => handleInputBlur(e, index)}
				onpaste={(e) => handleInputPaste(e, index)}
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
