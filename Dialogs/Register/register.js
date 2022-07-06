const { DateTimePrompt, TextPrompt, WaterfallDialog, ChoicePrompt, NumberPrompt,ComponentDialog, ConfirmPrompt } = require('botbuilder-dialogs');
const recognizer = require('../../Helpers/getLuis');


const cepValidator = require('../../Helpers/cepValidator');
const msg = require('./message');
const ChangePurchaseData = require('../ChangePurchaseData/changePurchaseData');
const dialogChange = new ChangePurchaseData();

const NUMBERHOUSE_NUMBERPROMPT = 'NUMBERHOUSE_NUMBERPROMPT';
const CPF_PROMPT = 'CPF_NUMBERPROMPT';
const CEP_PROMPT = 'CEP_NUMBER_PROMPT';
const FONE_PROMPT = 'FONE_NUMBERPROMPT';
const COMPLEMENT_TEXTPROMPT = 'COMPLEMENT_TEXTPROMPT';
const ADDRESS_TEXTPROMPT = 'ADDRESS_TEXTPROMPT';
const NAME_TEXTPROMPT = 'NAME_TEXTPROMPT';
const DISTRICT_TEXTPROMPT = 'DISTRICT_TEXTPROMPT';
const CITY_TEXTPROMPT = 'CITY_TEXTPROMPT';
const REGISTRATION_DIALOG = 'REGISTER';
class Register extends ComponentDialog {
    constructor() {
        super(REGISTRATION_DIALOG);
        this.addDialog(new TextPrompt(CITY_TEXTPROMPT))
            .addDialog(dialogChange)
            .addDialog(new TextPrompt(NAME_TEXTPROMPT))
            .addDialog(new TextPrompt(DISTRICT_TEXTPROMPT))
            .addDialog(new TextPrompt(ADDRESS_TEXTPROMPT))
            .addDialog(new TextPrompt(COMPLEMENT_TEXTPROMPT))
            .addDialog(new NumberPrompt(NUMBERHOUSE_NUMBERPROMPT))
            .addDialog(new NumberPrompt(CPF_PROMPT))
            .addDialog(new NumberPrompt(FONE_PROMPT))
            .addDialog(new NumberPrompt(CEP_PROMPT))
            .addDialog(new WaterfallDialog(REGISTRATION_DIALOG, [
                this.startDialog.bind(this),
                this.cepStep.bind(this),
                this.cityStep.bind(this),
                this.districtStep.bind(this),
                this.addressStep.bind(this),
                this.numberHouseStep.bind(this),
                this.complementStep.bind(this),
                this.nameStep.bind(this),
                this.cpfStep.bind(this),
                this.foneStep.bind(this)
            ]));

        this.initialDialogId = REGISTRATION_DIALOG;

    }
    async startDialog(stepContext) {
        stepContext.values.purchaseData = stepContext.options;
        if (stepContext.values.purchaseData.cep) {
            return stepContext.next();
        }

        return stepContext.prompt(CEP_PROMPT, msg.promptCEP);
    }
    async cepStep(stepContext) {
        if (stepContext.values.purchaseData.city) {
            return stepContext.next();
        }
        const entitie = recognizer.getEntities(stepContext.context.luisResult);
        if (!entitie || !entitie.CEP) {
            stepContext.values.purchaseData.cep = '*';
            return stepContext.prompt(CITY_TEXTPROMPT, msg.promptCity);
        }
        let cep = entitie.CEP[0];
        const resultValidation = await cepValidator(cep);
        if (!resultValidation) {
            stepContext.values.purchaseData.cep = '*';
            return stepContext.prompt(CITY_TEXTPROMPT, msg.promptCity);
        }
        stepContext.values.purchaseData.cep = cep;
        stepContext.values.purchaseData.city = resultValidation.city;
        stepContext.values.purchaseData.district = resultValidation.district;
        stepContext.values.purchaseData.address = resultValidation.address;
        return stepContext.next();
    }

    async cityStep(stepContext){
        if (stepContext.values.purchaseData.cep !== '*') {
            return stepContext.next(true);
        }
        stepContext.values.purchaseData.city = stepContext.result;
        return stepContext.prompt(DISTRICT_TEXTPROMPT, msg.promptDistrict);
    }

    async districtStep(stepContext){
        if (stepContext.options) {
            return stepContext.next(true);
        }
        stepContext.values.purchaseData.district = stepContext.result;
        return stepContext.prompt(ADDRESS_TEXTPROMPT, msg.promptAddress);
    }

    async addressStep(stepContext){
        if (stepContext.values.purchaseData.cep === '*') {
            stepContext.values.purchaseData.address = stepContext.result;
        }
        return stepContext.prompt(NUMBERHOUSE_NUMBERPROMPT, msg.promptNumberHouse);
    }

    async numberHouseStep(stepContext){
        const entitie = recognizer.getEntities(stepContext.context.luisResult);
        stepContext.values.purchaseData.numberHouse = entitie.number[0] || stepContext.result;
        return stepContext.prompt(COMPLEMENT_TEXTPROMPT, msg.promptComplement);

    }
    async complementStep(stepContext){
        stepContext.values.purchaseData.complement = stepContext.result;
        return stepContext.prompt(NAME_TEXTPROMPT, msg.promptName);

    }

    async nameStep(stepContext) {
        stepContext.values.purchaseData.name = stepContext.result;
        return stepContext.prompt(CPF_PROMPT, msg.promptCPF);
    }

    async cpfStep(stepContext) {
        const entitie = recognizer.getEntities(stepContext.context.luisResult);
        stepContext.values.purchaseData.cpf = entitie.CPF[0] || stepContext.result;
        return stepContext.prompt(FONE_PROMPT, msg.promptFone);
    }
    async foneStep(stepContext) {
        const entitie = recognizer.getEntities(stepContext.context.luisResult);
        stepContext.values.purchaseData.fone = entitie.number[0] || stepContext.result;
        
        return stepContext.replaceDialog('CHANGEDATA',{data: stepContext.values.purchaseData});
    }


    
}

module.exports.Register = Register;