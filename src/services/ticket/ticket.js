/**
 *
 * This handles the business logic for the ticket Model
 * @module SERVICE:TICKET
 */

 const RootService = require('../_root');
 const { createTicketSchema } = require('../../validators');
 
/**
 *
 * This is the integration of the ticket model routes with the ticket model controller bridging by holding core business logic.
 * @class
 */
class TicketService extends RootService {
    constructor() {
        super();
        this.ticketController = TicketController;
        this.serviceName = 'TicketService';
    }

    /**
     *
     * @typedef RequestFunctionParameter
     * @property {object} request Express Request parameter
     * @property {function} next Express NextFunction parameter
     */

    /**
     *
     * This method is an implementation to handle the business logic of Creating and saving new records into the database.
     * This should be used alongside a POST Request alone.
     * @async
     * @method
     * @param {RequestFunctionParameter} {@link RequestFunctionParameter}
     * @returns {object<processSingleRead|processedError>}
     * 
     * 
     */
    async createTicket({ request, next }) {
        try {
        const { body } = request;


        const { error } = createTicketSchema.validate(body);
        if (error) throw new CustomValidationError(this.filterJOIValidation(error.message));

        let foundTickets = await this.ticketController.readRecords({
            conditions: { ownerEmail: request.user.email }, fieldsToReturn: 'isFixed ownerEmail id'
        });

        if(foundTickets.length >= 4) throw new Error('You cannot create more than 4 tickets')

        const ticket = {...body}
        ticket.ownerEmail = request.user.email

        const result = await this.ticketController.createRecord({ ...ticket });
        if (result && result.failed) throw new CustomControllerError(result.error);
        return this.processSingleRead(result);
        }catch(e) {
            let processedError = this.formatError({
            service: this.serviceName,
            error: e,
            functionName: 'createTicket',
            });
            return next(processedError);
        }
    }

    /**
     * This method is an implementation to handle the business logic of updating the ticket records from the database.
     * This should be used alongside a GET Request alone.
     * @async
     * @method
     * @param {RequestFunctionParameter} {@link RequestFunctionParameter}
     * @returns {object<processSingleRead|processedError>}
     */
    async updateTicket({ request, response, next }) {
        try {

        const { params, body} = request;
        if( !params.id ) throw new CustomValidationError('Please supply ticket id')
        
        let foundItem = await this.ticketController.readRecords({
            conditions: { id: params.id }, fieldsToReturn: 'isFixed ownerEmail id'
        });

        foundItem = foundItem[0]
        if(!foundItem) throw new CustomValidationError(`This device with id ${params.id} is not registered with us`)
        if (foundItem && foundItem.failed) throw new CustomControllerError(foundItem.error);

        if(foundItem && foundItem.isFixed)throw new CustomValidationError(`Device with id ${params.id} already fixed`)
        
        const result = await this.ticketController.updateRecords({
            conditions: { id: params.id}, 
            data: {
                isFixed: body.isFixed,
                updatedOn: new Date()
            }
        });
        if (result && result.failed) throw new CustomControllerError(result.error);

        return this.processUpdateResult({result});
        }catch(e){
            let processedError = this.formatError({
            service: this.serviceName,
            error: e,
            functionName: 'updateTicket',
            });
            return next(processedError);
        }
    }

    /**
     * This method is an implementation to handle the business logic of Reading existing tickets from the database.
     * This should be used alongside a GET Request alone.
     * @async
     * @method
     * @param {RequestFunctionParameter} {@link RequestFunctionParameter}
     * @returns {object<processSingleRead|processedError>}
     */
    async checkTicket({ request, response, next }) {
    try {
        const { params } = request;
        if( !params.id) throw new CustomValidationError('Please supply ticket id')

        let foundTickets = await this.ticketController.readRecords({
            conditions: {  id: params.id, ownerEmail: request.user.email  }, fieldsToReturn: 'isFixed id'
        });

        if(foundTickets.length === 0) throw new Error(`You did not register a device with id ${params.id} with us`)
        if(foundTickets[0] && !foundTickets[0].isFixed) throw new Error(`Device with id ${params.id} is not fixed, please wait awhile`)

        return this.processSingleRead(foundTickets[0]);
    }catch (e) {
            let processedError = this.formatError({
            service: this.serviceName,
            error: e,
            functionName: 'checkTicket',
            });
        return next(processedError);
    }
    }

    /**
      * This method is an implementation to handle the business logic of Reading user tickets from the database.
      * This should be used alongside a GET Request alone.
      * @async
      * @method
      * @param {RequestFunctionParameter} {@link RequestFunctionParameter}
      * @returns {object<processSingleRead|processedError>}
      */
    async checkUserTickets({ request, response, next }) {
        try {
            const { body } = request;
            if( !body.email)  throw new CustomValidationError('Please supply user email')
        
            let foundTickets = await this.ticketController.readRecords({
                conditions: {  ownerEmail: body.email }, fieldsToReturn: 'isFixed id'
            });
            console.log(foundTickets);
            if(foundTickets.length === 0) throw new Error('User has not registered any device with us')
            return this.processMultipleReadResults(foundTickets);
        }catch (e) {
            let processedError = this.formatError({
                service: this.serviceName,
                error: e,
                functionName: 'checkUserTickets',
            });
            return next(processedError);
        }
    }
    async checkUserTickets({ request, response, next }) {
        try {
            const { body } = request;
            if( !body.email)  throw new CustomValidationError('Please supply user email')
        
            let foundTickets = await this.ticketController.readRecords({
                conditions: {  ownerEmail: body.email }, fieldsToReturn: 'isFixed id'
            });
            console.log(foundTickets);
            if(foundTickets.length === 0) throw new Error('User has not registered any device with us')
            return this.processMultipleReadResults(foundTickets);
        }catch (e) {
            let processedError = this.formatError({
                service: this.serviceName,
                error: e,
                functionName: 'checkUserTickets',
            });
            return next(processedError);
        }
    }    async checkUserTickets({ request, response, next }) {
        try {
            const { body } = request;
            if( !body.email)  throw new CustomValidationError('Please supply user email')
        
            let foundTickets = await this.ticketController.readRecords({
                conditions: {  ownerEmail: body.email }, fieldsToReturn: 'isFixed id'
            });
            console.log(foundTickets);
            if(foundTickets.length === 0) throw new Error('User has not registered any device with us')
            return this.processMultipleReadResults(foundTickets);
        }catch (e) {
            let processedError = this.formatError({
                service: this.serviceName,
                error: e,
                functionName: 'checkUserTickets',
            });
            return next(processedError);
        }
    }}
 
 module.exports = TicketService;
