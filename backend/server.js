var express = require('express');
var bodyParser = require('body-parser');
var mssql = require("mssql");
var jwt = require('jsonwebtoken');

var fs = require("fs");
var Web3 = require('web3');
var request = require('request');
var crypto = require('crypto');
const abiDecoder = require('abi-decoder');
const TruffleContract = require('truffle-contract');
var HDWalletProvider = require("truffle-hdwallet-provider");


/******************************************* Configuration ***********************************************/
var app = express();
app.use(bodyParser.json());
process.env.SECRET_KEY = "userKey";
// Add headers
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

var infura_apikey = "v3/8cf80ccb22dd4231b0b609cad3f58383";
var mnemonic = "letter casino spread lawn water toward extend public gasp turn wave bone";
var localRPC = "HTTP://127.0.0.1:8545"
let web3 = new Web3();
// var web3Provider = new HDWalletProvider(mnemonic, localRPC)
// web3.setProvider(new Web3.providers.HttpProvider(localRPC));
var web3Provider = new HDWalletProvider(mnemonic, "https://ropsten.infura.io/" + infura_apikey)
web3.setProvider(new Web3.providers.HttpProvider("https://ropsten.infura.io/" + infura_apikey));

web3.eth.defaultAccount = "0xdd56707585Bd9392500bBb30eEf767fb33299FF8";
var dbConfig, quizContract;
fs.readFile(__dirname + "/" + "build/contracts/Quiz.json", 'utf8', function(err, data) {
    quizContract = TruffleContract(JSON.parse(data));
    quizContract.setProvider(web3Provider);
    console.log(web3Provider.addresses[0]);
    quizContract.defaults({ from: web3Provider.addresses[0] });

    abiDecoder.addABI(JSON.parse(data).abi);

    dbConfig = {
        user: "sa",
        password: "mssql@123",
        server: "40.71.86.193",
        database: "blockchain",
        options: {
            encrypt: true
        }
    };

});

/******************************************* SQL Query ***********************************************/


app.post('/usersList', function(req, res) {
    var userIdPointer_Low = req.body.userIdPointer;
    var userIdPointer_High = userIdPointer_Low + 10;
    var query = "select id,uname,email from (SELECT ROW_NUMBER() OVER(ORDER BY id ASC) AS Row_, id,uname,email FROM [dbo].[users]) as X where ROW_ between " + userIdPointer_Low + " and " + userIdPointer_High;
    // var query = "Select id,uname,email from [dbo].[users] where id > " + userIdPointer_Low + " and id <= " + userIdPointer_High;
    console.log(query);
    mssql.close()
    mssql.connect(dbConfig, function(err) {
        if (err) {
            console.log("Error while connecting database :- " + err);
            res.status(500).json(err).end();
        } else {
            var request = new mssql.Request();
            request.query(query, function(err, result) {
                if (err) {
                    console.log("Error while querying database :- " + err);
                    res.status(400).json(err).end();
                } else {
                    console.log(result);
                    res.status(200).json(result.recordset).end();
                }
            });
        }
    });
});

app.post('/adminlogin', function(req, res) {
    var id = req.body.id;
    var password = req.body.password;

    if (id === "admin" && password === "admin") {
        var result = {
            "username": "admin",
            "password": "admin"
        };
        let token = jwt.sign(result, process.env.SECRET_KEY, {
            expiresIn: 1440
        });
        var data = {
            "username": "admin",
            "token": token
        };
        res.status(200).json(data).end();
    }
});

app.post('/userinfo', function(req, res) {
    mssql.close();
    var query = "SELECT id,uname,email FROM users WHERE id = '" + req.body.id + "';";
    console.log(query);
    mssql.connect(dbConfig, function(err) {
        if (err) {
            appData["error"] = 1;
            appData["data"] = "Internal Server Error";
            res.status(500).json(appData).end();
        } else {
            var request = new mssql.Request();
            request.query(query, function(err, result) {
                if (err) {
                    appData.error = 0;
                    appData["data"] = "User not registered !";
                    res.status(201).json(appData).end();
                } else {
                    console.log(result);
                    res.status(200).json(result.recordsets).end();

                }
            });
        }
    });
});
app.post('/login', function(req, res) {
    var appData = {};
    mssql.close();
    var password = req.body.password;
    var query = "SELECT * FROM users WHERE id = '" + req.body.id + "';";
    console.log(query);
    mssql.connect(dbConfig, function(err) {
        if (err) {
            appData["error"] = 1;
            appData["data"] = "Internal Server Error";
            res.status(500).json(appData).end();
        } else {
            var request = new mssql.Request();
            request.query(query, function(err, result) {
                if (err) {
                    appData.error = 0;
                    appData["data"] = "User not registered !";
                    res.status(201).json(appData).end();
                } else {
                    console.log(result);
                    if (result.recordset.length > 0) {
                        if (result.recordset[0].pass == password) {
                            let token = jwt.sign(result.recordset[0], process.env.SECRET_KEY, {
                                expiresIn: 1440
                            });
                            appData.error = 0;
                            appData["token"] = token;
                            res.status(200).json(appData).end();
                        } else {
                            console.log("pass")
                            appData.error = 1;
                            appData["data"] = "UID and Password does not match";
                            res.status(400).json(appData).end();
                        }
                    } else {
                        appData.error = 1;
                        appData["data"] = "UID does not exists!";
                        res.status(400).json(appData).end();
                    }
                }
            });
        }
    });

});

