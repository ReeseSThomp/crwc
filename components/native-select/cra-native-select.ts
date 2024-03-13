import { CSSResultArray, LitElement, TemplateResult, css, html } from 'lit';
import { property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

import StylesBase from '../../styles/base-styles';
import StylesButton from '../../styles/button-styles';
import StylesForm from '../../styles/form-styles';
// import Styles511 from "../../styles/styles-511";

import customEventFactory from '../utils/custom-event-factory';
import { TextEvent } from '../form-base/cra-form-controller';

export const NATIVE_SELECT_CHANGE = 'cra:nativeSelect:change';

export type SelectOption = {
	value: string;
	label: string;
	selected?: boolean;
	disabled?: boolean;
};

declare global {
	interface DocumentEventMap {
		[NATIVE_SELECT_CHANGE]: CustomEvent<TextEvent>;
	}
}

export class CRANativeSelect extends LitElement {
	@property({ type: String }) public label = '';

	@property({ type: String }) public name = '';

	@property({ type: String }) public value = '';

	@property({ type: String }) public errorText = '';

	@property({ type: Boolean }) public floatLabel = false;

	@property({ type: Boolean }) public disabled = false;

	@property({ type: Boolean }) public isLoading = false;

	@property({ type: Boolean }) public isError = false;

	@property({ type: Array }) public options: SelectOption[] = [];

	public static override get styles(): CSSResultArray {
		return [
			StylesBase,
			StylesButton,
			StylesForm,
			//   Styles511,
			// language=CSS
			css`
				:host {
					display: block;
					margin-bottom: 0.75rem;
					position: relative;
				}

				select {
					display: block;
					position: relative;
					width: 100%;
					box-sizing: border-box;
					border-radius: var(--border-radius);
					border: 1px solid rgb(var(--dell-gray));
					background-color: rgb(var(--clouds));
					color: rgb(var(--dell-gray));
					margin: 0px auto;
					padding: 0.5rem;
					height: 2.5rem;
					font-size: 1rem;
					outline: none;
					transition: all 0.2s ease-in-out;

					appearance: none;
					background-image: url('/images/down_triangle.svg');
					background-position: right 0.7em top 50%, 0 0;
					background-repeat: no-repeat, repeat;
					background-size: 1rem;
				}

				select[disabled] {
					color: rgb(var(--silver));
					border-color: rgb(var(--silver)) !important;
				}

				select[disabled] + label {
					color: rgb(var(--silver));
				}

				select[disabled]:hover {
					border-color: rgb(var(--silver)) !important;
				}

				select:hover,
				select:focus {
					border-color: rgb(var(--peter-river));
				}

				#spinner-container {
					right: 1.5rem;
				}
			`,
		];
	}

	protected override render(): TemplateResult {
		return html`
			<select
				name=${this.name}
				class=${classMap({
					'input-is-error': this.isError,
				})}
				@change=${this.onChange}
				.value="${this.value}"
				?disabled=${this.disabled}
				part="select"
				title=${this.label}
				aria-label=${this.label}
			>
				${this.options.map(
					(option) =>
						html`
							<option
								?disabled="${option.disabled}"
								?selected="${option.selected}"
								value="${option.value}"
							>
								${option.label}
							</option>
						`,
				)}
			</select>
			<p
				class=${classMap({
					'input-error-label': true,
					'input-error-label-show': this.isError,
				})}
			>
				${this.errorText}
			</p>
			${this.isLoading
				? html`<div id="#spinner-container" class="input-spinner-container">
						<div class="spinner" aria-label="Loading..."></div>
				  </div>`
				: undefined}
		`;
	}

	protected override firstUpdated(): void {
		if (this.value) {
			this.floatLabel = true;
		}
	}

	protected onChange(e: Event): void {
		this.floatLabel = true;
		const { name, value } = e.target as HTMLSelectElement;
		this.dispatchEvent(
			customEventFactory(NATIVE_SELECT_CHANGE, {
				detail: { name, value },
			}),
		);
	}
}

if (!window.customElements.get('cra-native-select')) {
	window.customElements.define('cra-native-select', CRANativeSelect);
}
