// Unit tests for API version 1

const VERSION_1_PARSE_ENDPOINT = "/api/v1/parse";

let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../dist/index");
let should = chai.should();

chai.use(chaiHttp);

const testCase1 = {
    data: "JOHN0000MICHAEL0009994567"
}

const testCase2 = {
    data: "JOHN0000O'BRIEN0009994567"
}

const testCase3 = {
    data: "WERNHER0VON BRAUN09994567"
}

const testCase4 = {
    data: "JOHN0000O-BRIEN0009994567"
}

const testCase5 = {
    data: "John0000Michael0009994567"
}

const testCase6 = {
    data: "JOHN-MICHAEL0009994567"
}

const testCase7 = {
    data: "CARRIE-ANNE0MOSS0009994567"
}

const testCase8 = {
    data: "JOHN0000MICHAEL0009994567",
    moreData: "GEORGE00MICHAEL0009994567"
}

const testCase9 = {
    data: 2.71828
}

const testCase10 = "{data: \"JOHN0000MICHAEL0009994567\"";

const testCase11 = {
    data: "JOHN0000MICHAEL00099945!7"
}

describe("API V1 Tests", () => {
    it("Should work on provided example", (done) => {
        chai.request(server)
            .post(VERSION_1_PARSE_ENDPOINT)
            .send(testCase1)
            .end((err, res) => {
                shouldReturnValidResponse(err, res);
                done();
            });
    });
    
    it("Should accept apostrophes in name", (done) => {
        chai.request(server)
            .post(VERSION_1_PARSE_ENDPOINT)
            .send(testCase2)
            .end((err, res) => {
                shouldReturnValidResponse(err, res);
                done();
            });
    });
    
    it("Should accept spaces in names, like Wernher von Braun", (done) => {
        chai.request(server)
            .post(VERSION_1_PARSE_ENDPOINT)
            .send(testCase3)
            .end((err, res) => {
                shouldReturnValidResponse(err, res);
                done();
            });
    });
    
    it("Should accept dashes in names", (done) => {
        chai.request(server)
            .post(VERSION_1_PARSE_ENDPOINT)
            .send(testCase4)
            .end((err, res) => {
                shouldReturnValidResponse(err, res);
                done();
            });
    });
    
    it("Should not accept lower case letters in names", (done) => {
        chai.request(server)
            .post(VERSION_1_PARSE_ENDPOINT)
            .send(testCase5)
            .end((err, res) => {
                shouldReturnErrorResponse(err, res);
                done();
            });
    });
    
    it("Should reject short strings", (done) => {
        chai.request(server)
            .post(VERSION_1_PARSE_ENDPOINT)
            .send(testCase6)
            .end((err, res) => {
                shouldReturnErrorResponse(err, res);
                done();
            });
    });
    
    it("Should reject long strings", (done) => {
        chai.request(server)
            .post(VERSION_1_PARSE_ENDPOINT)
            .send(testCase7)
            .end((err, res) => {
                shouldReturnErrorResponse(err, res);
                done();
            });
    });
    
    it("Should reject JSON with extra fields", (done) => {
        chai.request(server)
            .post(VERSION_1_PARSE_ENDPOINT)
            .send(testCase8)
            .end((err, res) => {
                shouldReturnErrorResponse(err, res);
                done();
            });
    });
    
    it("Should reject data that isn't a string", (done) => {
        chai.request(server)
            .post(VERSION_1_PARSE_ENDPOINT)
            .send(testCase9)
            .end((err, res) => {
                shouldReturnErrorResponse(err, res);
                done();
            });
    });
    
    it("Should reject invalid JSON", (done) => {
        chai.request(server)
            .post(VERSION_1_PARSE_ENDPOINT)
            .send(testCase10)
            .end((err, res) => {
                shouldReturnErrorResponse(err, res);
                done();
            });
    });
    
    it("Should reject non-numeric client IDs", (done) => {
        chai.request(server)
            .post(VERSION_1_PARSE_ENDPOINT)
            .send(testCase11)
            .end((err, res) => {
                shouldReturnErrorResponse(err, res);
                done();
            });
    });
});

function shouldReturnValidResponse(err, res)
{
    res.should.have.status(200);
    
    res.should.be.an("object");
    
    res.body.should.have.property("data");
    res.body.should.have.property("statusCode");
    
    res.body.should.not.have.property("error");
    
    res.body.statusCode.should.equal(res.status);
    
    res.body.data.should.have.property("firstName");
    res.body.data.should.have.property("lastName");
    res.body.data.should.have.property("clientId");
    
    res.body.data.firstName.should.have.length(8);
    res.body.data.lastName.should.have.length(10);
    res.body.data.clientId.should.have.length(7);
}

function shouldReturnErrorResponse(err, res)
{
    res.should.not.have.status(200);
    
    res.should.be.an("object");
    
    res.body.should.have.property("statusCode");
    res.body.should.have.property("error");
    res.body.should.have.property("data");
    
    res.body.statusCode.should.equal(res.status);
    
    res.body.data.should.not.have.property("firstName");
    res.body.data.should.not.have.property("lastName");
    res.body.data.should.not.have.property("clientId");
}