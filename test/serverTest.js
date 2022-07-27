const expect = require('chai').expect;
const request = require('request');

describe('Status and content', () => {
  describe('Testing GET', () => {
    it('status', done => {
      request('http://localhost:3050/Test', (_, response) => {
        expect(response.statusCode).to.equal(200)
        done()
      })
    })

    it('content', done => {
      request('http://localhost:3050/Test', (_, response) => {
        expect(JSON.parse(response.body).data).to.equal('Test passed')
        done()
      })
    })
  })
})