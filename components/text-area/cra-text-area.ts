import { CSSResultArray, LitElement, TemplateResult, css, html } from 'lit';
import { property } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { classMap } from 'lit/directives/class-map.js';

import StylesBase from '../../styles/base-styles';
import StylesButton from '../../styles/button-styles';
import StylesForm from '../../styles/form-styles';
import StylesSpinner from '../../styles/spinner-styles';

import customEventFactory from '../utils/custom-event-factory';
import { TextEvent } from '../form-base/cra-form-controller';

export const TEXT_AREA_INPUT = 'cra:textArea:input';
export const TEXT_AREA_BLUR = 'cra:textArea:blur';

declare global {
	interface DocumentEventMap {
		[TEXT_AREA_INPUT]: CustomEvent<TextEvent>;
		[TEXT_AREA_BLUR]: CustomEvent<TextEvent>;
	}
}

export class CRATextArea extends LitElement {
	@property({ type: String }) public placeholder = '';

	@property({ type: String }) public name = '';

	@property({ type: String }) public value = '';

	@property({ type: Boolean }) public isError = false;

	@property({ type: String }) public errorText = '';

	@property({ type: Number }) public maxLength: number | undefined;

	@property({ type: Boolean }) public disabled = false;

	@property({ type: Boolean }) public isLoading = false;

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

				.text-area {
					font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Oxygen-Sans, Ubuntu, Cantarell,
						'Helvetica Neue', Roboto, sans-serif;
					padding: 0.5rem;
					height: 4rem;
					resize: none;
				}

				.text-area::placeholder {
					color: rgb(var(--dell-gray));
				}

				.text-area[disabled]::placeholder {
					color: rgb(var(--silver));
				}

				#spinner-container {
					top: 0.25rem;
					right: 0.25rem;
				}

				.character-limit {
					color: rgb(var(--dell-gray));
					position: absolute;
					right: 0.9rem;
					bottom: 0rem;
					margin: 0;
					font-size: var(--smallest);
				}
			`,
		];
	}

	protected override render(): TemplateResult {
		return html`
			<textarea
				id=${this.name}
				class=${classMap({
					'base-input': true,
					'text-area': true,
					'input-is-error': this.isError,
				})}
				name=${this.name}
				placeholder=${this.placeholder}
				aria-placeholder=${this.placeholder}
				@input="${this.onInput}"
				@blur="${this.onBlur}"
				.value="${this.value}"
				?disabled=${this.disabled}
				aria-invalid=${this.isError}
				maxlength="${ifDefined(this.maxLength)}"
			></textarea>
			${this.maxLength
				? html`<p class="character-limit">${this.value.length}/${this.maxLength}</p>`
				: undefined}
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
				? html`<div id="#spinner-container" class="input-spinner-container">
						<div class="spinner" aria-label="Loading..."></div>
				  </div>`
				: undefined}
		`;
	}

	protected onInput(e: Event): void {
		const { name, value } = e.currentTarget as HTMLInputElement;
		this.dispatchEvent(
			customEventFactory(TEXT_AREA_INPUT, {
				detail: { name, value },
			}),
		);
	}

	protected onBlur(e: Event): void {
		const { name, value } = e.currentTarget as HTMLInputElement;
		this.dispatchEvent(
			customEventFactory(TEXT_AREA_BLUR, {
				detail: { name, value },
			}),
		);
	}
}

if (!window.customElements.get('cra-text-area')) {
	window.customElements.define('cra-text-area', CRATextArea);
}
