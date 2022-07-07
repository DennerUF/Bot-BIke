const { WaterfallDialog, ComponentDialog, DialogTurnStatus, TextPrompt, ConfirmPrompt, ChoicePrompt } = require('botbuilder-dialogs');
const objIsEndDialog = require('../../Helpers/isEndDialog');

const recognizer = require('../../Helpers/getLuis');
const CONFIRMDATA_CONFIRMPROMPT =  'CONFIRMDATA_CONFIRMPROMPT';
const msg = require('./message');
const START_TEXTPROMPT = 'START_TEXTPROMPT';
const CHANGE_TEXTPROMPT = 'CHANGE_TEXTPROMPT';
const ChangePurchaseData_DIALOG = 'CHANGEDATA';
class ChangePurchaseData extends ComponentDialog {
    constructor() {
        super(ChangePurchaseData_DIALOG);
        this.addDialog(new TextPrompt(START_TEXTPROMPT, this.startDialogValidator))
            .addDialog(new ConfirmPrompt(CONFIRMDATA_CONFIRMPROMPT))
            .addDialog(new TextPrompt(CHANGE_TEXTPROMPT))
            .addDialog(new WaterfallDialog(ChangePurchaseData_DIALOG, [
                this.startDialog.bind(this),
                this.confirm.bind(this),
                this.messageChangeData.bind(this),
                this.changeData.bind(this),

            ]));

        this.initialDialogId = ChangePurchaseData_DIALOG;

    }

    async startDialog(stepContext) {
        stepContext.values.purchaseData = stepContext.options.data;
        await stepContext.context.sendActivity(msg.messageConfirm);
        await stepContext.context.sendActivity(msg.purchaseData(stepContext.values.purchaseData));
        return stepContext.prompt(CONFIRMDATA_CONFIRMPROMPT, msg.promptConfirm);
    }
    async confirm(stepContext) {
        if (stepContext.result) {
            await stepContext.context.sendActivity(msg.completedPurchase);
            return stepContext.endDialog();
        }
        return stepContext.prompt(START_TEXTPROMPT, msg.changePurchaseData);
    }
    async messageChangeData(stepContext) {
        if (await objIsEndDialog.isEndDialog(stepContext)) { return stepContext.endDialog(); }
        const data = stepContext.result;
        stepContext.values.data = data;
        return stepContext.prompt(CHANGE_TEXTPROMPT, msg.messageChange(data));
    }
    async changeData(stepContext) {
        const entitie = recognizer.getEntities(stepContext.context.luisResult);
        if(entitie.CPF){
            stepContext.values.purchaseData.cpf = entitie.CPF[0] || stepContext.result;
            return stepContext.replaceDialog('CHANGEDATA',{data: stepContext.values.purchaseData});
        }else if(entitie.CEP){
            stepContext.values.purchaseData.cep = entitie.CEP[0] || stepContext.result;
            return stepContext.replaceDialog('CHANGEDATA',{data: stepContext.values.purchaseData});
        }
        stepContext.values.purchaseData[stepContext.values.data] = stepContext.result;
        return stepContext.replaceDialog('CHANGEDATA',{data: stepContext.values.purchaseData});
    }

    async startDialogValidator(stepContext) {
        const entitie = recognizer.getEntities(stepContext.context.luisResult);
        if (!entitie.purchaseData && stepContext.attemptCount < 2) {
            return false;
        } else if (!entitie.purchaseData && stepContext.attemptCount == 2) {
            stepContext.recognized.value = 'finishDialog';
            return true;
        }

        stepContext.recognized.value = entitie.purchaseData[0][0];
        return true;
    }




}

module.exports = ChangePurchaseData;