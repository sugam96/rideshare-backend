const expect = require('chai').expect;
const request = require('request');
const testURL = 'http://localhost:3050/user'

describe('Tesing User Services', () => {
    describe('Creating User', () => {
        describe('Validations Check', () => {
            describe('Missing field', () => {
                const payload = {
                    user_id: "Sugam",
                    first_name: "", //Missing Field
                    last_name: "Sharma",
                    date_of_birth: "1996-06-21",
                    gender: "Male",
                    contact_number: 123546,
                    email_id: "bbbcde@12345",
                    password: "Bello123"
                }

                it('Status', done => {
                    request.post(testURL, {
                        json: payload
                    }, (_, response) => {
                        expect(response.statusCode).to.equal(400)
                        done()
                    })
                })

                it('Message', done => {
                    request.post(testURL, {
                        json: payload
                    }, (_, response) => {
                        expect(response.body.errors.firstName[0]).to.equal('First Name is required')
                        done()
                    })
                })
            })

            describe('Invalid email', () => {
                const payload = {
                    user_id: "Sugam",
                    first_name: "Sugam",
                    last_name: "Sharma",
                    date_of_birth: "1996-06-21",
                    gender: "Male",
                    contact_number: 123546,
                    email_id: "",
                    password: "Bello123"
                }

                it('Status', done => {
                    request.post(testURL, {
                        json: payload
                    }, (_, response) => {
                        expect(response.statusCode).to.equal(400)
                        done()
                    })
                })

                it('Message', done => {
                    request.post(testURL, {
                        json: payload
                    }, (_, response) => {
                        expect(response.body.errors.email[0]).to.equal('Email is invalid')
                        done()
                    })
                })
            })

            describe('Duplicate Email', () => {
                const payload = {
                    user_id: "Sugam",
                    first_name: "Sugam",
                    last_name: "Sharma",
                    date_of_birth: "1996-06-21",
                    gender: "Male",
                    contact_number: 123546,
                    email_id: "bbbcde@12345",
                    password: "Bello123"
                }

                it('Status', done => {
                    request.post(testURL, {
                        json: payload
                    }, (_, response) => {
                        expect(response.statusCode).to.equal(400)
                        done()
                    })
                })

                it('Message', done => {
                    request.post(testURL, {
                        json: payload
                    }, (_, response) => {
                        expect(response.body.errors.duplicate[0]).to.equal('Email id already Registered')
                        done()
                    })
                })
            })
        })

        it('Pass Case', done => {
            request.post(testURL, {
                json: {
                    user_id: "Sugam",
                    first_name: "Sugam",
                    last_name: "Sharma",
                    date_of_birth: "1996-06-21",
                    gender: "Male",
                    contact_number: 123546,
                    email_id: "bbbcde@12345",
                    password: "Bello123"
                }
            }, (_, response) => {
                expect(response.statusCode).to.equal(200)
                done()
            })
        })
    })
})