// import askTheNamePage from './page/askTheName.js';
import askMultiToReview from './page/askMultiToReview.js';
import game from './page/game.js';
import ui from './ui/ui.js';
import storage from './ui/storage.js';
import Progressbar from './ui/progressbar.js';
import locale from './locale/default.js';

function getElement(id) {
	return document.getElementById(id);
}

function main() {
	const gameBoard = getElement('gameboard');
	const footer    = getElement('footer');

	getElement('mainTitle').innerHTML = document.title =  locale.pageTitle;

	footer.style.display = "none";
	askMultiToReview.show("", gameBoard, (multitable) => {
		footer.style.display = "block";

		const progressbar = new Progressbar(getElement('bar'), getElement('points'), multitable.length)
		game.start(gameBoard, multitable, () => {
			progressbar.startTimer();
		}, (win) => {
			progressbar.stopTimer();
			win ? progressbar.addPointsForWin() : progressbar.addPointsForLose();

		}, () => {
			progressbar.stopTimer();
			ui.showNotice(locale.endMessage.replace(/%d/, progressbar.getPoints()));
			window.location.reload();
		});
	});

	// TODO page for input the player name
	// askTheNamePage.show(gameBoard, name => {
	//
	// });

}

main();

// service worker part

if ('serviceWorker' in navigator) {

	function deleteAllCache() {
		// one of the 2 hard problems in CS

		if (navigator.serviceWorker.controller) {
			navigator.serviceWorker.controller.postMessage(
				{
					type : 'DELETE_ALL',
				}
			);
		}
		navigator.serviceWorker.getRegistrations().then(function (registrations) {
			for (let registration of registrations) {
				registration.unregister()
			}
		});
	}

	const lastUpdate = storage.fetch('lastBrowserUpdate');
	if (lastUpdate && (+new Date() - lastUpdate < 2000)) {
		deleteAllCache();
	}

	storage.store('lastBrowserUpdate', +new Date());


	window.addEventListener('load', function () {
		navigator.serviceWorker.register('./sw.js', {scope : './'}).then(function (registration) {
			console.log('ServiceWorker registration successful with scope: ', registration.scope);
		}, function (err) {
			console.log('ServiceWorker registration failed: ', err);
		});
	});
}