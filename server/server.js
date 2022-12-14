const express = require('express');
const app = express();

const db = require('./db');

let port = 1337;
if(process.argv[2])
{
    const safePort = parseInt(process.argv[2]);
    if(isNaN(safePort)==false)
    {
        port = safePort;
    }
    else
    {
        console.log('Port must be an integer! Got: '+process.argv[2]);
        console.log('Port will default to '+port);
    }
}

const analytics = require('./analytics');

const products = require('./products.json');

const logger = function (req, res, next)
{
    analytics.log(req);
    next();
}
app.use(logger);

app.use(express.static('public'));

app.set('json spaces', 2);//JSON formatting

app.get('/download', (req, res) => {
    const fs = require('fs');
    const target = req.query.target;
    const path =__dirname+'/dist/'+target;
    analytics.download(req, target);
    console.log('Download Requested: '+target);
    if(fs.existsSync(path))
    {
        console.log('Found target!');
        res.sendFile(path);
    }
    else
    {
        console.log('Target can not be found!');
        res.sendStatus(404);
    }
});

app.get('/downloadAnalytics', async (req, res) => {
    const json = await db.Downloads.findAll();
    res.json(json);
});

app.get('/logs', async (req, res) => {
    const json = await db.Logs.findAll();
    res.json(json);
});

app.get('/motd', (req, res) => {
    res.send('This is the message of the day!');
});

app.get('/currentVersion', (req, res) => {
    const out = {
        version: '0.3.5',
        md5: 'df9ffadfa2618e65322816818e3bbee0'
    }
    res.json(out);
});

app.get('/products', (req, res) => {
    res.json(products);
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});