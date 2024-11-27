describe('Layout component', () => {
  beforeEach(() => {
    // Mock the Next-Auth session
    cy.intercept('**/api/auth/session', (req) => {
      req.reply({
        status: 'authenticated',
        user: {
          email: 'test@ku.ac.th',
          name: 'Test User'
        }
      })
    }).as('session');

    cy.visit('/')
  })

  // Check correct authenticated
  it('can login', () => {
    cy.wait('@session')
      .its('response.body.user.email')
      .should('equal', 'test@ku.ac.th');
  })

  it('renders correctly when authenticated', () => {
    // Wait for session and user creation
    cy.wait('@session')

    // Check for key authenticated elements
    cy.contains('KU Vein').should('be.visible')
    cy.get('[data-testid="PersonIcon"]').should('exist')
    cy.contains('© 2024 KU Vein. All rights reserved').should('be.visible')
  })
})