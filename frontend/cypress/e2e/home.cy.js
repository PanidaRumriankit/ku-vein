describe('Home Page', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/course', {
      fixture: 'courses.json'
    }).as('getCourses');

    cy.visit('/');
  });

  it('should display the header and main elements', () => {
    cy.get('h1').contains('KU Vein');
    cy.get('p').contains('รีวิว แบ่งปัน Q&A');
    cy.get('img[alt="Artery"]').should('be.visible');
  });

  it('should find the Search input', () => {
    cy.get('div.my-2')
      .find('input')
      .should('be.visible');
  });

  it('loads and selects course options', () => {
    cy.get('div.my-2')
      .find('input')
      .click({ force: true })
      .type('computer', { delay: 100 });

    cy.wait('@getCourses');

    cy.get('body')
      .find('div[role="option"]')
      .should('exist')
      .first()
      .click({ force: true });
  });
})