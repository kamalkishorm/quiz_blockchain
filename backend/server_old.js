var express = require('express');
var bodyParser = require('body-parser');
var sql = require("mssql");
var app = express();
var fs = require("fs");
var Web3 = require('web3');
var request = require('request');
var crypto = require('crypto');
const abiDecoder = require('abi-decoder');
const TruffleContract = require('truffle-contract');
const quizABI = require('./build/contracts/Payment.json');

let web3 = new Web3();
// web3.setProvider(new web3.providers.HttpProvider('http://13.82.91.127:8102'));
web3.setProvider(new web3.providers.HttpProvider('HTTP://127.0.0.1:8545'));
this.web3Provider = new Web3.providers.HttpProvider('http://127.0.0.1:8545');

app.use(bodyParser.json());
// Add headers
app.use(function(req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});
// Set the account from where we perform out contract transactions
web3.eth.defaultAccount = web3.eth.coinbase;
var quizContract, quizContractInstance, flag, Connection, Request, TYPES, msSqlConnecter, connection, testdata;
var dbConfig;

fs.readFile(__dirname + "/" + quizABI, 'utf8', function(err, data) {
    // console.log(typeof(data))
    quizContract = TruffleContract(JSON.parse(data));
    quizContract.setProvider(that.web3Provider);

    flag = false;
    abiDecoder.addABI(JSON.parse(data));
    testdata = data;
    dbConfig = {
        user: "sa",
        password: "mssql@123",
        server: "40.71.86.193",
        database: "blockchain"
    };
});

app.get('/checkserver', function(req, res) {
    res.end(testdata)
});

app.post('/getAccountBalance', function(req, res) {
    console.log(req.body.address)
    xa = web3.eth.toWei(web3.eth.getBalance(req.body.address), 'ether').toNumber();
    var d = {};
    d['bal'] = xa; //JSON.parse(xa) / 1.0e18;
    d['address'] = req.body.address;
    res.end(JSON.stringify(d));
    console.log(d)
});

app.post('/LoginHere', function(req, res) {
    console.log(req.body)
    request({
        uri: "http://13.82.91.127:8102/",
        method: "POST",
        json: true,
        body: {
            jsonrpc: "2.0",
            method: "personal_unlockAccount",
            params: [req.body.aaddress, req.body.password, 999999],
            id: 15
        }
    }, function(error, response, body) {
        console.log('error:', error);
        console.log('statusCode:', response && response.statusCode);
        console.log('body:', body);
        res.end(JSON.stringify(body))
    });
})

app.post('/registerUser', function(req, res) {

    var query = "INSERT INTO USER (id,uname,email,pass) VALUES ('" + req.body.id + "','" + req.body.uname + "','" + req.body.email + "','" + req.body.pass + "');"
    console.log(query);
    executeQuery(res, query, output);
    res.end(JSON.stringify(output));

});

app.post('/checkcreditscore', function(req, res) {
    var lenderAccountAddress = req.body.address,
        //_checker = req.body.bankid,
        _target = req.body.companyid;
    var output = {};
    creditscore.checkCreditScoreOFCompany(_target, {
        from: lenderAccountAddress
    }, function(err, result) {
        if (err) {
            console.error(err);
        } else {
            console.log(result);
            output["CreditScore"] = result;
            console.log(output);
        }
        res.end(JSON.stringify(output));
    });
});


app.post('/GetProfile', function(req, res) {
    var address = req.body.address,
        C_UID = req.body.companyid;
    var output = {};
    creditscore.queryCompanyDetails({
        from: address
    }, function(err, result) {
        // console.log(result);

        if (result) {
            output["COMPANYID"] = result[0];
            output["Name"] = result[1];
            output["Credit Score "] = result[2];
            output["Registered Address "] = result[3];
        }
        // console.log("  COMPANYID          	: " + result[0] + "\n"
        // 	+ "   Name           	: " + result[1] + "\n"
        // 	+ "   Credit Score      	: " + result[2] + "\n"
        // 	+ "   Registered Address   : " + result[3]);
        // process.exit();
        console.log(output);
        res.end(JSON.stringify(output));

    });
});

