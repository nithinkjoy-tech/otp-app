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

export function getInputStyles(isError, inputErrorStyle, inputStyles, index) {
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
	console.log({inputType, value})
	if (typeof inputType === 'string') {
		switch (inputType) {
			case 'number':
				if(!isInvalidNumberKey(value)) return value
				break;

			case 'alnum':
				if(/^[a-zA-Z0-9]$/.test(value)) {
					return value
				}
				break;

			case 'uppercase':
				if (/^[a-zA-Z]$/.test(value)) {
					return value.toUpperCase();
				}
				break;

			case 'lowercase':
				if (/^[a-zA-Z]$/.test(value)) {
					return value.toLowerCase();
				}
				break;

			case 'upper-alnum':
				if (/^[a-zA-Z0-9]$/.test(value)) {
					return value.toUpperCase();
				}
				break;

			case 'lower-alnum':
				if (/^[a-zA-Z0-9]$/.test(value)) {
					return value.toLowerCase();
				}
				break;

			case 'text':
				return value;
		}
	} else if (inputType instanceof RegExp) {
		if (inputType.test(value)) {
			return value;
		}
	}
}

export function validateInput(e, index, _inputType = 'text') {
	if (typeof _inputType === 'string') {
		const key = e.key;

		switch (_inputType) {
			case 'number':
				if (!((e.ctrlKey || e.metaKey) && key.toLowerCase() === 'v') && isInvalidNumberKey(key)) {
					console.log('prventing defaulttt');
					e.preventDefault();
				}
				break;

			case 'alnum':
				if (!/^[a-zA-Z0-9]$/.test(key)) e.preventDefault();
				break;

			case 'uppercase':
				if (!/^[a-zA-Z]$/.test(key)) {
					e.preventDefault();
				} else if (/^[a-z]$/.test(key)) {
					transformCase(e, key.toUpperCase());
				}
				break;

			case 'lowercase':
				if (!/^[a-zA-Z]$/.test(key)) {
					e.preventDefault();
				} else if (/^[A-Z]$/.test(key)) {
					transformCase(e, key.toLowerCase());
				}
				break;

			case 'upper-alnum':
				if (!/^[a-zA-Z0-9]$/.test(key)) {
					e.preventDefault();
				} else if (/^[a-z]$/.test(key)) {
					transformCase(e, key.toUpperCase());
				}
				break;

			case 'lower-alnum':
				if (!/^[a-zA-Z0-9]$/.test(key)) {
					e.preventDefault();
				} else if (/^[A-Z]$/.test(key)) {
					transformCase(e, key.toLowerCase());
				}
				break;
		}
	} else if (Array.isArray(_inputType)) {
		validateInput(e, index, _inputType[index]);
	} else if (_inputType instanceof RegExp) {
		if (!_inputType.test(e.key)) e.preventDefault();
	}
}
