<script>
	import OtpInput from '$lib/components/OtpInput.svelte';
	let numInputs = $state(6);
</script>

{#snippet separatorSnippet()}
	<span class="custom-separator"></span>
{/snippet}

<div id="app">
	<OtpInput showInput={true} {numInputs}></OtpInput>
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
