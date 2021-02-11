const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const app = express();
const compression = require('compression');
const errorHandler = require('errorhandler');
const morgan = require('morgan');
const expiry = require('static-expiry');
const hbs = require('express-hbs');
const http = require('http');
const path = require('path');
const os = require('os');
const routes = require('./routes');
const api = require('./api');
const config = require('./config')
const atlassianConnect = require('atlassian-connect-express');
const MongoClient = require('mongodb').MongoClient;

const IssuesGateway = require('./gateways/IssuesGateway');
const FiltersGateway = require('./gateways/FiltersGateway');
const UsersGateway = require('./gateways/UsersGateway');
const StatusesGateway = require('./gateways/StatusesGateway');
const JiraService = require('./core/JiraService');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());

const databaseClient = new MongoClient("mongodb+srv://kiwi:w4Iwm9cIQFf3ZTar@mongodb.wuc2n.mongodb.net/jira?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

(async function initialiseApp() {

    const dbConnection = await databaseClient.connect();
    const database = await dbConnection.db(config.databaseName);

    process.env.PWD = process.env.PWD || process.cwd();

    const staticDir = path.join(__dirname, 'public');

    const viewsDir = path.join(__dirname, 'views');

    const addon = atlassianConnect(app);

    const port = addon.config.port();

    const devEnv = app.get('env') == 'development';

    app.set('port', port);

    app.set('view engine', 'hbs');

    app.set('views', viewsDir);

    app.use(morgan(devEnv ? 'dev' : 'combined'));

    app.use(compression());

    app.use(addon.middleware());

    app.use(expiry(app, { dir: staticDir, debug: devEnv }));

    app.use(express.static(staticDir));

    if (devEnv) app.use(errorHandler());

    app.use(api({ database }));

    app.use(routes({
        issuesGateway: new IssuesGateway({
            jiraService: new JiraService({
                apiUsername: config.apiUsername,
                apiToken: config.apiToken,
                apiUrl: config.apiUrl,
            }),
        }),
        filtersGateway: new FiltersGateway({
            jiraService: new JiraService({
                apiUsername: config.apiUsername,
                apiToken: config.apiToken,
                apiUrl: config.apiUrl,
            }),
        }),
        usersGateway: new UsersGateway({
            jiraService: new JiraService({
                apiUsername: config.apiUsername,
                apiToken: config.apiToken,
                apiUrl: config.apiUrl,
            }),
        }),
        statusesGateway: new StatusesGateway({
            jiraService: new JiraService({
                apiUsername: config.apiUsername,
                apiToken: config.apiToken,
                apiUrl: config.apiUrl,
            }),
        }),
    }));

    process.on('exit', onExit);
    process.on('SIGINT', onExit);
    process.on('beforeExit', onExit);
    process.on('uncaughtException', onExit);

    function onExit(options, exitCode) {
        process.exit();
    }

    http.createServer(app)
        .listen(port, async function () {
            console.log('Add-on server running at http://' + os.hostname() + ':' + port);
            if (devEnv) {
                try {
                    await addon
                        .register()
                } catch (error) {
                    console.log('Addon connection error', error)
                }
            };
        });
})();
