import { TemplateResult, html } from 'lit';

import { StoryFormData, fieldNames } from '../components/story-components/text-area-form';
import '../components/tel-input';
import '../components/story-components/text-area-form';
import { FormField, ValidationResult } from '../components/form-base/cra-form-field';

const baseForm: StoryFormData = {
	textBoxA: new FormField<string, fieldNames>(''),
	textBoxB: new FormField<string, fieldNames>(''),
};

export const BaseTextArea = (): TemplateResult => {
	return html`
		<div style="width: 700px; height: 50px">
			<text-area-form .formData=${baseForm}></text-area-form>
		</div>
	`;
};

const errorForm: StoryFormData = {
	textBoxA: new FormField<string, fieldNames>('', {
		isError: true,
		validateField(): ValidationResult {
			return { isError: true, errorMessage: this.errorMessage ?? '' };
		},
		errorMessage: 'This field is in error',
	}),
	textBoxB: new FormField<string, fieldNames>('Some pre-existing text', {
		isError: true,
		validateField(): ValidationResult {
			return { isError: true, errorMessage: this.errorMessage ?? '' };
		},
		errorMessage: 'This field is in error',
	}),
};

export const ErrorTextArea = (): TemplateResult => {
	return html`
		<div style="width: 700px; height: 50px">
			<text-area-form .formData=${errorForm}></text-area-form>
		</div>
	`;
};

const loadingForm: StoryFormData = {
	textBoxA: new FormField<string, fieldNames>('', { isLoading: true }),
	textBoxB: new FormField<string, fieldNames>('Some pre-existing text', { isLoading: true }),
};

export const LoadingTextArea = (): TemplateResult => {
	return html`
		<div style="width: 700px; height: 50px">
			<text-area-form .formData=${loadingForm} disable></text-area-form>
		</div>
	`;
};

export const DisabledTextArea = (): TemplateResult => {
	return html`
		<div style="width: 700px; height: 50px">
			<text-area-form .formData=${baseForm} disable></text-area-form>
		</div>
	`;
};
