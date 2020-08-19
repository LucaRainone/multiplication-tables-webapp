export default {
	showNotice(text) {
		return new Promise((res, rej) => {
			alert(text);
			res();
		});
	},
	hide(element) {
		element.classList.add('hidden');
	},
	show(element) {
		element.classList.remove('hidden');
	}
}