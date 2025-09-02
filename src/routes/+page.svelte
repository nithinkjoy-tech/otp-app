<script>
	import OtpInput from '$lib/components/OtpInput.svelte';
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
		/^[A-Za-z]+$/
	];
	let shouldAutoFocus = true;

	let inputStyles = [`
		border: 2px solid green;
		border-radius: 5px;
	`,,,,`
		border: 2px solid brown;
		border-radius: 5px;
	`];
	
	let inputFocusStyle = `
	border: 2px solid pink;
	`

	let inputErrorStyle = [
		`border: 2px solid purple;`,
		`border: 2px solid pink;`,
		`border: 2px solid blue;`,
		`border: 2px solid brown;`
	]

	let containerStyles = `
		gap: unset;
	`;


	function onChange(input, event, index) {
		console.log('onChange clalled', event, index);
	}

	function keyDown(event, index) {
		// console.log('keyDown clalled', event, index, inputRef);
	}

	function onInput(event, index) {
		console.log('onInput clalled', event, index);
	}

	function onFocus(event, index) {

	}

	function onBlur(event, index) {

	}

	function onPaste(event, index) {
		// console.log('onPaste clalled', event, index);
		// alert('Pasting is not allowed');
		// event.preventDefault();
	}

	function onComplete(value) {
		console.log('onComplete called', value);
	}

	function onEnter(value) {
		console.log('onEnter called', value);
	}

	let inputRef = $state(Array(numInputs).fill(null));
	//let inputRef = "hel;lo";
	let value = $state('');

	function clearOTP() {
		value = '';
		console.log('clearOTP called',inputRef);
		inputRef[0].focus()
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
		bind:inputRef = {inputRef}
		bind:value = {value}
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
		keyDown={[keyDown, "after"]}
		onInput={[onInput, "after"]}
		onFocus={[onFocus, "after"]}
		onBlur={[onBlur, "after"]}
		onPaste={[onPaste, "after"]}
		onComplete={onComplete}
		onEnter={onEnter}
		allowPaste={true}
	></OtpInput>

	<button onclick={()=>clearOTP()}>Clear OTP</button>
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
