describe('Profile oage', () => {
  const testEmail = 'test@ku.th';
  const idToken = 'mock-id-token'; 

  beforeEach(() => {
    // Mock the Next-Auth session
    cy.intercept('**/api/auth/session', (req) => {
      req.reply({
        status: 'authenticated',
        user: {
          email: testEmail,
          name: 'user_6',
        },
        email: 'test@ku.th',
        idToken: 'mock-id-token'
      })
    }).as('session');

    // Mock create user
    cy.intercept('POST', '**/api/user', (req) => {
      req.reply({
        email: testEmail,
      })
    }).as('createUser');

    // Mock user data fetching
    cy.intercept('GET', '**/api/user*', (req) => {
      req.reply({
        statusCode: 200,
        body: {
          "id": 4,
          "username": "Ori",
          "desc": "death smell",
          "pf_color": "#e62424",
          "following": [
            {
              "username": "user_3",
              "desc": ""
            }
          ],
          "follower": [
            {
              "username": "user_3",
              "desc": ""
            }
          ],
          "follower_count": 1,
          "following_count": 1
        }
      })
    }).as('userData');

    // Mock follow API
    cy.intercept('POST', '**/api/follow', (req) => {
      req.reply({ 
        statusCode: 200,
        headers: {
          "Authorization": `Bearer ${idToken}`,
          'Content-Type': 'application/json',
          "email": testEmail,
        }, 
        body: JSON.stringify({
          current_user_id: "9",
          target_user_id: "4",
        }),
      })
    }).as('followUser');

    // Visit user 4 profile page
    cy.visit('/user/4')
  });

  it('loads user profile correctly', () => {
    // Check profile details
    cy.contains('Ori').should('be.visible')
    cy.contains('@4').should('be.visible')
    cy.contains('death smell').should('be.visible')
  })

  it('displays follower and following counts', () => {
    // Check Following
    cy.get('[aria-describedby="popup-1"]')
      .contains('Following')
      .should('be.visible');
    
    // Check Following counts
    cy.get('[aria-describedby="popup-1"]')
      .contains('1')
      .should('be.visible');

    // Check Follower
    cy.get('[aria-describedby="popup-2"]')
      .contains('Follower')
      .should('be.visible');
    
    // Check Follower counts
    cy.get('[aria-describedby="popup-2"]')
      .contains('1')
      .should('be.visible');
  })

  it('opens following popup', () => {
    // Open Following popup
    cy.get('[aria-describedby="popup-1"]')
      .contains('Following')
      .click();
    cy.contains('user_3').should('be.visible');
  })

  it('opens follower popup', () => {
    // Open Follower popup
    cy.get('[aria-describedby="popup-2"]')
      .contains('Follower')
      .click();
    cy.contains('user_3').should('be.visible');
  })

  it('logs the session email', () => {
    cy.wait('@session').then((interception) => {
      const sessionEmail = interception.response.body.email;
      cy.log('Session Email:', sessionEmail);
      expect(sessionEmail).to.equal(testEmail); // Ensure the mocked email matches
    });
  });

  it('allows following/unfollowing user', () => {
    cy.wait('@session');
    cy.wait('@createUser');
    cy.visit('/user/6');
    // Click Follow button
    cy.get('button').contains('Follow').click()

    // Verify API call and button state change
    cy.wait('@followUser')
    cy.contains('Unfollow').should('be.visible')

    // Click Unfollow
    cy.contains('Unfollow').click()
    cy.wait('@followUser')
    cy.get('button').contains('Follow').should('be.visible')
  })
});

