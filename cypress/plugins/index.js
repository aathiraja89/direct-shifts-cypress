// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

/**
 * @type {Cypress.PluginConfig}
 */

const fs = require('fs-extra');
const path = require('path');

function getConfigurationByFile(environment) {
    const pathToConfigFile = path.resolve(__dirname, '../../cypress/configs', `${environment}.json`
    );
    const pathToAPIConfigFile = path.resolve(__dirname, '../../cypress/configs/apiConfig.json');

    return Object.assign(JSON.parse(fs.readFileSync(pathToConfigFile)), JSON.parse(fs.readFileSync(pathToAPIConfigFile)));
}


// eslint-disable-next-line no-unused-vars
module.exports = (on, config) => {
    // `on` is used to hook into various events Cypress emits
    // `config` is the resolved Cypress config
    require('cypress-grep/src/plugin')(config)
    const file = config.env.configFile || 'test1'
    const environment = config.env.environment || 'staging'

    on('task', {
        generateJwtToken() {
            return new Promise(function (resolve, reject) {
                setTimeout(() => {
                    let privateKey;

                    if ("JWT_PRIVATE_KEY_ENCODED" in config.env) {
                        privateKey = atob(config.env.JWT_PRIVATE_KEY_ENCODED)
                    } else {
                        privateKey = fs.readFileSync(path.resolve(__dirname, `../keys/private_${environment}.pem`));
                    }

                    let token = jwt.sign({
                        sub: "tester@gmail.com",
                        aud: config.baseUrl,
                        iss: "tester@gmail.com",
                        name: "Tester Testerson",
                        firstName: "Tester",
                        lastName: "Testerson",
                        organisation: "directshifts.com",
                        exp: expTime,
                        iat: iatTime
                    }, privateKey, { algorithm: 'RS256' });
                    release();
                    resolve(token);

                    return token;

                }, 3000);
            });
        }
    });

    on('before:browser:launch', (browser = {}, launchOptions) => {
        // launchOptions.args.push('--user-data-dir=/home/user/.config/google-chrome/Default')    
        if (browser.family === 'chromium') {
            launchOptions.args.push('--disable-gpu');
            launchOptions.args.push('--disable-dev-shm-usage');
            launchOptions.args.push('--disable-software-rasterizer');
            launchOptions.args.push('--use-gl=swiftshader');
            launchOptions.args.push('--ignore-gpu-blacklist');
            launchOptions.args.push('--start-fullscreen');
        }

        return launchOptions
    })

    return getConfigurationByFile(environment)
}
