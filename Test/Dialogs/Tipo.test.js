const { DialogTestClient, DialogTestLogger } = require('botbuilder-testing');
const { Type } = require('../../Dialogs/Type/type');
const assert = require('assert');
const testCases = require('./TestData/typeCases')
describe('Type', () => {
    const sut = new Type();
    testCases.map(testData => {
        it(testData.name, async () => {
            const client = new DialogTestClient('test', sut, {}, [new DialogTestLogger()]);
            for (let i = 0; i < testData.steps.length; i++) {
                let reply = await client.sendActivity(testData.steps[i][0]);
                assert.strictEqual((reply ? reply.text : null), testData.steps[i][1]);
            }
            assert.strictEqual(client.dialogTurnResult.status, testData.expectedStatus);
        });
    })


})


