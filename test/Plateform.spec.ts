import { expect } from "chai";

import {IProblem, PlateformFactory, UserStatistic} from "../src/controllers/InterfaceFacade";
import {InsightResponse, InsightResponseSuccessBody, InsightResponseErrorBody} from "../src/controllers/InterfaceFacade";
import {Plateform, Codeforces, Spoj, Uva, LiveArchive, AllPlateforms} from "../src/controllers/Plateform";
import {Level, PlateformName} from "../src/controllers/Level";
import Log from "../src/Util";
import TestUtil from "./TestUtil";

// This should match the JSON schema described in test/query.schema.json
// except 'filename' which is injected when the file is read.
export interface ITestQuery {
    title: string;
    plateform: string;
    query: any;  // make any to allow testing structurally invalid queries
    response: InsightResponse;
    filename: string;  // This is injected when reading the file
}

describe("IntefaceFacade should add all plateforms problems", function () {
    // Reference any datasets to test/data here and they will
    // automatically be loaded in the Before All hook.
    const datasetsToLoad: { [id: string]: string } = {
        codeforces: "./test/data/codeforces.zip",
        livearchive: "./test/data/livearchive.zip",
        uva: "./test/data/uva.zip"
    };

    let codeforces: Plateform;
    let uva: Plateform;
    let livearchive: Plateform;
    let allPlateforms: Plateform;
    let datasets: { [id: string]: string };

    before(async function () {
        Log.test(`Before: ${this.test.parent.title}`);

        try {
            const loadDatasetPromises: Array<Promise<Buffer>> = [];
            for (const [id, path] of Object.entries(datasetsToLoad)) {
                loadDatasetPromises.push(TestUtil.readFileAsync(path));
            }
            const loadedDatasets = (await Promise.all(loadDatasetPromises)).map((buf, i) => {
                return { [Object.keys(datasetsToLoad)[i]]: buf.toString("base64") };
            });
            datasets = Object.assign({}, ...loadedDatasets);
            expect(Object.keys(datasets)).to.have.length.greaterThan(0);
            expect(datasets).to.have.all.keys("codeforces", "livearchive", "uva");
        } catch (err) {
            expect.fail("", "", `Failed to read one or more datasets. ${JSON.stringify(err)}`);
        }

        try {
            codeforces = new Codeforces();
            livearchive = new LiveArchive();
            uva = new Uva();
            allPlateforms = new AllPlateforms();
        } catch (err) {
            Log.error(err);
        } finally {
            expect(codeforces).to.be.instanceOf(Plateform);
            expect(livearchive).to.be.instanceOf(Plateform);
            expect(uva).to.be.instanceOf(Plateform);
            expect(allPlateforms).to.be.instanceOf(Plateform);
        }
    });

    beforeEach(function () {
        Log.test(`BeforeTest: ${this.currentTest.title}`);
    });

    after(function () {
        Log.test(`After: ${this.test.parent.title}`);
    });

    afterEach(function () {
        Log.test(`AfterTest: ${this.currentTest.title}`);
    });

    /*
     * Let's start by getting firstly valid datasets
     * and test them against our implementations
     */


    /*
    *   Getting codeforces problems
    */
    it("Should get all codeforces problems", async () => {
        const id: string = "codeforces";
        const plateform: PlateformName = PlateformName.CODEFORCES;
        const expectedCode: number = 204;
        let response: InsightResponse;

        try {
            response = await codeforces.getListOfProblems(datasets[id], plateform);
        } catch (err) {
            response = err;
        } finally {
            expect(response.code).to.equal(expectedCode);
            expect(response.body).to.have.lengthOf(31);
        }
    });

    it("Should not add the same problems", async () => {
        const id: string = "codeforces";
        const plateform: PlateformName = PlateformName.CODEFORCES;
        const expectedCode: number = 204;
        let response: InsightResponse;

        try {
            response = await codeforces.getListOfProblems(datasets[id], plateform);
        } catch (err) {
            response = err;
        } finally {
            expect(response.code).to.equal(expectedCode);
            expect(response.body).to.have.lengthOf(31);
        }
    });

    it("Should not add invalid codeforces", async () => {
        const id: string = "codeorces";
        const plateform: PlateformName = PlateformName.CODEFORCES;
        const expectedCode: number = 400;
        let response: InsightResponse;

        try {
            response = await codeforces.getListOfProblems(datasets[id], plateform);
        } catch (err) {
            response = err;
        } finally {
            expect(response.code).to.equal(expectedCode);
            expect(response.body).to.have.property('error');
        }
    });

    /*
    *   Getting livearchive problems
    */
    it("Should get all livearchive problems", async () => {
        const id: string = "livearchive";
        const plateform: PlateformName = PlateformName.LIVEARCHIVE;
        const expectedCode: number = 204;
        let response: InsightResponse;

        try {
            response = await livearchive.getListOfProblems(datasets[id], plateform);
        } catch (err) {
            response = err;
        } finally {
            expect(response.code).to.equal(expectedCode);
            expect(response.body).to.have.lengthOf(30);
        }
    });

    it("Should not add the same problems", async () => {
        const id: string = "livearchive";
        const plateform: PlateformName = PlateformName.LIVEARCHIVE;
        const expectedCode: number = 204;
        let response: InsightResponse;

        try {
            response = await livearchive.getListOfProblems(datasets[id], plateform);
        } catch (err) {
            response = err;
        } finally {
            expect(response.code).to.equal(expectedCode);
            expect(response.body).to.have.lengthOf(30);
        }
    });

    it("Should not add invalid livearchive", async () => {
        const id: string = "livarchive";
        const plateform: PlateformName = PlateformName.LIVEARCHIVE;
        const expectedCode: number = 400;
        let response: InsightResponse;

        try {
            response = await codeforces.getListOfProblems(datasets[id], plateform);
        } catch (err) {
            response = err;
        } finally {
            expect(response.code).to.equal(expectedCode);
            expect(response.body).to.have.property('error');
        }
    });

    /*
    *   Getting uva problems
    */
    it("Should get all uva problems", async () => {
        const id: string = "uva";
        const plateform: PlateformName = PlateformName.UVA;
        const expectedCode: number = 204;
        let response: InsightResponse;

        try {
            response = await uva.getListOfProblems(datasets[id], plateform);
        } catch (err) {
            response = err;
        } finally {
            expect(response.code).to.equal(expectedCode);
            expect(response.body).to.have.lengthOf(29);
        }
    });

    it("Should not add the same problems", async () => {
        const id: string = "uva";
        const plateform: PlateformName = PlateformName.UVA;
        const expectedCode: number = 204;
        let response: InsightResponse;

        try {
            response = await uva.getListOfProblems(datasets[id], plateform);
        } catch (err) {
            response = err;
        } finally {
            expect(response.code).to.equal(expectedCode);
            expect(response.body).to.have.lengthOf(29);
        }
    });

    it("Should not add invalid uva", async () => {
        const id: string = "uv";
        const plateform: PlateformName = PlateformName.UVA;
        const expectedCode: number = 400;
        let response: InsightResponse;

        try {
            response = await uva.getListOfProblems(datasets[id], plateform);
        } catch (err) {
            response = err;
        } finally {
            expect(response.code).to.equal(expectedCode);
            expect(response.body).to.have.property('error');
        }
    });

});

