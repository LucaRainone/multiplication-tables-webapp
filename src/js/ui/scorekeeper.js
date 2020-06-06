class Scorekeeper {
	timerOn     = false;
	points      = 0;

	constructor(barSpan, pointsSPan, {totalQuestions, points4win = 100, points4lose = -50 }) {
		this.barSpan    = barSpan;
		this.pointsSpan = pointsSPan;
		this.points4win = points4win;
		this.points4lose = points4lose;
		this.maxPoints  = totalQuestions * this.points4win - totalQuestions * 5;
		setInterval(() => {
			if (this.timerOn)
				this.addPoints(-1);
		}, 100)
	}

	startTimer() {
		this.timerOn = true;
	}

	stopTimer() {
		this.timerOn = false;
	}

	addPoints(p) {
		if (p < 0 && this.points === 0)
			return;
		this.points += p;
		if (this.points < 0)
			this.points = 0;
		this.updateBar()
	}

	updateBar() {
		let perc                  = this.points / this.maxPoints;
		this.barSpan.style.width  = perc * 100 + "%";
		this.pointsSpan.innerHTML = this.points + "";
	}

	addPointsForWin() {
		this.addPoints(this.points4win);
	}

	addPointsForLose() {
		this.addPoints(this.points4lose)
	}

	getPoints() {
		return this.points;
	}
}


export default Scorekeeper