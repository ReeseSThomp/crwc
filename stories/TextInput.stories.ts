import { Meta, Story } from '@storybook/web-components';
import { BaseTextInput, DisabledTextInput, ErrorTextInput, LoadingTextInput } from './TextInput';

export default {
	title: 'Inputs/TextInputs',
} as Meta;

const Template: Story<Meta> = () => BaseTextInput();
const ErrorTemplate: Story<Meta> = () => ErrorTextInput();
const LoadingTemplate: Story<Meta> = () => LoadingTextInput();
const DisabledTemplate: Story<Meta> = () => DisabledTextInput();

export const Base = Template.bind({});
export const Error = ErrorTemplate.bind({});
export const Loading = LoadingTemplate.bind({});
export const Disabled = DisabledTemplate.bind({});
