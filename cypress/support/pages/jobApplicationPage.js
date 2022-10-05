import * as faker from 'faker';
import * as jobApplicationPageLocators from '../../support/locators/jobApplicationPageLocators';
import * as appHelper from '../../helper/app/appHelper';
import * as enumHelper from '../../helper/enumHelper';
import * as enums from '../../support/enums/enums';

var titleFromUrl = null;

export function enterFirstName(firstName) {
    if (typeof firstName == 'undefined')
        firstName = faker.name.firstName()
    cy.xpath(jobApplicationPageLocators.firstName).clear().type(firstName).should('have.value', firstName)
}

export function enterLastName(lastName) {
    if (typeof lastName == 'undefined')
        lastName = faker.name.lastName()
    cy.xpath(jobApplicationPageLocators.lastName).clear().type(lastName).should('have.value', lastName)
}

export function enterEmail(email) {
    if (typeof email == 'undefined')
        email = faker.internet.email()
    cy.xpath(jobApplicationPageLocators.email).clear().type(email).should('have.value', email)
}

export function enterPhoneNumber(phoneNumber) {
    if (typeof phoneNumber == 'undefined')
        phoneNumber = "(909) 453-8284"
    cy.xpath(jobApplicationPageLocators.phone).clear().type(phoneNumber).should('have.value', phoneNumber)
}

export function enterPassword(password) {
    if (typeof password == 'undefined')
        password = faker.internet.password(20, true, /[A-Za-z0-9_@./#&+-]/)
    cy.xpath(jobApplicationPageLocators.password).clear().type(password).should('have.value', password)
}

export function uploadDocument(document) {
    if (typeof document == 'undefined')
        document = 'fileUpload.doc'
    cy.xpath(jobApplicationPageLocators.fileUpload).attachFile(document);
}

export function selectOccupation(value) {
    if (typeof value == 'undefined')
        value = 'Physician'
    cy.xpath(jobApplicationPageLocators.occupationDropdown).clear().type(`${value}{downarrow}{enter}`);
}

export function selectSpecialty(value) {
    if (typeof value == 'undefined')
        value = 'Flight'
    cy.xpath(jobApplicationPageLocators.specialtyDropdown).clear().type(`${value}{downarrow}{enter}`);
}

export function selectState(value) {
    if (typeof value == 'undefined')
        value = 'Maryland'
    cy.xpath(jobApplicationPageLocators.stateDropdown).clear().type(`${value}{downarrow}{enter}`);
}

export function enterZipcode(zipcode) {
    if (typeof zipcode == 'undefined')
        zipcode = faker.address.zipCode()
    cy.xpath(jobApplicationPageLocators.zipcode).clear().type(zipcode).should('have.value', zipcode)
}

export function selectEmailOptIn(needToSelect) {
    if (typeof needToSelect == 'undefined')
        needToSelect = true
    cy.xpath(jobApplicationPageLocators.emailOptIn).invoke('val').then((value) => {
        if (value.toString() !== needToSelect.toString())
            cy.xpath(jobApplicationPageLocators.emailOptIn).click().should('have.value', needToSelect)
    })
}

export function clickApplyNow() {
    cy.xpath(jobApplicationPageLocators.applyNow).click({ force: true })
}


export function validateAlertMessage(field, message) {
    cy.xpath(field)
        .invoke('prop', 'validationMessage')
        .should('equal', message)
}

export function verifyButtonText(status) {
    cy.xpath(jobApplicationPageLocators.applyNow).invoke('text').should('have.value', status)
}


export function getJobPostTitleFromURL() {
    cy.url().then((url) => {
        let urlPath = new URL(url).pathname.split('/')
        titleFromUrl = (urlPath[urlPath.length - 1].match(/.+(?=-)/g)[0]).replaceAll("-", " ")
    })
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(titleFromUrl);
        }, 2000);
    })
}

export function getJobDescription() {
    let jobDetails;
    let jobDesc, jobTitle, jobLocation;
    cy.xpath("//div[@class='job-desc-container']/i[contains(@class,'stethoscope')]/following-sibling::text()[1]").invoke('text').as('jobTitle')
    cy.xpath("//div[@class='job-desc-container']/i[contains(@class,'map')]/following-sibling::text()").invoke('text').as('jobLocation')
    cy.xpath("//div[@class='job-desc-container']/div[contains(@class,'job-desc')]").invoke('text').as('jobDescription')
    cy.all(
        cy.get('@jobTitle').then((val) => { jobTitle = val.trim() }),
        cy.get('@jobLocation').then((val) => { jobLocation = val.trim() }),
        cy.get('@jobDescription').then((val) => { jobDesc = val.trim() })
    ).then(() => {
        jobDetails =
        {
            "jobTitle": jobTitle,
            "jobLocation": jobLocation,
            "jobDesc": jobDesc
        }
    })

    return new Promise(resolve => {
        setTimeout(() => {
            resolve(jobDetails);
        }, 2000);
    })
}

export function getExpectedJobSpecialtyLocation() {
    let jobPostTitle, jobExpectedSpecialtyLocation;
    getJobPostTitleFromURL()
        .then((title) => {
            jobPostTitle = title.split(' ')
            jobExpectedSpecialtyLocation = {
                "expectedJobSpecialty": jobPostTitle[0],
                "expectedJobLocation": jobPostTitle[jobPostTitle.length - 2]
            }
        })
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(jobExpectedSpecialtyLocation);
        }, 2000);
    })
}

export function verifyLogo() {
    cy.get(jobApplicationPageLocators.logo)
        .find('img')
        .should('have.attr', 'src')
        .should('include', 'logo-d80a84a7e943f342a9c8fff4c88b47912c41427d3cfaa8e474cefd19ac08c04a.webp')
}

