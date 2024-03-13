import { TemplateResult, html } from 'lit';

import '../components/success-check';

export const SuccessCheck = (): TemplateResult => {
	return html`
		<div style="width: 200px; height: 200px">
			<cra-success-check></cra-success-check>
		</div>
		<div style="width: 100px; height: 100px">
			<cra-success-check></cra-success-check>
		</div>
		<div style="width: 50px; height: 50px">
			<cra-success-check></cra-success-check>
		</div>
		<div style="width: 10px; height: 10px">
			<cra-success-check></cra-success-check>
		</div>
	`;
};
export default SuccessCheck;
