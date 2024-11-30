describe('Layout component', () => {
  beforeEach(() => {
    // Mock the Next-Auth session
    cy.intercept('**/api/auth/session', (req) => {
      req.reply({
        status: 'authenticated',
        user: {
          email: 'test@ku.th',
          name: 'Test User'
        },
        email: 'test@ku.th',
        idToken: 'mock-id-token'
      })
    }).as('session');

    // GET courses
    cy.intercept('GET', '**/api/course', {
      fixture: 'courses.json'
    }).as('getCourses');

    // Mock the review submission API
    cy.intercept('POST', '**/api/review', (req) => {
      req.reply({ 
        statusCode: 200, 
        body: { message: 'Review added successfully' } 
      })
    }).as('submitReview')

    cy.visit('/')
  })

  // Check correct authenticated
  it('can login', () => {
    cy.wait('@session')
      .its('response.body.user.email')
      .should('equal', 'test@ku.th');
  })

  it('renders correctly when authenticated', () => {
    // Check for key authenticated elements
    cy.contains('KU Vein').should('be.visible')
    cy.get('[data-testid="PersonIcon"]').should('exist')
    cy.contains('© 2024 KU Vein. All rights reserved').should('be.visible')
  })

  it('authenticated users cannot add reviews if data is not filled', () => {
    // Check for AddIcon and click it
    cy.get('svg[data-testid="AddIcon"]').should('exist');
    cy.get('svg[data-testid="AddIcon"]').click();
    // Check if submit button is disabled
    cy.contains('Submit').should('be.disabled');
  })

  it('allows selecting course and faculty', () => {
    // Open review popup
    cy.get('button')
      .find('svg[data-testid="AddIcon"]')
      .parent()
      .click();

    // Mock search components
    cy.get('[id="react-select-3-input"]').type('01200101-64', {delay: 500});
    cy.wait('@getCourses');
    cy.get('body')
      .find('div[role="option"]')
      .first()
      .click({ force: true });
    
    // Mock faculty selection
    cy.get('[id="react-select-4-input"]').type('คณะวิศวกรรมศาสตร์', {delay: 500});
    cy.get('body')
      .find('div[role="option"]')
      .first()
      .click({ force: true });

    // Review text
    cy.get('textarea[placeholder="ความคิดเห็นต่อรายวิชา"]').type('This is a test review')

    // Select rating
    cy.contains('ความพึงพอใจ').parent().find('svg[data-testid="StarIcon"]').eq(3).click({ force: true });

    // Select effort level
    cy.contains('ความยาก').parent().contains('4').click({ force: true });
    cy.contains('ยาก').should('be.visible');

    // Attendance
    cy.contains('การเช็คชื่อ').parent().contains('3').click()
    
    // Class type
    cy.contains('เรียนแบบ').parent().contains('Onsite').click();
    
    // Scoring criteria
    cy.contains('เกณฑ์').parent().contains('Balance').click();
    
    // Grade
    cy.contains('เกรดที่ได้').parent().contains('B+').click();
    
    // Instructor
    cy.get('input[placeholder="อาจารย์"]').type('Test Instructor');
    
    // Academic year
    cy.get('input[placeholder="พ.ศ."]').clear().type('2567');
    
    // Submit review
    cy.contains('Submit').click({ delay: 1000 });

    // Verify API call and success
    cy.wait('@submitReview').its('response.statusCode').should('eq', 200);
  })
})