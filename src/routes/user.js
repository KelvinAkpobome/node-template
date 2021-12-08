/**
 * This handles the user routes declaration in the application
 * @module ROUTES:USER
 */

const { NODE_ENV } = process.env;

const router = require('express').Router();

const { Logger } = require('../utilities/logger');
const UserService = require('../services/user/user');

const userService = new UserService();

try {
    router
        .post('/', async (request, response, next) => {
            request.payload = await userService.createUser({ request, next });
            next();
        })
        .post('/login', async (request, response, next) => {
            request.payload = await userService.loginUser({ request, response, next });
            next();
        })
} catch (e) {
    const currentRoute = '[Route Error] /user';
    if (verifyDevelopmentEnvironment) {
        console.log(`${currentRoute}: ${e.message}`);
    } else {
        Logger.error(`${currentRoute}: ${e.message}`);
    }
} finally {
    module.exports = router;
}
