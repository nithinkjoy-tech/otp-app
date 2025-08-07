<script>
	import { onMount, tick } from 'svelte';
	let {
		showInput,
		inputType,
		index,
		shouldAutoFocus,
		handleInputChange,
		handleInputFocus,
		focusIndex,
		value,
		numInputs
	} = $props();
	let otpInput;
	let fireDeleteEvent = true;

	$effect(() => {
		// $inspect(index, focusIndex);
		if (index === focusIndex && otpInput) {
			console.log("focus called", index)
			otpInput.focus();
			setTimeout(() => {
				otpInput.select();
			})
		}
	});

	function handleSingleInputChange(event) {
		console.log("inout change called",event, fireDeleteEvent)
		if (event.inputType === 'deleteContentBackward') {
			handleInputChange(event, index - 1);
		} else {
			handleInputChange(event, index);
			if(index === numInputs - 1 && otpInput.value) {
				otpInput.select();
			}
			fireDeleteEvent = true;
		}


	}

	function handleSingleInputFocus(event) {
		// if (select) {
		// 	otpInput.select();
		// }
		console.log({ event, index })
		handleInputFocus(event, index);
	}
</script>

<input
	class="single-otp-input"
	bind:this={otpInput}
	type={inputType}
	bind:value={
		() => value,
		(v) =>
			(value = (function (v) {
				return v?.toString()?.substring(0, 1);
			})(v))
	}
	onkeydown={(e) => {
		if (inputType === 'number') {
			if (['e', 'E', '+', '-', '.'].includes(e.key)) {
				e.preventDefault();
			}
		}

		console.log({e})
		if (e.key === 'Backspace') {
			console.log({otpInput})
			if(otpInput.value) {
				handleSingleInputChange(e, index);
				fireDeleteEvent = false;
			} else {
				handleSingleInputChange(e, index);
			}
		}

		if (e.key === 'ArrowLeft') {
			if(index > 0)
				handleInputFocus(e, index - 1, true);
			else
				e.preventDefault();
		}

		if (e.key === 'ArrowRight') {
			if(index < numInputs - 1)
				handleInputFocus(e, index + 1, true);
			else
				e.preventDefault();
		}

		if (e.key === 'Enter') {

		}
	}}
	onfocus={handleSingleInputFocus}
	oninput={handleSingleInputChange}
	maxlength="1"
/>

<style>
	.single-otp-input {
		height: 60px;
		width: 60px;
		border-radius: 5px;
		text-align: center;
		font-size: 40px;
		line-height: 60px;
		vertical-align: middle;
		margin: 0 12px;
		border: 2px solid #6f6e6c;
		box-sizing: border-box;

		-moz-appearance: textfield;
		appearance: textfield;
	}

	.single-otp-input::-webkit-inner-spin-button,
	.single-otp-input::-webkit-outer-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}
</style>
