/*
package this js file (template_dapp.js) with required packages using command below

browserify template_dapp.js -o main.js

*/
var INFURAIO_TOKEN = "chim_himidumage";
var PROVIDER_NODE = 'https://ropsten.infura.io/' + INFURAIO_TOKEN;
var currentChainId = 3;
var CONTRACT_ABI_ADD = JSON.parse('[ { "constant": true, "inputs": [], "name": "getValue", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "name": "val", "type": "uint256" } ], "name": "addValue", "outputs": [], "payable": true, "stateMutability": "payable", "type": "function" }, { "constant": false, "inputs": [], "name": "resetValue", "outputs": [], "payable": true, "stateMutability": "payable", "type": "function" }, { "inputs": [], "payable": false, "stateMutability": "nonpayable", "type": "constructor" } ]');

var CONTRACT_CODE_ADD = '0x6060604052341561000f57600080fd5b6000808190555060ec806100246000396000f3006060604052600436106053576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806316e9fe81146058578063209652551460605780635b9af12b146086575b600080fd5b605e609c565b005b3415606a57600080fd5b607060a5565b6040518082815260200191505060405180910390f35b609a600480803590602001909190505060ae565b005b60008081905550565b60008054905090565b806000808282540192505081905550505600a165627a7a723058207ddd45e839106929eafa927e15598691cfa2754d95c1b12cd77bed3c35869dd20029';

var CONTRACT_ADDRESS_ADD = "0xe0ba26d4ff33796d3e6c69d7f9c0842aa82bebd3";

var CONTRACT_OWNER_ADDR = "0x00002d5cc95777ed0f1dbcac9b5a30fb1868eea4"; //This account should have an Ether balance
var CONTRACT_OWNER_PVTK = "27f1693deb0dcf2b845c52c78f72bdacd3b9027eb65bcb577ee414600f4e9ae1";

var LIST_INDEX = '0';


var GAS_LIMIT = 4500000;


//Initialise the app instance
var _web3jsraw = require('web3js-raw');

var W3JSR = new _web3jsraw();
W3JSR.setProvider(PROVIDER_NODE);

var privateKey = new Buffer(CONTRACT_OWNER_PVTK, 'hex');

W3JSR.createContractInstance(CONTRACT_ABI_ADD,CONTRACT_ADDRESS_ADD);
// Initialize values
document.getElementById('numberToAdd').value = "3";
//Event bindings

document.getElementById('addValue').addEventListener('click',onAddValueButtonClick);
document.getElementById('showValue').addEventListener('click',onShowValueButtonClick);
document.getElementById('resetValue').addEventListener('click',onResetValueButtonClick);

//Event listener funtions
function onAddValueButtonClick(){
    var contractOwner = CONTRACT_OWNER_ADDR;
    var value = document.getElementById('numberToAdd').value;

    var functionName = 'addValue';
    var types = ['uint256'];
    var args = [value];

    var txnData = W3JSR.encodeFunctionParams(functionName, types, args);

    var txnRawData = W3JSR.getDefaultTxnAttributes('',contractOwner,CONTRACT_ADDRESS_ADD,'0',txnData,'','')
    var serializedTx = W3JSR.getSignedTransaction(txnRawData, privateKey);

    W3JSR.invokeSendRawTransaction(functionName,serializedTx,web3jsrCallaback);
}

function onShowValueButtonClick(){
    W3JSR.ContractInstance.getValue(function(error, result){
        if(!error){
            console.log("getCurrentValue", result);
            var val = result;
            var str= "getCurrentValue - ".concat(result);
            addRowToConsole(str);
        }
        else
            console.error(error);
    });
}

function onResetValueButtonClick(){
    var contractOwner = CONTRACT_OWNER_ADDR;

    var functionName = 'resetValue';
    var types = [];
    var args = [];

    var txnData = W3JSR.encodeFunctionParams(functionName, types, args);

    var txnRawData = W3JSR.getDefaultTxnAttributes('',contractOwner,CONTRACT_ADDRESS_ADD,'0',txnData,'','')
    var serializedTx = W3JSR.getSignedTransaction(txnRawData, privateKey);

    W3JSR.invokeSendRawTransaction(functionName,serializedTx,web3jsrCallaback);
}

var web3jsrCallaback = function (data){
    console.log("web3jsrCallaback - ", data);
    setTxnHash(data.functionName,data.message);
}

function addRowToConsole(rowContent){

    var temp = document.createElement("div");
    temp.innerHTML = getHTMLBlock(rowContent);

    var parent = document.getElementById('txnConsole');
    parent.insertBefore(temp,parent.firstChild);

}

function getHTMLBlock(content){
    var html;
    html = '<div class="txnrow">' + content + '</div>';
    return html;
}


function setTxnHash(callerName, txnHash){
    document.getElementById('txnHash').value = txnHash;
    var url = "https://ropsten.etherscan.io/tx/" + txnHash;
    var link = '<a href="' + url + '" target="_blank">'+txnHash+'<img border="0" alt="W3Schools" src="https://ropsten.etherscan.io/images/favicon2.ico" width="15" height="15"></a>';

    addRowToConsole("   Txn Hash for " + callerName + " - " + link );
}
