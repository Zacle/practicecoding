import { expect } from "chai";

import {IProblem, PlateformFactory, ProblemStatistic, UserStatistic} from '../src/controllers/InterfaceFacade';
import {InsightResponse, InsightResponseSuccessBody, InsightResponseErrorBody} from '../src/controllers/InterfaceFacade';
import {Plateform, Codeforces, Spoj, Uva, LiveArchive, AllPlateforms} from '../src/controllers/Plateform';
import {Level, PlateformName} from '../src/controllers/Level';
import Log from "../src/Util";
import TestUtil from "./TestUtil";

// This should match the JSON schema described in test/query.schema.json
// except 'filename' which is injected when the file is read.
export interface ITestQuery {
    title: string;
    query: any;  // make any to allow testing structurally invalid queries
    response: InsightResponse;
    filename: string;  // This is injected when reading the file
}

describe("InsightFacade Add/Remove Dataset", function () {
    // Reference any datasets you've added to test/data here and they will
    // automatically be loaded in the Before All hook.
    const datasetsToLoad: { [id: string]: string } = {
        codeforces: "./test/data/codeforces.zip",
        livearchive: "./test/data/livearchive.zip",
        uva: "./test/data/uva.zip"
    };

    let codeforces: Plateform;
    let uva: Plateform;
    let livearchive: Plateform;
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
        } catch (err) {
            expect.fail("", "", `Failed to read one or more datasets. ${JSON.stringify(err)}`);
        }

        try {
            codeforces = new Codeforces();
            livearchive = new LiveArchive();
            uva = new Uva();
        } catch (err) {
            Log.error(err);
        } finally {
            expect(codeforces).to.be.instanceOf(Plateform);
            expect(livearchive).to.be.instanceOf(Plateform);
            expect(uva).to.be.instanceOf(Plateform);
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
     * Let's start by adding firstly valid datasets
     * and test them against our implementations
     */

    /*it("Should add a valid dataset", async () => {
        const id: string = "courses";
        const expectedCode: number = 204;
        let response: InsightResponse;

        try {
            response = await insightFacade.addDataset(id, datasets[id], InsightDatasetKind.Courses);
        } catch (err) {
            response = err;
        } finally {
            expect(response.code).to.equal(expectedCode);
        }
    });*/

    /*it("Should add a valid dataset", async () => {
        const id: string = "courseWithNonCSV";
        const expectedCode: number = 204;
        let response: InsightResponse;

        try {
            response = await insightFacade.addDataset(id, datasets[id], InsightDatasetKind.Courses);
        } catch (err) {
            response = err;
        } finally {
            expect(response.code).to.equal(expectedCode);
        }
    });*/

    /*it("Should add a valid dataset", async () => {
        const id: string = "moreCSV";
        const expectedCode: number = 204;
        let response: InsightResponse;

        try {
            response = await insightFacade.addDataset(id, datasets[id], InsightDatasetKind.Courses);
        } catch (err) {
            response = err;
        } finally {
            expect(response.code).to.equal(expectedCode);
        }
    });*/

    /*
     * Now let's add invalid datasets and 
     * test them against our implementations
     */

    /*it("Should not add an invalid dataset", async () => {
        const id: string = "courses";
        const expectedCode: number = 400;
        let response: InsightResponse;

        try {
            response = await insightFacade.addDataset(id, datasets[id], InsightDatasetKind.Courses);
        } catch (err) {
            response = err;
        } finally {
            expect(response.code).to.equal(expectedCode);
        }
    });*/

    /*it("Should not add an invalid dataset", async () => {
        const id: string = "empty";
        const expectedCode: number = 400;
        let response: InsightResponse;

        try {
            response = await insightFacade.addDataset(id, datasets[id], InsightDatasetKind.Courses);
        } catch (err) {
            response = err;
        } finally {
            expect(response.code).to.equal(expectedCode);
        }
    });*/

    /*it("Should not add an invalid dataset", async () => {
        const id: string = "NoCourseSection";
        const expectedCode: number = 400;
        let response: InsightResponse;

        try {
            response = await insightFacade.addDataset(id, datasets[id], InsightDatasetKind.Courses);
        } catch (err) {
            response = err;
        } finally {
            expect(response.code).to.equal(expectedCode);
        }
    });*/
    /*
     * Remove datasets from the memory
     */
    
    /*it("Should remove the courseWithNonCSV dataset", async () => {
        const id: string = "courseWithNonCSV";
        const expectedCode: number = 204;
        let response: InsightResponse;

        try {
            response = await insightFacade.removeDataset(id);
        } catch (err) {
            response = err;
        } finally {
            expect(response.code).to.equal(expectedCode);
        }
    });*/

    /*it("Should not remove the courseWithNonCSV dataset", async () => {
        const id: string = "courseWithNonCSV";
        const expectedCode: number = 400;
        let response: InsightResponse;

        try {
            response = await insightFacade.removeDataset(id);
        } catch (err) {
            response = err;
        } finally {
            expect(response.code).to.equal(expectedCode);
        }
    });*/

    /*it("Should not remove the NotFound dataset", async () => {
        const id: string = "NotFound";
        const expectedCode: number = 400;
        let response: InsightResponse;

        try {
            response = await insightFacade.removeDataset(id);
        } catch (err) {
            response = err;
        } finally {
            expect(response.code).to.equal(expectedCode);
        }
    });*/
});