// This test suite dynamically generates tests from the JSON files in test/queries.
// Do not modify it; instead, add additional files to the queries directory.
describe("PlateformFactory getProblemsFiltered", () => {
    
    const datasetsToQuery: { [id: string]: string } = {
        codeforces: "./test/data/codeforces.zip",
        livearchive: "./test/data/livearchive.zip",
        uva: "./test/data/uva.zip"
    };

    let codeforces: Plateform;
    let uva: Plateform;
    let livearchive: Plateform;
    let allPlateforms: Plateform;
    let testQueries: ITestQuery[] = [];

    // Create a new instance of InsightFacade, read in the test queries from test/queries and
    // add the datasets specified in datasetsToQuery.
    before(async function () {
        Log.test(`Before: ${this.test.parent.title}`);

        // Load the query JSON files under test/queries.
        // Fail if there is a problem reading ANY query.
        try {
            testQueries = await TestUtil.readTestQueries("test/queries/filter");
            expect(testQueries).to.have.length.greaterThan(0);
        } catch (err) {
            expect.fail("", "", `Failed to read one or more test queries. ${JSON.stringify(err)}`);
        }

        try {
            codeforces = new Codeforces();
            livearchive = new LiveArchive();
            uva = new Uva();
            allPlateforms = new AllPlateforms();
        } catch (err) {
            Log.error(err);
        } finally {
            expect(codeforces).to.be.instanceOf(Plateform);
            expect(livearchive).to.be.instanceOf(Plateform);
            expect(uva).to.be.instanceOf(Plateform);
            expect(allPlateforms).to.be.instanceOf(Plateform);
        }

        // Load the datasets specified in datasetsToQuery and add them to InterfaceFacade.
        // Fail if there is a problem reading ANY dataset.
        try {
            const loadDatasetPromises: Array<Promise<Buffer>> = [];
            for (const [id, path] of Object.entries(datasetsToQuery)) {
                loadDatasetPromises.push(TestUtil.readFileAsync(path));
            }
            const loadedDatasets = (await Promise.all(loadDatasetPromises)).map((buf, i) => {
                return { [Object.keys(datasetsToQuery)[i]]: buf.toString("base64") };
            });
            expect(loadedDatasets).to.have.length.greaterThan(0);

            const responsePromises: Array<Promise<InsightResponse>> = [];
            const datasets: { [id: string]: string } = Object.assign({}, ...loadedDatasets);
            
            for (const [id, content] of Object.entries(datasets)) {
                if (id == "codeforces") {
                    responsePromises.push(codeforces.getListOfProblems(content, PlateformName.CODEFORCES));
                }
                else if (id == "livearchive") {
                    responsePromises.push(codeforces.getListOfProblems(content, PlateformName.LIVEARCHIVE));
                }
                else if (id == "uva") {
                    responsePromises.push(codeforces.getListOfProblems(content, PlateformName.UVA));
                }
            }

            try {
                const responses: InsightResponse[] = await Promise.all(responsePromises);
                responses.forEach((response) => expect(response.code).to.equal(204));
            } catch (err) {
                Log.warn(`Ignoring getListOfProblems() errors.`);
            }

        } catch (err) {
            expect.fail("", "", `Failed to read one or more datasets. ${JSON.stringify(err)}`);
        }
    });

    beforeEach(function () {
        Log.test(`BeforeTest: ${this.currentTest.title}`);
    });

    after(function () {
        Log.test(`After: ${this.test.parent.title}`);
    });

    afterEach(function () {
        Log.test(`AfterTest: ${this.currentTest.title}`);
    });

    // Dynamically create and run a test for each query in testQueries
    it("Should run all codeforces test queries", () => {
        describe("Dynamic Codeforces Filter difficulties tests", () => {
            for (const test of testQueries) {
                if (test.plateform == "codeforces") {
                    it(`[${test.filename}] ${test.title}`, async () => {
                        let response: InsightResponse;
                        let level: Level;
                        // search by level
                        switch ((test.query + "").toLowerCase()) {
                            case "easy":
                                level = Level.EASY;
                                break;
                            case "medium":
                                level = Level.MEDIUM;
                                break;
                            case "hard":
                                level = Level.HARD;
                                break;
                            default:
                                level = Level.MEDIUM;
                        }

                        try {
                            response = await codeforces.getProblemsFiltered(level);
                        } catch (err) {
                            response = err;
                        } finally {
                            expect(response.code).to.equal(test.response.code);
    
                            if (test.response.code >= 400) {
                                expect(response.body).to.have.property("error");
                            } else {
                                expect(response.body).to.have.property("result");
                                const expectedResult = (test.response.body as InsightResponseSuccessBody).result;
                                const actualResult = (response.body as InsightResponseSuccessBody).result;
                                expect(actualResult).to.deep.equal(expectedResult);
                            }
                        }
                    });
                }
            }
        });
    });

    it("Should run all livearchive test queries", () => {
        describe("Dynamic Livearchive Filter difficulties tests", () => {
            for (const test of testQueries) {
                if (test.plateform == "livearchive") {
                    it(`[${test.filename}] ${test.title}`, async () => {
                        let response: InsightResponse;
                        let level: Level;
                        // search by level
                        switch ((test.query + "").toLowerCase()) {
                            case "easy":
                                level = Level.EASY;
                                break;
                            case "medium":
                                level = Level.MEDIUM;
                                break;
                            case "hard":
                                level = Level.HARD;
                                break;
                            default:
                                level = Level.MEDIUM;
                        }

                        try {
                            response = await livearchive.getProblemsFiltered(level);
                        } catch (err) {
                            response = err;
                        } finally {
                            expect(response.code).to.equal(test.response.code);
    
                            if (test.response.code >= 400) {
                                expect(response.body).to.have.property("error");
                            } else {
                                expect(response.body).to.have.property("result");
                                const expectedResult = (test.response.body as InsightResponseSuccessBody).result;
                                const actualResult = (response.body as InsightResponseSuccessBody).result;
                                expect(actualResult).to.deep.equal(expectedResult);
                            }
                        }
                    });
                }
            }
        });
    });

    it("Should run all uva test queries", () => {
        describe("Dynamic Uva Filter difficulties tests", () => {
            for (const test of testQueries) {
                if (test.plateform == "uva") {
                    it(`[${test.filename}] ${test.title}`, async () => {
                        let response: InsightResponse;
                        let level: Level;
                        // search by level
                        switch ((test.query + "").toLowerCase()) {
                            case "easy":
                                level = Level.EASY;
                                break;
                            case "medium":
                                level = Level.MEDIUM;
                                break;
                            case "hard":
                                level = Level.HARD;
                                break;
                            default:
                                level = Level.MEDIUM;
                        }

                        try {
                            response = await uva.getProblemsFiltered(level);
                        } catch (err) {
                            response = err;
                        } finally {
                            expect(response.code).to.equal(test.response.code);
    
                            if (test.response.code >= 400) {
                                expect(response.body).to.have.property("error");
                            } else {
                                expect(response.body).to.have.property("result");
                                const expectedResult = (test.response.body as InsightResponseSuccessBody).result;
                                const actualResult = (response.body as InsightResponseSuccessBody).result;
                                expect(actualResult).to.deep.equal(expectedResult);
                            }
                        }
                    });
                }
            }
        });
    });

    it("Should run all plateforms test queries", () => {
        describe("Dynamic All plateforms Filter difficulties tests", () => {
            for (const test of testQueries) {
                if (test.plateform == "all") {
                    it(`[${test.filename}] ${test.title}`, async () => {
                        let response: InsightResponse;
                        let level: Level;
                        // search by level
                        switch ((test.query + "").toLowerCase()) {
                            case "easy":
                                level = Level.EASY;
                                break;
                            case "medium":
                                level = Level.MEDIUM;
                                break;
                            case "hard":
                                level = Level.HARD;
                                break;
                            default:
                                level = Level.MEDIUM;
                        }

                        try {
                            response = await allPlateforms.getProblemsFiltered(level);
                        } catch (err) {
                            response = err;
                        } finally {
                            expect(response.code).to.equal(test.response.code);
    
                            if (test.response.code >= 400) {
                                expect(response.body).to.have.property("error");
                            } else {
                                expect(response.body).to.have.property("result");
                                const expectedResult = (test.response.body as InsightResponseSuccessBody).result;
                                const actualResult = (response.body as InsightResponseSuccessBody).result;
                                expect(actualResult).to.deep.equal(expectedResult);
                            }
                        }
                    });
                }
            }
        });
    });
});

