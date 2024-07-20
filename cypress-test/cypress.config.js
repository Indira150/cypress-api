const { defineConfig } = require("cypress");
const createBundler = require("@bahmutov/cypress-esbuild-preprocessor");
const preprocessor = require("@badeball/cypress-cucumber-preprocessor");
const createEsbuildPlugin = require("@badeball/cypress-cucumber-preprocessor/esbuild");
const { MongoClient, ObjectId } = require('mongodb');

async function setupNodeEvents(on, config) {
    await preprocessor.addCucumberPreprocessorPlugin(on, config);

    on(
        "file:preprocessor",
        createBundler({
            plugins: [createEsbuildPlugin.default(config)],
        })
    );

    on('task', {
        async findOne({ collection, query }) {
            const client = new MongoClient(config.env.mongodb.uri, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });

            await client.connect();
            const db = client.db(config.env.mongodb.database);
            
            const result = await db.collection(collection).findOne(query);
            await client.close();

            return result;
        },
    });

    return config;
}

module.exports = defineConfig({
    e2e: {
        setupNodeEvents,
        specPattern: "cypress/e2e/features/*.feature",
        baseUrl: "https://dev-sl.kapaqnan.net",
        chromeWebSecurity: false,
    },
    env: {
        mongodb: {
            uri: "mongodb+srv://user_reader:joCx3WKCAlVqeqbD@cluster-test.euppsll.mongodb.net/?retryWrites=true&w=majority",
            database: "openBanking", 
        }
    }
});