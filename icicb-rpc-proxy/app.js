require("dotenv").config();
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
const HTTP_PORT = process.env.HTTP_PORT || 80;
const HTTPS_PORT = process.env.HTTPS_PORT || 443;

const fs = require("fs");
const path = require("path");
const express = require("express");
const cors = require('cors');
const request = require('request');
const shrinkRay = require('shrink-ray-current')
const app = express();
const http = require('http');
const https = require('https');
const server = http.createServer(app);
let serverHttps = null;

const file_key = __dirname+'/certs/private.key';
const file_crt = __dirname+'/certs/star.icicbchain.org.crt';
const file_ca = __dirname+'/certs/star.icicbchain.org.ca-bundle';
if (fs.existsSync(file_key) && fs.existsSync(file_crt) && fs.existsSync(file_ca)) {
    const key = fs.readFileSync(file_key, 'utf8')
    const cert = fs.readFileSync(file_crt, 'utf8')
    const caBundle = fs.readFileSync(file_ca, 'utf8')
    const ca = caBundle.split('-----END CERTIFICATE-----\n') .map((cert) => cert +'-----END CERTIFICATE-----\n')
    ca.pop()
    const options = {cert,key,ca}
    
    serverHttps = https.createServer(options,app)
} else {
    console.log("Did not find ssl files, disabled ssl features.")
}

/* let allowedOrigins = [
    'chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn',
    'http://localhost:3000','http://127.0.0.1:3000',
    'http://localhost','http://127.0.0.1'
]; */
app.use(shrinkRay());
app.use(cors({
    origin: function(origin, callback){
        return callback(null, true);
        /* if (origin===undefined || origin==='null' || allowedOrigins.indexOf(origin) === 0) {
            return callback(null, true);	  
        }
        console.log('origin',origin);
        var msg = 'The CORS policy for this site does not allow access from the specified Origin.';
        return callback(new Error(msg), false); */
    }
}));

/* app.use(express.urlencoded({ extended: true })); */
app.use(express.json());
app.post('/:chain?', async(req, res) => {
    const chain = req.params.chain;
	try {
        if (chain==='eth') {
            request('http://127.0.0.1:8545', {method:"post", headers:{'Content-Type':'application/json'}, json:req.body},(err, res1, body) => {
                if (err) res.json({err});
                res.json(body);
            })
        } else if (chain==='bsc') {
            request('https://bsc-dataseed4.binance.org/', {method:"post", headers:{'Content-Type':'application/json'}, json:req.body},(err, res1, body) => {
                if (err) res.json({err});
                res.json(body);
            })
        } else if (chain==='bsctest') {
            request('https://data-seed-prebsc-1-s1.binance.org:8545/', {method:"post", headers:{'Content-Type':'application/json'}, json:req.body},(err, res1, body) => {
                if (err) res.json({err});
                res.json(body);
            })
        } else if (chain==='graphql') {
            request('http://127.0.0.1:16761/graphql', {method:"post", headers:{'Content-Type':'application/json'}, json:req.body},(err, res1, body) => {
                if (err) res.json({err});
                res.json(body);
            })
        } else {
            request('http://127.0.0.1:5050', {method:"post", headers:{'Content-Type':'application/json'}, json:req.body},(err, res1, body) => {
                if (err) res.json({err});
                res.json(body);
            })    
        }
	} catch (err) {
		res.json({err});
	}
});
const FRONTENDPATH = path.normalize(__dirname + '/../icicb-explorer/dist');
app.use(express.static(FRONTENDPATH));
app.get('*', (req,res) => {
    if (fs.existsSync(FRONTENDPATH+'/index.html')) {
        res.sendFile(FRONTENDPATH+'/index.html')
    } else {
        res.status(404).send('')
    }
});
server.listen(HTTP_PORT, async err => {
    if (err) return console.log('HTTPS Server', err)
    console.log('HTTP Server Started at port ' + HTTP_PORT)
})
if (serverHttps) {
    serverHttps.listen(HTTPS_PORT, async err => {
        if (err) return console.log('HTTPS Server', err)
        console.log('HTTPS Server Started at port ' + HTTPS_PORT)
    })
}
