import "cypress-localstorage-commands"

const mainPath = '/dist/index.html'

describe('Settings page on reload', () => {
	beforeEach(()=> {
		cy.clearLocalStorageSnapshot();
	});

	it('should remember choice', ()=> {
		cy.visit(mainPath);
		cy.get('label.checkbox').eq(3).click();
		cy.get('button').click();
		cy.reload();
		cy.get('input[type="checkbox"]').eq(3).should('not.be.checked');
	});

	it('should not play without at least a label checked', ()=> {
		cy.visit(mainPath);
		cy.get('label.checkbox').click({multiple:true});
		cy.get('input[type="checkbox"]:checked').should('have.length', 0)
		cy.get('button').click();
		// the settings page should be still here
		cy.get('input[type="checkbox"]').its("length").should('be.eq', 9);
	});
})