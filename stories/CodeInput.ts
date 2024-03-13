import { TemplateResult, html } from 'lit';

import { StoryFormData } from '../components/story-components/code-input-form';
import '../components/story-components/code-input-form';
import { FormField } from '../components/form-base';
import { ValidationResult } from '../components/form-base/cra-form-field';

type fieldNames = 'textedCode';

const baseForm: StoryFormData = { textedCode: new FormField<string, fieldNames>('') };

export const BaseCodeInput = (): TemplateResult => {
	return html`
		<div style="width: 700px; height: 50px">
			<code-input-form .formData=${baseForm}></code-input-form>
		</div>
	`;
};

const errorForm: StoryFormData = {
	textedCode: new FormField<string, fieldNames>('', {
		validateField: (): ValidationResult => {
			return { isError: true, errorMessage: 'This field is in error' };
		},
		isError: true,
	}),
};

export const ErrorCodeInput = (): TemplateResult => {
	return html`
		<div style="width: 700px; height: 50px">
			<code-input-form .formData=${errorForm}></code-input-form>
		</div>
	`;
};

const loadingForm: StoryFormData = {
	textedCode: new FormField<string, fieldNames>('', {
		validateField: (): ValidationResult => {
			return { isError: true, errorMessage: 'This field is in error' };
		},
		isError: true,
	}),
};

export const LoadingCodeInput = (): TemplateResult => {
	return html`
		<div style="width: 700px; height: 50px">
			<code-input-form .formData=${loadingForm} disable></code-input-form>
		</div>
	`;
};

export const DisabledCodeInput = (): TemplateResult => {
	return html`
		<div style="width: 700px; height: 50px">
			<code-input-form .formData=${baseForm} disable></code-input-form>
		</div>
	`;
};

export const SuccessCodeInput = (): TemplateResult => {
	return html`
		<div style="width: 700px; height: 50px">
			<code-input-form .formData=${baseForm} isSuccess></code-input-form>
		</div>
	`;
};
