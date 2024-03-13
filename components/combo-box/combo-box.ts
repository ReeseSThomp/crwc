/* 
MIT License

Copyright (c) 2019 Félix Zapata

Modified by Castle Rock Associates 2020

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

import { CSSResultArray, LitElement, PropertyValues, TemplateResult, css, html } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { Key } from 'ts-key-enum';
//	the .js is part of the path name, eslint, geez.
// eslint-disable-next-line import/no-unresolved
import Fuse from 'fuse.js';
import containsTargetPenetrate from '../utils/contains-penetrate';
import StylesForm from '../../styles/form-styles';
import StylesBase from '../../styles/base-styles';

export const isNonEmptyString = (value: unknown): value is string =>
	typeof value === 'string' && value !== undefined && value !== null && value !== '';

export type ComboBoxOption = {
	value: string;
	label?: string;
	recommended?: boolean;
};

export type CombBoxSelected = {
	value?: string;
	label?: string;
};

/**
 * @fires ComboBox#change
 * @fires ComboBox#selected
 */
@customElement('combo-box')
export class ComboBox extends LitElement {
	@property({ type: Array }) public options: ComboBoxOption[] = [];

	@property({ type: String, reflect: true }) public value?: string;

	protected oldValue?: string; //	value stored here temporarily while user is searching open list

	@state() protected onUpperScreen = true;

	@state() protected resultsCount = 0;

	@state() protected activeIndex = -1;

	@property({ type: String, reflect: true }) public label?: string;

	@property({ type: String, reflect: true }) public placeholder?: string;

	@property({ attribute: 'should-auto-select', type: Boolean, reflect: true })
	public shouldAutoSelect = false;

	@query('#combox-input-wrapper') protected combobox?: HTMLDivElement;

	@query('#combobox-input') protected input?: HTMLInputElement;

	@query('#combobox-dropdown') protected listbox?: HTMLUListElement;

	@property({ reflect: true, type: Boolean }) public disabled?: boolean = false;

	//	public so parent elements can set additional click exceptions, add extra button functionality, etc
	public globalClickExceptions: Element[] = [];

	public static override get styles(): CSSResultArray {
		return [
			StylesBase,
			StylesForm,
			css`
				:host {
					padding: var(--xxs);
				}

				:host(:focus-within),
				:host(:hover) {
					box-shadow: 0 0 3px 1px rgb(var(--purple));
				}

				.hidden {
					display: none;
				}

				.combobox-wrapper {
					position: relative;
					width: 100%;
				}

				#combobox-dropdown {
					position: absolute;
					z-index: 2;
					width: 100%;
					max-height: 25vh;
					overflow-y: auto;
					margin: 0;
					padding: 0;
					top: 100%;
					border: 1px solid black;
					list-style: none;
					background: white;
				}

				#combobox-dropdown > .result {
					margin: 0;
					padding: 0.5em 1em;
					cursor: pointer;
				}

				#combobox-dropdown > .focused,
				.result:hover {
					background: rgb(139, 189, 225);
					color: white;
				}

				#combobox-input {
					box-sizing: border-box;
					width: 100%;
				}
				#combobox-input:hover,
				#combobox-input:focus {
					border-color: rgb(var(--input-gray));
				}
			`,
		];
	}

	public override render(): TemplateResult {
		return html`
			${this.label
				? html`<label part="label" for="combobox-input" id="combobox-label" class="combobox-label">
						<span>${this.label}</span>
				  </label>`
				: ``}
			<div class="combobox-wrapper" part="wrapper">
				<div
					role="combobox"
					aria-expanded="false"
					aria-owns="combobox-dropdown"
					aria-haspopup="listbox"
					id="combox-input-wrapper"
				>
					<input
						part="input"
						type="text"
						class="base-input"
						.value=${this.value ?? ''}
						@keyup=${this.checkKeyHandler}
						@keydown=${this.setActiveItemHandler}
						@blur=${this.checkSelectionHandler}
						@input=${this.inputHandler}
						@mousedown=${this.clickHandler}
						autocomplete="off"
						@focus=${this.focusHandler}
						aria-autocomplete="list"
						aria-controls="combobox-dropdown"
						id="combobox-input"
						placeholder=${ifDefined(this.placeholder)}
						?disabled=${this.disabled}
					/>
				</div>
				<ul
					part="dropdown"
					aria-labelledby="combobox-label"
					role="listbox"
					id="combobox-dropdown"
					class="hidden"
					?openup=${!this.onUpperScreen}
					@click=${this.clickItemHandler}
				></ul>
			</div>
		`;
	}

