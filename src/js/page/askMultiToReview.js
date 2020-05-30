import {shuffle} from '../helpers/array.js';
import storage from '../ui/storage.js';
import ui from '../ui/ui.js';
import locale from '../locale/default.js';

function buildTemplate(range, selected) {
	let labels = "";

	for (let i = range[0]; i <= range[1]; i++) {
		let checked = "";
		if (!selected) {
			checked = "checked";
		} else {
			checked = selected.indexOf(i) !== -1 ? "checked" : "";
		}
		labels += `<label class="checkbox"><input type="checkbox" value="${i}" ${checked}><div>${i}</div></label>`;
	}
	return `
<div class="askMultiTable input">
	<p>${locale.whichMultiTable}</p>
	${labels}
	<br>
	<button type="button" id="sendChoice">${locale.letsStart}</button>
</div>
`;
}


function getChoice(container) {
	let checks = [];
	container.querySelectorAll('input[type="checkbox"]').forEach(input => {
		if (input.checked)
			checks.push(+input.value);
	});
	return checks;
}

function generateMultitables(tabs) {

	const allCombinations = [];
	for (let i = 0; i < tabs.length; i++) {
		for (let j = 2; j <= 10; j++) {
			allCombinations.push([tabs[i], j]);
		}
	}
	shuffle(allCombinations);
	return allCombinations;

}

export default {
	show(name, container, cbk) {
		container.innerHTML = buildTemplate([2, 10], storage.fetch('multiPreferred'));
		container.querySelector('#sendChoice').addEventListener('click', function () {
			let multitables = getChoice(container);
			if (multitables.length === 0) {
				ui.showNotice(locale.noticeSelectAtLeastOne);
				return;
			}
			storage.store('multiPreferred', multitables);
			cbk(generateMultitables(multitables));
		});
	}
}