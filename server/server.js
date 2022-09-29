const express = require('express');
const app = express();
const port = 3000;

app.use(express.static('public'))

app.get('/', (req, res) => {
     res.send('Hello World!');
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

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});