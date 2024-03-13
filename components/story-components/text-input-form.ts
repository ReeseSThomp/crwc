import { LitElement, TemplateResult, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { CRAFormController, FormField } from '../form-base';
import type { FormBaseData } from '../form-base';

import '../text-input';
import './form-display-table';

export type fieldNames = 'username' | 'email' | 'password' | 'yearsExperience';

export interface StoryFormData extends FormBaseData<fieldNames> {
	username: FormField<string, fieldNames>;
	email: FormField<string, fieldNames>;
	password: FormField<string, fieldNames>;
	yearsExperience: FormField<string, fieldNames>;
}

@customElement('text-input-form')
export default class TextInputForm extends LitElement {
	@property({ type: Boolean }) public disable = false;

	form = new CRAFormController<fieldNames, StoryFormData>(this, this.generateFormData);

	public generateFormData(): StoryFormData {
		return {
			username: new FormField<string, fieldNames>(''),
			email: new FormField<string, fieldNames>(''),
			password: new FormField<string, fieldNames>(''),
			yearsExperience: new FormField<string, fieldNames>(''),
		};
	}

	protected override render(): TemplateResult {
		return html`
			<form-display-table .formData="${this.form.data}"></form-display-table>
			<cra-text-input
				id="username"
				inputType="text"
				name="username"
				@cra:textInput:input="${this.form.handleTextInput}"
				@cra:textInput:blur="${this.form.handleTextBlur}"
				label="Username (text type)"
				value=${this.form.data.username.value}
				?isLoading=${this.form.data.username.isLoading}
				?disabled=${this.disable}
				?isError=${this.form.data.username.isError}
				errorText=${this.form.data.username.errorMessage}
			></cra-text-input>

			<cra-text-input
				id="email"
				inputType="email"
				name="email"
				@cra:textInput:input="${this.form.handleTextInput}"
				@cra:textInput:blur="${this.form.handleTextBlur}"
				label="Email (email type)"
				value=${this.form.data.email.value}
				?isError=${this.form.data.email.isError}
				errorText=${this.form.data.email.errorMessage}
				?isLoading=${this.form.data.email.isLoading}
				?disabled=${this.disable}
			></cra-text-input>

			<cra-text-input
				id="password"
				inputType="password"
				name="password"
				@cra:textInput:input="${this.form.handleTextInput}"
				@cra:textInput:blur="${this.form.handleTextBlur}"
				label="Password (password type)"
				value=${this.form.data.password.value}
				?isLoading=${this.form.data.password.isLoading}
				?isError=${this.form.data.password.isError}
				errorText=${this.form.data.password.errorMessage}
				?disabled=${this.disable}
			></cra-text-input>

			<cra-text-input
				id="yearsExperience"
				inputType="number"
				name="yearsExperience"
				@cra:textInput:input="${this.form.handleTextInput}"
				@cra:textInput:blur="${this.form.handleTextBlur}"
				label="Years Experience (number type)"
				value=${this.form.data.yearsExperience.value}
				?isLoading=${this.form.data.yearsExperience.isLoading}
				?isError=${this.form.data.yearsExperience.isError}
				errorText=${this.form.data.yearsExperience.errorMessage}
				?disabled=${this.disable}
			></cra-text-input>
		`;
	}
}

if (!window.customElements.get('text-input-form')) {
	window.customElements.define('text-input-form', TextInputForm);
}
