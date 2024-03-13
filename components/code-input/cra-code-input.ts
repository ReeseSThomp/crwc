import {
	CSSResultArray,
	LitElement,
	PropertyValues,
	TemplateResult,
	css,
	html,
	unsafeCSS,
} from 'lit';
import { property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { live } from 'lit/directives/live.js';

import StylesMain from '../../styles/base-styles';
import StylesButton from '../../styles/button-styles';
import StylesForm from '../../styles/form-styles';
import StylesSpinner from '../../styles/spinner-styles';

import { Breakpoint } from '../utils/breakpoints';
import customEventFactory from '../utils/custom-event-factory';

import { TextEvent } from '../form-base/cra-form-controller';
import '../success-check/cra-success-check';

export const CODE_INPUT_INPUT = 'cra:codeInput:input';
export const CODE_INPUT_BLUR = 'cra:codeInput:blur';

export function formatCode(submittedCode: string): string {
	if (!submittedCode) {
		return '';
	}
	return submittedCode.replace(/\D/g, '');
}

declare global {
	interface DocumentEventMap {
		[CODE_INPUT_INPUT]: CustomEvent<TextEvent>;
		[CODE_INPUT_BLUR]: CustomEvent<TextEvent>;
	}
}

export class CRACodeInput extends LitElement {
	@property({ type: String }) public label = '';

	@property({ type: String }) public name = '';

	@property({ type: String, hasChanged: () => true }) public value = '';

	@property({ type: String }) public errorText = '';

	@property({ type: Boolean }) public isError = false;

	@property({ type: Boolean }) public floatLabel = false;

	@property({ type: Boolean }) public disabled = false;

	@property({ type: Boolean }) public isLoading = false;

	@property({ type: Boolean }) public isSuccess = false;

	public static override get styles(): CSSResultArray {
		const phoneXLBreakpoint = unsafeCSS(Breakpoint.PHONE_XL);
		return [
			StylesMain,
			StylesButton,
			StylesForm,
			StylesSpinner,
			// language=CSS
			css`
				:host {
					display: flex;
					margin-bottom: 0.75rem;
					position: relative;
					justify-content: flex-start;
					align-items: center;
				}

				.wrapper {
					position: relative;
					display: block;
					width: 4.5rem;
					order: 1;
				}

				.code-override {
					padding: 1rem;
					width: 4.5rem;
				}

				.hide-label + label,
				.base-input:focus + label {
					display: none;
				}

				.label-override {
					width: 78%;
					text-align: center;
				}

				.success-container {
					width: 2rem;
					height: 2rem;

					margin-right: var(--gap);
					margin-left: var(--gap);
					margin-bottom: calc(var(--gap) / 2);
					order: 2;
				}

				@media all and (min-width: ${phoneXLBreakpoint}) {
					.wrapper {
						margin-right: var(--gap);
						margin-top: var(--gap);
					}

					.wrapper {
						order: 2;
					}

					.success-container {
						order: 1;
						margin: 0;
						margin-top: var(--gap);
						margin-right: var(--gap);
					}
				}
			`,
		];
	}

	protected override render(): TemplateResult {
		return html`
			<div class="success-container">
				${this.isLoading ? html`<div class="spinner" aria-label="Loading..."></div>` : html``}
				${this.isSuccess ? html`<cra-success-check></cra-success-check>` : html``}
			</div>
			<div class="wrapper">
				<input
					id=${this.name}
					class=${classMap({
						'base-input': true,
						'code-override': true,
						'input-is-error': this.isError,
						'hide-label': this.floatLabel,
					})}
					type="text"
					maxlength="4"
					name=${this.name}
					.value="${live(this.value)}"
					@input=${this.onInput}
					@blur=${this.onBlur}
					?disabled=${this.disabled}
					aria-invalid=${this.isError}
				/>
				<label for=${this.name} class="base-input-label label-override">_ _ _ _</label>
			</div>
		`;
	}

	protected onInput(e: InputEvent): void {
		const { name, value } = e.currentTarget as HTMLInputElement;
		const formattedCode = formatCode(value);
		this.value = formattedCode;
		this.dispatchEvent(
			customEventFactory(CODE_INPUT_INPUT, {
				detail: { name, value: formattedCode },
			}),
		);
	}

	protected onBlur(e: Event): void {
		const { name, value } = e.currentTarget as HTMLInputElement;
		this.dispatchEvent(
			customEventFactory(CODE_INPUT_BLUR, {
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

if (!window.customElements.get('cra-code-input')) {
	window.customElements.define('cra-code-input', CRACodeInput);
}
