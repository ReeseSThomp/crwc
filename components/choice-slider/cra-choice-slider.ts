import { CSSResultArray, LitElement, PropertyValues, TemplateResult, css, html } from 'lit';
import { property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { styleMap } from 'lit/directives/style-map.js';

import StylesBase from '../../styles/base-styles';
import StylesButton from '../../styles/button-styles';
import customEventFactory from '../utils/custom-event-factory';
import { TextEvent } from '../form-base/cra-form-controller';

export const CHOICE_SLIDER_CHANGE = 'cra:choiceSlider:change';

declare global {
	interface DocumentEventMap {
		[CHOICE_SLIDER_CHANGE]: CustomEvent<TextEvent>;
	}
}

export interface SliderOption {
	sliderValue: string;
	hoverText: string;
}

export class CRAChoiceSlider extends LitElement {
	@property({ type: String }) public name = '';

	@property({ type: Array }) public options: SliderOption[] = [];

	@property({ type: String }) public value = '';

	@property({ type: String }) public errorText = '';

	@property({ type: Boolean }) public disabled = false;

	@property({ type: Boolean }) public isLoading = false;

	@property({ type: Boolean }) public isError = false;

	@property({ type: Number }) public rangeTrackPercentage = 0;

	public static override get styles(): CSSResultArray {
		return [
			StylesBase,
			StylesButton,
			// Styles511,
			// language=CSS
			css`
				.range-container {
					box-sizing: border-box;
					width: 100%;
					padding: 0 1rem 1rem 1rem;
				}

				.label-container {
					box-sizing: border-box;
					width: 100%;
					/* was this the fix pt2? */
					margin-top: 1rem;
					display: flex;
					padding-right: 0.25rem;
					padding-left: 0.687rem;
				}

				.label {
					position: relative;
					font-size: 0.8rem;
					color: rgb(var(--main-gray));
					flex: 1;
					cursor: pointer;
					text-transform: capitalize;
				}

				.label:last-child {
					flex: 0;
				}

				.label::before {
					content: '|';
					position: absolute;
					top: -1rem;
					left: -0.25rem;
					font-size: 0.8rem;
					color: rgb(var(--main-gray));
				}

				.label::after {
					content: '.';
					position: absolute;
					top: -2rem;
					left: -0.25rem;
					font-size: 0.5rem;
					opacity: 0;
				}

				.label > span {
					position: absolute;
					transform: translateX(-50%);
				}

				.highlighted,
				.highlighted::before,
				.highlighted::after {
					color: rgb(var(--darkest));
				}

				.is-error {
					border-color: rgb(var(--danger));
				}

				.error-label {
					color: rgb(var(--danger));
					font-size: 0.8rem;
					margin: 0;
					height: 0;
					transition: all 0.15s ease-in-out;
				}

				.error-label-show {
					height: 1rem;
				}

				/* fake track slider */

				.track-container {
					box-sizing: border-box;
					width: 100%;
					margin-top: 0.5rem;
					display: flex;
					padding-right: 0.25rem;
					padding-left: 0.687rem;
				}

				.track {
					height: 0.25rem;
					border-radius: 0.125rem 0 0 0.125rem;
					box-sizing: border-box;
					padding-right: 0.25rem;
					background-color: rgb(var(--darkest));
					position: relative;
					/* was this the fix? */
					top: 0.55rem;
					transition: width 1s;
				}

				.track-background {
					height: 0 0.25rem 0.125rem 0;
					border-radius: 0.125rem;
					box-sizing: border-box;
					padding-right: 0.25rem;
					background-color: rgb(var(--light-gray));
					position: relative;
					top: 0.55rem;
					transition: width 1s;
				}

				/* range slider track and thumb overrides */

				input {
					position: relative;
				}

				input[type='range'] {
					-webkit-appearance: none; /* Hides the slider so that custom slider can be made */
					width: 100%; /* Specific width is required for Firefox. */
					background: transparent; /* Otherwise white in Chrome */
				}

				input[type='range']:focus {
					outline: none; /* Removes the blue border. You should probably do some kind of focus styling for accessibility reasons though. */
				}

				input[type='range']::-ms-track {
					width: 100%;
					cursor: pointer;

					/* Hides the slider so custom styles can be added */
					background: transparent;
					border-color: transparent;
					color: transparent;
				}

				input[type='range']::-webkit-slider-thumb {
					-webkit-appearance: none;
					height: 1rem;
					width: 1rem;
					border-radius: 1rem;
					background-color: rgb(var(--darkest));
					cursor: pointer;
					position: relative;
					z-index: 10;
					margin-top: -0.875rem; /* You need to specify a margin in Chrome, but in Firefox and IE it is automatic */
				}

				input[type='range']::-moz-range-thumb {
					-webkit-appearance: none;
					height: 1rem;
					width: 1rem;
					border-radius: 1rem;
					border: none;
					background-color: rgb(var(--darkest));
					cursor: pointer;
					position: relative;
					z-index: 100;
				}

				input[type='range']::-ms-thumb {
					-webkit-appearance: none;
					height: 1rem;
					width: 1rem;
					border-radius: 1rem;
					border: none;
					background-color: rgb(var(--darkest));
					cursor: pointer;
					position: relative;
					z-index: 100;
				}
			`,
		];
	}

	// Styling and range bar appearence methods //

	private getStepSize(): number {
		return Math.round(1000 / (this.options.length - 1));
	}

	private convertSliderValueToSelection(value: string): string {
		const numberVal = parseInt(value, 10);
		const index = Math.round(numberVal / this.getStepSize());
		return this.options[index].sliderValue;
	}

	private convertValueSelectionToSliderValue(): string {
		const index = this.options.findIndex((opt) => opt.sliderValue === this.value);
		const stepSize = this.getStepSize();
		if (index !== -1) {
			return String(index * stepSize);
		}
		return '0';
	}

	private calculateRangeTrackPercentage(): number {
		const index = this.options.findIndex((opt) => opt.sliderValue === this.value);
		const stepSize = this.getStepSize();
		if (index !== -1) {
			return (index * stepSize) / 10;
		}
		return 0;
	}

	private shouldHighlight(option: string): boolean {
		const optionIndex = this.options.findIndex((opt) => opt.sliderValue === option);
		const selectedIndex = this.options.findIndex((opt) => opt.sliderValue === this.value);
		if (optionIndex > selectedIndex) {
			return false;
		}
		return true;
	}

	protected override updated(changed: PropertyValues): void {
		if (changed.has('value')) {
			this.rangeTrackPercentage = this.calculateRangeTrackPercentage();
		}
	}

	protected override render(): TemplateResult {
		return html`
			<div class="range-container">
				<div class="track-container">
					<div
						class="track"
						style=${styleMap({
							width: `${this.rangeTrackPercentage}%`,
						})}
					></div>
					<div
						class="track-background"
						style=${styleMap({
							width: `${100 - this.rangeTrackPercentage}%`,
						})}
					></div>
				</div>
				<input
					type="range"
					name=${this.name}
					min="0"
					max="1000"
					.value=${this.convertValueSelectionToSliderValue()}
					step=${this.getStepSize()}
					?disabled=${this.disabled}
					@change=${this.handleChange}
					@input=${this.handleInput}
				/>
				<div class="label-container">
					${this.options.map(
						(option, i) => html` <div
							class=${classMap({
								label: true,
								highlighted: this.shouldHighlight(option.sliderValue),
							})}
							@click=${this.handleLabelClick(i)}
						>
							<span>${option.sliderValue}</span>
						</div>`,
					)}
				</div>
			</div>
			<p
				class=${classMap({
					'error-label': true,
					'error-label-show': this.isError,
				})}
			>
				${this.errorText}
			</p>
		`;
	}

	private handleInput(e: Event): void {
		const { value } = e.currentTarget as HTMLInputElement;
		this.rangeTrackPercentage = parseInt(value, 10) / 10;
	}

	private handleChange(e: Event): void {
		const { name, value } = e.currentTarget as HTMLInputElement;
		const selectedOption = this.convertSliderValueToSelection(value);
		this.value = selectedOption;
		this.rangeTrackPercentage = this.calculateRangeTrackPercentage();

		this.dispatchEvent(
			customEventFactory(CHOICE_SLIDER_CHANGE, {
				detail: { name, value: selectedOption },
			}),
		);
	}

	private handleLabelClick = (i: number) => (): void => {
		const selectedOption = this.options[i];
		this.value = selectedOption.sliderValue;
		this.rangeTrackPercentage = this.calculateRangeTrackPercentage();

		this.dispatchEvent(
			customEventFactory(CHOICE_SLIDER_CHANGE, {
				detail: { name: this.name, value: selectedOption.sliderValue },
			}),
		);
	};
}

if (!window.customElements.get('cra-choice-slider')) {
	window.customElements.define('cra-choice-slider', CRAChoiceSlider);
}
