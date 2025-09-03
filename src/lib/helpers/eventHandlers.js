import {
	applyFocusStyle,
	checkValidation,
	getInputFocusStyles,
	getInputType,
	removeFocusStyle,
	validateInput
} from './utils.js';

export class EventHandler {
	constructor(eventName) {
		this.eventName = eventName;
	}

	_handle(event, index, config) {
		if (Array.isArray(config)) {
			const [fn, mode] = config;

			if (typeof fn !== 'function') {
				throw new TypeError(
					`Expected '${this.eventName}' array's first index to be a function, but got ${typeof fn}`
				);
			}

			switch (mode) {
				case 'before':
					fn(event, index);
					this.defaultHandler(event, index);
					break;
				case 'after':
					this.defaultHandler(event, index);
					fn(event, index);
					break;
				case 'replace':
					fn(event, index);
					break;
				default:
					throw new TypeError(
						`Expected '${this.eventName}' array's second index to be one of: before, after, replace, but got ${mode}`
					);
			}
		} else if (config) {
			throw new TypeError(
				`Expected '${this.eventName}' to be an array, but got ${typeof config}`
			);
		} else {
			this.defaultHandler(event, index);
		}
	}
}

export class OnInputClass extends EventHandler {
	constructor({ numInputs, setFocusIndex }) {
		super('onInput');
		this.numInputs = numInputs;
		this.setFocusIndex = setFocusIndex;
	}

	defaultHandler(event, index) {
		const isDelete =
			event.inputType === 'deleteContentBackward' ||
			event.key === 'Backspace' ||
			event.key === 'deleteContentCut';

		this.setFocusIndex(
			isDelete ? index - 1 : Math.min(index + 1, this.numInputs - 1)
		);
	}

	handleOnInput(event, index, onInput) {
		this._handle(event, index, onInput);
	}
}

export class KeyDownClass extends EventHandler {
	constructor({ numInputs, inputRefs, setFocusIndex, onInputInstance, onFocusInstance, inputType, onEnter, getValue }) {
		super('keyDown');
		this.numInputs = numInputs;
		this.inputRefs = inputRefs;
		this.setFocusIndex = setFocusIndex;
		this.onInputInstance = onInputInstance;
		this.onFocusInstance = onFocusInstance;
		this.inputType = inputType;
		this.onEnter = onEnter;
		this.getValue = getValue;
	}

	defaultHandler(event, index) {
		switch (event.key) {
			case 'Backspace':
				this.inputRefs[index].value
					? this.onInputInstance.handleOnInput(event, index)
					: this.onFocusInstance.handleInputFocus(event, index - 1);
				break;
			case 'Enter':
				if(this.onEnter) {
					if(typeof this.onEnter === 'function') {
						this.onEnter(this.getValue());
					} else {
						throw new TypeError('onEnter must be a function');
					}
				}
				break;
			case 'Tab':
				this.defaultHandler({ ...event, key: 'ArrowRight' }, index);
				break;
			case 'ArrowLeft':
				this.setFocusIndex(index > 0 ? index - 1 : index);
				if (index === 0) event.preventDefault();
				break;
			case 'ArrowRight':
				this.setFocusIndex(index < this.numInputs - 1 ? index + 1 : index);
				if (index === this.numInputs - 1) {
					if ('preventDefault' in event) event.preventDefault();
				}
				break;
			case 'ArrowUp':
			case 'ArrowDown':
				event.preventDefault();
				break;
			default:
				validateInput(event, index, this.inputType);
		}
	}

	handleKeyDown(event, index, keyDown) {
		this._handle(event, index, keyDown);
	}
}

export class OnFocusClass extends EventHandler {
	constructor({ inputRefs, inputFocusStyle, setFocusIndex }) {
		super('onFocus');
		this.inputRefs = inputRefs;
		this.inputFocusStyle = inputFocusStyle;
		this.setFocusIndex = setFocusIndex;
	}

	defaultHandler(event, index) {
		this.setFocusIndex(index);
		if (this.inputFocusStyle) {
			applyFocusStyle(
				this.inputRefs[index],
				getInputFocusStyles(this.inputFocusStyle, index)
			);
		}
	}

	handleInputFocus(event, index, onFocus) {
		this._handle(event, index, onFocus);
	}
}

export class OnBlurClass extends EventHandler {
	constructor({ inputRefs, inputFocusStyle }) {
		super('onBlur');
		this.inputRefs = inputRefs;
		this.inputFocusStyle = inputFocusStyle;
	}

	defaultHandler(event, index) {
		if (this.inputFocusStyle) {
			removeFocusStyle(this.inputRefs[index]);
		}
	}

	handleInputBlur(event, index, onBlur) {
		this._handle(event, index, onBlur);
	}
}

export class OnPasteClass extends EventHandler {
	constructor({ numInputs, inputValues, setFocusIndex, inputType }) {
		super('onPaste');
		this.numInputs = numInputs;
		this.inputValues = inputValues;
		this.setFocusIndex = setFocusIndex;
		this.inputType = inputType;
	}

	#allowPaste = true;

	defaultHandler(event, index) {
		event.preventDefault();
		const pastedData = event.clipboardData
			.getData('text/plain')
			.slice(0, this.numInputs)
			.split('');

		if (this.inputType === 'number' && pastedData.some((v) => isNaN(Number(v)))) return;

		console.log({index,a:this.inputValues[index - 1]})
		let si = index - 1;
		if(this.inputValues[index - 1].toLowerCase() === 'v') {
			console.log('its v')
			this.inputValues[index - 1] = '';
		} else {
			si =index
		}
		const totalPastedChars = pastedData.length;
		console.log("sll",this.inputValues.slice(0, index))
		const hasNonEmptyInput = this.inputValues.slice(0, index).some(Boolean);
		console.log({hasNonEmptyInput});
		const startPos = !hasNonEmptyInput ? 0 : si;
		console.log({startPos})
		const endPos = Math.min(this.numInputs, startPos + totalPastedChars);

		for (let pos = startPos; pos < endPos; pos++) {
			if (pastedData.length > 0) {
				console.log({ipp:this.inputType[pos],pos})
				let val = checkValidation(getInputType(this.inputType[pos]), pastedData.shift()) ?? ''
				console.log({val})
				this.inputValues[pos] = val;
				this.setFocusIndex(Math.min(this.numInputs - 1, pos + 1));
			} else {
				break;
			}
		}
	}

	handleInputPaste(event, index, onPaste, allowPaste) {
		this.#allowPaste = allowPaste;
		this._handle(event, index, onPaste);
	}
}
