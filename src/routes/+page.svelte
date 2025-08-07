<script>
	import OtpInput from '$lib/components/OtpInput.svelte';
	let numInputs = $state(6);
	let shouldAutoFocus = true

	function onChange(event){
		console.log('onChange clalled', event)
	}
</script>

{#snippet separatorSnippet()}
	<span class="custom-separator"></span>
{/snippet}

<div id="app">
	<OtpInput showInput={true} {numInputs} {onChange}></OtpInput>
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
</style>
