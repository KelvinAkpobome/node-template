/**
 * Handles the implementation of Joi package for both user and ticket validation
 * @module VALIDATOR:INDEX
 */

 const Joi = require('@hapi/joi');

 const createUserSchema = Joi.object({
     firstName: Joi.string().required().label('First Name'),
     lastName: Joi.string().required().label('Last Name'),
     role: Joi.string().required().label('Role'),
     email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required().error(
         new Error(
           'Email  not valid',
         ),
       ),
     password: Joi.string()
     .regex(
       /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!_`,/@#\-"=:;~<>'\$%\^&\*\?\|\+\(\)\[\]\{}\.])(?=.{8,})/,
     )
     .trim()
     .required()
     .min(1)
     .error(
       new Error(
         'Password should contain a minimum of 8 characters (upper and lowercase letters, numbers and at least one special character)',
       ),
     ),
     // confirmPassword: Joi.any()
     //     .equal(Joi.ref('password'))
     //     .required()
     //     .label('Confirm password')
     //     .options({ messages: { 'any.only': '{{#label}} does not match' } }),
 });
 
 const createTicketSchema = Joi.object({
     brand: Joi.string().required().label('brand is required'),
     model: Joi.string().required().label('model is missing'),
     issue: Joi.string().required().label('issue is missing')
 });
 
 
 const updateUserSchema = Joi.object({
     email: Joi.string().email().required().label('Email'),
     password: Joi.string().min(6).max(16).required().label('Password'),
 });
 
 const updateTicketSchema = Joi.object({
     isFixed: Joi.boolean().error(
      new Error(
        'isFixed is missing',
      ),
    ),
    ownerEmail: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required().error(
      new Error(
        'Email not valid',
      ),
    )
 });
 
 
 module.exports = {
     createUserSchema,
     updateUserSchema,
     createTicketSchema,
     updateTicketSchema
 };