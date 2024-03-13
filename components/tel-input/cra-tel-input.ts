import { CSSResultArray, LitElement, PropertyValues, TemplateResult, css, html } from 'lit';
import { property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { live } from 'lit/directives/live.js';

import StylesContent from '../../styles/base-styles';
import StylesButton from '../../styles/button-styles';
import StylesForm from '../../styles/form-styles';
import StylesSpinner from '../../styles/spinner-styles';

import customEventFactory from '../utils/custom-event-factory';
import { TextEvent } from '../form-base/cra-form-controller';

export const TEXT_INPUT_INPUT = 'cra:textInput:input';
export const TEXT_INPUT_BLUR = 'cra:textInput:blur';

function backspaceOverFormatCharacters(submittedPhoneNumber: string, inputType: string): string {
	if (
		inputType === 'deleteContentBackward' &&
		(submittedPhoneNumber.length === 4 || submittedPhoneNumber.length === 9)
	) {
		return submittedPhoneNumber.substring(0, submittedPhoneNumber.length - 1);
	}
	return submittedPhoneNumber;
}

export function formatPhoneNumber(submittedPhoneNumber: string): string {
	if (!submittedPhoneNumber) {
		return '';
	}

	const format = '(ddd) ddd-dddd';
	let formattedNumber = '';

	const stripedNumber = submittedPhoneNumber.replace(/\D/g, '');

	for (let indexFormat = 0, indexNumber = 0; indexFormat < format.length; indexFormat += 1) {
		if (/\d/g.test(format.charAt(indexFormat))) {
			if (format.charAt(indexFormat) === stripedNumber.charAt(indexNumber)) {
				formattedNumber += stripedNumber.charAt(indexNumber);
				indexNumber += 1;
			} else {
				formattedNumber += format.charAt(indexFormat);
			}
		} else if (format.charAt(indexFormat) !== 'd') {
			if (stripedNumber.charAt(indexNumber) !== '' || format.charAt(indexFormat) === '+') {
				formattedNumber += format.charAt(indexFormat);
			}
		} else if (stripedNumber.charAt(indexNumber) === '') {
			formattedNumber += '';
		} else {
			formattedNumber += stripedNumber.charAt(indexNumber);
			indexNumber += 1;
		}
	}

	const lastCharacter = format.charAt(formattedNumber.length);
	if (lastCharacter !== 'd') {
		formattedNumber += lastCharacter;
	}
	return formattedNumber;
}

export function stripPhoneNumber(formattedNumber: string): string {
	return formattedNumber.replace(/\D/g, '');
}

declare global {
	interface DocumentEventMap {
		[TEXT_INPUT_INPUT]: CustomEvent<TextEvent>;
		[TEXT_INPUT_BLUR]: CustomEvent<TextEvent>;
	}
}

export class CRATelInput extends LitElement {
	@property({ type: String }) public label = '';

	@property({ type: String }) public name = '';

	@property({ type: String, hasChanged: () => true }) public value = '';

	@property({ type: String }) public errorText = '';

	@property({ type: Boolean }) public floatLabel = false;

	@property({ type: Boolean }) public disabled = false;

	@property({ type: Boolean }) public isLoading = false;

	@property({ type: Boolean }) public isError = false;

	// @property({ type: Boolean }) public isUpdated = false;

	public static override get styles(): CSSResultArray {
		return [
			StylesContent,
			StylesButton,
			StylesForm,
			StylesSpinner,
			// language=CSS
			css`
				:host {
					display: block;
					position: relative;
				}
			`,
		];
	}

	protected override render(): TemplateResult {
		return html`
			<input
				id=${this.name}
				class=${classMap({
					'base-input': true,
					'input-is-error': this.isError,
					'float-label': this.floatLabel,
				})}
				type="tel"
				maxlength="14"
				name=${this.name}
				.value="${live(this.value)}"
				@input=${this.onInput}
				@blur=${this.onBlur}
				?disabled=${this.disabled}
				aria-invalid=${this.isError}
			/>
			<label for=${this.name} class="base-input-label">${this.label}</label>
			<p
				class=${classMap({
					'input-error-label': true,
					'input-error-label-show': this.isError,
				})}
			>
				${this.errorText}
			</p>
			<div
				class=${classMap({
					'error-spacer': true,
					'error-spacer-is-error': this.isError,
				})}
			></div>
			${this.isLoading
				? html`<div class="input-spinner-container">
						<div class="spinner" aria-label="Loading..."></div>
				  </div>`
				: undefined}
		`;
	}

	protected onInput(e: InputEvent): void {
		const { inputType } = e;
		const { name, value } = e.currentTarget as HTMLInputElement;
		const formattedPhoneNumber = formatPhoneNumber(backspaceOverFormatCharacters(value, inputType));
		this.value = formattedPhoneNumber;
		this.dispatchEvent(
			customEventFactory(TEXT_INPUT_INPUT, {
				detail: { name, value: formattedPhoneNumber },
			}),
		);
	}

	protected onBlur(e: Event): void {
		const { name, value } = e.currentTarget as HTMLInputElement;
		this.dispatchEvent(
			customEventFactory(TEXT_INPUT_BLUR, {
				detail: { name, value },
			}),
		);
	}

	protected override updated(changedProps: PropertyValues): void {
		if (changedProps.has('value')) {
			if (this.value === '') {
				this.floatLabel = false;
			} else {
				this.floatLabel = true;
			}
		}
	}
}

if (!window.customElements.get('cra-tel-input')) {
	window.customElements.define('cra-tel-input', CRATelInput);
}
