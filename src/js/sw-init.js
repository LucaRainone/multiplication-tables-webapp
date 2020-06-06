import storage from "./ui/storage.js";

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

}

export default {
	register:()=> {
		window.addEventListener('load', function () {
			navigator.serviceWorker.register('./sw.js', {scope : './'}).then(function (registration) {
				console.log('ServiceWorker registration successful with scope: ', registration.scope);
			}, function (err) {
				console.log('ServiceWorker registration failed: ', err);
			});
		});
	}
}