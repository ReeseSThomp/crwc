/* eslint-disable max-lines */
import 'element-internals-polyfill';
// eslint-disable-next-line import/no-unresolved
import { ElementInternals } from 'element-internals-polyfill/dist/element-internals';
import { CSSResultArray, LitElement, PropertyValues, TemplateResult, css, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { live } from 'lit/directives/live.js';
import { Ref, createRef, ref } from 'lit/directives/ref.js';
import { styleMap } from 'lit/directives/style-map.js';
import StylesBase from '../../styles/base-styles';

enum Keys {
	Backspace = 'Backspace',
	Clear = 'Clear',
	Down = 'ArrowDown',
	End = 'End',
	Enter = 'Enter',
	Escape = 'Escape',
	Home = 'Home',
	Left = 'ArrowLeft',
	PageDown = 'PageDown',
	PageUp = 'PageUp',
	Right = 'ArrowRight',
	Space = ' ',
	Tab = 'Tab',
	Up = 'ArrowUp',
}

enum MenuActions {
	Close,
	CloseSelect,
	First,
	Last,
	Next,
	Open,
	Previous,
	Select,
	Space,
	Type,
}

/**
 * @param element
 */
function isScrollable(element: HTMLElement): boolean {
	return element && element.clientHeight < element.scrollHeight;
}

/**
 * @param as
 * @param bs
 */
function eqSet<T>(as: Set<T>, bs: Set<T>) {
	if (as.size !== bs.size) {
		return false;
	}
	for (const a of as) {
		if (!bs.has(a)) {
			return false;
		}
	}
	return true;
}

@customElement('multi-select')
export class MultiSelect<T extends string> extends LitElement {
	#categorizedChoices: Array<{
		categoryLabel?: string;
		choices: Array<{ id: T; label?: string }>;
	}> = [];

	@property({ type: Array })
	get categorizedChoices(): Array<{
		categoryLabel?: string;
		choices: Array<{ id: T; label?: string }>;
	}> {
		return this.#categorizedChoices;
	}

	public set categorizedChoices(
		newCategorizedChoices: Array<{
			categoryLabel?: string;
			choices: Array<{ id: T; label?: string }>;
		}>,
	) {
		this.#categorizedChoices = newCategorizedChoices;
		const categories: Record<number, string> = {};
		let options: Array<{ id: T; label?: string }> = [];
		let lastLength = 0;
		newCategorizedChoices.forEach((choiceSet) => {
			if (choiceSet.categoryLabel) {
				categories[lastLength] = choiceSet.categoryLabel;
			}
			options = options.concat(choiceSet.choices);
			lastLength += choiceSet.choices.length;
		});
		this.options = options;
		this.categories = categories;
	}

	@property({ type: String })
	noChoicesFallback = '--';

	@state()
	private categories?: Record<number, string>;

	#options: Array<{ id: T; label?: string }> = [];

	@property({ type: Array })
	get options(): Array<{ id: T; label?: string }> {
		return this.#options;
	}

	private set options(options: Array<{ id: T; label?: string }>) {
		const oldValue = this.#options;
		this.#options = options;
		this.filtered = MultiSelect.filterOptions(options, this.inputValue);
		void this.requestUpdate('options', oldValue);
	}

	public get value(): Array<T> {
		const optionIds = this.options.reduce((acc, opt) => {
			acc.add(opt.id);
			return acc;
		}, new Set<T>());
		return Array.from(this.selected).filter((val) => optionIds.has(val));
	}

	public set value(value: Array<T>) {
		const setChanged =
			value.length !== this.selected.size || !value.every((val) => this.selected.has(val));
		if (setChanged) {
			this.selected = new Set(value);
		}
	}

	#inputValue = '';

	@state()
	public get inputValue(): string {
		return this.#inputValue;
	}

	public set inputValue(inputValue: string) {
		const oldValue = this.#inputValue;
		this.#inputValue = inputValue;
		this.filtered = MultiSelect.filterOptions(this.#options, inputValue);

		if (!this.active || !this.filtered.has(this.active)) {
			this.active = this.options.filter((opt) => this.filtered.has(opt.id))[0]?.id;
		}
		void this.requestUpdate('inputValue', oldValue);
	}

	// Identify the element as a form-associated custom element
	public static formAssociated = true;

	#internals!: ElementInternals;

	public constructor() {
		super();
		const internals = this.attachInternals && this.attachInternals();
		if (!internals) {
			throw new Error('Element internals error');
		}
		this.#internals = internals;
	}

	/**
	 * @see https://web.dev/more-capable-form-controls/
	 * The following properties and methods aren't strictly required,
	 * but browser-level form controls provide them. Providing them helps
	 * ensure consistency with browser-provided controls.
	 */
	public get form(): HTMLFormElement {
		return this.#internals.form;
	}

	public get type(): string {
		return this.localName;
	}

	public get validity(): ValidityState {
		return this.#internals.validity;
	}

	#selected: Set<T> = new Set();

	@state() protected get selected(): Set<T> {
		return this.#selected;
	}

	protected set selected(selected: Set<T>) {
		const oldValue = this.#selected;
		this.#selected = selected;

		if (!eqSet(selected, oldValue)) {
			const entries = new FormData();
			selected.forEach((sel) => {
				entries.append(`${this.name}[]`, String(sel));
			});
			this.#internals.setFormValue(entries);

			this.dispatchEvent(new Event('change'));
		}
		void this.requestUpdate('selected', oldValue);
	}

	@state() protected filtered: Set<T> = new Set();

	@state() protected active?: T;

	@property({ type: String }) label = '';

	@property({ type: String }) placeholder = '';

	@property({ type: String, reflect: true }) name = String(Math.random());

	@property({ type: String }) errorText = '';

	@state() protected listboxFlipped = false;

	@state() protected listboxStyles: Record<string, string> = {};

	#open = false;

	@property({ type: Boolean, reflect: true })
	get open(): boolean {
		return this.#open;
	}

	protected set open(open: boolean) {
		const oldVal = this.#open;
		this.#open = open;
		if (open && !oldVal) {
			this.listboxHeight = this.listboxEl.value!.offsetHeight;
		}
		this.recalculateListboxPosition();
		void this.requestUpdate('open', oldVal);
	}

	@property({ type: Boolean, reflect: true }) disabled = false;

	@property({ type: Boolean, reflect: true }) loading = false;

	@property({ type: Boolean, reflect: true }) error = false;

	@property({ type: Boolean, reflect: true, attribute: 'focus' }) isFocus = false;

	@property({ type: Boolean }) isFloatingLabel = false;

	protected inputEl: Ref<HTMLInputElement> = createRef();

	protected listboxEl: Ref<HTMLDivElement> = createRef();

	private listboxHeight = 0;

	static override get styles(): CSSResultArray {
		return [
			StylesBase,
			css`
				:host {
					display: flex;
					flex-direction: column;

					--checkbox-color-active: #000;
					--border-color: #555;
					--border-radius: 0.25rem;
					--gap: 1rem;
					--active-color: #aa0000;
					--active-color-light: #ccc;
					--disabled-color: #ccc;
					--font-size: 1rem;

					--listbox-bg: white;
					--listbox-background: #fff;
					--listbox-shadow: rgb(0 0 0 / 5%) 0px 3px 3px;
				}
				.option,
				.option-category {
					white-space: nowrap;
					display: flex;
					align-items: center;
					padding: calc(var(--gap) / 4) calc(var(--gap) / 2);
					cursor: pointer;
				}

				.option-category {
					cursor: default;
				}

				@media (pointer: coarse) {
					.option {
						padding: 0.375rem 0.25rem;
					}
				}
				.option:hover {
					color: var(--active-color);
				}
				.option--active {
					background-color: var(--active-color-light);
				}
				.option--disabled {
					color: var(--disabled-color);
					padding: calc(var(--gap) / 4) calc(var(--gap) / 2);
				}

				.option::before {
					border: 1px solid var(--color);
					border-radius: var(--border-radius);
					content: '\\00a0';
					display: inline-flex;
					font-weight: bold;
					height: var(--font-size);
					width: var(--font-size);
					margin: 0 calc(var(--gap) / 2) 0 0;
					line-height: var(--font-size);
				}
				.option--selected::before {
					display: flex;
					justify-content: center;
					align-content: center;
					background: var(--checkbox-color-active);
					color: white;
					content: '\\2713';
					text-align: center;
				}

				.listbox {
					position: absolute;
					z-index: 1;
					visibility: hidden;
					opacity: 0;
					width: 100%;
					box-sizing: border-box;
					max-height: calc((1.5 * var(--smaller) + calc(var(--gap) / 2)) * 10);
					padding: calc(var(--gap) / 4) 0;
					overflow-y: scroll;
					overflow-x: hidden;
					background-color: var(--listbox-background);
					box-shadow: var(--listbox-shadow);
					border: 1px solid var(--border-color);
					color: var(--color);
				}
				@media (pointer: coarse) {
					.listbox {
						max-height: calc((1.5 * var(--smaller) + calc(var(--gap) * 0.75)) * 10);
					}
				}
				.listbox--open {
					visibility: visible;
					opacity: 1;
					transition: all 100ms 50ms;
				}
				.listbox--bottom {
					border-top: none;
					border-bottom-left-radius: var(--border-radius);
					border-bottom-right-radius: var(--border-radius);
				}
				.listbox--top {
					border-bottom: none;
					border-top-left-radius: var(--border-radius);
					border-top-right-radius: var(--border-radius);
				}
				#selected {
					padding: calc(var(--gap) / 4);
					margin: 0;
					border-bottom-left-radius: var(--border-radius);
					border-bottom-right-radius: var(--border-radius);
					border: 1px solid var(--border-color);
					border-top: none;
					list-style: none;
					flex-wrap: wrap;
				}

				#selected:not([hidden]) {
					display: inline-flex;
				}

				.chip {
					padding: calc(var(--gap) / 4) calc(var(--gap) / 2);
					margin: calc(var(--gap) / 4);
					display: flex;
					align-items: center;
					gap: calc(var(--gap) / 4);
					border-radius: var(--border-radius);
					font-size: var(--smallest);
					cursor: pointer;
					color: var(--color);
					background-color: rgb(var(--light-purple));
				}
				.chip[disabled] {
					opacity: 0.7;
					cursor: not-allowed;
				}
				.input-group {
					position: relative;
				}
				.input {
					box-sizing: border-box;
					transition: none;
					width: 100%;
					border: 1px solid var(--border-color);
					border-radius: var(--border-radius);
				}

				.input:focus {
					outline: none;
				}
				.input--some-selected {
					border-bottom-left-radius: 0;
					border-bottom-right-radius: 0;
					border-bottom: 1px dotted var(--border-color);
				}

				.input-error-label {
					margin: 0;
				}

				.selected--is-error {
					border-color: var(--danger);
				}

				.input--open-top {
					z-index: 2;
					border-top: 1px dotted var(--border-color);
					border-top-left-radius: 0;
					border-top-right-radius: 0;
				}
				.input--open-bottom {
					z-index: 2;
					border-bottom: 1px dotted var(--border-color);
					border-bottom-left-radius: 0;
					border-bottom-right-radius: 0;
				}
				.base-input-label--open {
					z-index: 2;
				}
				.remove-icon {
					height: calc(var(--smallest) - var(--gap) / 4);
					width: calc(var(--smallest) - var(--gap) / 4);
					margin-left: calc(var(--gap) / 4);
				}

				.input-spinner-container {
					z-index: 2;
					margin-left: calc(var(--gap) / 2);
				}

				.float-label + label,
				.base-input:focus + label {
					top: 0;
					line-height: 1.25rem;
					font-size: var(--smallest);
				}
			`,
		];
	}

	override render(): TemplateResult {
		const selected = this.options.filter((opt) => this.selected.has(opt.id));
		const filtered = this.options.filter((opt) => this.filtered.has(opt.id));

		return html`
			<div class="input-group">
				<div
					${ref(this.listboxEl)}
					part="listbox"
					class=${classMap({
						'listbox': true,
						'listbox--open': this.open,
						'listbox--top': this.listboxFlipped,
						'listbox--bottom': !this.listboxFlipped,
					})}
					style=${styleMap(this.listboxStyles)}
					role="listbox"
					@mousedown=${this.onOptionMousedown}
					@click=${this.onOptionSelect}
					aria-labelledby="label"
				>
					${filtered.map(
						({ id, label }, i) => html`
							${!this.inputValue && this.categories?.[i]
								? html`<div class="option-category">${this.categories?.[i]}</div>`
								: html``}
							<div
								role="option"
								class=${classMap({
									'option': true,
									'option--active': this.active === id,
									'option--selected': this.selected.has(id),
								})}
								data-listbox-id=${id as string}
								aria-selected=${this.selected.has(id)}
							>
								${label ?? id}
							</div>
						`,
					)}
					${!filtered.length
						? html` <div role="option" class="option--disabled">${this.noChoicesFallback}</div> `
						: undefined}
				</div>
				<input
					${ref(this.inputEl)}
					part="input"
					class=${classMap({
						'base-input': true,
						'input': true,
						'input-is-error': this.error,
						'float-label': this.open || this.isFloatingLabel,
						'input--some-selected': !!selected.length,
						'input--open-bottom': this.open && !this.listboxFlipped,
						'input--open-top': this.open && this.listboxFlipped,
					})}
					type="text"
					name=${this.name}
					placeholder=${ifDefined(this.placeholder)}
					.value=${live(this.inputValue)}
					@input=${this.onInput}
					@click=${this.onListboxClick}
					@focusin=${this.onInputFocus}
					@focusout=${this.onInputFocusOut}
					@keydown=${this.onKeyDown}
					?disabled=${this.disabled}
					role="combobox"
					aria-invalid=${this.error}
					aria-expanded=${this.open}
					aria-activedescendant=${ifDefined(this.active as string)}
					aria-autocomplete="none"
					aria-haspopup="true"
					aria-controls="listbox"
					aria-labelledby="label"
					aria-live=${ifDefined(this.loading) ? 'polite' : 'off'}
					aria-busy=${this.loading}
				/>
				${this.label
					? html`
							<label
								for=${this.name}
								part="label"
								class=${classMap({
									'base-input-label': true,
									'base-input-label--open': this.open || this.isFloatingLabel,
								})}
							>
								${this.label}
							</label>
					  `
					: undefined}
				${this.loading
					? html`<div class="input-spinner-container">
							<div class="spinner" part="spinner" aria-label="Loading"></div>
					  </div>`
					: undefined}
			</div>
			<span id="remove" style="display: none">remove</span>
			<ul
				id="selected"
				class=${classMap({ 'selected--is-error': this.error })}
				@click=${this.onSelectedRemove}
				?hidden=${!selected.length}
			>
				${selected.map(
					({ id, label }) => html`<li>
						<button
							class="chip"
							part="chip"
							data-selected-id=${id as string}
							aria-describedby="remove"
							?disabled=${this.disabled}
						>
							${label ?? id}
							<svg role="presentation" class="btn_icon remove-icon" viewBox="0 0 12.66 12.66">
								<path
									d="M8.5,6.3l3.8-3.8c0.6-0.6,0.6-1.5,0-2.1s-1.5-0.6-2.1,0L6.3,4.2L2.6,0.5C2-0.1,1-0.1,0.5,0.5s-0.6,1.5,0,2.1
	l3.8,3.8l-3.7,3.7c-0.6,0.6-0.6,1.5,0,2.1c0,0,0,0,0,0c0.3,0.3,0.7,0.4,1,0.5c0.4,0,0.8-0.2,1-0.5l3.8-3.8l3.8,3.8
	c0.3,0.3,0.7,0.4,1,0.5c0.4,0,0.8-0.2,1-0.5c0.6-0.6,0.6-1.5,0-2.1c0,0,0,0,0,0L8.5,6.3z"
								/>
							</svg>
						</button>
					</li>`,
				)}
			</ul>
			<p
				class=${classMap({
					'input-error-label': true,
					'input-error-label-show': this.error,
				})}
				part="error"
			>
				${this.errorText}
			</p>
			<div
				class=${classMap({
					'error-spacer': true,
					'error-spacer-is-error': this.error,
				})}
				part="spacer"
			></div>
		`;
	}

	public recalculateListboxPosition = (): void => {
		const inputRect = this.inputEl.value!.getBoundingClientRect();
		const inputRectBottom = document.documentElement.clientHeight - inputRect.bottom;
		const inputRectTop = inputRect.top;
		if (this.open) {
			this.listboxFlipped = false;
			if (inputRectBottom < this.listboxHeight && inputRectTop > inputRectBottom) {
				this.listboxFlipped = true;
			}
			if (!this.listboxFlipped && inputRectBottom < this.listboxHeight) {
				// resize height to fit bottom;
				this.listboxStyles = { 'top': '100%', 'max-height': `calc(${inputRectBottom}px - 0.5rem)` };
			} else if (this.listboxFlipped && inputRectTop < this.listboxHeight) {
				// resize height to fit top;
				this.listboxStyles = { 'bottom': '100%', 'max-height': `calc(${inputRectTop}px - 0.5rem)` };
			} else if (!this.listboxFlipped) {
				this.listboxStyles = { top: '100%' };
			} else {
				this.listboxStyles = { bottom: '100%' };
			}
		} else {
			this.listboxStyles = { top: '100%' };
		}
	};

	override connectedCallback(): void {
		super.connectedCallback();
		window.addEventListener('resize', this.recalculateListboxPosition);
	}

	override disconnectedCallback(): void {
		window.removeEventListener('resize', this.recalculateListboxPosition);
		super.disconnectedCallback();
	}

	protected onInput(event: Event): void {
		const { name, value } = event.currentTarget as HTMLInputElement;

		this.inputValue = value;

		this.open = this.options.length > 0;

		this.dispatchEvent(
			new CustomEvent<{ name: string; value: string }>('cra:multi-select:input', {
				detail: { name, value },
			}),
		);
	}

	protected onListboxClick(): void {
		this.open = true;
	}

	protected onOptionMousedown(): void {
		this.ignoreBlur = true;
	}

	protected static isOptionElement(el: EventTarget): boolean {
		return el instanceof HTMLElement && el.getAttribute('role') === 'option';
	}

	protected onOptionSelect(event: MouseEvent): void {
		const clickedId = (
			event.composedPath().find((el) => MultiSelect.isOptionElement(el)) as HTMLElement
		)?.dataset.listboxId as T;
		if (!clickedId) {
			this.inputEl.value!.focus();
			return;
		}

		this.active = clickedId;
		const newSelected = new Set(this.selected);
		if (this.selected.has(clickedId)) {
			newSelected.delete(clickedId);
		} else {
			newSelected.add(clickedId);
		}
		this.selected = newSelected;
		this.inputEl.value!.focus();
	}

	protected static isRemoveButton(el: EventTarget): boolean {
		return el instanceof HTMLElement && el.tagName === 'BUTTON';
	}

	protected onSelectedRemove(event: MouseEvent): void {
		if (this.disabled) {
			return;
		}
		const found = event.composedPath().find((el) => MultiSelect.isRemoveButton(el)) as HTMLElement;
		if (!found) {
			return;
		}
		const clickedId = found.dataset.selectedId as T;

		const newSelected = new Set(this.selected);
		newSelected.delete(clickedId);
		this.selected = newSelected;
	}

	protected ignoreBlur = false;

	protected onInputFocus(): void {
		this.open = true;
		this.isFocus = true;
		this.setAttribute('floating-label', '');
	}

	protected onInputFocusOut(e: Event): void {
		if (this.ignoreBlur) {
			this.ignoreBlur = false;
			return;
		}
		this.isFocus = false;
		this.isFloatingLabel = !!this.inputValue.length;
		this.open = false;

		if (!this.isFloatingLabel) {
			this.removeAttribute('floating-label');
		}

		const { name, value } = e.currentTarget as HTMLInputElement;
		this.dispatchEvent(
			new CustomEvent<{ name: string; value: string }>('cra:multi-select:blur', {
				detail: { name, value },
			}),
		);
	}

	protected onKeyDown(event: KeyboardEvent): void {
		const { name } = event.currentTarget as HTMLInputElement;
		const { key } = event;
		const filtered = this.options.filter((opt) => this.filtered.has(opt.id));
		const max = filtered.length - 1;

		this.dispatchEvent(
			new CustomEvent<{ name: string; key: string }>('cra:multi-select:keydown', {
				detail: { name, key },
			}),
		);

		const action = MultiSelect.getActionFromKey(event, this.open);

		if (action === MenuActions.Next) {
			const activeIndex = filtered.findIndex((opt) => opt.id === this.active);
			this.active = filtered[Math.min(max, activeIndex + 1)].id;
		}
		if (action === MenuActions.Previous) {
			const activeIndex = filtered.findIndex((opt) => opt.id === this.active);
			this.active = filtered[Math.max(0, activeIndex - 1)].id;
		}
		if (action === MenuActions.First) {
			this.active = filtered[0].id;
		}
		if (action === MenuActions.Last) {
			this.active = filtered[max].id;
		}
		if (action === MenuActions.CloseSelect && this.active) {
			const newSelected = new Set(this.selected);
			if (this.selected.has(this.active)) {
				newSelected.delete(this.active);
			} else {
				newSelected.add(this.active);
			}
			this.selected = newSelected;
			event.preventDefault();
		}
		if (action === MenuActions.Close) {
			if (this.open) {
				event.preventDefault();
				this.open = false;
			}
		}
		if (action === MenuActions.Open) {
			this.open = true;
		}
	}

	override updated(changed: PropertyValues): void {
		if (changed.has('active') && this.active && this.open && isScrollable(this.listboxEl.value!)) {
			const activeEl = this.renderRoot.querySelector(
				`[data-listbox-id="${this.active}"]`,
			) as HTMLElement;
			MultiSelect.maintainScrollVisibility(activeEl, this.listboxEl.value!);
		}
	}

	protected static filterOptions<T>(
		options: Array<{ id: T; label?: string }>,
		filter: string,
	): Set<T> {
		return options.reduce((acc, opt) => {
			if (
				!filter ||
				((opt.label as string) ?? opt.id).toLowerCase().includes(filter.toLowerCase())
			) {
				acc.add(opt.id);
			}
			return acc;
		}, new Set<T>());
	}

	// ensure given child element is within the parent's visible scroll area
	protected static maintainScrollVisibility(
		activeElement: HTMLElement,
		scrollParent: HTMLElement,
	): void {
		const { offsetHeight, offsetTop } = activeElement;
		const { offsetHeight: parentOffsetHeight, scrollTop } = scrollParent;

		const isAbove = offsetTop < scrollTop;
		const isBelow = offsetTop + offsetHeight > scrollTop + parentOffsetHeight;

		if (isAbove) {
			scrollParent.scrollTo(0, offsetTop);
		} else if (isBelow) {
			scrollParent.scrollTo(0, offsetTop - parentOffsetHeight + offsetHeight);
		}
	}

	protected static getActionFromKey(event: KeyboardEvent, menuOpen: boolean): MenuActions | null {
		const { key, altKey, ctrlKey, metaKey } = event;
		// handle opening when closed
		if (!menuOpen && (key === Keys.Down || key === Keys.Enter || key === Keys.Space)) {
			return MenuActions.Open;
		}

		// handle keys when open
		if (key === Keys.Down) {
			return MenuActions.Next;
		}
		if (key === Keys.Up) {
			return MenuActions.Previous;
		}
		if (key === Keys.Home) {
			return MenuActions.First;
		}
		if (key === Keys.End) {
			return MenuActions.Last;
		}
		if (key === Keys.Escape) {
			return MenuActions.Close;
		}
		if (key === Keys.Enter) {
			return MenuActions.CloseSelect;
		}
		if (key === Keys.Space) {
			return MenuActions.Space;
		}
		if (
			key === Keys.Backspace ||
			key === Keys.Clear ||
			(key.length === 1 && !altKey && !ctrlKey && !metaKey)
		) {
			return MenuActions.Type;
		}
		return null;
	}
}

export interface HTMLElementTagNameMap {
	'multi-select': MultiSelect<string>;
}

export default MultiSelect;
