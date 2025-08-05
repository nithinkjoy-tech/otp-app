<script>
	import {onMount, tick} from "svelte"
	let {showInput, inputType, index} = $props()
	let otpInput
</script>

<input class="single-otp-input" bind:this={otpInput} type="{inputType}" />

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