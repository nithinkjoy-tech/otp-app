<script>
	// mixed input type
	// mixed separator
	// separator for some intervals
	// invalid group error
	import OtpInput from '$lib/components/OtpInput.svelte';
	let numInputs = $state(9);
	let placeholder = $state('1111');
	// let inputType = $state('tel');
	let separator = $state(separatorSnippet);
	let groupSeparator = $state(groupSeparatorSnippet);
	let group = $state([3, 2, 4]);
	let isError = $state(false);
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

	let containerStyles = `
		gap: unset;
	`;

	function onChange(event) {
		console.log('onChange clalled', event);
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
		{containerStyles}
		{inputStyles}
		{inputFocusStyle}
		{groupSeparator}
		{numInputs}
		{onChange}
		{shouldAutoFocus}
		{placeholder}
		{inputType}
		{separator}
		{isError}
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
