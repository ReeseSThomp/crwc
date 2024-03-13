import { TemplateResult, html } from 'lit';
import { StoryFormData, fieldNames } from '../components/story-components/text-input-form';
import '../components/text-input';
import '../components/story-components/text-input-form';
import FormField, { ValidationResult } from '../components/form-base/cra-form-field';

const baseForm: StoryFormData = {
	username: new FormField<string, fieldNames>(''),
	email: new FormField<string, fieldNames>(''),
	password: new FormField<string, fieldNames>(''),
	yearsExperience: new FormField<string, fieldNames>(''),
};

export const BaseTextInput = (): TemplateResult => {
	return html`
		<div style="width: 400px; height: 50px">
			<text-input-form .formData=${baseForm}></text-input-form>
		</div>
	`;
};

const errorForm: StoryFormData = {
	username: new FormField<string, fieldNames>('', {
		validateField(): ValidationResult {
			return { isError: true, errorMessage: this.errorMessage ?? '' };
		},
		errorMessage: 'This field is in error',
		isError: true,
	}),
	email: new FormField<string, fieldNames>('', {
		validateField(): ValidationResult {
			return { isError: true, errorMessage: this.errorMessage ?? '' };
		},
		errorMessage: 'This field is in error',
		isError: true,
	}),
	password: new FormField<string, fieldNames>('', {
		validateField(): ValidationResult {
			return { isError: true, errorMessage: this.errorMessage ?? '' };
		},
		errorMessage: 'This field is in error',
		isError: true,
	}),
	yearsExperience: new FormField<string, fieldNames>('', {
		validateField(): ValidationResult {
			return { isError: true, errorMessage: this.errorMessage ?? '' };
		},
		errorMessage: 'This field is in error',
		isError: true,
	}),
};

export const ErrorTextInput = (): TemplateResult => {
	return html`
		<div style="width: 400px; height: 50px">
			<text-input-form .formData=${errorForm}></text-input-form>
		</div>
	`;
};

const loadingForm: StoryFormData = {
	username: new FormField<string, fieldNames>('', { isLoading: true }),
	email: new FormField<string, fieldNames>('', { isLoading: true }),
	password: new FormField<string, fieldNames>('', { isLoading: true }),
	yearsExperience: new FormField<string, fieldNames>('', { isLoading: true }),
};

export const LoadingTextInput = (): TemplateResult => {
	return html`
		<div style="width: 400px; height: 50px">
			<text-input-form .formData=${loadingForm} disable></text-input-form>
		</div>
	`;
};

export const DisabledTextInput = (): TemplateResult => {
	return html`
		<div style="width: 400px; height: 50px">
			<text-input-form .formData=${baseForm} disable></text-input-form>
		</div>
	`;
};
