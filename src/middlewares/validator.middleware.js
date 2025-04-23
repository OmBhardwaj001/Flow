import {validationResult} from "express-validator"
import {ApiError} from "../utils/api-error.js"

export const validate = (req, res, next)=>
{
    const errors = validationResult(req);

    if(errors.isEmpty()){
      return next()
    }

    const extractedError = []
    errors.array().map((err)=>{
      extractedError.push({
        [err.path]: err.msg
      })
    })


    throw new  ApiError(422, "recieved data is not valid",extractedError);
}

//validationResult is a function that you call inside your route handler to collect and check the results of any validation done using body(), param(), query(), etc.