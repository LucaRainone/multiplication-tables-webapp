export default {
	showNotice(text) {
		alert(text)
	},
	hide(element) {
		element.classList.add('hidden');
	},
	show(element) {
		element.classList.remove('hidden');
	}
}