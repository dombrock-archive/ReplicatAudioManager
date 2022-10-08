const db = require('./db');

async function log(req)
{
    const logPkg = {
        baseUrl: req.baseUrl,
        method: req.method,
        originalUrl: req.originalUrl,
        query: JSON.stringify(req.query),
        path: req.path,
        params: JSON.stringify(req.params),
        ip: req.ip
    };
    console.log('///REQUEST///');
    console.log(logPkg.ip);
    console.log(logPkg.method, logPkg.path);
    if(logPkg.query !== '{}')
    {
        console.log(logPkg.query);
    }
    if(logPkg.params !== '{}')
    {
        console.log(logPkg.params);
    }
    console.log('///////');
    await db.Logs.create(logPkg);
}

async function download(req, target)
{
    const logPkg = {
        target: target,
        ip: req.ip
    };
    await db.Downloads.create(logPkg);
}

module.exports = {
    log,
    download
};