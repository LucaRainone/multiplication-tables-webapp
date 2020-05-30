import {getRandomHigher, getRandomLower, getRandomNumberExcept} from '../helpers/random.js';
import {shuffle} from '../helpers/array.js';
import sounds from '../ui/sounds.js';
import locale from '../locale/default.js'

function buildQuestion(numbers) {

	const proposals = buildProposals(numbers);
	let choices     = "";
	proposals.forEach(proposal => {
		choices += `<span class="choice" data-number="${proposal}">${proposal}</span>`;
	});
	return `
    <div class="question">
        ${locale.howMuchIs}<br>
        <span>${numbers[0]} x ${numbers[1]}</span> ?
    </div>
    <div class="choices">${choices}</div>
`;
}

function buildProposals(numbers) {
	const solution  = numbers[0] * numbers[1];
	const proposals = [
		solution, getRandomHigher(solution), getRandomLower(solution)
	];
	proposals.push(getRandomNumberExcept(proposals));
	shuffle(proposals);
	return proposals;
}

function askQuestion(container, numbers, callback) {
	container.innerHTML = buildQuestion(numbers);
	container.querySelectorAll('.choice').forEach(a => {
		function handlerClick(e) {
			e.preventDefault();
			e.stopPropagation();
			if (a.getAttribute('data-inactive')) {
				return;
			}
			const solution = numbers[0] * numbers[1];
			const win      = +this.getAttribute('data-number') === solution;
			if (win) {
				this.className += " is-clicked ";
				sounds.success();
			} else {
				sounds.error();
			}
			container.querySelectorAll('.choice').forEach(a => {
				a.className += " " + (+a.getAttribute('data-number') === solution ? "is-correct" : "is-wrong");
				a.setAttribute('data-inactive', '1');
			});

			callback(win);

		}

		a.addEventListener('click', handlerClick);
		a.addEventListener('touchstart', handlerClick);
	});
}

function start(container, multitables, questionShown, userClicked, finished) {
	questionShown();
	if (multitables.length === 0) {
		finished();
		return;
	}
	const numbers = multitables.pop();
	askQuestion(container, numbers, function (win) {
		if (!win) {
			multitables.unshift(numbers);
		}
		userClicked(win);
		setTimeout(() => {
			start(container, multitables, questionShown, userClicked, finished);
		}, 1500)
	});
}

export default {
	start
}
