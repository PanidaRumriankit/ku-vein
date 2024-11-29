describe('Profile oage', () => {
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
    cy.intercept('GET', '**/api/user?email=test@ku.th*', (req) => {
      req.reply({
        statusCode: 200,
        body: {
          id: 9,
          username: 'user_6',
          desc: 'Test Description',
          pf_color: '#4ECDC4',
          follower_count: 1,
          following_count: 1,
          following: [
            { username: 'FollowedUser1', desc: 'First followed user' }
          ],
          follower: [
            { username: 'FollowerUser1', desc: 'First follower' }
          ]
        }
      })
    }).as('userData');
  });
});

