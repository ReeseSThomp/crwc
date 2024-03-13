import { LitElement, TemplateResult, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { CRAFormController, FormField } from '../form-base';
import type { FormBaseData } from '../form-base';

import '../tel-input';
import './form-display-table';

export type fieldNames = 'cellPhone' | 'homePhone';

export interface StoryFormData extends FormBaseData<fieldNames> {
	cellPhone: FormField<string, fieldNames>;
	homePhone: FormField<string, fieldNames>;
}

@customElement('tel-input-form')
export default class TelInputForm extends LitElement {
	@property({ type: Boolean }) public disable = false;

	form = new CRAFormController<fieldNames, StoryFormData>(this, this.generateFormData);

	public generateFormData(): StoryFormData {
		return {
			cellPhone: new FormField<string, fieldNames>(''),
			homePhone: new FormField<string, fieldNames>(''),
		};
	}

	protected render(): TemplateResult {
		return html`
			<form-display-table .formData="${this.form.data}"></form-display-table>
			<cra-tel-input
				id="cellPhone"
				name="cellPhone"
				@cra:textInput:input="${this.form.handleTextInput}"
				@cra:textInput:blur="${this.form.handleTextBlur}"
				label="Cell Phone"
				value=${this.form.data.cellPhone.value}
				?isLoading=${this.form.data.cellPhone.isLoading}
				?disabled=${this.disable}
				?isError=${this.form.data.cellPhone.isError}
				errorText=${this.form.data.cellPhone.errorMessage}
			></cra-tel-input>

			<cra-tel-input
				id="homePhone"
				name="homePhone"
				@cra:textInput:input="${this.form.handleTextInput}"
				@cra:textInput:blur="${this.form.handleTextBlur}"
				label="Home Phone"
				value=${this.form.data.homePhone.value}
				?isError=${this.form.data.homePhone.isError}
				errorText=${this.form.data.homePhone.errorMessage}
				?isLoading=${this.form.data.homePhone.isLoading}
				?disabled=${this.disable}
			></cra-tel-input>
		`;
	}
}

if (!window.customElements.get('tel-input-form')) {
	window.customElements.define('tel-input-form', TelInputForm);
}
