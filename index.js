require('dotenv').config();
const dataBase = require('./DataBase/connection');
const cors = require('cors');
const restify = require('restify');
const {
    CloudAdapter,
    ConfigurationServiceClientCredentialFactory,
    ConversationState,
    createBotFrameworkAuthenticationFromConfiguration,
    MemoryStorage,
    UserState
} = require('botbuilder');

const { WelcomeBot } = require('./Bots/welcomeBot');
const { MainDialog } = require('./Dialogs/mainDialog');
const { BikeRecognizer } = require('./Luis/BikeRecognizer');

const server = restify.createServer();
server.use(restify.plugins.bodyParser());

server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log(`\n${server.name} listening to ${server.url}`);
});
dataBase.connection();

const credentialsFactory = new ConfigurationServiceClientCredentialFactory({
    MicrosoftAppId: process.env.MicrosoftAppId,
    MicrosoftAppPassword: process.env.MicrosoftAppPassword,
    MicrosoftAppType: process.env.MicrosoftAppType,
    MicrosoftAppTenantId: process.env.MicrosoftAppTenantId
});

const botFrameworkAuthentication = createBotFrameworkAuthenticationFromConfiguration(null, credentialsFactory);

const adapter = new CloudAdapter(botFrameworkAuthentication);


const { LuisAppId, LuisAPIKey, LuisAPIHostName } = process.env;
const luisConfig = { applicationId: LuisAppId, endpointKey: LuisAPIKey, endpoint: `https://${LuisAPIHostName}` };

const memoryStorage = new MemoryStorage();

const userState = new UserState(memoryStorage);
const conversationState = new ConversationState(memoryStorage);

const luis = new BikeRecognizer(luisConfig);
const dialog = new MainDialog();
const bot = new WelcomeBot(conversationState, userState, dialog, luis);

adapter.onTurnError = async (context, error) => {
    console.error(`\n [onTurnError] unhandled error: ${error}`);
    await context.sendTraceActivity(
        'OnTurnError Trace',
        `${error}`,
        'https://www.botframework.com/schemas/error',
        'TurnError'
    );

    await context.sendActivity('The bot encountered an error or bug.');
    await context.sendActivity('To continue to run this bot, please fix the bot source code.');
    await conversationState.clear(context);
};

server.post('/api/messages', async (req, res) => {
    await adapter.process(req, res, (context) =>bot.run(context));
});
