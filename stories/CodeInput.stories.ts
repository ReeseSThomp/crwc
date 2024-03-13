import { Meta, Story } from '@storybook/web-components';
import {
	BaseCodeInput,
	DisabledCodeInput,
	ErrorCodeInput,
	LoadingCodeInput,
	SuccessCodeInput,
} from './CodeInput';

export default {
	title: 'Inputs/CodeInput',
} as Meta;

const Template: Story<Meta> = () => BaseCodeInput();
const ErrorTemplate: Story<Meta> = () => ErrorCodeInput();
const LoadingTemplate: Story<Meta> = () => LoadingCodeInput();
const DisabledTemplate: Story<Meta> = () => DisabledCodeInput();
const SuccessTemplate: Story<Meta> = () => SuccessCodeInput();

export const Base = Template.bind({});
export const Error = ErrorTemplate.bind({});
export const Loading = LoadingTemplate.bind({});
export const Disabled = DisabledTemplate.bind({});
export const Success = SuccessTemplate.bind({});