	public override firstUpdated(): void {
		if (this.input !== undefined) {
			this.globalClickExceptions.push(this.input);
		}
	}

	public override updated(changedProps: PropertyValues): void {
		if (changedProps.has('value')) {
			/**
			 * @event ComboBox#change the combobox value has changed (reflected in the selected property)
			 * @type {object}
			 * @property {string} detail the newly-selected combobox value
			 */
			this.dispatchEvent(
				new CustomEvent('change', {
					composed: true,
					bubbles: true,
					detail: this.value,
				}),
			);
		}
	}

	protected checkKeyHandler(evt: KeyboardEvent): void {
		switch (evt.key) {
			case Key.ArrowUp:
			case Key.ArrowDown:
			case Key.Escape:
			case Key.Enter:
				evt.preventDefault();
				return;
			default:
				this.updateResults(false);
		}
	}

	protected search(searchString: string): ComboBoxOption[] {
		return new Fuse(this.options, {
			keys: ['label', 'value'],
			threshold: 0.3,
		})
			.search(searchString)
			.map((result) => result.item);
	}

	protected sort?(a: ComboBoxOption, b: ComboBoxOption): number {
		const sortableA = a.label ?? a.value;
		const sortableB = b.label ?? b.value;

		if (sortableA < sortableB) {
			return -1;
		}
		if (sortableB < sortableA) {
			return 1;
		}
		return 0;
	}

	protected updateResults(shouldShowAll: boolean, shouldFocus = true): void {
		const searchString = this.input?.value;
		const results =
			searchString !== undefined && isNonEmptyString(searchString) && shouldShowAll === false
				? this.search(searchString)
				: this.options;

		results.sort(this.sort ?? undefined);

		if (results !== undefined && results.length > 0) {
			if (this.listbox) {
				this.listbox.innerHTML = '';
				for (let i = 0; i < results.length; i += 1) {
					//	TODO: handle this via proper lithtml templating
					const resultItem = document.createElement('li');
					const { label } = results[i];

					resultItem.className = 'result';
					resultItem.setAttribute('role', 'option');
					resultItem.setAttribute('id', `result-item-${i}`);
					resultItem.setAttribute('data-value', results[i].value);
					if (label) {
						resultItem.setAttribute('data-label', label);
					}
					resultItem.innerText = label || results[i].value;
					if (this.shouldAutoSelect && i === 0) {
						resultItem.setAttribute('aria-selected', 'true');
						resultItem.classList.add('focused');
						this.activeIndex = 0;
					}
					this.listbox.appendChild(resultItem);
				}

				this.listbox.classList.remove('hidden');
				this.combobox?.setAttribute('aria-expanded', 'true');
				this.resultsCount = results.length;
				if (shouldFocus) {
					this.input?.focus();
				}
			}
		} else {
			this.hideListbox();
		}
	}

