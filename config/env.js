const fs = require('fs');
const path = require('path');
const paths = require('./paths');

// Make sure that including paths.js after env.js will read .env variables.
delete require.cache[require.resolve('./paths')];

const { NODE_ENV = 'mainnet' } = process.env;

const dotenvFiles = [`${paths.dotenv}.${NODE_ENV}`].filter(Boolean);
console.log('dotenvFiles', dotenvFiles);

dotenvFiles.forEach(dotenvFile => {
  if (fs.existsSync(dotenvFile)) {
    require('dotenv-expand')(
      require('dotenv').config({
        path: dotenvFile,
      }),
    );
  }
});

// We support resolving modules according to `NODE_PATH`.
// This lets you use absolute paths in imports inside large monorepos:
// https://github.com/facebookincubator/create-react-app/issues/253.
// It works similar to `NODE_PATH` in Node itself:
// https://nodejs.org/api/modules.html#modules_loading_from_the_global_folders
// Note that unlike in Node, only *relative* paths from `NODE_PATH` are honored.
// Otherwise, we risk importing Node.js core modules into an app instead of Webpack shims.
// https://github.com/facebookincubator/create-react-app/issues/1023#issuecomment-265344421
// We also resolve them to make sure all tools using them work consistently.
const appDirectory = fs.realpathSync(process.cwd());
process.env.NODE_PATH = (process.env.NODE_PATH || '')
  .split(path.delimiter)
  .filter(folder => folder && !path.isAbsolute(folder))
  .map(folder => path.resolve(appDirectory, folder))
  .join(path.delimiter);

// Grab NODE_ENV and REACT_APP_* environment variables and prepare them to be
// injected into the application via DefinePlugin in Webpack configuration.
const REACT_APP = /^REACT_APP_/i;

function getClientEnvironment(publicUrl) {
  const raw = Object.keys(process.env)
    .filter(key => REACT_APP.test(key))
    .reduce(
      (env, key) => {
        env[key] = process.env[key];
        return env;
      },
      {
        ENV: process.env.ENV,
        BUILD_TIME: new Date(),
        // Useful for determining whether we’re running in production mode.
        // Most importantly, it switches React into the correct mode.
        NODE_ENV: process.env.NODE_ENV || 'development',
        // Useful for resolving the correct path to static assets in `public`.
        // For example, <img src={process.env.PUBLIC_URL + '/img/logo.png'} />.
        // This should only be used as an escape hatch. Normally you would put
        // images into the `src` and `import` them in code to get their paths.
        PUBLIC_URL: publicUrl,
        HIDE_CONTRACT_BTN: process.env.HIDE_CONTRACT_BTN === 'true',

        PRIVATE_KEY: process.env.PRIVATE_KEY,

        CHAIN_ID: process.env.CHAIN_ID,
        CHAIN_NAME: process.env.CHAIN_NAME,
        SECRET_RPC: process.env.SECRET_RPC,
        SECRET_LCD: process.env.SECRET_LCD,
        SECRET_POST_ADDRESS: process.env.SECRET_POST_ADDRESS,
        SECRET_WS: process.env.SECRET_WS,
        SSCRT_CONTRACT: process.env.SSCRT_CONTRACT,
        CSHBK_CONTRACT: process.env.CSHBK_CONTRACT,
        MINTER_CONTRACT: process.env.MINTER_CONTRACT,
        MASTER_CONTRACT: process.env.MASTER_CONTRACT,
        SIENNA_CONTRACT: process.env.SIENNA_CONTRACT,
        SEFI_STAKING_CONTRACT: process.env.SEFI_STAKING_CONTRACT,
        SEFI_STAKING_OLD_CONTRACT: process.env.SEFI_STAKING_OLD_CONTRACT,
        FACTORY_CONTRACT: process.env.FACTORY_CONTRACT,

        SIENNA_PROXY_CONTRACT_ETH: process.env.SIENNA_PROXY_CONTRACT_ETH,
        WSCRT_PROXY_CONTRACT_ETH: process.env.WSCRT_PROXY_CONTRACT_ETH,
        SIENNA_PROXY_CONTRACT_BSC: process.env.SIENNA_PROXY_CONTRACT_BSC,
        WSCRT_PROXY_CONTRACT_BSC: process.env.WSCRT_PROXY_CONTRACT_BSC,

        AMM_FACTORY_CONTRACT: process.env.AMM_FACTORY_CONTRACT,
        AMM_ROUTER_CONTRACT: process.env.AMM_ROUTER_CONTRACT,
        AMM_TOKENS: process.env.AMM_TOKENS,
        AMM_PAIRS: process.env.AMM_PAIRS,

        ETH_MANAGER_CONTRACT: process.env.ETH_MANAGER_CONTRACT,
        BSC_MANAGER_CONTRACT: process.env.BSC_MANAGER_CONTRACT,
        PLSM_MANAGER_CONTRACT: process.env.PLSM_MANAGER_CONTRACT,

        SCRT_SWAP_CONTRACT: process.env.SCRT_SWAP_CONTRACT,
        BSC_SCRT_SWAP_CONTRACT: process.env.BSC_SCRT_SWAP_CONTRACT,
        PLSM_SWAP_CONTRACT: process.env.PLSM_SWAP_CONTRACT,

        ETH_EXPLORER_URL: process.env.ETH_EXPLORER_URL,
        BSC_EXPLORER_URL: process.env.BSC_EXPLORER_URL,
        SCRT_EXPLORER_URL: process.env.SCRT_EXPLORER_URL,

        ETH_NODE_URL: process.env.ETH_NODE_URL,
        ETH_GAS_PRICE: process.env.ETH_GAS_PRICE,
        ETH_GAS_LIMIT: process.env.ETH_GAS_LIMIT,

        ETH_GOV_TOKEN_ADDRESS: process.env.ETH_GOV_TOKEN_ADDRESS,
        ETH_DIST_TOKEN_ADDRESS: process.env.ETH_DIST_TOKEN_ADDRESS,

        SCRT_GOV_TOKEN_ADDRESS: process.env.SCRT_GOV_TOKEN_ADDRESS,
        SCRT_DIST_TOKEN_ADDRESS: process.env.SCRT_DIST_TOKEN_ADDRESS,

        SWAP_FEE: process.env.SWAP_FEE,

        GAS_LIMIT: process.env.GAS_LIMIT,
        GAS_PRICE: process.env.GAS_PRICE,

        BACKEND_URL: process.env.BACKEND_URL,
        PLSM_BACKEND_URL: process.env.PLSM_BACKEND_URL,
        BSC_BACKEND_URL: process.env.BSC_BACKEND_URL,

        SUSHI_API: process.env.SUSHI_API,
        GET_TOKENS_SERVICE: process.env.GET_TOKENS_SERVICE,

        TEST_COINS: !!process.env.TEST_COINS,
        SIG_THRESHOLD: process.env.SIG_THRESHOLD,
        LEADER_ACCOUNT_ETH: process.env.LEADER_ACCOUNT_ETH,
        LEADER_ACCOUNT_BSC: process.env.LEADER_ACCOUNT_BSC,
        
        IS_MAINTENANCE: process.env.IS_MAINTENANCE,
        TRANSAK_URL: process.env.TRANSAK_URL,
      },
    );
  // Stringify all values so we can feed into Webpack DefinePlugin
  const stringified = {
    'process.env': Object.keys(raw).reduce((env, key) => {
      env[key] = JSON.stringify(raw[key]);
      return env;
    }, {}),
  };

  return { raw, stringified };
}

module.exports = getClientEnvironment;
