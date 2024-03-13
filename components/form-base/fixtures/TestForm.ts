import '../../checkbox-group/cra-checkbox-group';
import { LitElement, TemplateResult, html } from 'lit';
import { live } from 'lit/directives/live.js';
import { customElement } from 'lit/decorators.js';
import { CRAFormController, CRA_FORM_DIFFERED, FormBaseData } from '../cra-form-controller';
import FormField, { ValidationResult, validateNotEmpty } from '../cra-form-field';

enum fieldNames {
	id = 'id',
	groupName = 'groupName',
	selected = 'selected',
}

interface TestFormDef extends FormBaseData<fieldNames> {
	id: FormField<number | undefined, fieldNames>;
	groupName: FormField<string, fieldNames>;
	selected: FormField<string[], fieldNames>;
}
export type TestFormValues = { [P in keyof TestFormDef]?: TestFormDef[P]['value'] };

/**
 * @fires cra:form:differed
 */
@customElement('test-form')
export default class TestForm extends LitElement {
	form = new CRAFormController<fieldNames, TestFormDef>(
		this,
		(values?: TestFormValues) => ({
			id: new FormField<number | undefined, fieldNames>(values?.id),
			groupName: new FormField(values?.groupName ?? '', {
				validateField: (val: string): ValidationResult => {
					if (val.length < 1) {
						return { isError: true, errorMessage: 'Group name must be 1 or more characters' };
					}
					return { isError: false, errorMessage: '' };
				},
			}),
			selected: new FormField(values?.selected ?? [], {
				validateField: validateNotEmpty('At least one sign must be selected'),
			}),
		}),
		(hasDiffered: boolean) => {
			this.dispatchEvent(new CustomEvent(CRA_FORM_DIFFERED, { detail: hasDiffered }));
		},
	);

	set givenValues(values: TestFormValues) {
		this.form.regenerate(values);
	}

	public override render(): TemplateResult {
		return html`
			<input
				id="group-name"
				name="groupName"
				type="text"
				placeholder="e.g. Speedway"
				@input=${this.form.handleTextInput}
				@blur=${this.form.handleTextBlur}
				.value=${live(this.form.data.groupName.value ?? '')}
			/>
			<cra-checkbox-group
				id="selected"
				name="selected"
				.valueToLabel=${{ george: 'george', yuki: 'yuki' }}
				@cra:array:change=${this.form.handleArrayChange}
				.selectedValues=${live(this.form.data.selected.value)}
			></cra-checkbox-group>
		`;
	}
}