export function verifyJobSpecialty() {
    let expectedJobTitle, expectedJobLocation

    getExpectedJobSpecialtyLocation().then((jobSpecialtyLocation) => {
        expectedJobTitle = jobSpecialtyLocation.expectedJobSpecialty
        expectedJobLocation = jobSpecialtyLocation.expectedJobLocation
    })


    getJobDescription().then((jobDetails) => {
        let jobSpecialty = enumHelper.getEnumByValue(enums.Specialty, expectedJobTitle);
        expect(jobDetails.jobTitle.toLowerCase()).to.equal(jobSpecialty.toLowerCase());
    })
}

export function verifyJobLocation() {
    let expectedJobTitle, expectedJobLocation

    getExpectedJobSpecialtyLocation().then((jobSpecialtyLocation) => {
        expectedJobTitle = jobSpecialtyLocation.expectedJobSpecialty
        expectedJobLocation = jobSpecialtyLocation.expectedJobLocation
    })

    getJobDescription().then((jobDetails) =>
        expect(jobDetails.jobLocation.split(',')[0].toLowerCase())
            .to.equal(expectedJobLocation.toLowerCase()))
}

export function verifyJobDescription() {
    let expectedJobTitle, expectedJobLocation

    getExpectedJobSpecialtyLocation().then((jobSpecialtyLocation) => {
        expectedJobTitle = jobSpecialtyLocation.expectedJobSpecialty
        expectedJobLocation = jobSpecialtyLocation.expectedJobLocation
    })

    getJobDescription().then((jobDetails) =>
        expect(jobDetails.jobDesc.toLowerCase())
            .to.equal(appHelper.jobDescription.format(expectedJobTitle, expectedJobLocation).toLowerCase()))
}

export function verifyFormSubmit(fields) {
    typeof fields.firstName == 'undefined' ? enterFirstName() : (fields.firstName[0] ? enterFirstName(fields.firstName[1]) : "");
    typeof fields.lastName == 'undefined' ? enterLastName() : (fields.lastName[0] ? enterLastName(fields.lastName[1]) : "");
    typeof fields.email == 'undefined' ? enterEmail() : (fields.email[0] ? enterEmail(fields.email[1]) : "");
    typeof fields.phone == 'undefined' ? enterPhoneNumber() : (fields.phone[0] ? enterPhoneNumber(fields.phone[1]) : "");
    typeof fields.password == 'undefined' ? enterPassword() : (fields.password[0] ? enterPassword(fields.password[1]) : "");
    typeof fields.fileUpload == 'undefined' ? uploadDocument() : (fields.fileUpload[0] ? uploadDocument(fields.fileUpload[1]) : "");
    typeof fields.occupation == 'undefined' ? selectOccupation() : (fields.occupation[0] ? selectOccupation(fields.occupation[1]) : "");
    typeof fields.specialty == 'undefined' ? selectSpecialty() : (fields.specialty[0] ? selectSpecialty(fields.specialty[1]) : "");
    typeof fields.state == 'undefined' ? selectState() : (fields.state[0] ? selectState(fields.state[1]) : "");

    typeof fields.zipcode == 'undefined' ? enterZipcode() : (fields.zipcode[0] ? enterZipcode(fields.zipcode[1]) : "");
    typeof fields.emailOptIn == 'undefined' ? selectEmailOptIn() : (fields.emailOptIn[0] ? selectEmailOptIn(fields.emailOptIn[1]) : "");
    typeof fields.submit == 'undefined' ? clickApplyNow() : (fields.submit[0] ? clickApplyNow(fields.submit[1]) : "");
}


export function verifyAlertMessage(fields) {
    let alertShown = false
    let i = 0
    while (!alertShown && i < 20) {
        typeof fields.firstName == 'undefined' ? "" : (fields.firstName[0] ? "" : () => {
            validateAlertMessage(jobApplicationPageLocators.firstName, fields.firstName[2])
            alertShown = true;
        });
        typeof fields.lastName == 'undefined' ? "" : (fields.lastName[0] ? "" : () => {
            validateAlertMessage(jobApplicationPageLocators.lastName, fields.lastName[2])
            alertShown = true;
        });
        typeof fields.email == 'undefined' ? "" : (fields.email[0] ? "" : () => {
            validateAlertMessage(jobApplicationPageLocators.email, fields.email[2])
            alertShown = true;
        });
        typeof fields.phone == 'undefined' ? "" : (fields.phone[0] ? "" : () => {
            validateAlertMessage(jobApplicationPageLocators.phone, fields.phone[2])
            alertShown = true;
        });
        typeof fields.password == 'undefined' ? "" : (fields.password[0] ? "" : () => {
            validateAlertMessage(jobApplicationPageLocators.password, fields.password[2])
            alertShown = true;
        });
        typeof fields.fileUpload == 'undefined' ? "" : (fields.fileUpload[0] ? "" : () => {
            validateAlertMessage(jobApplicationPageLocators.fileUpload, fields.fileUpload[2])
            alertShown = true;
        });
        typeof fields.zipcode == 'undefined' ? "" : (fields.zipcode[0] ? "" : () => {
            validateAlertMessage(jobApplicationPageLocators.zipcode, fields.zipcode[2])
            alertShown = true;
        });
        typeof fields.emailOptIn == 'undefined' ? "" : (fields.emailOptIn[0] ? "" : () => {
            validateAlertMessage(jobApplicationPageLocators.emailOptIn, fields.emailOptIn[2])
            alertShown = true;
        });
        ++i
    }
}

