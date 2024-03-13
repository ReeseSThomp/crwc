import { Meta, Story } from '@storybook/web-components';
import { BaseTextArea, DisabledTextArea, ErrorTextArea, LoadingTextArea } from './TextArea';

export default {
	title: 'Inputs/TextArea',
} as Meta;

const Template: Story<Meta> = () => BaseTextArea();
const ErrorTemplate: Story<Meta> = () => ErrorTextArea();
const LoadingTemplate: Story<Meta> = () => LoadingTextArea();
const DisabledTemplate: Story<Meta> = () => DisabledTextArea();

export const Base = Template.bind({});
export const Error = ErrorTemplate.bind({});
export const Loading = LoadingTemplate.bind({});
export const Disabled = DisabledTemplate.bind({});
