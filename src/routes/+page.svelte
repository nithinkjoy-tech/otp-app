<script>
	import OtpInput from '$lib/components/OtpInput.svelte';
	let numInputs = $state(9);
	let placeholder = $state('1111');
	let separator = $state(separatorSnippet);
	let groupSeparator = $state(groupSeparatorSnippet);
	let group = $state([3, 2, 4]);
	let isError = $state(true);
	let inputType = $state([
		'number',
		'text',
		'upper-alnum',
		'lower-alnum',
		'alnum',
		'uppercase',
		'lowercase',
		/^[A-Za-z]+$/
	]);
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

	let focusIndex = $state(null);
	let inputRefs = $state(Array(numInputs).fill(null));
	let inputValues = $state(Array(numInputs).fill(''));

	function onChange(input, event, index) {
		console.log('onChange clalled', event, index);
	}

	function keyDown(event, index) {
			console.log('keyDown clalled', event, index);
	}

	function onInput(event, index) {

	}

	function onFocus(event, index) {

	}

	function onBlur(event, index) {

	}

	function onPaste(event, index) {

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
		showInput={true}
		{group}
		{focusIndex}
		bind:inputRefs = {inputRefs}
		bind:inputValues = {inputValues}
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
	></OtpInput>
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