// This test suite dynamically generates tests from the JSON files in test/queries.
// Do not modify it; instead, add additional files to the queries directory.
describe("PlateformFactory getProblems matching the query", () => {
    
    const datasetsToQuery: { [id: string]: string } = {
        codeforces: "./test/data/codeforces.zip",
        livearchive: "./test/data/livearchive.zip",
        uva: "./test/data/uva.zip"
    };

    let codeforces: Plateform;
    let uva: Plateform;
    let livearchive: Plateform;
    let allPlateforms: Plateform;
    let testQueries: ITestQuery[] = [];

    // Create a new instance of InsightFacade, read in the test queries from test/queries and
    // add the datasets specified in datasetsToQuery.
    before(async function () {
        Log.test(`Before: ${this.test.parent.title}`);

        // Load the query JSON files under test/queries.
        // Fail if there is a problem reading ANY query.
        try {
            testQueries = await TestUtil.readTestQueries();
            expect(testQueries).to.have.length.greaterThan(0);
        } catch (err) {
            expect.fail("", "", `Failed to read one or more test queries. ${JSON.stringify(err)}`);
        }

        try {
            codeforces = new Codeforces();
            livearchive = new LiveArchive();
            uva = new Uva();
            allPlateforms = new AllPlateforms();
        } catch (err) {
            Log.error(err);
        } finally {
            expect(codeforces).to.be.instanceOf(Plateform);
            expect(livearchive).to.be.instanceOf(Plateform);
            expect(uva).to.be.instanceOf(Plateform);
            expect(allPlateforms).to.be.instanceOf(Plateform);
        }

        // Load the datasets specified in datasetsToQuery and add them to InterfaceFacade.
        // Fail if there is a problem reading ANY dataset.
        try {
            const loadDatasetPromises: Array<Promise<Buffer>> = [];
            for (const [id, path] of Object.entries(datasetsToQuery)) {
                loadDatasetPromises.push(TestUtil.readFileAsync(path));
            }
            const loadedDatasets = (await Promise.all(loadDatasetPromises)).map((buf, i) => {
                return { [Object.keys(datasetsToQuery)[i]]: buf.toString("base64") };
            });
            expect(loadedDatasets).to.have.length.greaterThan(0);

            const responsePromises: Array<Promise<InsightResponse>> = [];
            const datasets: { [id: string]: string } = Object.assign({}, ...loadedDatasets);

            expect(datasets).to.have.all.keys('codeforces', 'livearchive', 'uva');

            for (const [id, content] of Object.entries(datasets)) {
                if (id == "codeforces") {
                    responsePromises.push(codeforces.getListOfProblems(content, PlateformName.CODEFORCES));
                }
                else if (id == "livearchive") {
                    responsePromises.push(codeforces.getListOfProblems(content, PlateformName.LIVEARCHIVE));
                }
                else if (id == "uva") {
                    responsePromises.push(codeforces.getListOfProblems(content, PlateformName.UVA));
                }
            }

            try {
                const responses: InsightResponse[] = await Promise.all(responsePromises);
                responses.forEach((response) => expect(response.code).to.equal(204));
            } catch (err) {
                Log.warn(`Ignoring getListOfProblems() errors.`);
            }

        } catch (err) {
            expect.fail("", "", `Failed to read one or more datasets. ${JSON.stringify(err)}`);
        }
    });

    beforeEach(function () {
        Log.test(`BeforeTest: ${this.currentTest.title}`);
    });

    after(function () {
        Log.test(`After: ${this.test.parent.title}`);
    });

    afterEach(function () {
        Log.test(`AfterTest: ${this.currentTest.title}`);
    });

    // Dynamically create and run a test for each query in testQueries
    it("Should run all codeforces test queries", () => {
        describe("Dynamic Codeforces match the given query tests", () => {
            for (const test of testQueries) {
                if (test.plateform == "codeforces") {
                    it(`[${test.filename}] ${test.title}`, async () => {
                        let response: InsightResponse;

                        try {
                            response = await codeforces.getProblems(test.query + "");
                        } catch (err) {
                            response = err;
                        } finally {
                            expect(response.code).to.equal(test.response.code);
    
                            if (test.response.code >= 400) {
                                expect(response.body).to.have.property("error");
                            } else {
                                expect(response.body).to.have.property("result");
                                const expectedResult = (test.response.body as InsightResponseSuccessBody).result;
                                const actualResult = (response.body as InsightResponseSuccessBody).result;
                                expect(actualResult).to.deep.equal(expectedResult);
                            }
                        }
                    });
                }
            }
        });
    });

    it("Should run all livearchive test queries", () => {
        describe("Dynamic Livearchive match the given query tests", () => {
            for (const test of testQueries) {
                if (test.plateform == "livearchive") {
                    it(`[${test.filename}] ${test.title}`, async () => {
                        let response: InsightResponse;

                        try {
                            response = await livearchive.getProblems(test.query + "");
                        } catch (err) {
                            response = err;
                        } finally {
                            expect(response.code).to.equal(test.response.code);
    
                            if (test.response.code >= 400) {
                                expect(response.body).to.have.property("error");
                            } else {
                                expect(response.body).to.have.property("result");
                                const expectedResult = (test.response.body as InsightResponseSuccessBody).result;
                                const actualResult = (response.body as InsightResponseSuccessBody).result;
                                expect(actualResult).to.deep.equal(expectedResult);
                            }
                        }
                    });
                }
            }
        });
    });

    it("Should run all uva test queries", () => {
        describe("Dynamic Uva match the given query tests", () => {
            for (const test of testQueries) {
                if (test.plateform == "uva") {
                    it(`[${test.filename}] ${test.title}`, async () => {
                        let response: InsightResponse;

                        try {
                            response = await uva.getProblems(test.query + "");
                        } catch (err) {
                            response = err;
                        } finally {
                            expect(response.code).to.equal(test.response.code);
    
                            if (test.response.code >= 400) {
                                expect(response.body).to.have.property("error");
                            } else {
                                expect(response.body).to.have.property("result");
                                const expectedResult = (test.response.body as InsightResponseSuccessBody).result;
                                const actualResult = (response.body as InsightResponseSuccessBody).result;
                                expect(actualResult).to.deep.equal(expectedResult);
                            }
                        }
                    });
                }
            }
        });
    });

    it("Should run all plateforms test queries", () => {
        describe("Dynamic All plateforms match the given query tests", () => {
            for (const test of testQueries) {
                if (test.plateform == "all") {
                    it(`[${test.filename}] ${test.title}`, async () => {
                        let response: InsightResponse;

                        try {
                            response = await allPlateforms.getProblems(test.query + "");
                        } catch (err) {
                            response = err;
                        } finally {
                            expect(response.code).to.equal(test.response.code);
    
                            if (test.response.code >= 400) {
                                expect(response.body).to.have.property("error");
                            } else {
                                expect(response.body).to.have.property("result");
                                const expectedResult = (test.response.body as InsightResponseSuccessBody).result;
                                const actualResult = (response.body as InsightResponseSuccessBody).result;
                                expect(actualResult).to.deep.equal(expectedResult);
                            }
                        }
                    });
                }
            }
        });
    });
});
