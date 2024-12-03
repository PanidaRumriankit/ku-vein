describe('Profile page', () => {
  beforeEach(() => {
    // Mock the Next-Auth session
    cy.intercept('**/api/auth/session', (req) => {
      req.reply({
        status: 'authenticated',
        user: {
          email: 'test@ku.th',
          name: 'user_6'
        },
        email: 'test@ku.th',
        idToken: 'mock-id-token'
      })
    }).as('session');

    // Mock user data fetching
    cy.intercept('GET', '**/api/user?email=test%40ku.th*', (req) => {
      req.reply({
        statusCode: 200,
        body: {
          id: 9,
          username: 'user_6',
          desc: '',
          pf_color: '#ffffff',
          follower_count: 0,
          following_count: 0,
          following: [],
          follower: []
        }
      })
    }).as('userData');

    // Mock PUT request
    cy.intercept('PUT', '**/api/user', (req) => {
      req.reply({
        statusCode: 200,
      });
    }).as('updateProfile');

    // Wait for session and user data to load
    // cy.wait(['@session', '@userData']);

    // Visit the profile page
    cy.visit('/profile');
  });

  it('renders profile information correctly', () => {
    // Check username
    cy.contains('user_6').should('be.visible');
    cy.contains('@9').should('be.visible');

    // Check Following
    cy.get('[aria-describedby="popup-1"]')
      .contains('Following')
      .should('be.visible');
    
    // Check Following counts
    cy.get('[aria-describedby="popup-1"]')
      .contains('0')
      .should('be.visible');
    
    // Check Follower
    cy.get('[aria-describedby="popup-2"]')
      .contains('Follower')
      .should('be.visible');
    
    // Check Follower counts
    cy.get('[aria-describedby="popup-2"]')
      .contains('0')
      .should('be.visible');
  });

  it('opens color picker dialog', () => {
    // Hover over background and click color picker
    cy.get('[style*="background: rgb(255, 255, 255)"]')
      .trigger('mouseover')
      .find('svg[data-testid="BrushIcon"]')
      .click();

    // Verify color picker dialog is open
    cy.get('.MuiDialog-root').should('be.visible');
    cy.contains('Background Color').should('be.visible');
  });

  it('opens following popup', () => {
    // Open Following popup
    cy.get('[aria-describedby="popup-1"]')
      .contains('Following')
      .click();
  })

  it('opens follower popup', () => {
    // Open Follower popup
    cy.get('[aria-describedby="popup-2"]')
      .contains('Follower')
      .click();
  })

  it('edits profile information', () => {
    // Open edit profile dialog
    cy.contains('Edit Profile').click();

    // Verify edit dialog is open
    cy.contains('Edit Profile').should('be.visible');

    // Modify username
    cy.get('input[id=":r5:"]')
      .clear()
      .type('who');

    // Modify description
    cy.get('textarea[id=":r6:"]')
      .clear()
      .type('oh hi');

    // Save changes
    cy.contains('Save Changes').click();

    // Verify API call was made
    cy.wait('@updateProfile').its('request.body').should('include', {
      user_id: 9,
      user_name: 'who',
      description: 'oh hi',
      profile_color: '#ffffff',
    });
  });
});

