import { CSSResult, CSSResultArray, LitElement, TemplateResult, css, html } from 'lit';
import { property } from 'lit/decorators.js';

import StylesBase from '../../styles/base-styles';

export class CRAToggleSwitch extends LitElement {
	public static override get styles(): CSSResult | CSSResultArray {
		return [
			StylesBase,
			// language=CSS
			css`
				@media screen and (prefers-reduced-motion: reduce) {
					:host {
						transition: none;
					}
				}
				:host {
					--toggle-switch-disabled-opacity: 0.5;
					--toggle-switch-toggle-duration: 0.1s;

					--toggle-switch-color: rgb(var(--concrete));
					--toggle-switch-color-active: rgb(var(--peter-river));
					--toggle-switch-color-focus: rgba(var(--peter-river), 0.5);

					--toggle-switch-track-height: 0.75rem;

					--toggle-switch-knob-color: rgb(var(--concrete));
					--toggle-switch-knob-color-active: rgb(var(--peter-river));

					display: block;
					outline: 0.25rem solid transparent;
					cursor: pointer;
					transition: fill 0.1s linear, color 0.1s linear, outline 0.15s ease-in-out;
					fill: var(--toggle-switch-color);
				}

				:host([hidden]) {
					display: none;
				}

				:host([disabled]) {
					opacity: var(--toggle-switch-disabled-opacity);
				}

				:host([checked]) {
					/*color: var(--toggle-switch-color-active);*/
					fill: var(--toggle-switch-color-active);
				}

				label {
					flex-grow: 1;
				}

				#track,
				#knob {
					position: absolute;
					top: 0;
					bottom: 0;
					left: 0;
					margin: auto;
				}

				#wrapper {
					display: flex;
					padding: 0.5rem var(--gap);
					/*border-top: 1px solid black;*/
					/*justify-content: space-between;*/
					align-items: center;
				}

				label {
					/*margin-right: var(--gap);*/
					display: flex;
					align-items: stretch;
				}

				#inner-wrap {
					position: relative;
					height: 1.25rem;
					width: 2em;
					margin-right: 0.5rem;
				}

				@media screen and (prefers-reduced-motion: reduce) {
					#track {
						transition: none;
					}
				}
				#track {
					height: var(--toggle-switch-track-height);
					width: 100%;
					border-radius: 1rem;
					background-color: var(--toggle-switch-knob-color);
					opacity: 0.25;
					transition: background-color var(--toggle-switch-toggle-duration);
				}

				:host([checked]) #track {
					background-color: var(--toggle-switch-knob-color-active);
				}

				@media screen and (prefers-reduced-motion: reduce) {
					#knob {
						transition: none;
					}
				}
				#knob {
					position: absolute;
					left: 0;
					top: 0;
					bottom: 0;
					margin: auto;
					height: 90%;
					width: 1.1rem;
					border-radius: 50%;
					background-color: var(--toggle-switch-knob-color);
					transition: transform var(--toggle-switch-toggle-duration),
						background-color var(--toggle-switch-toggle-duration);
				}

				@media screen and (prefers-reduced-motion: reduce) {
					:host([checked]) #knob {
						transition: none;
					}
				}
				:host([checked]) #knob {
					transform: translateX(70%);
					background-color: var(--toggle-switch-knob-color-active);
				}
			`,
		];
	}

	protected override render(): TemplateResult | void {
		return html`
			<span id="wrapper" @click="${this.clickHandler}">
				${this.hideSwitch
					? ''
					: html`
							<span id="inner-wrap">
								<span id="track"></span>
								<span id="knob"></span>
							</span>
					  `}
				<label>
					<slot></slot>
				</label>
			</span>
		`;
	}

	@property({ type: Boolean, reflect: true }) public checked = false;

	@property({ type: String }) public name = '';

	@property({ type: Boolean }) public disabled = false;

	@property({ type: Boolean, attribute: 'hide-switch' }) public hideSwitch = false;

	protected override updated(): void {
		this.setAttribute('aria-checked', Boolean(this.checked).toString());
	}

	public override connectedCallback(): void {
		super.connectedCallback();
		this.addEventListener('keyup', this.keyUpHandler);
		this.setAttribute('role', 'checkbox');
		if (!this.hasAttribute('checked')) {
			this.checked = false;
		}
		this.setAttribute('aria-checked', Boolean(this.checked).toString());
		this.setAttribute('tabindex', '0');
	}

	public override disconnectedCallback(): void {
		this.removeEventListener('keyup', this.keyUpHandler);
	}

	private clickHandler(event: MouseEvent): void {
		if (!this.disabled) {
			event.preventDefault();
			this.toggleChecked();
		}
	}

	private keyUpHandler(event: KeyboardEvent): void {
		if (event.keyCode === 32 && !this.disabled) {
			event.preventDefault();
			this.toggleChecked();
		}
	}

	private toggleChecked(): void {
		this.checked = !this.checked;
		this.setAttribute('aria-checked', Boolean(this.checked).toString());
		this.dispatchEvent(
			new Event('change', {
				bubbles: true,
				composed: true,
			}),
		);
	}
}

export default CRAToggleSwitch;

if (!window.customElements.get('cra-toggle-switch')) {
	window.customElements.define('cra-toggle-switch', CRAToggleSwitch);
}
