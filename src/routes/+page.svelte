<script>
	import OtpInput from '$lib/components/OtpInput.svelte';
	import { getInputType, getValidInput, setValue } from '$lib/helpers/utils.js';
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

	let stylePriority = {
		inputDisabledStyle: 'p0',
		inputErrorStyle: 'p1',
		inputFocusStyle: 'p2'
	}

	// let inputType = 'number';
	let shouldAutoFocus = true;

	// let inputStyles = [
	// 	`
	// 	border: 2px solid green;
	// 	border-radius: 5px;
	// `,
	// 	,
	// 	,
	// 	,
	// 	`
	// 	border: 2px solid brown;
	// 	border-radius: 5px;
	// `
	// ];

	// let inputStyles = [
	// 	{
	// 		border: `2px solid green`,
	// 		borderRadius: `5px`,
	// 	}
	// ];

	// let inputStyles = ""

	// let inputStyles = "w-16 text-center aspect-square focus:outline-none focus:ring-1 rounded-md px-4 py-3 ring-[0.4px] ring-gray-500"
	let inputStyles = "!w-16 !text-center !aspect-square !rounded-md !px-4 !py-3 !ring-[0.4px] !ring-gray-500";
	// let inputStyles = {
	// 	width: '60px',
	// 	height: '60px',
	// 	border: '2px solid green',
	// 	borderRadius: '5px',
	// 	outline: 'none',
	// 	padding: '0',
	// 	margin: '0',
	// 	fontSize: '16px',
	// 	textAlign: 'center',
	// 	lineHeight: '16px',
	// }

	// let inputFocusStyle = {
	// 	border: '2px solid pink;'
	// }

	let inputFocusStyle =
		`!border-[1px] !border-solid !border-pink-500`

	let inputErrorStyle =
		`!border-[1px] !border-solid !border-green-500`

	// let inputErrorStyle = {
	// 	border: '2px solid brown',
	// 	borderRadius: '5px',
	// 	outline: 'none',
	// 	padding: '12px',
	// 	margin: '0',
	// 	fontSize: '16px',
	// 	textAlign: 'center',
	// 	lineHeight: '16px',
	// }

	let inputDisabledStyle = "!border-[2px] !border-[blue] !bg-[pink]"

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
		setValue('');
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
		group={group}
		containerStyles={containerStyles}
		inputStyles={inputStyles}
		inputFocusStyle={inputFocusStyle}
		inputErrorStyle={inputErrorStyle}
		groupSeparator={groupSeparator}
		numInputs={numInputs}
		onChange={onChange}
		shouldAutoFocus={shouldAutoFocus}
		placeholder={placeholder}
		inputType={inputType}
		separator={separator}
		isError={isError}
		keyDown={[keyDown, 'after']}
		onInput={[onInput, 'after']}
		onFocus={[onFocus, 'after']}
		onBlur={[onBlur, 'after']}
		onPaste={[onPaste, 'replace']}
		onComplete={onComplete}
		onEnter={onEnter}
		restrictPaste={false}
		isDisabled={false}
		inputDisabledStyle={inputDisabledStyle}
		stylePriority={stylePriority}
	></OtpInput>

	<button class="mt-8" onclick={() => clearOTP()}>Clear OTP</button>
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
