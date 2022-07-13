const { TextPrompt, WaterfallDialog, ChoicePrompt, NumberPrompt, ComponentDialog, ConfirmPrompt } = require('botbuilder-dialogs');
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
                this.districtStep.bind(this),
                this.addressStep.bind(this),
                this.numberHouseStep.bind(this),
                this.complementStep.bind(this),
                this.nameStep.bind(this),
                this.cpfStep.bind(this),
                this.foneStep.bind(this),
                this.newDialogStep.bind(this)
            ]));

        this.initialDialogId = REGISTRATION_DIALOG;

    }
    /**
     * First step of the waterfall. 
     * Question about Cep
     * @param {TurnContext} stepContext Dialog Context
     * @returns {Promise<DialogTurnStatus>}
     */
    async startDialog(stepContext) {
        stepContext.values.purchaseData = stepContext.options;
        return stepContext.prompt(CEP_PROMPT, msg.promptCEP);
    }
    /**
     * Check if CEP was passed correctly
     * If not, start the path with new conversations
     * Question about city, if CEP entered incorrectly
     * @param {TurnContext} stepContext Dialog Context
     * @returns {Promise<DialogTurnStatus>} 
     */
    async cepStep(stepContext) {
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
        stepContext.values.purchaseData.cidade = resultValidation.city;
        stepContext.values.purchaseData.bairro = resultValidation.district;
        stepContext.values.purchaseData.endereco = resultValidation.address;
        return stepContext.next();
    }
    /**
     * Question sobre district, if CEP entered incorrectly
     * @param {TurnContext} stepContext Dialog Context
     * @returns {Promise<DialogTurnStatus>}
     */
    async districtStep(stepContext) {
        if (stepContext.values.purchaseData.cep !== '*') {
            return stepContext.next();
        }
        stepContext.values.purchaseData.cidade = stepContext.result;
        return stepContext.prompt(DISTRICT_TEXTPROMPT, msg.promptDistrict);
    }
    /**
     * Question about address, if CEP entered incorrectly
     * @param {TurnContext} stepContext Dialog Context
     * @returns {Promise<DialogTurnStatus>}
     */
    async addressStep(stepContext) {
        if (stepContext.values.purchaseData.cep !== '*') {
            return stepContext.next();
        }
        stepContext.values.purchaseData.bairro = stepContext.result;
        return stepContext.prompt(ADDRESS_TEXTPROMPT, msg.promptAddress);
    }
    /**
     * Question about house number
     * @param {TurnContext} stepContext Dialog Context
     * @returns {Promise<DialogTurnStatus>}
     */
    async numberHouseStep(stepContext) {
        if (stepContext.values.purchaseData.cep === '*') {
            stepContext.values.purchaseData.endereco = stepContext.result;
        }
        return stepContext.prompt(NUMBERHOUSE_NUMBERPROMPT, msg.promptNumberHouse);
    }
    /**
     * Ask for a complement about the address
     * @param {TurnContext} stepContext Dialog Context
     * @returns {Promise<DialogTurnStatus>}
     */
    async complementStep(stepContext) {
        const entitie = recognizer.getEntities(stepContext.context.luisResult);
        stepContext.values.purchaseData.numero = entitie.number[0] || stepContext.result;
        return stepContext.prompt(COMPLEMENT_TEXTPROMPT, msg.promptComplement);

    }
    /**
     * Ask for full name
     * @param {TurnContext} stepContext Dialog Context
     * @returns {Promise<DialogTurnStatus>}
     */
    async nameStep(stepContext) {
        stepContext.values.purchaseData.complemento = stepContext.result;
        return stepContext.prompt(NAME_TEXTPROMPT, msg.promptName);
    }
    /**
     * Question CPF
     * @param {TurnContext} stepContext Dialog Context
     * @returns {Promise<DialogTurnStatus>}
     */
    async cpfStep(stepContext) {
        stepContext.values.purchaseData.nome = stepContext.result;
        return stepContext.prompt(CPF_PROMPT, msg.promptCPF);
    }
    /**
     * Question phone number
     * @param {TurnContext} stepContext Dialog Context
     * @returns {Promise<DialogTurnStatus>}
     */
    async foneStep(stepContext) {
        const entitie = recognizer.getEntities(stepContext.context.luisResult);
        stepContext.values.purchaseData.cpf = entitie.CPF[0] || stepContext.result;
        return stepContext.prompt(FONE_PROMPT, msg.promptFone);
    }
    /**
     * Start new dialog
     * @param {TurnContext} stepContext Dialog Context
     * @returns {Promise<DialogTurnStatus>}
     */
    async newDialogStep(stepContext) {
        const entitie = recognizer.getEntities(stepContext.context.luisResult);
        stepContext.values.purchaseData.telefone = entitie.number[0] || stepContext.result;

        return stepContext.replaceDialog('CHANGEDATA', { data: stepContext.values.purchaseData });
    }



}

module.exports.Register = Register;