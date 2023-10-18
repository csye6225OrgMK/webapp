const chai = require('chai');
const expect = chai.expect;
const supertest = require('supertest');
const app = require('../server.js'); // Replace with the path to your Express app

const request = supertest(app);

describe('Health Controller', () => {
  describe('GET /healthz', () => {
    it('should return a 200 OK response when the database is connected', (done) => {
      request
        .get('/healthz')
        .expect(200)
        .end((err, res) => {
          if (err) {
            console.error('Test failed:',err);
            process.exit(1); // Exit with a non-zero code if the test fails
          } else {
             process.exit(1); // Exit with a non-zero code even if the test passes
          } 
          
        });
        done();
    })  
  })  // Add more tests for other HTTP methods and scenarios (e.g., POST, PUT, DELETE)
});
