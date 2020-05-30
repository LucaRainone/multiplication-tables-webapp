import ui from '../ui/ui.js';
import locale from '../locale/default.js';

const template = `
<div id="askNamePage">
    ${locale.whatsYourName} <input type="text" name="name" value="" id="inputName"><button type="button" id="sendName">Invia</button>
</div>`;

function getName(container) {
	return container.querySelector('input[name="name"]').value;
}

function show(container, start) {
	container.innerHTML = template;
	container.querySelector('#sendName').addEventListener('click', function (e) {
		const name = getName(container);
		if (!name) {
			ui.showNotice(locale.noticeInsertYourName);
		} else {
			start(name);
		}
	});
}

export default {
	show
}
