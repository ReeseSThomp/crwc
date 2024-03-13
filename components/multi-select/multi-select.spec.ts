import { axe } from 'jest-axe';
import { html } from 'lit';

import './multi-select';
import MultiSelect from './multi-select';
import { fixture } from '../../jest-setup';

describe('multi-select', () => {
	it('passes axe accessability', async () => {
		expect.hasAssertions();
		const el = await fixture(html`<multi-select label="test"></multi-select>`);
		const results = await axe(el);
		expect(results).toHaveNoViolations();
	});

	it('shows options with categories interspersed', async () => {
		expect.hasAssertions();

		const categorizedChoices = [
			{
				categoryLabel: 'Popular',
				choices: [
					{
						id: 'a',
						label: 'label-a',
					},
					{
						id: 'b',
						label: 'label-b',
					},
				],
			},
			{
				categoryLabel: 'Cool',
				choices: [
					{
						id: 'c',
						label: 'label-c',
					},
					{
						id: 'd',
						label: 'label-d',
					},
				],
			},
			{
				categoryLabel: 'Not Cool',
				choices: [
					{
						id: 'e',
						label: 'label-e',
					},
					{
						id: 'f',
						label: 'label-f',
					},
					{
						id: 'g',
						label: 'label-g',
					},
				],
			},
		];

		const order = [
			// 0
			'Popular',
			'label-a',
			'label-b',
			// 2
			'Cool',
			'label-c',
			'label-d',
			// 4
			'Not Cool',
			'label-e',
			'label-f',
			'label-g',
		];

		const changeFunc = jest.fn();

		const el = await fixture(html`<multi-select
			name="roadway"
			label="Roadway"
			class="filter-select"
			.value=${[]}
			.categorizedChoices=${categorizedChoices}
			@change=${changeFunc as () => void}
		></multi-select>`);

		expect(el?.shadowRoot?.querySelectorAll('.option-category')).toHaveLength(3);
		expect(el?.shadowRoot?.querySelectorAll('.option')).toHaveLength(7);

		const children = Array.from(
			(el?.shadowRoot?.querySelector('#listbox') as MultiSelect<string>)?.children,
		);
		const dropdownContents = [...(children || [])];

		dropdownContents.forEach((el, i) => {
			expect(el.textContent).toContain(order[i]);
		});

		(
			el?.shadowRoot
				?.querySelector('#listbox')
				?.getElementsByClassName('option')[0] as HTMLDivElement
		).click();
		expect(changeFunc).toHaveBeenCalledTimes(1);
		(el?.shadowRoot?.querySelector('.option-category') as HTMLDivElement).click();
		// no calls
		expect(changeFunc).toHaveBeenCalledTimes(1);
	});

	it('shows no choices exist message', async () => {
		const el = await fixture(html`<multi-select
			name="nooptions"
			label="No Options"
			noChoicesFallback="nope"
		></multi-select>`);
		const input = el.renderRoot.querySelector('input') as HTMLInputElement;
		const disabledOptEl = el?.shadowRoot?.querySelector('.option--disabled') as HTMLElement;

		input.dispatchEvent(new Event('click', { bubbles: false, cancelable: false, composed: false }));
		await el.updateComplete;
		expect(el.hasAttribute('open')).toBeTruthy();
		expect(disabledOptEl?.textContent).toContain('nope');

		// Keep multi-select open with input focused on disabled opt click
		disabledOptEl.dispatchEvent(
			new Event('click', { bubbles: false, cancelable: false, composed: false }),
		);
		await el.updateComplete;
		expect(el.hasAttribute('open')).toBeTruthy();
		// No worky :(
		// const active = el.shadowRoot?.activeElement;
		// expect(active === input).toBeTruthy();
	});
});
