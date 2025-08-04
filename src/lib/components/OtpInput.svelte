<script>
	import SingleOtpInput from '$lib/components/SingleOtpInput.svelte';

	let { showInput, inputType, numInputs } = $props();
</script>

{#if showInput}
	<div class="otp-input-lib-container">
		{#each Array(numInputs).keys() as i}
			<SingleOtpInput {showInput} {inputType}></SingleOtpInput>
		{/each}
	</div>
{/if}

<style>
	.otp-input-lib-container {
		display: flex;
		flex-direction: row;
	}
</style>