	protected setActiveItemHandler(evt: KeyboardEvent): void {
		let { activeIndex } = this;

		if (evt.key === Key.Escape) {
			this.hideListbox();
			return;
		}

		const prevActive = this.getItemAt(activeIndex);
		let activeItem: HTMLLIElement | null;

		switch (evt.key) {
			case Key.ArrowUp:
				if (activeIndex <= 0) {
					activeIndex = this.resultsCount - 1;
				} else {
					activeIndex -= 1;
				}
				break;
			case Key.ArrowDown:
				if (activeIndex === -1 || activeIndex >= this.resultsCount - 1) {
					activeIndex = 0;
				} else {
					activeIndex += 1;
				}
				break;
			case Key.Enter:
				activeItem = this.getItemAt(activeIndex);
				if (activeItem !== null) {
					this.selectItem(activeItem);
				}
				return;
			case Key.Tab:
				this.checkSelectionHandler();
				this.hideListbox();
				return;
			default:
				return;
		}

		evt.preventDefault();

		activeItem = this.getItemAt(activeIndex);
		this.activeIndex = activeIndex;
		if (prevActive) {
			prevActive.classList.remove('focused');
			prevActive.setAttribute('aria-selected', 'false');
		}

		if (activeItem) {
			const PIXELS_FROM_CENTER = this.listbox?.clientHeight ?? 160 / 2;

			this.input?.setAttribute('aria-activedescendant', `result-item-${activeIndex}`);
			activeItem.classList.add('focused');
			activeItem.setAttribute('aria-selected', 'true');
			// scroll the <ul> so activeItem is always in view
			if (this.listbox) {
				this.listbox.scrollTop = activeItem.offsetTop - PIXELS_FROM_CENTER;
			}
		} else {
			this.input?.setAttribute('aria-activedescendant', '');
		}
	}

	protected getItemAt(index: number): HTMLLIElement | null {
		return this.shadowRoot?.querySelector(`#result-item-${index}`) ?? null;
	}

	protected clickItemHandler(evt: MouseEvent): void {
		const target = evt.target as HTMLLIElement;
		if (target) {
			this.selectItem(evt.target as HTMLLIElement);
		}
	}

	public selectItem(item: HTMLLIElement): void {
		if (item) {
			this.value = item.dataset.label ?? item.dataset.value;
			this.hideListbox();

			// include both label and value in event detail
			// in practice, will probably send the value to the server and update the UI with the label
			this.dispatchEvent(
				new CustomEvent('selected', {
					composed: true,
					bubbles: true,
					detail: {
						value: item.dataset.value,
						label: item.dataset.label,
					},
				}),
			);
		}
	}

	protected focusHandler(_: FocusEvent): void {
		void this.showOptions(true);
	}

	public async showOptions(shouldShowAll = false, shouldFocus = true): Promise<void> {
		await this.updateComplete;
		this.updateResults(shouldShowAll, shouldFocus);
	}

	protected clickHandler(e: MouseEvent): void {
		e.preventDefault();
		void this.showOptions(true);
	}

	protected hideListbox(): void {
		this.activeIndex = -1;
		this.listbox?.classList.add('hidden');
		this.combobox?.setAttribute('aria-expanded', 'false');
		this.resultsCount = 0;
		this.input?.setAttribute('aria-activedescendant', '');

		if (isNonEmptyString(this.value) === false && isNonEmptyString(this.oldValue) === true) {
			this.value = `${this.oldValue ?? ''}`;
			this.oldValue = undefined;
		}
	}

	hasOptionValue(value: string): boolean {
		return (
			this.options?.some((option) =>
				option.label ? option.label === value : option.value === value,
			) ?? false
		);
	}

	protected checkSelectionHandler(): void {
		if (this.activeIndex >= 0) {
			const activeItem = this.getItemAt(this.activeIndex);
			if (activeItem !== null) {
				this.selectItem(activeItem);
			}
		}
		if (!this.hasOptionValue(this.value ?? '')) {
			this.value = this.oldValue;
		}
		// this.hideListbox();
	}

	protected inputHandler(e: InputEvent): void {
		this.value = (e.target as HTMLInputElement).value;
	}

	protected onGlobalClick = (e: MouseEvent) => {
		for (let i = 0; i < this.globalClickExceptions.length; i += 1) {
			if (containsTargetPenetrate(this.globalClickExceptions[i], e)) {
				//	if the click penetrates an element marked as an exception,
				//	don't hide the listbox.
				return;
			}
		}
		this.hideListbox();
	};

	public override connectedCallback(): void {
		this.onUpperScreen = true;
		document.body.addEventListener('click', this.onGlobalClick);
		super.connectedCallback();
	}

	public override disconnectedCallback(): void {
		document.body.removeEventListener('click', this.onGlobalClick);
		super.disconnectedCallback();
	}
}

export default ComboBox;
