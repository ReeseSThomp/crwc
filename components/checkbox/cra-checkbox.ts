import { CSSResultArray, LitElement, TemplateResult, css, html } from 'lit';
import { property } from 'lit/decorators.js';

import customEventFactory from '../utils/custom-event-factory';

import StylesBase from '../../styles/base-styles';

export const CHECKBOX_CHANGE = 'cra:checkbox:change';

export interface CheckboxChangeEvent {
	checked: boolean;
	value: string;
}

declare global {
	interface DocumentEventMap {
		[CHECKBOX_CHANGE]: CustomEvent<CheckboxChangeEvent>;
	}
}

export class CRACheckbox extends LitElement {
	@property({ type: Boolean, reflect: true }) public checked = false;

	@property({ type: String, reflect: true }) public value = '';

	@property({ type: Boolean, reflect: true }) public disabled = false;

	public static override get styles(): CSSResultArray {
		const styles = [
			StylesBase,
			// language=CSS
			css`
				:host {
					display: flex;
					align-items: center;
					position: relative;
					cursor: pointer;
					margin-bottom: 0.75rem;

					--checkbox-color-active: rgb(var(--purple));
				}

				:host(:focus) {
					outline: 0;
					box-shadow: 0 0 0 0.15rem rgba(var(--purple), 0.3);
				}

				input[type='checkbox'] {
					visibility: hidden;
					width: 1px;
					margin: -1px;
					padding: 0;
					clip: rect(0, 0, 0, 0);
				}

				label {
					flex: 1;
					display: flex;
					align-items: center;
					padding: 0.25rem 0;
				}

				input[type='checkbox'] + label:before {
					border: 1px solid rgb(var(--dark-gray));
					border-radius: 0.25rem;
					content: '\\00a0';
					display: block;
					font-weight: bold;
					height: var(--smaller);
					width: var(--smaller);
					margin: 0 0.5rem 0 0;
					padding: 0;
					line-height: 1rem;
				}

				input[type='checkbox']:disabled + label:before {
					background: rgb(var(--main-gray)) !important;
				}

				input[type='checkbox']:checked + label:before {
					background: var(--checkbox-color-active);
					color: white;
					content: '\\2713';
					text-align: center;
				}
			`,
		];
		return styles;
	}

	public override render(): TemplateResult {
		this.setAttribute('aria-checked', String(this.checked));
		return html`
			<input type="checkbox" .checked=${this.checked} ?disabled=${this.disabled} />
			<label id="${this.value}">
				<slot></slot>
			</label>
		`;
	}

	public override connectedCallback(): void {
		this.addEventListener('click', this.handleClick);
		this.setAttribute('tabindex', '0');
		this.setAttribute('role', 'checkbox');
		this.setAttribute('aria-labelledby', this.value);
		this.setAttribute('aria-disabled', String(this.disabled));
		super.connectedCallback();
	}

	public override disconnectedCallback(): void {
		super.disconnectedCallback();
		this.removeEventListener('click', this.handleClick);
	}

	private handleClick(): void {
		if (this.disabled) {
			return;
		}
		this.checked = !this.checked;
		this.dispatchEvent(
			customEventFactory(CHECKBOX_CHANGE, {
				detail: { checked: this.checked, value: this.value },
			}),
		);
	}
}

if (!window.customElements.get('cra-checkbox')) {
	window.customElements.define('cra-checkbox', CRACheckbox);
}
