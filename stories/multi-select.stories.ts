import { TemplateResult, html } from 'lit';
import { Meta } from '@storybook/web-components';
import '../components/multi-select';

export const MultiSelectBase = (): TemplateResult => {
	return html` <multi-select></multi-select> `;
};

export const BaseMultiSelectOptions = (): TemplateResult => {
	return html` <multi-select></multi-select> `;
};

export default {
	title: 'Inputs/MultiSelect',
} as Meta;

// const Template: Story<Meta> = () => MultiSelectBase();
// export const Error = ErrorTemplate.bind({});

export const Base = function () {
	return MultiSelectBase();
};
