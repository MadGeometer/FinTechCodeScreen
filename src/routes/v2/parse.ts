import * as express from "express";
import { Request, Response, Router, Express } from "express";
import {CustomerData, ParsedDataSuccess, ParsedDataFailure} from "../../interfaces/CustomerData";

const VALID_NAME_REGEX = /^[A-Z'\-\s]+$/
const VALID_CLIENT_ID_REGEX = /^\d{3}\-\d{4}$/

const requestRouter = express.Router();
requestRouter.post("/parse", parseInput);

function parseInput(req:Request, res:Response, next)
{
    let responseJson: ParsedDataSuccess | ParsedDataFailure;
    let responseStatusCode: number;
    let responseData: CustomerData;
    let responseError: string = "";

    try
    {
        let incomingObject = req.body;

        if(Object.keys(incomingObject).length === 1 && incomingObject.data
            && typeof incomingObject.data === "string" && incomingObject.data.length === 25)
        {
            let incomingData = incomingObject.data;

            let firstName: string = incomingData.substring(0, 8);
            firstName = firstName.replace(/0/g, "");

            let lastName: string = incomingData.substr(8, 10);
            lastName = lastName.replace(/0/g, "");

            let clientId: string = incomingData.substr(18, 7);
            clientId = clientId.substr(0, 3) + "-" + clientId.substr(3);

            let dataIsValid: boolean = VALID_NAME_REGEX.test(firstName)
                && VALID_NAME_REGEX.test(lastName)
                && VALID_CLIENT_ID_REGEX.test(clientId);

            if(dataIsValid)
            {
                responseData = {
                    "firstName": firstName,
                    "lastName": lastName,
                    "clientId": clientId
                };

                responseStatusCode = 200;
            }
            else
            {
                throw new Error("Invalid data format");
            }
        }
        else
        {
            throw new Error("Malformed request");
        }
    }
    catch (e)
    {
        responseStatusCode = 400;
        responseError = e.message;
    }
    finally
    {
        if(responseStatusCode === 200)
        {
            responseJson = {
                "statusCode": responseStatusCode,
                "data": responseData
            }
        }
        else
        {
            responseJson = {
                "statusCode": responseStatusCode,
                "data": {},
                "error": responseError
            }
        }

        res.status(responseStatusCode).json(responseJson);
    }
}

export default requestRouter;