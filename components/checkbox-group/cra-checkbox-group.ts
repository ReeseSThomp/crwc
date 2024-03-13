import { CSSResultArray, LitElement, TemplateResult, css, html } from 'lit';
import { property } from 'lit/decorators.js';

import StylesContent from '../../styles/base-styles';
import StylesButton from '../../styles/button-styles';

import customEventFactory from '../utils/custom-event-factory';
import { ArrayChangeEvent } from '../form-base/cra-form-controller';

import { CRACheckbox } from '../checkbox/cra-checkbox';
import '../checkbox/cra-checkbox';

export const ARRAY_CHANGE = 'cra:array:change';

declare global {
	interface DocumentEventMap {
		[ARRAY_CHANGE]: CustomEvent<ArrayChangeEvent>;
	}
}

/**
 * @fires cra:array:change
 */
export class CRACheckboxGroup extends LitElement {
	@property({ type: Object }) public valueToLabel: Record<string, string> = {};

	@property({ type: Array }) public selectedValues: string[] = [];

	@property({ type: String }) public name = '';

	public static override get styles(): CSSResultArray {
		return [
			StylesContent,
			StylesButton,
			// language=CSS
			css`
				.checkbox-group {
					display: flex;
				}

				cra-checkbox {
					padding: calc(var(--gap) / 2);
					border: 1px solid rgb(var(--input-gray));
					border-right: none;
					margin-bottom: 0;
				}

				cra-checkbox:last-child {
					border-right: 1px solid rgb(var(--input-gray));
				}
			`,
		];
	}

	protected override render(): TemplateResult {
		return html`
			<div class="checkbox-group">
				${Object.keys(this.valueToLabel).map(
					(labeledValue) => html`
					<cra-checkbox
						?checked=${this.selectedValues.includes(labeledValue)}
						value=${labeledValue}
						@cra:checkbox:change=${this.handleCheckboxChange}
					>
						<div class="checkbox-text">${this.valueToLabel[labeledValue]}</div>
					</cra-checkbox>
				</div>
				`,
				)}
			</div>
		`;
	}

	private handleCheckboxChange(e: CustomEvent): void {
		const { value, checked } = e.currentTarget as CRACheckbox;
		let newSelectedOptions = [...this.selectedValues];
		if (checked) {
			newSelectedOptions.push(value);
		} else {
			newSelectedOptions = newSelectedOptions.filter((api) => api !== value);
		}
		this.selectedValues = newSelectedOptions;
		this.dispatchEvent(
			customEventFactory(ARRAY_CHANGE, {
				detail: { name: this.name, value: newSelectedOptions },
			}),
		);
	}
}

if (!window.customElements.get('cra-checkbox-group')) {
	window.customElements.define('cra-checkbox-group', CRACheckboxGroup);
}
