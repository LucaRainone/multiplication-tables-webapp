import "cypress-localstorage-commands"

describe('game page', () => {
	before(() => {
		cy.clearLocalStorageSnapshot();
	});

	it('should start the game with 2x questions', () => {
		cy.visit('/dist/index.html');
		cy.get('label.checkbox').not().eq(0).click({multiple:true});

	});


});
