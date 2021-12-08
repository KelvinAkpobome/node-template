/**
 * This handles the Sample routes declaration in the application
 * @module ROUTES:Sample
 */

const { NODE_ENV } = process.env;

const router = require('express').Router();

const { Logger } = require('../utilities/logger');
const TicketService = require('../services/ticket/ticket');
const {  verifyUser, checkIfTech, checkIfClient } = require('../middlewares/validate');

const ticketService = new TicketService();

try {
    router
        .post('/', verifyUser, checkIfClient, async (request, response, next) => {
            request.payload = await ticketService.createTicket({ request, next });
            next();
        })
        .put('/:id', verifyUser, checkIfTech, async (request, response, next) => {
            request.payload = await ticketService.updateTicket({ request, response, next });
            next();
        })
        .get('/:id', verifyUser, async (request, response, next) => {
            request.payload = await ticketService.checkTicket({ request, response, next });
            next();
        })
        .get('/all', verifyUser, async (request, response, next) => {
            request.payload = await ticketService.checkUserTickets({ request, response, next });
            next();
        })
} catch (e) {
    const currentRoute = '[Route Error] /item';
    if (verifyDevelopmentEnvironment) {
        console.log(`${currentRoute}: ${e.message}`);
    } else {
        Logger.error(`${currentRoute}: ${e.message}`);
    }
} finally {
    module.exports = router;
}
