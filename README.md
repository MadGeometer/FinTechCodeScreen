# Code Screen

## Introduction
The problem is to write an Express/TypeScript app that, when given JSON like
```
{
    "data": "JOHN0000MICHAEL0009994567"
}
```
is POSTed to two API endpoints, the response is JSON like (for version 1):
```
{
    "statusCode": 200,
    "data": {
        "firstName": "JOHN0000",
        "lastName": "MICHAEL000",
        "clientId": "9994567"
    }
}
```
or (in the case of version 2)
```
{
    "statusCode": 200,
    "data": {
        "firstName": "JOHN",
        "lastName": "MICHAEL",
        "clientId": "999-4567"
    }
}
```

The API endpoints are:
* /api/v1/parse (POST)
* /api/v2/parse (POST)

## Assumptions
We assume that the data string consists of three length-delimited substrings 
representing the client's first name, last name, and ID. In other words, "0000" 
and "0000" are NOT field delimiters!


## Setup
Assuming Node.js and NPM are installed correctly...
1. Download this repository
2. In Terminal / command prompt, move into that directory using cd command
3. Install Mocha globally: ```npm install mocha -g```
4. Enter ```npm install```
5. To build app, run ```npm run build```

## Running the Application
To run the app, just enter ```npm run dev```

## Testing the App
To run unit tests, enter ```npm test```

To get a code coverage report, enter ```npm run coverage```

The app can also be tested manually using Postman or the ```curl``` command.


## Code Organization and Overview
This application implements two different versions of an API. It is natural to keep 
the implementation of these two versions somewhat separate. As such:
* Routes for the two different versions are kept in two subfolders
* The code has no cross-dependencies even though the implementation differs in only a few lines
* There are two separate unit test suites and they are almost identical, too.

When organized in this manner, the evolution and support of the two versions can proceed independently.

### index.ts
This is the application entry point. It configures an Express server by:
* Including middleware that adds basic security features
* Adding the routes
* Including some middleware for catching malformed JSON

Finally, the server is started, running on port 3000 by default.
  
### routes/v1/parse.ts and routes/v2/parse.ts
Assuming that the input made it through the middleware test, the following checks are performed:
* The input object has exactly one field, and it is called "data"
* The "data" value is a string with exactly 25 characters.

The "data" value is then broken into three substrings:
* firstName will be first 8 characters
* lastName will be next 10 characters
* clientId will be final 7 characters

Additional tests are then performed on these using regular expressions:
* The name fields must contain only capital letters, "-", spaces, and "'", and can end with zero or more zeros.
* The clientId field must only contain digits

Based on the results of all these tests, either a response like this (in the case of V1):
```
{
    "statusCode": 200,
    "data": {
        "firstName": "JOHN0000",
        "lastName": "MICHAEL000",
        "clientId": "9994567"
    }
}
```
or like this, in case of error:
```
{
    "statusCode": 400,
    "data": {},
    "error": "Malformed request"
}
```
is returned.

Version 2 is almost exactly the same, except that two additional processing steps are performed:
* The trailing zeros are removed from firstName and lastName
* A dash is inserted into clientId between the third and fourth digits.

This results in a response like this:
```
{
    "statusCode": 200,
    "data": {
        "firstName": "JOHN",
        "lastName": "MICHAEL",
        "clientId": "999-4567"
    }
}
```

### Test files
Testing is done using the Mocha library with the Chai assertion library, 
along with Istanbul for code coverage.

For each version of the API, two lists of tests are maintained. Right now they are the 
same 11 tests for v1 and v2, but as more features are added, we would want to update the 
tests separately

These were written in JavaScript, but could be written in TypeScript. 


## Follow-On Actions
Ways of improving this solution include:
* Adding logging (right now, basic logging is available by piping output to a file)
* Adjusting the failed-parse response to meet client needs
* Determining if the various data validation tests are sufficient:
  - If so, replace try-catch-finally blocks with if-else if-else blocks to improve 
    performance
  - If not, update code and add additional unit tests
* User documentation!
* Swagger-style documentation
* Publishing a file for performing the tests in Postman 