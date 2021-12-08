/**
 *
 * This handles the business logic for the user Model
 * @module SERVICE:USER
 */

const RootService = require('../_root');
const { buildQuery, buildWildcardOptions } = require('../../utilities/query');
const { createUserSchema } = require('../../validators');
const { hashObject, verifyObject, generateToken, verifyToken } = require('../../utilities/encryption')
/**
 *
 * This is the integration of the Sample model routes with the Sample model controller bridging by holding core business logic.
 * @class
 */
class UserService extends RootService {
    constructor() {
        super();
        this.userController = UserController;
        this.serviceName = 'UserService';
    }

    /**
     *
     * @typedef RequestFunctionParameter
     * @property {object} request Express Request parameter
     * @property {function} next Express NextFunction parameter
     */

    /**
     *
     * This method is an implementation to handle the business logic of Creating and saving new users into the database.
     * This should be used alongside a POST Request alone.
     * @async
     * @method
     * @param {RequestFunctionParameter} {@link RequestFunctionParameter}
     * @returns {object<processSingleRead|processedError>}
     */
    async createUser({ request, next }) {
        try {
            const { body } = request;

            const { error } = createUserSchema.validate(body);

            if (error) throw new CustomValidationError(this.filterJOIValidation(error.message));

            
            const userDetails = {fullName: `${body.firstName} ${body.lastName}`,
                ...body}
            const hashPassword = await hashObject(body.password)
            userDetails.password = hashPassword
            const result = await this.userController.createRecord({...userDetails});
            if (result && result.failed) throw new CustomControllerError(result.error);

            return this.processSingleRead(result);
        }catch (e) {
                let processedError = this.formatError({
                    service: this.serviceName,
                    error: e,
                    functionName: 'createUser',
                });
            return next(processedError);
        }
    }

    /**
     *
     * @typedef RequestFunctionParameter
     * @property {object} request Express Request parameter
     * @property {function} next Express NextFunction parameter
     */

    /**
     *
     * This method is an implementation to handle the business logic for logging in user into the system.
     * This should be used alongside a POST Request alone.
     * @async
     * @method
     * @param {RequestFunctionParameter} {@link RequestFunctionParameter}
     * @returns {object<processSingleRead|processedError>}
     */
     async loginUser({ request, response, next }) {
        try {
            const { body } = request;
            if( !body.email || !body.password)  throw new CustomValidationError('Please supply login details')

            let existingUser = await this.userController.readRecords({conditions: {email: body.email}, fieldsToReturn: 'fullName password email id role'})
            existingUser = existingUser[0]

            if(!existingUser) throw new CustomValidationError('User does not exist')
        

            const hashPassword = await verifyObject({sentObject: body.password, accurateObject: existingUser.password})
        
            if(!hashPassword) throw new CustomValidationError('Password incorrect')
          
            const payload = {
                email: body.email,
                fullName: existingUser.fullName,
                id: existingUser.id,
                role: existingUser.role,
            }
            const token = await generateToken({payload})
            existingUser.token = token
            response.setHeader('x-auth-token', token); 
            return this.processSingleRead(existingUser);
        } catch (e) {
            let processedError = this.formatError({
                service: this.serviceName,
                error: e,
                functionName: 'loginUser',
            });

            return next(processedError);
        }
    }
}

module.exports = UserService;
