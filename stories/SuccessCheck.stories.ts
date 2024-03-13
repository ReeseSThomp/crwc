import { Meta, Story } from '@storybook/web-components';
import { SuccessCheck } from './SuccessCheck';

export default {
	title: 'Extras/SuccessCheck',
} as Meta;

const Template: Story<Meta> = () => SuccessCheck();

export const Base = Template.bind({});
