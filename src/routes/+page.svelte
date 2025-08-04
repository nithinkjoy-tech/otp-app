<script>
	import OtpInput from '$lib/components/OtpInput.svelte';

	let inputType = $state('number');
	let numInputs = $state(4);
</script>

<div id="app">
	<OtpInput showInput={true} {inputType} {numInputs}></OtpInput>
</div>
<style>
</style>
