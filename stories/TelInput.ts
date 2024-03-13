import { TemplateResult, html } from 'lit';

import { StoryFormData, fieldNames } from '../components/story-components/tel-input-form';
import '../components/tel-input';
import '../components/story-components/tel-input-form';
import { FormField } from '../components/form-base';
import { ValidationResult } from '../components/form-base/cra-form-field';

const baseForm: StoryFormData = {
	cellPhone: new FormField<string, fieldNames>('(453) 453-4534'),
	homePhone: new FormField<string, fieldNames>(''),
};

export const BaseTelInput = (): TemplateResult => {
	return html`
		<div style="width: 700px; height: 50px">
			<tel-input-form .formData=${baseForm}></tel-input-form>
		</div>
	`;
};

const errorForm: StoryFormData = {
	cellPhone: new FormField<string, fieldNames>('(453) 453-4534', {
		validateField(): ValidationResult {
			return { isError: true, errorMessage: this.errorMessage ?? '' };
		},
		errorMessage: 'This field is in error',
		isError: true,
	}),
	homePhone: new FormField<string, fieldNames>('', {
		validateField(): ValidationResult {
			return { isError: true, errorMessage: this.errorMessage ?? '' };
		},
		errorMessage: 'This field is in error',
		isError: true,
	}),
};

export const ErrorTelInput = (): TemplateResult => {
	return html`
		<div style="width: 700px; height: 50px">
			<tel-input-form .formData=${errorForm}></tel-input-form>
		</div>
	`;
};

const loadingForm: StoryFormData = {
	homePhone: new FormField<string, fieldNames>('(453) 453-4534', { isLoading: true }),
	cellPhone: new FormField<string, fieldNames>('', { isLoading: true }),
};

export const LoadingTelInput = (): TemplateResult => {
	return html`
		<div style="width: 700px; height: 50px">
			<tel-input-form .formData=${loadingForm} disable></tel-input-form>
		</div>
	`;
};

export const DisabledTelInput = (): TemplateResult => {
	return html`
		<div style="width: 700px; height: 50px">
			<tel-input-form .formData=${baseForm} disable></tel-input-form>
		</div>
	`;
};
