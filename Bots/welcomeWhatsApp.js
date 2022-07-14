const { TwilioWhatsAppAdapter } = require('@botbuildercommunity/adapter-twilio-whatsapp');
const whatsAppAdapter = new TwilioWhatsAppAdapter({
    accountSid: process.env.TwillioId,
    authToken: process.env.TwillioToken,
    phoneNumber: process.env.NumberPhone,
    endpointUrl: process.env.UrlBot
})
module.exports = {
    async whatsAppPost(req, res, bot) {
        await whatsAppAdapter.processActivity(req, res, async (context) => {
            //await context.sendActivity(`Oi! Eu sou o Bici JR,sou craque em pedaladas e vou funcionar como um guidão para te guiar na sua busca!`);
            await bot.run(context);
        });

    }
}