app.post('/AllTxn', function(req, res) {
    var address = req.body.address,
        _between = req.body.lendertype,
        no_transaction = req.body.no_transaction;
    console.log(req.body);
    var output = {};
    creditscore.totalTransaction(_between, {
        from: address
    }, function(err, result) {
        if (err) {
            console.log(err);
            res.end(JSON.stringify(err));
        }
        count = JSON.parse(result);
        output["Total Transaction"] = count;

        if (no_transaction < count) {
            count = no_transaction;
        }
        console.log(count);
        if (count != 0) {
            // var flag = 0;
            var f = 0;
            if (_between == 2) {
                for (var i = 0; i < count; i++) {
                    creditscore.retriveCollectionAgencyTxOnDelay(i, {
                        from: address
                    }, function(err, result) {
                        console.log(result);
                        output[f] = [];
                        if (result) {
                            output[f].push({
                                "collectionAgencyID": result[0]
                            });
                            output[f].push({
                                "lenderID": result[1]
                            });
                            output[f].push({
                                "contractIDOrbankAccountNumber": result[2]
                            });
                            output[f].push({
                                "arrearDays": result[3]
                            });
                            output[f].push({
                                "dueDate": result[4]
                            });
                            output[f].push({
                                "delayReason": result[5]
                            });
                        }

                        console.log(output);
                        f++;
                        // console.log(flag);
                        if (f == count) {
                            res.end(JSON.stringify(output));

                            // process.exit();
                        }
                    });
                }
                // res.end(output);
                // res.end(JSON.stringify(output));
            } else if (_between == 1) {
                for (var i = 0; i < count; i++) {
                    // while (output[i] == null || i==count) {

                    creditscore.retriveTransactionsB2C(i, {
                        from: address
                    }, function(err, result) {
                        output[f] = [];

                        // console.log(result);
                        if (result) {
                            output[f].push({
                                "bankAccountNumber": result[0]
                            });
                            // output[f].push({
                            // 	"bankID": result[1]
                            // });
                            output[f].push({
                                "installmentAmount": result[2]
                            });
                            output[f].push({
                                "txType": result[3]
                            });
                            output[f].push({
                                "dueDate": result[4]
                            });
                            output[f].push({
                                "paymentDate": result[5]
                            });
                            // f++;
                        }

                        console.log(output);
                        f++;
                        // console.log(flag);
                        if (f == count) {
                            res.end(JSON.stringify(output));

                            // process.exit();
                        }
                    });
                    // }
                }
                // res.end(output);
                // res.end(JSON.stringify(output));
            } else if (_between == 0) {
                for (var i = 0; i < count; i++) {
                    creditscore.retriveTransactionC2C(i, {
                        from: address
                    }, function(err, result) {
                        output[f] = [];

                        // console.log(result);
                        if (result) {
                            output[f].push({
                                "company1ID": result[0]
                            });
                            output[f].push({
                                "contractID": result[1]
                            });
                            output[f].push({
                                "installmentAmount": result[2]
                            });
                            output[f].push({
                                "dueDate": result[3]
                            });
                            output[f].push({
                                "daysinArrear": result[4]
                            });
                            output[f].push({
                                "txType": result[5]
                            });
                        }
                        f++;
                        // console.log(flag);
                        if (f == count) {
                            // process.exit();
                            res.end(JSON.stringify(output));

                        }
                    });
                }
                // res.end(output);
                // res.end(JSON.stringify(output));
            }
        } else {
            res.end(JSON.stringify({
                "Number of Transaction": 0
            }));
        }
    });
});

app.post('/GiveAccess', function(req, res) {
    var companyAccountAddress = req.body.address,
        LenderID = req.body.lenderid,
        start_date = 1502320505,
        end_date = 1602320505;

    console.log(req.body);
    var output = {};
    creditscore.giveAccessToCompany(LenderID, start_date, end_date, {
        from: companyAccountAddress,
        gas: 500000
    }, function(err, result) {
        console.log(result);
        output["TransactionMine"] = printTransaction(result);
        output["logs"] = readLogs(result);
        output["TransactionId"] = result;
        res.end(JSON.stringify(output));
    });
})


