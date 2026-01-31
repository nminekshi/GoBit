const request = require('supertest');
const app = require('../index');
const mongoose = require('mongoose');

describe('GET /', () => {
    it('should return 200 and welcome message', async () => {
        const res = await request(app).get('/');
        expect(res.statusCode).toBe(200);
        expect(res.text).toBe('Backend API is running and connected to MongoDB');
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });
});
