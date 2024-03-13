import { CSSResultArray, LitElement, TemplateResult, css, html } from 'lit';
import { property } from 'lit/decorators.js';

import '../text-input';

export type UnknownFormData = Record<
	string,
	{
		value: unknown;
		isError: boolean;
		isLoading: boolean;
		errorMessage: string;
	}
>;

// @customElement("form-display-table")
export default class FormDisplayTable extends LitElement {
	@property({ type: Object })
	public formData?: UnknownFormData;

	public static override get styles(): CSSResultArray {
		return [
			// language=CSS
			css`
				table {
					border-collapse: collapse;
					margin: 25px 0;
					font-size: 0.9em;
					min-width: 400px;
					box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
				}

				thead tr {
					background-color: #1088ce;
					color: #ffffff;
					text-align: left;
				}

				th,
				td {
					padding: 12px 15px;
				}

				tbody tr {
					border-bottom: 1px solid #dddddd;
				}

				tbody tr:nth-of-type(even) {
					background-color: #f3f3f3;
				}
			`,
		];
	}

	protected override render(): TemplateResult {
		if (!this.formData) {
			return html``;
		}
		return html`
			<table>
				<thead>
					<tr>
						<th>form key</th>
						<th>value</th>
						<th>isError</th>
						<th>isLoading</th>
						<th>errorMessage</th>
					</tr>
				</thead>
				<tbody>
					${Object.keys(this.formData).map((key): TemplateResult => {
						if (!this.formData) {
							return html``;
						}
						const data = this.formData[key];
						return html`
							<tr>
								<td>${key}</td>
								<td>${JSON.stringify(data.value)}</td>
								<td>${data.isError}</td>
								<td>${data.isLoading}</td>
								<td>${JSON.stringify(data.errorMessage)}</td>
							</tr>
						`;
					})}
				</tbody>
			</table>
		`;
	}
}

if (!window.customElements.get('form-display-table')) {
	window.customElements.define('form-display-table', FormDisplayTable);
}
