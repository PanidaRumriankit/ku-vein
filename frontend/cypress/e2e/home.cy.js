describe('Home Page', () => {
  beforeEach(() => {
    // GET courses
    cy.intercept('GET', '**/api/course', {
      fixture: 'courses.json'
    }).as('getCourses');

    // GET latest reviews
    cy.intercept('GET', '**/api/review?sort=latest**', {
      fixture: 'reviews_latest.json'
    }).as('getReviewsLatest');

    // GET earliest reviews
    cy.intercept('GET', '**/api/review?sort=earliest**', {
      fixture: 'reviews_earliest.json'
    }).as('getReviewsEarliest');

    // GET upvoted Reviews
    cy.intercept('GET', '**/api/review?sort=upvote**', {
      fixture: 'reviews_upvote.json'
    }).as('getReviewsUpvote');

    // POST upvote
    cy.intercept('POST', '**/api/upvote*', {
      statusCode: 200,
      body: { success: true }
    }).as('upvoteReview');

    // GET upvote
    cy.intercept('GET', '**/api/upvote*', {
      statusCode: 200,
      body: { voted: false }
    }).as('checkUpvote');

    cy.visit('/');
  });

  // Check main elements
  it('should display the header and main elements', () => {
    cy.get('h1').contains('KU Vein');
    cy.get('p').contains('รีวิว แบ่งปัน Q&A');
    cy.get('img[alt="Artery"]').should('be.visible');
  });

  // Check if the sorting dropdown is visible
  it('renders the sorting dropdown', () => {
    cy.get('button')
      .contains('latest')
      .should('be.visible');
  });

  // Check if the review cards contain correct information
  it('renders review cards with correct information', () => {
    cy.wait('@getReviewsLatest');

    cy.get('fieldset').each(($card, index) => {
      cy.wrap($card)
        .find('legend')
        .should('contain', ['01200432-00 | Rolling Stock Technology', '01200101-64 | Innovative Thinking'][index]);

      cy.wrap($card)
        .find('[class*="MuiRating"]')
        .should('exist');

      cy.wrap($card)
        .contains('p', ['A', 'Yes I like itttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttt'][index])
        .should('be.visible');

      cy.wrap($card)
        .contains('p', ['ผู้สอน: A', 'ผู้สอน: Kasidet'][index])
        .should('be.visible');

      cy.wrap($card)
        .contains('p', ['เกรด: C', 'เกรด: A'][index])
        .should('be.visible');

      cy.wrap($card)
      .contains('p', ['26 พ.ย. 2567 โดย: user_2', '26 พ.ย. 2567 โดย: user_0'][index])
      .should('be.visible');

      cy.wrap($card)
        .find('button')
        .contains((['0', '10'][index]))
        .should('be.visible');
    });
  });

  // Check if earliest sorting works
  it('checks earliest sorting affects review order', () => {
    
    cy.get('button')
      .contains('latest')
      .click();
    
    // Open sorting dropdown
    cy.get('button')
      .contains('latest')
      .click();

    // Select earliest sorting option
    cy.get('[role="dialog"]')
      .find('[role="menuitemradio"]')
      .contains('earliest')
      .click();
    
    // Wait for reviews to load
    cy.wait('@getReviewsEarliest');

    // Check if reviews are in correct order
    cy.get('fieldset').then(($cards) => {
      const reversedCards = Cypress.$.makeArray($cards).reverse();

      Cypress._.each(reversedCards, ($card, index) => {
      cy.wrap($card)
        .find('legend')
        .should('contain', ['01200432-00 | Rolling Stock Technology', '01200101-64 | Innovative Thinking'][index]);

      cy.wrap($card)
        .find('[class*="MuiRating"]')
        .should('exist');

      cy.wrap($card)
        .contains('p', ['A', 'Yes I like itttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttt'][index])
        .should('be.visible');

      cy.wrap($card)
        .contains('p', ['ผู้สอน: A', 'ผู้สอน: Kasidet'][index])
        .should('be.visible');

      cy.wrap($card)
        .contains('p', ['เกรด: C', 'เกรด: A'][index])
        .should('be.visible');

      cy.wrap($card)
      .contains('p', ['26 พ.ย. 2567 โดย: user_2', '26 พ.ย. 2567 โดย: user_0'][index])
      .should('be.visible');

      cy.wrap($card)
        .find('button')
        .contains((['0', '10'][index]))
        .should('be.visible');
      });
    });
  });

  // Check upvote reviews sorting
  it('checks upvote sorting affects review order', () => {
    cy.get('button')
      .contains('latest')
      .click();
    
    // Open sorting dropdown
    cy.get('button')
      .contains('latest')
      .click();

    // Select upvote sorting option
    cy.get('[role="dialog"]')
      .find('[role="menuitemradio"]')
      .contains('upvote')
      .click();
    
    // Wait for reviews to load
    cy.wait('@getReviewsUpvote');

    // Check if reviews are in correct order
    cy.get('fieldset').then(($cards) => {
      const reversedCards = Cypress.$.makeArray($cards).reverse();

      Cypress._.each(reversedCards, ($card, index) => {
      cy.wrap($card)
        .find('legend')
        .should('contain', ['01200432-00 | Rolling Stock Technology', '01200101-64 | Innovative Thinking'][index]);

      cy.wrap($card)
        .find('[class*="MuiRating"]')
        .should('exist');

      cy.wrap($card)
        .contains('p', ['A', 'Yes I like itttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttt'][index])
        .should('be.visible');

      cy.wrap($card)
        .contains('p', ['ผู้สอน: A', 'ผู้สอน: Kasidet'][index])
        .should('be.visible');

      cy.wrap($card)
        .contains('p', ['เกรด: C', 'เกรด: A'][index])
        .should('be.visible');

      cy.wrap($card)
      .contains('p', ['26 พ.ย. 2567 โดย: user_2', '26 พ.ย. 2567 โดย: user_0'][index])
      .should('be.visible');

      cy.wrap($card)
        .find('button')
        .contains((['0', '10'][index]))
        .should('be.visible');
      });
    });
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