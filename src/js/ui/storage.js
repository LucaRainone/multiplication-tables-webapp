export default {
	store(name, value) {
		localStorage && localStorage.setItem(name, JSON.stringify(value));
	},

	fetch(name) {
		if (!localStorage)
			return null;
		let value = localStorage.getItem(name);
		return value ? JSON.parse(value) : null;
	}
}