/***************************************************************Blockchain Explorer**************************************************************************/
function printTransaction(txHash) {
    var output = {};
    var tx = web3.eth.getTransaction(txHash);

    if (tx != null) {
        while (tx.blockNumber == null) {
            var tx = web3.eth.getTransaction(txHash);
        }
        //	  console.log(tx.length());
        output["TransactionDetails"] = tx;
        console.log("  tx hash          : " + tx.hash + "\n" +
            "   nonce           : " + tx.nonce + "\n" +
            "   blockHash       : " + tx.blockHash + "\n" +
            "   blockNumber     : " + tx.blockNumber + "\n" +
            "   transactionIndex: " + tx.transactionIndex + "\n" +
            "   from            : " + tx.from + "\n" +
            "   to              : " + tx.to + "\n" +
            "   value           : " + tx.value + "\n" +
            "   gasPrice        : " + tx.gasPrice + "\n" +
            "   gas             : " + tx.gas
        );
        console.log("   ----------input---------- ");
        const data = abiDecoder.decodeMethod(tx.input);
        if (data != null) {
            output["OprationName"] = data.name;
            console.log(
                "	Opration Name 	: " + data.name + "\n" +
                "	-----------params----------- "
            );
            output["OprationData"] = [];
            data.params.forEach(function(para) {
                output["OprationData"].push(para);
                console.log(
                    "	" + para.name + " 		: " + para.value
                );
            });
        }
    }
    return output;
}

function readLogs(txHash) {
    var output = {};
    var txReceipt = web3.eth.getTransactionReceipt(txHash);
    // console.log(txReceipt);
    // console.log(txReceipt.logs);
    if (txReceipt.logs.length > 0) {
        const decodedLogs = abiDecoder.decodeLogs(txReceipt.logs);
        output["EventName"] = decodedLogs[0].name;
        console.log(
            "	Event Name 	: " + decodedLogs[0].name + "\n" +
            "	-----------params----------- "
        );
        output["EventData"] = [];
        decodedLogs[0].events.forEach(function(para) {
            output["EventData"].push(para);
            console.log(
                "	" + para.name + " 		: " + para.value
            );
        });
        //   alert( decodedLogs[0].events[decodedLogs[0].events.length-1].name + ":" + decodedLogs[0].events[decodedLogs[0].events.length-1].value);
    }
    return output;
}

var executeQuery = function(res, query, output) {
    sql.connect(dbConfig, function(err) {
        if (err) {
            console.log("Error while connecting database :- " + err);
            sql.close();

            res.end(JSON.stringify(err));
        } else {
            // create Request object
            var request = new sql.Request();
            // query to the database
            request.query(query, function(err, ress) {
                if (err) {
                    console.log("Error while querying database :- " + err);
                    sql.close();

                    res.end(JSON.stringify(err));
                } else {
                    sql.close();
                    console.log(ress);
                    res.end(JSON.stringify(output));
                }
            });
        }
    });
}


function twoDigits(d) {
    if (0 <= d && d < 10) return "0" + d.toString();
    if (-10 < d && d < 0) return "-0" + (-1 * d).toString();
    return d.toString();
}

/**
 * …and then create the method to output the date string as desired.
 * Some people hate using prototypes this way, but if you are going
 * to apply this to more than one Date object, having it as a prototype
 * makes sense.
 **/
Date.prototype.toMysqlFormat = function() {
    return this.getUTCFullYear() + "-" + twoDigits(1 + this.getUTCMonth()) + "-" + twoDigits(this.getUTCDate());
};


// function getData(userAddress) {
// 	creditscore.getID(userAddress, {
// 		from: userAddress
// 	}, function(err, result) {
// 		console.log(result);
// 		return result;
// 	});
// }
// function createaccount() {
// 	var pvtKey = crypto.randomBytes(32).toString('hex')
// 	request({
// 	 uri: "http://13.82.91.127:8102/",
// 	 method: "POST",
// 	 json:true,
// 	 body: {
// 	   jsonrpc: "2.0",
// 	   method: "personal_importRawKey",
// 	   params:[pvtKey,"01"],
// 	   id: 15
// 	 }
// 	},function(error,response,body){
// 	 console.log('error:', error);
// 	 console.log('statusCode:', response && response.statusCode);
// 	 console.log('body:', body);
// 	 return body.result;
// 	});
// }

var server = app.listen(8201, function() {
    var host = server.address().address
    var port = server.address().port

    console.log("Example app listening at http://%s:%s", host, port)
})