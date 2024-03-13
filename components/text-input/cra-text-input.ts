import { CSSResultArray, LitElement, PropertyValues, TemplateResult, css, html } from 'lit';
import { property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

import StylesBase from '../../styles/base-styles';
import StylesButton from '../../styles/button-styles';
import StylesForm from '../../styles/form-styles';
import StylesSpinner from '../../styles/spinner-styles';

import customEventFactory from '../utils/custom-event-factory';

import { KeyEvent, TextEvent } from '../form-base/cra-form-controller';

export const TEXT_INPUT_INPUT = 'cra:textInput:input';
export const TEXT_INPUT_BLUR = 'cra:textInput:blur';
export const TEXT_INPUT_KEYDOWN = 'cra:textInput:keydown';

type AllowedInputTypes = 'email' | 'password' | 'text' | 'number';

declare global {
	interface DocumentEventMap {
		[TEXT_INPUT_INPUT]: CustomEvent<TextEvent>;
		[TEXT_INPUT_BLUR]: CustomEvent<TextEvent>;
		[TEXT_INPUT_KEYDOWN]: CustomEvent<KeyEvent>;
	}
}

export class CRATextInput extends LitElement {
	@property({ type: String }) public inputType: AllowedInputTypes = 'text';

	@property({ type: String }) public label = '';

	@property({ type: String }) public name = '';

	@property({ type: String }) public value = '';

	@property({ type: Boolean }) public isError = false;

	@property({ type: String }) public errorText = '';

	@property({ type: Boolean }) public disabled = false;

	@property({ type: Boolean }) public isLoading = false;

	@property({ type: Boolean }) public autocapitalization = false;

	@state() protected floatLabel = false;

	public static override get styles(): CSSResultArray {
		return [
			StylesBase,
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
				type=${this.inputType}
				name=${this.name}
				.value="${this.value}"
				@input=${this.onInput}
				@blur=${this.onBlur}
				@keydown=${this.onKeyDown}
				?disabled=${this.disabled}
				aria-invalid=${this.isError}
				autocapitalize=${this.autocapitalization ? 'on' : 'off'}
			/>
			<label for=${this.name} class="base-input-label"><i>${this.label}</i></label>

			<div
				class=${classMap({
					'error-spacer': true,
				})}
			>
				<p
					class=${classMap({
						'input-error-label': true,
						'input-error-label-show': this.isError,
					})}
				>
					${this.errorText}
				</p>
			</div>
			${this.isLoading
				? html`<div class="input-spinner-container">
						<div class="spinner" aria-label="Loading..."></div>
				  </div>`
				: undefined}
		`;
	}

	protected onInput(e: Event): void {
		const { name, value } = e.currentTarget as HTMLInputElement;
		this.dispatchEvent(
			customEventFactory(TEXT_INPUT_INPUT, {
				detail: { name, value },
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

	protected onKeyDown(e: KeyboardEvent): void {
		const { name } = e.currentTarget as HTMLInputElement;
		const { key } = e;
		this.dispatchEvent(
			customEventFactory(TEXT_INPUT_KEYDOWN, {
				detail: { name, key },
			}),
		);
	}

	public override willUpdate(changedProps: PropertyValues): void {
		if (changedProps.has('value')) {
			if (this.value === '') {
				this.floatLabel = false;
			} else {
				this.floatLabel = true;
			}
		}
	}
}

if (!window.customElements.get('cra-text-input')) {
	window.customElements.define('cra-text-input', CRATextInput);
}
