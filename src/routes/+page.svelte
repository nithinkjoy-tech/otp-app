<script>
	import OtpInput from '$lib/components/OtpInput.svelte';
	import { getInputType, getValidInput } from '$lib/helpers/utils.js';
	let numInputs = 9;
	let placeholder = '12345';
	let separator = $state(separatorSnippet);
	let groupSeparator = $state(groupSeparatorSnippet);
	let group = [3, 4, 2];
	let isError = true;
	let inputType = [
		'number',
		'text',
		'upper-alnum',
		'lower-alnum',
		'alnum',
		'uppercase',
		'lowercase',
		/^[A-Za-z]+$/,
		'password'
	];
	// let inputType = 'number';
	let shouldAutoFocus = true;

	let inputStyles = [
		`
		border: 2px solid green;
		border-radius: 5px;
	`,
		,
		,
		,
		`
		border: 2px solid brown;
		border-radius: 5px;
	`
	];

	let inputFocusStyle = `
		border: 2px solid pink;
	`;

	let inputErrorStyle = [
		`border: 2px solid purple;`,
		`border: 2px solid pink;`,
		`border: 2px solid blue;`,
		`border: 2px solid brown;`
	];

	let inputDisabledStyle = `border: 2px solid blue;
		background: pink
		;`;

	let containerStyles = `
		gap: unset;
	`;

	let placeholderStyle = `
	color: red;
	font-size: 10px;`;

	function onChange(input, event, index) {
		console.log('onChange clalled', event, index);
	}

	function keyDown(event, index) {
		// console.log('keyDown clalled', event, index, inputRef);
	}

	function onInput(event, index) {
		console.log('onInput clalled', event, index);
	}

	function onFocus(event, index) {}

	function onBlur(event, index) {}



	function onComplete(value) {
		console.log('onComplete called', value);
	}

	function onEnter(value) {
		console.log('onEnter called', value);
	}

	let inputRef = $state(Array(numInputs).fill(null));
	//let inputRef = "hel;lo";
	let value = $state('');
	let otp;

	function onPaste(event, currentIndex) {
		event.preventDefault();
		console.log("paste",event)
		event.preventDefault();
		const clipboardText = event.clipboardData
			.getData('text/plain')
			.slice(0, numInputs) // limit to max input length
			.split('');

		let insertionStartIndex = currentIndex - 1;

		// Handle case where previous value is 'v' (from Ctrl+V)
		if (otp.internal.inputValues[currentIndex - 1]?.toLowerCase() === 'v') {
			inputValues[currentIndex - 1] = '';
		} else {
			insertionStartIndex = currentIndex;
		}
		const totalCharsToInsert = clipboardText.length;

		// Check if any non-empty value exists before currentIndex
		const hasValuesBefore = otp.internal.inputValues.slice(0, currentIndex).some(Boolean);
		const startIndex = !hasValuesBefore ? 0 : insertionStartIndex;
		const endIndex = Math.min(numInputs, startIndex + totalCharsToInsert);

		for (let pos = startIndex; pos < endIndex; pos++) {
			if (clipboardText.length > 0) {
				const char = clipboardText.shift();
				otp.internal.inputValues[pos] = getValidInput(getInputType(inputType, pos), char) ?? '';
				otp.internal.setFocusIndex(Math.min(numInputs - 1, pos + 1));
			} else {
				break;
			}
		}
	}

	function clearOTP() {
		value = '';
		console.log('clearOTP called', inputRef);
		inputRef[0].focus();
	}

	function displayValue() {
		console.log('displayValue called', value);
	}
</script>

{#snippet separatorSnippet()}
	<span class="custom-separator"></span>
{/snippet}

{#snippet groupSeparatorSnippet()}
	<span class="custom-group-separator"></span>
{/snippet}

<div id="app">
	<OtpInput
		bind:inputRef
		bind:value
		bind:this={otp}
		{group}
		{containerStyles}
		{inputStyles}
		{inputFocusStyle}
		{inputErrorStyle}
		{groupSeparator}
		{numInputs}
		{onChange}
		{shouldAutoFocus}
		{placeholder}
		{inputType}
		{separator}
		{isError}
		keyDown={[keyDown, 'after']}
		onInput={[onInput, 'after']}
		onFocus={[onFocus, 'after']}
		onBlur={[onBlur, 'after']}
		onPaste={[onPaste, 'replace']}
		{onComplete}
		{onEnter}
		restrictPaste={false}
		isDisabled={false}
		{inputDisabledStyle}
	></OtpInput>

	<button onclick={() => clearOTP()}>Clear OTP</button>
	<button onclick={() => displayValue()}>Display value</button>
</div>

<style>
	.custom-separator {
		display: flex;
		align-items: center;
		height: 6px;
		width: 6px;
		border-radius: 50%;
		background: red;
	}

	.custom-group-separator {
		display: flex;
		align-items: center;
		height: 5px;
		width: 10px;
		/*border-radius: 50%;*/
		background: #1e1e1e;
	}
</style>
