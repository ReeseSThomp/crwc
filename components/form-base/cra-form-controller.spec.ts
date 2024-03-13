import './fixtures/TestForm';
import { html } from 'lit';
import userEvent from '@testing-library/user-event';
import { querySelectorDeep } from 'query-selector-shadow-dom';
import { fixture } from '../../jest-setup';
import TestForm, { TestFormValues } from './fixtures/TestForm';
import { CRACheckboxGroup } from '../checkbox-group';
import { CRA_FORM_DIFFERED } from './cra-form-controller';

describe('Test form', () => {
	it('renders', async () => {
		expect.assertions(1);

		const testForm = await fixture<TestForm>(html`<test-form></test-form>`);
		expect(testForm?.shadowRoot?.getElementById('group-name')).toBeTruthy();
	});

	it('returns form values', async () => {
		expect.assertions(3);

		const given: TestFormValues = { groupName: 'cats', selected: ['george'] };
		const testForm = await fixture<TestForm>(html`<test-form .givenValues=${given}></test-form>`);
		const groupName = querySelectorDeep('#group-name', testForm) as HTMLInputElement;
		const selected = querySelectorDeep('#selected', testForm) as CRACheckboxGroup;

		expect(testForm.form.getValues()).toMatchObject(given);

		userEvent.type(groupName, 'dogs');
		expect(testForm.form.getValues()).toMatchObject({
			groupName: 'catsdogs',
			selected: ['george'],
		});

		userEvent.click(querySelectorDeep('[value="yuki"]', selected) as Element);
		expect(testForm.form.getValues()).toMatchObject({
			groupName: 'catsdogs',
			selected: ['george', 'yuki'],
		});
	});

	it('diffs form values', async () => {
		expect.assertions(4);
		const given: TestFormValues = { groupName: 'cats', selected: ['george'] };

		const testForm = await fixture<TestForm>(html`<test-form .givenValues=${given}></test-form>`);
		const groupName = querySelectorDeep('#group-name', testForm) as HTMLInputElement;

		expect(testForm.form.differed()).toBeFalsy();

		let eventDifferedFired = false;
		testForm.addEventListener(CRA_FORM_DIFFERED, () => {
			eventDifferedFired = true;
		});

		userEvent.type(groupName, 'x');
		expect(testForm.form.differed()).toBeTruthy();
		expect(eventDifferedFired).toBeTruthy();

		userEvent.type(groupName, '{backspace}');
		expect(testForm.form.differed()).toBeFalsy();
	});
});
