To add the contracts:

1. Clone github.com/superpowerlabs/syn-nfts and put the two repos in the same folder.

2. In `syn-nfts`, set an `.env` file containing

```
INFURA_API_KEY=f3fe1818a2ec4c249d91c2224c27b784
OWNER_PRIVATE_KEY=0x55938ae9a779320ec1ddb0f4d8ca9e6440ebc320a7ca3c98a0b453b1ddf2b17a
```

The private key is the wallet 1 in Hardhat default signers

3. In a terminal, in the root of syn-nfts, you can launch

```
npx hardhat node
```

to start a local blockchain.

4. Deploy the contracts to localhost with

```
bin/deploy.sh passes localhost
bin/deploy.sh claim localhost
```

5. Export the data to claiming-app:

```
bin/export-for-claim.sh
```

6. In claiming-app, you should find a file `deployed.json` with the addresses where you have deployed the contracts in the folder `src/config`

7. Install new packages

```
npm i
```

8. Start the app and connect the wallet.

```
npm start
```

Good luck!
