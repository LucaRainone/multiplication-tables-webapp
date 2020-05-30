function getRandomHigher(n) {
	return n + (1 + Math.random() * 5) | 0;
}

function getRandomLower(n) {
	let j = n - (1 + Math.random() * 5) | 0;
	return j >= 0 ? j : 0;
}

function getRandomNumberExcept(disallowed) {
	let n = 1 + Math.round(Math.random() * 100);
	return disallowed.indexOf(n) === -1 ? n : getRandomNumberExcept(disallowed);
}

export {
	getRandomHigher,
	getRandomLower,
	getRandomNumberExcept,
}