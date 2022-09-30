const crypto = require('crypto')
const fs = require('fs');
let out = {};
const path = __dirname+'/../public';
for(let fileName of fs.readdirSync(path))
{
    const file = fs.readFileSync(path+'/'+fileName);
    let hash = crypto.createHash('md5').update(file).digest("hex");
    if(out[file])
    {
        console.log('Duplicate File: '+fileName);
    }
    out[fileName] = hash;
}
console.log(JSON.stringify(out, null, 2));