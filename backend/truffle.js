/*
 * NB: since truffle-hdwallet-provider 0.0.5 you must wrap HDWallet providers in a 
 * function when declaring them. Failure to do so will cause commands to hang. ex:
 * ```
 * mainnet: {
 *     provider: function() { 
 *       return new HDWalletProvider(mnemonic, 'https://mainnet.infura.io/<infura-key>') 
 *     },
 *     network_id: '1',
 *     gas: 4500000,
 *     gasPrice: 10000000000,
 *   },
 */
var HDWalletProvider = require("truffle-hdwallet-provider");

var infura_apikey = "v3/8cf80ccb22dd4231b0b609cad3f58383";
var mnemonic = "letter casino spread lawn water toward extend public gasp turn wave bone";
// place judge dry narrow torch choose elevator pact flight grain beef crucial


module.exports = {
    networks: {
        ropsten: {
            provider: new HDWalletProvider(mnemonic, "https://ropsten.infura.io/" + infura_apikey),
            network_id: 3
        },
        local: {
            provider: new HDWalletProvider(mnemonic, "http://127.0.0.1:8545"),
            gas: 4500000,
            gasPrice: 10000000000,
            network_id: "*"
        }
    }
};