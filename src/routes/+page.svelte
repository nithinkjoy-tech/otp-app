<script>
	import OtpInput from '$lib/components/OtpInput.svelte';
	let numInputs = $state(9);
	let placeholder = $state('1111');
	// let inputType = $state('tel');
	let separator = $state(separatorSnippet);
	let groupSeparator = $state(groupSeparatorSnippet);
	let group = $state([3,2,4]);
	let inputType = $state(['number','text','upper-alnum','lower-alnum','alnum','uppercase','lowercase',/^[A-Za-z]+$/]);
	let shouldAutoFocus = true;

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
	<OtpInput showInput={true} {group} {groupSeparator} {numInputs} {onChange} {shouldAutoFocus} {placeholder} {inputType} {separator}
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
