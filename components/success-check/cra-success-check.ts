import { CSSResultArray, LitElement, TemplateResult, css, html } from 'lit';

import StylesBase from '../../styles/base-styles';

export class CRASuccessCheck extends LitElement {
	public static override get styles(): CSSResultArray {
		const styles = [
			StylesBase,
			// language=CSS
			css`
				.checkmark {
					width: 100%;
					height: 100%;
					border-radius: 50%;
					display: block;
					stroke-width: 2;
					stroke: rgb(var(--success));
					stroke-miterlimit: 10;
					box-shadow: inset 0px 0px 0px rgb(var(--success));
					animation: fill 0.4s ease-in-out 0.4s forwards, scale 0.3s ease-in-out 0.9s both;
					position: relative;
					margin: 0 auto;
				}

				.checkmark__circle {
					stroke-dasharray: 166;
					stroke-dashoffset: 166;
					stroke-width: 2;
					stroke-miterlimit: 10;
					stroke: rgb(var(--success));
					fill: #fff;
					animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
				}

				.checkmark__check {
					transform-origin: 50% 50%;
					stroke-dasharray: 48;
					stroke-dashoffset: 48;
					animation: stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards;
				}

				@keyframes stroke {
					100% {
						stroke-dashoffset: 0;
					}
				}

				@keyframes scale {
					0%,
					100% {
						transform: none;
					}

					50% {
						transform: scale3d(1.1, 1.1, 1);
					}
				}
			`,
		];
		return styles;
	}

	protected override render(): TemplateResult {
		return html`
			<svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
				<circle class="checkmark__circle" cx="26" cy="26" r="25" fill="none" />
				<path class="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
			</svg>
		`;
	}
}

export default CRASuccessCheck;

if (!window.customElements.get('cra-success-check')) {
	window.customElements.define('cra-success-check', CRASuccessCheck);
}
