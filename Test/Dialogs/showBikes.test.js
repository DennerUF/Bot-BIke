const { DialogTestClient, DialogTestLogger } = require('botbuilder-testing');
const { ShowBikes } = require('../../Dialogs/ShowBikes/showBikes');
const assert = require('assert');
const testCases = require('./TestData/showBikesCases')
const { Menu } = require('../../Dialogs/Menu/menu');
const menuDialog = new Menu();
describe('Show Bkies', () => {
    const sut = new ShowBikes();
    testCases.map(testData => {
        it(testData.name, async () => {
            const client = new DialogTestClient('test', sut, testData.initialData, [new DialogTestLogger()]);
            for (let i = 0; i < testData.steps.length; i++) {
                let reply = await client.sendActivity(testData.steps[i][0]);
                if(reply.attachments){
                    assert.deepStrictEqual((reply.attachments), testData.steps[i][1]);
                }else{
                    assert.strictEqual((reply ? reply.text : null), testData.steps[i][1]);
                }
            }
            assert.strictEqual(client.dialogTurnResult.status, testData.expectedStatus);
        });
    })


})


