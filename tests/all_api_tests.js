// Combined unit tests for both V1 and V2 versions

let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../dist/index");
let should = chai.should();


function importTest(name, path)
{
    describe(name, function () {
        require(path);
    });
}

describe("All Tests", () => {
    importTest("v1", "./api_v1_tests");
    importTest("v2", "./api_v2_tests");
});