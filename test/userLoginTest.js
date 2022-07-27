const expect = require('chai').expect;
const request = require('request');
const testURL = 'http://localhost:3050/userlogin'

describe('Tesing User Services', () => {
    describe('Logging In User', () => {
        describe('Validations Check', () => {
            describe('Missing field', () => {
                const payload = {
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
                        expect(response.body.errors.message[0]).to.equal('Email Required')
                        done()
                    })
                })
            })

            describe('Invalid Email', () => {
                const payload = {
                    email_id: "abcde@123.com",
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
                        expect(response.body.message).to.equal('Account Does Not Exist')
                        done()
                    })
                })
            })

            describe('Missing Password', () => {
                const payload = {
                    email_id: "bbbcde@12345",
                    password: ""
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
                        expect(response.body.errors.message[0]).to.equal('Password Required')
                        done()
                    })
                })
            })

            describe('Invalid Password', () => {
                const payload = {
                    email_id: "abcde@123.com",
                    password: "aaaaaaaaaa"
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
                        expect(response.body.errors.message[0]).to.equal('Incorrect Password')
                        done()
                    })
                })
            })
        })

        it('Pass Case', done => {
            request.post(testURL, {
                json: {
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