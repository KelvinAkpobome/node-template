/**
 *
 * This handles user validation and ensures protection for selected routes
 * @module MIDDLEWARE:VALIDATE
 */

const { verifyToken } = require('../utilities/encryption');


/**
 *
 * This middleware verifies the token, ensures user authentication and attaches decoded properties it to the request object.
 * @param {object} request Express request object
 * @param {object} response Express response object
 * @param {object} next Express next function
 */
async function verifyUser(request, response, next) {
    const token = request.header('x-auth-token') || false;

    try {
        if (token) {
          const decoded = await verifyToken(token);
          if (decoded.email) {
            request.user = {
              email: decoded.email,
              role: decoded.role,
            };
            next();
          }
        }else throw new Error ('You are not logged in');
        
    } catch (err) {
        err.status = 401
        err.error = err.message
        next(err)
    }
   
}

/**
 *
 * This middleware ensures routes protection for the different users .
 * @param {object} request Express request object
 * @param {object} response Express response object
 * @param {object} next Express next function
 */
function checkIfTech(request, response, next) {
    try {
        if(request.user.role === 'technician'){
         next();
        }else throw new Error ('You are not a technician');
    }catch (err) {
        err.status = 401
        err.error = err.message
        next(err)
    }
}


/**
 *
 * This middleware ensures routes protection for the different users .
 * @param {object} request Express request object
 * @param {object} response Express response object
 * @param {object} next Express next function
 */
function checkIfClient(request, response, next) {
   try{
        if (request.user.role === 'client')  {
        next();
        }else throw new Error ('You are not a client');
    }catch (err) {
        err.status = 401
        err.error = err.message
        next(err)
    }
};

module.exports = {
    verifyUser,
    checkIfTech,
    checkIfClient
};
