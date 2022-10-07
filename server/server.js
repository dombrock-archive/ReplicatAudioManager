const express = require('express');
const app = express();
const port = 3000;

const path = require('path');

const products = require('./products.json');


app.use(express.static('public'));


app.get('/download', (req, res) => {
    console.log('/download');
    const fs = require('fs');
    const target = req.query.target;
    const path =__dirname+'/dist/'+target;
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

app.get('/motd', (req, res) => {
    console.log('/motd');
    res.send('This is the message of the day!');
});

app.get('/currentVersion', (req, res) => {
    console.log('/currentVersion');
    const out = {
        version: '0.3.5',
        md5: 'df9ffadfa2618e65322816818e3bbee0'
    }
    res.json(out);
});

app.get('/products', (req, res) => {
    console.log('/products');
    // const category = req.query.category;
    // const categoryJSON = JSON.parse(category);
    // if(!categoryJSON)
    // {
    //     console.log('Cant parse category JSON');
    //     console.log(category);
    //     return;
    // }

    // let out = {};
    // for (const [productId, data] of Object.entries(products))
    // {
    //     if(data.category == 'standalone')
    //     {
    //         out[productId] = data;
    //     }
    // }
    // res.json(out);
    res.json(products);
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});