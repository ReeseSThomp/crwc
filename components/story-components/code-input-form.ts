import { LitElement, TemplateResult, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { CRAFormController, FormField } from '../form-base';
import type { FormBaseData } from '../form-base';

import '../code-input';
import './form-display-table';

type fieldNames = 'textedCode';

export interface StoryFormData extends FormBaseData<fieldNames> {
	textedCode: FormField<string, fieldNames>;
}

@customElement('code-input-form')
export default class CodeInputForm extends LitElement {
	@property({ type: Boolean }) public disable = false;

	@property({ type: Boolean }) public isSuccess = false;

	form = new CRAFormController<fieldNames, StoryFormData>(this, this.generateFormData);

	public generateFormData(): StoryFormData {
		return {
			textedCode: new FormField<string, fieldNames>(''),
		};
	}

	protected override render(): TemplateResult {
		return html`
			<form-display-table .formData="${this.form.data}"></form-display-table>
			<div style="width: 150px; height: 50px">
				<cra-code-input
					id="textedCode"
					name="textedCode"
					@cra:codeInput:input="${this.form.handleTextInput}"
					@cra:codeInput:blur="${this.form.handleTextBlur}"
					label="Does this go anywhere?"
					value=${this.form.data.textedCode.value}
					?isLoading=${this.form.data.textedCode.isLoading}
					?disabled=${this.disable}
					?isSuccess=${this.isSuccess}
					?isError=${this.form.data.textedCode.isError}
					errorText=${this.form.data.textedCode.errorMessage}
				></cra-code-input>
			</div>
		`;
	}
}

if (!window.customElements.get('code-input-form')) {
	window.customElements.define('code-input-form', CodeInputForm);
}
