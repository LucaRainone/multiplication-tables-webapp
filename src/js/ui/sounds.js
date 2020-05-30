const audioSuccess = new Audio('assets/sounds/success.wav');
const audioError   = new Audio('assets/sounds/error.wav');

function playAudio(audio, offset, stopAfter) {
	audio.pause();
	audio.currentTime = offset;
	audio.play().catch(function (e) {
		console.error("audio not available: " + e)
	});
	setTimeout(function () {
		audio.pause();
	}, stopAfter)
}

export default {

	success() {
		try {
			playAudio(audioSuccess, 0, 1000);
		} catch (e) {

		}
	},
	error() {
		try {
			playAudio(audioError, 0, 1000);
		} catch (e) {

		}
	}

}