import {registerRoute} from 'workbox-routing';
import {CacheFirst, NetworkFirst} from 'workbox-strategies';
import {precacheAndRoute} from 'workbox-precaching';
import {ExpirationPlugin} from 'workbox-expiration';

self.__WB_DISABLE_DEV_LOGS = true;

precacheAndRoute([
	                 {url : './assets/sounds/error.wav', revision : '1'},
	                 {url : './assets/sounds/success.wav', revision : '1'},
                 ], {ignoreURLParametersMatching : [/.*/]});

registerRoute(
	({request, url}) => {
		let cache = request.destination === 'script' || url.pathname.endsWith('.html') || url.pathname.endsWith('/')
			|| url.pathname.endsWith('.json');
		return cache;
	},
	new NetworkFirst()
);

registerRoute(
	({request, url}) => request.destination === 'image' || url.pathname.split('css/').length > 1 || url.pathname.split('assets').length > 1,
	new CacheFirst(
		{
			cacheName : 'image-cache',
			plugins   : [
				new ExpirationPlugin(
					{
						maxAgeSeconds : 3 * 60 * 60,
					}
				),
			]
		}
	)
);

self.addEventListener('message', (event) => {
	if (event.data && event.data.type === 'DELETE_ALL') {
		console.log("Delete command received");
		caches.keys().then(function (names) {
			for (let name of names) {
				console.log("delete " + name)
				caches.delete(name);
			}
		});
	}
});

