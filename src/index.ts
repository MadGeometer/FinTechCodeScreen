import * as express from "express";
import { Request, Response, Express } from "express";
import {ParsedDataFailure} from "./interfaces/CustomerData";
import * as helmet from "helmet";

const app: Express = express();
const PORT: string | number = process.env.PORT || 3000;

import v1Router from "./routes/v1/parse";
import v2Router from "./routes/v2/parse";

// Boilerplate security, e.g. removing x-powered-by header
app.use(helmet())

// Middleware
app.use(express.json());

// Routes
app.use("/api/v1", v1Router);
app.use("/api/v2", v2Router);

// Catch malformed JSON
app.use(clientErrorHandler);

// Start API server
let server = app.listen(PORT, function () {
    console.log("App listening on port", PORT);
});

/*istanbul ignore next*/
function clientErrorHandler(err, req:Request, res:Response, next)
{
    let responseJson: ParsedDataFailure = {
        "statusCode": 400,
        "data": {},
        "error": "Problems parsing JSON"
    }

    res.status(400).json(responseJson);
}

module.exports = server;