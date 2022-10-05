import * as jobApplicationPage from '../../support/pages/jobApplicationPage';


describe('Verify the job application page', () => {
  const pagesConfig = Cypress.config('pages');

  beforeEach(() => {
    // cy.visit(`${Cypress.config('baseUrl')}${pagesConfig.jobs.gastroenterologist}`)
  })

  it('Verify the page logo', () => {
    jobApplicationPage.verifyLogo();
  })

  it('Verify the Job Specialty', () => {
    jobApplicationPage.verifyJobSpecialty()
  })

  it('Verify the Job Location', () => {
    jobApplicationPage.verifyJobLocation()
  })

  it('Verify the Job Description', () => {
    jobApplicationPage.verifyJobDescription()
  })

  it('Verify the Form Submit alert without Last Name ', () => {
    let fields = {
      "lastName": [false, '', 'Please fill in this field.']
    }
    jobApplicationPage.verifyFormSubmit(fields)
    jobApplicationPage.verifyAlertMessage(fields)
  })

  it('Verify the Form Submit alert without FirstName ', () => {
    let fields = {
      "firstName": [false, '', 'Please fill in this field.']
    }
    jobApplicationPage.verifyFormSubmit(fields)
    jobApplicationPage.verifyAlertMessage(fields)
  })



  it('Verify the Form Submit alert without File Upload', () => {
    let fields = {
      "fileUpload": [false, '', '']
    }
    jobApplicationPage.verifyFormSubmit(fields)
    jobApplicationPage.verifyAlertMessage(fields)
  })

  it('Verify the Form Submit alert with invalid Email', () => {
    let fields = {
      "email": [true, 'tester001', "Please include an '@' in the email address. 'tester001@' is missing an '@'."]
    }
    jobApplicationPage.verifyFormSubmit(fields)
    jobApplicationPage.verifyAlertMessage(fields)
  })


  it('Verify the Form Submit alert with invalid Email', () => {
    let fields = {
      "email": [true, 'tester001@', "Please enter a part following '@'. 'tester001@' is incomplete."]
    }
    jobApplicationPage.verifyFormSubmit(fields)
    jobApplicationPage.verifyAlertMessage(fields)
  })

  it('Verify the Form Submit without Email Opt in checkbox', () => {
    let fields = {
      "emailOptIn": [false, 'tester001@', "Please enter a part following '@'. 'tester001@' is incomplete."]
    }
    jobApplicationPage.verifyFormSubmit(fields)
    jobApplicationPage.verifyAlertMessage(fields)
  })

  it('Verify the Form Submit without Email Opt in checkbox', () => {
    let fields = {
      "occupation": [true, 'NurseMidWife', ""]
    }
    jobApplicationPage.verifyFormSubmit(fields)
    jobApplicationPage.verifyAlertMessage(fields)
  })

  it('Verify the Form Submit without Email Opt in checkbox', () => {
    let fields = {
      "occupation": [false, 'NurseMidWife', ""]
    }
    jobApplicationPage.verifyFormSubmit(fields)
    jobApplicationPage.verifyAlertMessage(fields)
  })

})


