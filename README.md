# Pallet Rent Gaming Use-Case

## Introduction

This project demonstrates a gaming use-case using the [pallet-rent](https://github.com/ok-Alice/pallet-rent) pallet.

This project uses the foundations from the following projects:

- [substrate-front-end-template](https://github.com/substrate-developer-hub/substrate-front-end-template)
- [Create React App](https://github.com/facebook/create-react-app)
- [Polkadot js API](https://polkadot.js.org/docs/api/)
- [Semantic UI](https://semantic-ui.com/).

## Features

This project showcases the ability to create, rent out, rent, destroy, and equip items onto a "character" using the pallet-rent pallet.
Communication with the `pallet-rent` pallet is done by using the foundations foundations provided by the substrate-front-end-template project which provide easy-to-use interfaces to connect with Substrate nodes and your Polkadot wallet.

## Requirements

The project requires [Yarn](https://yarnpkg.com/) to be installed.

## Usage

To get started, clone the repository and install the dependencies:

```bash
Copy code
git clone https://github.com/ok-Alice/nft-on-rent-ui.git
cd nft-on-rent-ui
yarn install
```

### You can start the project in development mode to connect to a locally running node:

```
yarn start

```

### To build the production version of the project, run:

```
yarn build
```

and open `build/index.html` in your favorite browser.

## Configuration

The template's configuration is stored in the `src/config` directory, with
`common.json` being loaded first, then the environment-specific json file,
and finally environment variables, with precedence.

- `development.json` affects the development environment
- `test.json` affects the test environment, triggered in `yarn test` command.
- `production.json` affects the production environment, triggered in
  `yarn build` command.

Some environment variables are read and integrated in the template `config` object,
including:

- `REACT_APP_PROVIDER_SOCKET` overriding `config[PROVIDER_SOCKET]`

More on [React environment variables](https://create-react-app.dev/docs/adding-custom-environment-variables).

When writing and deploying your own front end, you should configure:

- `PROVIDER_SOCKET` in `src/config/production.json` pointing to your own
  deployed node.

### Specifying Connecting WebSocket

There are two ways to specify it:

- With `PROVIDER_SOCKET` in `{common, development, production}.json`.
- With `rpc=<ws or wss connection>` query parameter after the URL. This overrides the above setting.

## Reusable Components

### useSubstrate Custom Hook

The custom hook `useSubstrate()` provides access to the Polkadot js API and thus the
keyring and the blockchain itself. Specifically it exposes this API.

```js
{
  setCurrentAccount: func(acct) {...}
  state: {
    socket,
    keyring,
    keyringState,
    api,
    apiState,
    currentAccount
  }
}
```

- `socket` - The remote provider socket it is connecting to.
- `keyring` - A keyring of accounts available to the user.
- `keyringState` - One of `"READY"` or `"ERROR"` states. `keyring` is valid
  only when `keyringState === "READY"`.
- `api` - The remote api to the connected node.
- `apiState` - One of `"CONNECTING"`, `"READY"`, or `"ERROR"` states. `api` is valid
  only when `apiState === "READY"`.
- `currentAccount` - The current selected account pair in the application context.
- `setCurrentAccount` - Function to update the `currentAccount` value in the application context.

If you are only interested in reading the `state`, there is a shorthand `useSubstrateState()` just to retrieve the state.

### Account Selector

The [Account Selector](./src/AccountSelector.js) provides the user with a unified way to
select their account from a keyring. If the Balances module is installed in the runtime,
it also displays the user's token balance. It is included in the template already.

## Author

This project was created by Kenneth Verbeure.

## License

This project is licensed under the MIT License.
