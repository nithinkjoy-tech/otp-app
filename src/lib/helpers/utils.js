export function applyFocusStyle(el, style) {
	el.dataset.prevStyle = el.style.cssText;
	el.style.cssText += style;
}

export function removeFocusStyle(el) {
	if (el.dataset.prevStyle !== undefined) {
		el.style.cssText = el.dataset.prevStyle;
		delete el.dataset.prevStyle;
	}
}

export function getInputType(inputType, index) {
	if (typeof inputType === 'string') return inputType;
	if (Array.isArray(inputType)) return inputType[index] ?? 'text';
	return 'text';
}

export function getInputStyles(
	inputRefs,
	isError,
	inputErrorStyle,
	isDisabled,
	inputDisabledStyle,
	inputStyles,
	index
) {
	if (isDisabled && inputDisabledStyle) return getInputDisabledStyle(inputDisabledStyle, index);
	if (isError && inputErrorStyle) return getInputErrorStyle(inputErrorStyle, index);
	if (typeof inputStyles === 'string') return inputStyles;
	if (Array.isArray(inputStyles)) return inputStyles[index] || '#1e1e1e';
}

export function getInputFocusStyles(inputFocusStyle, index) {
	if (typeof inputFocusStyle === 'string') return inputFocusStyle;
	if (Array.isArray(inputFocusStyle)) return inputFocusStyle[index] || '#1e1e1e';
}

export function getInputErrorStyle(inputErrorStyle, index) {
	if (typeof inputErrorStyle === 'string') return inputErrorStyle;
	if (Array.isArray(inputErrorStyle)) return inputErrorStyle[index] || 'red';
	throw new Error('inputErrorStyle must be a string or array of strings');
}

export function getInputDisabledStyle(inputDisabledStyle, index) {
	if (typeof inputDisabledStyle === 'string') return inputDisabledStyle;
	if (Array.isArray(inputDisabledStyle)) return inputDisabledStyle[index] || 'gray';
	throw new Error('inputDisabledStyle must be a string or array of strings');
}

export function isInvalidNumberKey(key) {
	// Returns true for any key that's not 0-9
	return /[^0-9]/.test(key);
}

// As of now svelte doesn't have an inbuilt way to determine whether it is a snippet or not
// still under discussion https://github.com/sveltejs/svelte/issues/9774
export function isSnippet(fn) {
	return typeof fn === 'function' && fn.toString !== Function.prototype.toString;
}

export function transformCase(e, input) {
	requestAnimationFrame(() => {
		const { selectionStart, selectionEnd, value } = e.target;
		const before = value.slice(0, selectionStart - 1);
		const after = value.slice(selectionEnd);
		e.target.value = before + input + after;
		e.target.setSelectionRange(selectionStart, selectionStart);
		e.target.dispatchEvent(new Event('input', { bubbles: true }));
	});
}

export function checkValidation(inputType, value) {
	if (typeof inputType === 'string') {
		switch (inputType) {
			case 'number':
				return !isInvalidNumberKey(value);

			case 'alnum':
				return /^[a-zA-Z0-9]$/.test(value);

			case 'uppercase':
			case 'lowercase':
				return /^[a-zA-Z]$/.test(value);

			case 'upper-alnum':
			case 'lower-alnum':
				return /^[a-zA-Z0-9]$/.test(value);

			case 'text':
			case 'password':
				return true;

			default:
				return false;
		}
	} else if (inputType instanceof RegExp) {
		return inputType.test(value);
	}

	return false;
}

export function getValidInput(inputType, value) {
	if (!checkValidation(inputType, value)) return '';

	switch (inputType) {
		case 'uppercase':
		case 'upper-alnum':
			return value.toUpperCase();

		case 'lowercase':
		case 'lower-alnum':
			return value.toLowerCase();

		case 'number':
		case 'alnum':
		case 'text':
		case 'password':
			return value;

		default:
			return '';
	}
}

export function validateInput(e, index, _inputType = 'text') {
	const key = e.key;

	// handle array case
	if (Array.isArray(_inputType)) {
		return validateInput(e, index, _inputType[index]);
	}

	// handle regex case
	if (_inputType instanceof RegExp) {
		if (!_inputType.test(key)) e.preventDefault();
		return;
	}

	if (typeof _inputType === 'string') {
		// allow Ctrl+V / Cmd+V for all input types
		if ((e.ctrlKey || e.metaKey) && key.toLowerCase() === 'v') {
			return;
		}

		if (!checkValidation(_inputType, key)) {
			e.preventDefault();
			return;
		}

		const transformed = getValidInput(_inputType, key);
		if (transformed !== key) {
			transformCase(e, transformed);
		}
	}
}
