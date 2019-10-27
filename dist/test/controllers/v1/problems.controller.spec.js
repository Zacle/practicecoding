"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@tsed/common");
const testing_1 = require("@tsed/testing");
const supertest_1 = __importDefault(require("supertest"));
const chai_1 = require("chai");
const app_1 = require("../../../src/app");
describe("ProblemsCtrl", () => {
    let request;
    before(testing_1.bootstrap(app_1.Server));
    before(testing_1.inject([common_1.ExpressApplication], (expressApplication) => {
        request = supertest_1.default(expressApplication);
    }));
    after(testing_1.TestContext.reset);
    describe("GET /rest/v1/problems", () => {
        it("should get all problems from Codeforces, Live Archive", (done) => {
            request
                .get("/rest/v1/problems")
                .expect(200)
                .end((err, response) => {
                if (err) {
                    throw (err);
                }
                const obj = JSON.parse(response.body);
                chai_1.expect(obj).to.be.an("array");
                chai_1.expect(obj).to.have.length.greaterThan(150);
                chai_1.expect(obj[0]).to.have.property("problemID");
                chai_1.expect(obj[0]).to.have.property("name");
                chai_1.expect(obj[0]).to.have.property("plateform");
                chai_1.expect(obj[0]).to.have.property("link");
                chai_1.expect(obj[0]).to.not.have.property("difficulty");
                done();
            });
        });
    });
    describe("GET /rest/v1/problems/:key", () => {
        let request;
        before(testing_1.bootstrap(app_1.Server));
        before(testing_1.inject([common_1.ExpressApplication], (expressApplication) => {
            request = supertest_1.default(expressApplication);
        }));
        it("should get all problems that contain e", (done) => {
            request
                .get("/rest/v1/problems/e")
                .expect(200)
                .end((err, response) => {
                if (err) {
                    throw (err);
                }
                const obj = JSON.parse(response.body);
                chai_1.expect(obj).to.be.an("array");
                chai_1.expect(obj).to.have.length.greaterThan(150);
                chai_1.expect(obj[0]).to.have.property("problemID");
                chai_1.expect(obj[0]).to.have.property("name");
                chai_1.expect(obj[0]).to.have.property("plateform");
                chai_1.expect(obj[0]).to.have.property("link");
                chai_1.expect(obj[0]).to.not.have.property("difficulty");
                done();
            });
        });
        it("should get all problems that contain the", (done) => {
            request
                .get("/rest/v1/problems/the")
                .expect(200)
                .end((err, response) => {
                if (err) {
                    throw (err);
                }
                const obj = JSON.parse(response.body);
                chai_1.expect(obj).to.be.an("array");
                chai_1.expect(obj).to.have.length.greaterThan(5);
                chai_1.expect(obj[0]).to.have.property("problemID");
                chai_1.expect(obj[0]).to.have.property("name");
                chai_1.expect(obj[0]).to.have.property("plateform");
                chai_1.expect(obj[0]).to.have.property("link");
                chai_1.expect(obj[0]).to.not.have.property("difficulty");
                done();
            });
        });
        it("should get all problems that contain tree", (done) => {
            request
                .get("/rest/v1/problems/tree")
                .expect(200)
                .end((err, response) => {
                if (err) {
                    throw (err);
                }
                const obj = JSON.parse(response.body);
                chai_1.expect(obj).to.be.an("array");
                chai_1.expect(obj).to.have.length.greaterThan(5);
                chai_1.expect(obj[0]).to.have.property("problemID");
                chai_1.expect(obj[0]).to.have.property("name");
                chai_1.expect(obj[0]).to.have.property("plateform");
                chai_1.expect(obj[0]).to.have.property("link");
                chai_1.expect(obj[0]).to.not.have.property("difficulty");
                done();
            });
        });
    });
    describe("GET /rest/v1/problems/:key/:plateform", () => {
        let request;
        before(testing_1.bootstrap(app_1.Server));
        before(testing_1.inject([common_1.ExpressApplication], (expressApplication) => {
            request = supertest_1.default(expressApplication);
        }));
        it("should get all Codeforces problems that contain e", (done) => {
            request
                .get("/rest/v1/problems/e/codeforces")
                .expect(200)
                .end((err, response) => {
                if (err) {
                    throw (err);
                }
                const obj = JSON.parse(response.body);
                chai_1.expect(obj).to.be.an("array");
                chai_1.expect(obj).to.have.length.greaterThan(5);
                chai_1.expect(obj[0]).to.have.property("problemID");
                chai_1.expect(obj[0]).to.have.property("name");
                chai_1.expect(obj[0]).to.have.property("plateform");
                chai_1.expect(obj[0]).to.have.property("link");
                chai_1.expect(obj[0]).to.not.have.property("difficulty");
                done();
            });
        });
        it("should get all Codeforces problems that contain the", (done) => {
            request
                .get("/rest/v1/problems/the/codeforces")
                .expect(200)
                .end((err, response) => {
                if (err) {
                    throw (err);
                }
                const obj = JSON.parse(response.body);
                chai_1.expect(obj).to.be.an("array");
                chai_1.expect(obj).to.have.length.greaterThan(2);
                chai_1.expect(obj[0]).to.have.property("problemID");
                chai_1.expect(obj[0]).to.have.property("name");
                chai_1.expect(obj[0]).to.have.property("plateform");
                chai_1.expect(obj[0]).to.have.property("link");
                chai_1.expect(obj[0]).to.not.have.property("difficulty");
                done();
            });
        });
        it("should get all Codeforces problems that contain tree", (done) => {
            request
                .get("/rest/v1/problems/tree/codeforces")
                .expect(200)
                .end((err, response) => {
                if (err) {
                    throw (err);
                }
                const obj = JSON.parse(response.body);
                chai_1.expect(obj).to.be.an("array");
                chai_1.expect(obj).to.have.length.greaterThan(2);
                chai_1.expect(obj[0]).to.have.property("problemID");
                chai_1.expect(obj[0]).to.have.property("name");
                chai_1.expect(obj[0]).to.have.property("plateform");
                chai_1.expect(obj[0]).to.have.property("link");
                chai_1.expect(obj[0]).to.not.have.property("difficulty");
                done();
            });
        });
        it("should get all Live Archive problems that contain e", (done) => {
            request
                .get("/rest/v1/problems/e/livearchive")
                .expect(200)
                .end((err, response) => {
                if (err) {
                    throw (err);
                }
                const obj = JSON.parse(response.body);
                chai_1.expect(obj).to.be.an("array");
                chai_1.expect(obj).to.have.length.greaterThan(5);
                chai_1.expect(obj[0]).to.have.property("problemID");
                chai_1.expect(obj[0]).to.have.property("name");
                chai_1.expect(obj[0]).to.have.property("plateform");
                chai_1.expect(obj[0]).to.have.property("link");
                chai_1.expect(obj[0]).to.not.have.property("difficulty");
                done();
            });
        });
        it("should get all Live Archive problems that contain the", (done) => {
            request
                .get("/rest/v1/problems/the/livearchive")
                .expect(200)
                .end((err, response) => {
                if (err) {
                    throw (err);
                }
                const obj = JSON.parse(response.body);
                chai_1.expect(obj).to.be.an("array");
                chai_1.expect(obj).to.have.length.greaterThan(2);
                chai_1.expect(obj[0]).to.have.property("problemID");
                chai_1.expect(obj[0]).to.have.property("name");
                chai_1.expect(obj[0]).to.have.property("plateform");
                chai_1.expect(obj[0]).to.have.property("link");
                chai_1.expect(obj[0]).to.not.have.property("difficulty");
                done();
            });
        });
        it("should get all Live Archive problems that contain tree", (done) => {
            request
                .get("/rest/v1/problems/tree/livearchive")
                .expect(200)
                .end((err, response) => {
                if (err) {
                    throw (err);
                }
                const obj = JSON.parse(response.body);
                chai_1.expect(obj).to.be.an("array");
                chai_1.expect(obj).to.have.length.greaterThan(2);
                chai_1.expect(obj[0]).to.have.property("problemID");
                chai_1.expect(obj[0]).to.have.property("name");
                chai_1.expect(obj[0]).to.have.property("plateform");
                chai_1.expect(obj[0]).to.have.property("link");
                chai_1.expect(obj[0]).to.not.have.property("difficulty");
                done();
            });
        });
        it("should get all Uva problems that contain e", (done) => {
            request
                .get("/rest/v1/problems/e/uva")
                .expect(200)
                .end((err, response) => {
                if (err) {
                    throw (err);
                }
                const obj = JSON.parse(response.body);
                chai_1.expect(obj).to.be.an("array");
                chai_1.expect(obj).to.have.length.greaterThan(5);
                chai_1.expect(obj[0]).to.have.property("problemID");
                chai_1.expect(obj[0]).to.have.property("name");
                chai_1.expect(obj[0]).to.have.property("plateform");
                chai_1.expect(obj[0]).to.have.property("link");
                chai_1.expect(obj[0]).to.not.have.property("difficulty");
                done();
            });
        });
        it("should get all Uva problems that contain the", (done) => {
            request
                .get("/rest/v1/problems/the/uva")
                .expect(200)
                .end((err, response) => {
                if (err) {
                    throw (err);
                }
                const obj = JSON.parse(response.body);
                chai_1.expect(obj).to.be.an("array");
                chai_1.expect(obj).to.have.length.greaterThan(2);
                chai_1.expect(obj[0]).to.have.property("problemID");
                chai_1.expect(obj[0]).to.have.property("name");
                chai_1.expect(obj[0]).to.have.property("plateform");
                chai_1.expect(obj[0]).to.have.property("link");
                chai_1.expect(obj[0]).to.not.have.property("difficulty");
                done();
            });
        });
        it("should get all Uva problems that contain tree", (done) => {
            request
                .get("/rest/v1/problems/tree/uva")
                .expect(200)
                .end((err, response) => {
                if (err) {
                    throw (err);
                }
                const obj = JSON.parse(response.body);
                chai_1.expect(obj).to.be.an("array");
                chai_1.expect(obj).to.have.length.greaterThan(2);
                chai_1.expect(obj[0]).to.have.property("problemID");
                chai_1.expect(obj[0]).to.have.property("name");
                chai_1.expect(obj[0]).to.have.property("plateform");
                chai_1.expect(obj[0]).to.have.property("link");
                chai_1.expect(obj[0]).to.not.have.property("difficulty");
                done();
            });
        });
    });
    describe("GET /rest/v1/problems/filter/difficulty", () => {
        let request;
        before(testing_1.bootstrap(app_1.Server));
        before(testing_1.inject([common_1.ExpressApplication], (expressApplication) => {
            request = supertest_1.default(expressApplication);
        }));
        it("should get all easy problems", (done) => {
            request
                .get("/rest/v1/problems/filter/easy")
                .expect(200)
                .end((err, response) => {
                if (err) {
                    throw (err);
                }
                const obj = JSON.parse(response.body);
                chai_1.expect(obj).to.be.an("array");
                chai_1.expect(obj).to.have.length.greaterThan(150);
                chai_1.expect(obj[0]).to.have.property("problemID");
                chai_1.expect(obj[0]).to.have.property("name");
                chai_1.expect(obj[0]).to.have.property("plateform");
                chai_1.expect(obj[0]).to.have.property("link");
                chai_1.expect(obj[0]).to.not.have.property("difficulty");
                done();
            });
        });
        it("should get all medium problems", (done) => {
            request
                .get("/rest/v1/problems/filter/medium")
                .expect(200)
                .end((err, response) => {
                if (err) {
                    throw (err);
                }
                const obj = JSON.parse(response.body);
                chai_1.expect(obj).to.be.an("array");
                chai_1.expect(obj).to.have.length.greaterThan(5);
                chai_1.expect(obj[0]).to.have.property("problemID");
                chai_1.expect(obj[0]).to.have.property("name");
                chai_1.expect(obj[0]).to.have.property("plateform");
                chai_1.expect(obj[0]).to.have.property("link");
                chai_1.expect(obj[0]).to.not.have.property("difficulty");
                done();
            });
        });
        it("should get all hard problems", (done) => {
            request
                .get("/rest/v1/problems/filter/hard")
                .expect(200)
                .end((err, response) => {
                if (err) {
                    throw (err);
                }
                const obj = JSON.parse(response.body);
                chai_1.expect(obj).to.be.an("array");
                chai_1.expect(obj).to.have.length.greaterThan(5);
                chai_1.expect(obj[0]).to.have.property("problemID");
                chai_1.expect(obj[0]).to.have.property("name");
                chai_1.expect(obj[0]).to.have.property("plateform");
                chai_1.expect(obj[0]).to.have.property("link");
                chai_1.expect(obj[0]).to.not.have.property("difficulty");
                done();
            });
        });
    });
    describe("GET /rest/v1/problems/filter/:difficulty/:plateform", () => {
        let request;
        before(testing_1.bootstrap(app_1.Server));
        before(testing_1.inject([common_1.ExpressApplication], (expressApplication) => {
            request = supertest_1.default(expressApplication);
        }));
        it("should get all Codeforces easy problems", (done) => {
            request
                .get("/rest/v1/problems/filter/easy/codeforces")
                .expect(200)
                .end((err, response) => {
                if (err) {
                    throw (err);
                }
                const obj = JSON.parse(response.body);
                chai_1.expect(obj).to.be.an("array");
                chai_1.expect(obj).to.have.length.greaterThan(5);
                chai_1.expect(obj[0]).to.have.property("problemID");
                chai_1.expect(obj[0]).to.have.property("name");
                chai_1.expect(obj[0]).to.have.property("plateform");
                chai_1.expect(obj[0]).to.have.property("link");
                chai_1.expect(obj[0]).to.not.have.property("difficulty");
                done();
            });
        });
        it("should get all Codeforces medium problems", (done) => {
            request
                .get("/rest/v1/problems/filter/medium/codeforces")
                .expect(200)
                .end((err, response) => {
                if (err) {
                    throw (err);
                }
                const obj = JSON.parse(response.body);
                chai_1.expect(obj).to.be.an("array");
                chai_1.expect(obj).to.have.length.greaterThan(2);
                chai_1.expect(obj[0]).to.have.property("problemID");
                chai_1.expect(obj[0]).to.have.property("name");
                chai_1.expect(obj[0]).to.have.property("plateform");
                chai_1.expect(obj[0]).to.have.property("link");
                chai_1.expect(obj[0]).to.not.have.property("difficulty");
                done();
            });
        });
        it("should get all Codeforces hard problems", (done) => {
            request
                .get("/rest/v1/problems/filter/hard/codeforces")
                .expect(200)
                .end((err, response) => {
                if (err) {
                    throw (err);
                }
                const obj = JSON.parse(response.body);
                chai_1.expect(obj).to.be.an("array");
                chai_1.expect(obj).to.have.length.greaterThan(2);
                chai_1.expect(obj[0]).to.have.property("problemID");
                chai_1.expect(obj[0]).to.have.property("name");
                chai_1.expect(obj[0]).to.have.property("plateform");
                chai_1.expect(obj[0]).to.have.property("link");
                chai_1.expect(obj[0]).to.not.have.property("difficulty");
                done();
            });
        });
        it("should get all Live Archive easy problems", (done) => {
            request
                .get("/rest/v1/problems/filter/easy/livearchive")
                .expect(200)
                .end((err, response) => {
                if (err) {
                    throw (err);
                }
                const obj = JSON.parse(response.body);
                chai_1.expect(obj).to.be.an("array");
                chai_1.expect(obj).to.have.length.greaterThan(1);
                chai_1.expect(obj[0]).to.have.property("problemID");
                chai_1.expect(obj[0]).to.have.property("name");
                chai_1.expect(obj[0]).to.have.property("plateform");
                chai_1.expect(obj[0]).to.have.property("link");
                chai_1.expect(obj[0]).to.not.have.property("difficulty");
                done();
            });
        });
        it("should get all Live Archive medium problems", (done) => {
            request
                .get("/rest/v1/problems/filter/medium/livearchive")
                .expect(200)
                .end((err, response) => {
                if (err) {
                    throw (err);
                }
                const obj = JSON.parse(response.body);
                chai_1.expect(obj).to.be.an("array");
                chai_1.expect(obj).to.have.length.greaterThan(2);
                chai_1.expect(obj[0]).to.have.property("problemID");
                chai_1.expect(obj[0]).to.have.property("name");
                chai_1.expect(obj[0]).to.have.property("plateform");
                chai_1.expect(obj[0]).to.have.property("link");
                chai_1.expect(obj[0]).to.not.have.property("difficulty");
                done();
            });
        });
        it("should get all Live Archive hard problems", (done) => {
            request
                .get("/rest/v1/problems/filter/hard/livearchive")
                .expect(200)
                .end((err, response) => {
                if (err) {
                    throw (err);
                }
                const obj = JSON.parse(response.body);
                chai_1.expect(obj).to.be.an("array");
                chai_1.expect(obj).to.have.length.greaterThan(2);
                chai_1.expect(obj[0]).to.have.property("problemID");
                chai_1.expect(obj[0]).to.have.property("name");
                chai_1.expect(obj[0]).to.have.property("plateform");
                chai_1.expect(obj[0]).to.have.property("link");
                chai_1.expect(obj[0]).to.not.have.property("difficulty");
                done();
            });
        });
        it("should get all Uva easy problems", (done) => {
            request
                .get("/rest/v1/problems/filter/easy/uva")
                .expect(200)
                .end((err, response) => {
                if (err) {
                    throw (err);
                }
                const obj = JSON.parse(response.body);
                chai_1.expect(obj).to.be.an("array");
                chai_1.expect(obj).to.have.length.greaterThan(5);
                chai_1.expect(obj[0]).to.have.property("problemID");
                chai_1.expect(obj[0]).to.have.property("name");
                chai_1.expect(obj[0]).to.have.property("plateform");
                chai_1.expect(obj[0]).to.have.property("link");
                chai_1.expect(obj[0]).to.not.have.property("difficulty");
                done();
            });
        });
        it("should get all Uva medium problems", (done) => {
            request
                .get("/rest/v1/problems/filter/medium/uva")
                .expect(200)
                .end((err, response) => {
                if (err) {
                    throw (err);
                }
                const obj = JSON.parse(response.body);
                chai_1.expect(obj).to.be.an("array");
                chai_1.expect(obj).to.have.length.greaterThan(2);
                chai_1.expect(obj[0]).to.have.property("problemID");
                chai_1.expect(obj[0]).to.have.property("name");
                chai_1.expect(obj[0]).to.have.property("plateform");
                chai_1.expect(obj[0]).to.have.property("link");
                chai_1.expect(obj[0]).to.not.have.property("difficulty");
                done();
            });
        });
        it("should get all Uva hard problems", (done) => {
            request
                .get("/rest/v1/problems/filter/hard/uva")
                .expect(200)
                .end((err, response) => {
                if (err) {
                    throw (err);
                }
                const obj = JSON.parse(response.body);
                chai_1.expect(obj).to.be.an("array");
                chai_1.expect(obj).to.have.length.greaterThan(2);
                chai_1.expect(obj[0]).to.have.property("problemID");
                chai_1.expect(obj[0]).to.have.property("name");
                chai_1.expect(obj[0]).to.have.property("plateform");
                chai_1.expect(obj[0]).to.have.property("link");
                chai_1.expect(obj[0]).to.not.have.property("difficulty");
                done();
            });
        });
    });
});
//# sourceMappingURL=problems.controller.spec.js.map