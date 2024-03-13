import { Meta, Story } from '@storybook/web-components';
import { BaseTelInput, DisabledTelInput, ErrorTelInput, LoadingTelInput } from './TelInput';

export default {
	title: 'Inputs/TelInput',
} as Meta;

const Template: Story<Meta> = () => BaseTelInput();
const ErrorTemplate: Story<Meta> = () => ErrorTelInput();
const LoadingTemplate: Story<Meta> = () => LoadingTelInput();
const DisabledTemplate: Story<Meta> = () => DisabledTelInput();

export const Base = Template.bind({});
export const Error = ErrorTemplate.bind({});
export const Loading = LoadingTemplate.bind({});
export const Disabled = DisabledTemplate.bind({});
