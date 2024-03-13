import { LitElement, TemplateResult, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { CRAFormController, FormField } from '../form-base';
import type { FormBaseData } from '../form-base';

import '../text-area';
import './form-display-table';

export type fieldNames = 'textBoxA' | 'textBoxB';

export interface StoryFormData extends FormBaseData<fieldNames> {
	textBoxA: FormField<string, fieldNames>;
	textBoxB: FormField<string, fieldNames>;
}

@customElement('text-area-form')
export default class TextAreaForm extends LitElement {
	@property({ type: Boolean }) public disable = false;

	form = new CRAFormController<fieldNames, StoryFormData>(this, this.generateFormData);

	public generateFormData(): StoryFormData {
		return {
			textBoxA: new FormField<string, fieldNames>(''),
			textBoxB: new FormField<string, fieldNames>(''),
		};
	}

	protected render(): TemplateResult {
		return html`
			<form-display-table .formData="${this.form.data}"></form-display-table>
			<cra-text-area
				id="textBoxA"
				name="textBoxA"
				@cra:textArea:input="${this.form.handleTextInput}"
				@cra:textArea:blur="${this.form.handleTextBlur}"
				placeholder="Text Box A Placeholder"
				value=${this.form.data.textBoxA.value}
				?isLoading=${this.form.data.textBoxA.isLoading}
				?disabled=${this.disable}
				?isError=${this.form.data.textBoxA.isError}
				errorText=${this.form.data.textBoxA.errorMessage}
			></cra-text-area>

			<cra-text-area
				id="textBoxB"
				name="textBoxB"
				@cra:textArea:input="${this.form.handleTextInput}"
				@cra:textArea:blur="${this.form.handleTextBlur}"
				placeholder="Max length text area"
				value=${this.form.data.textBoxB.value}
				?isError=${this.form.data.textBoxB.isError}
				errorText=${this.form.data.textBoxB.errorMessage}
				?isLoading=${this.form.data.textBoxB.isLoading}
				?disabled=${this.disable}
				maxLength=${180}
			></cra-text-area>
		`;
	}
}

if (!window.customElements.get('text-area-form')) {
	window.customElements.define('text-area-form', TextAreaForm);
}