app.post('/register', function(req, res) {
    var today = new Date();
    var uname = req.body.uname;
    today = today.toLocaleDateString() + " " + today.toLocaleTimeString();
    var appData = {
        "error": 1,
        "data": ""
    };
    mssql.close();
    var query = "INSERT INTO [dbo].[users] VALUES('" + req.body.uname + "','" + req.body.email + "','" + req.body.password + "','" + today + "');";
    console.log(query);
    mssql.connect(dbConfig, function(err) {
        if (err) {
            appData["error"] = 1;
            appData["data"] = "Internal Server Error";
            res.status(500).json(appData).end();
        } else {
            var request = new mssql.Request();
            request.query(query, function(err, result) {
                if (!err) {
                    var getID = new mssql.Request();
                    var q = "Select id from [dbo].[users] where uname like '" + uname + "'";
                    console.log(q);
                    getID.query(q, function(err, rst) {
                        if (!err) {
                            appData.error = 0;
                            appData["data"] = "User registered successfully!";
                            appData["id"] = rst.recordsets[0][0].id;
                            res.status(201).json(appData).end();
                        } else {
                            appData["data"] = "Error Occured!";
                            appData["Error"] = err;
                            res.status(400).json(appData).end();
                        }
                    })

                } else {
                    appData["data"] = "Error Occured!";
                    appData["Error"] = err;
                    res.status(400).json(appData).end();
                }
            });
        }
    });
});

app.get('/taketest', function(req, res) {
    var query = "select top 5 id,question,choice1,choice2,choice3,choice4,answer from [dbo].[QandA] where is_active=1 order by newid()";
    console.log(query);
    mssql.close()
    mssql.connect(dbConfig, function(err) {
        if (err) {
            console.log("Error while connecting database :- " + err);
            res.status(500).json(err).end();
        } else {
            var request = new mssql.Request();
            request.query(query, function(err, result) {
                if (err) {
                    console.log("Error while querying database :- " + err);
                    res.status(400).json(err).end();
                } else {
                    console.log(result);
                    res.status(200).json(result.recordset).end();
                }
            });
        }
    });
});

app.post('/qanda', function(req, res) {
    var qandapointer_low = req.body.qandapointer;
    var qandapointer_high = qandapointer_low + 10;
    var query = "select id,question,choice1,choice2,choice3,choice4,answer,is_active from (SELECT ROW_NUMBER() OVER(ORDER BY id ASC) AS Row_, * FROM [dbo].[qanda]) as X where ROW_ between " + qandapointer_low + " and " + qandapointer_high;
    console.log(query);
    mssql.close()
    mssql.connect(dbConfig, function(err) {
        if (err) {
            console.log("Error while connecting database :- " + err);
            res.status(500).json(err).end();
        } else {
            var request = new mssql.Request();
            request.query(query, function(err, result) {
                if (err) {
                    console.log("Error while querying database :- " + err);
                    res.status(400).json(err).end();
                } else {
                    console.log(result);
                    res.status(200).json(result.recordset).end();
                }
            });
        }
    });
});
/******************************************* Blockchain ***********************************************/

app.get('/getAccountBalance', function(req, res) {
    // console.log(req.body.address)
    var x = web3.fromWei(web3.eth.getBalance(web3.eth.defaultAccount));
    console.log(web3.eth.getBalance(web3.eth.defaultAccount));
    // xa = web3.fromWei(x, 'ether');
    // console.log(xa)
    var data = {
        "balance": JSON.parse(x),
        "address": web3.eth.defaultAccount
    };
    // data['balance'] = JSON.parse(xa);
    // data['address'] = req.body.address;
    console.log(data)

    res.end(JSON.stringify(data));

});

app.post('/updateUserResult', function(req, res) {
    var id = req.body.id;
    var score = req.body.score;
    quizContract.deployed().then(function(instance) {
        return instance;
    }).then(function(instance) {
        instance.addTestResult(id, score).then(function(rst) {
            console.log(rst);
            res.json(rst).end();
        }).catch(e => {
            console.log(e);
            res.json(e).end();
        });
    });
});
app.post('/getUserResult', function(req, res) {
        var id = req.body.id;
        quizContract.deployed().then(function(instance) {
            return instance;
        }).then(function(instance) {
            instance.getResult(id).then(function(result) {
                res.json(result).end();

            })
        }).catch(e => {
            console.log(e);
            res.json(quizContract).end();
        });
    })
    /******************************************* Server ***********************************************/
var server = app.listen(3300, function() {
    var host = server.address().address
    var port = server.address().port

    console.log("Example app listening at http://%s:%s", host, port)
})