const {ipcRenderer} = require('electron');

const ipc = {};

ipc.checkLocalVersions = (state)=>
{
    const localCheck = ipcRenderer.sendSync('checkLocalVersion', state);
    //console.log('Local Versions:');
    //console.log(JSON.stringify(localCheck, null, 2));
    return localCheck;
}

ipc.viewDirectory = (dir, state)=>
{
    if(dir === 'standalone')
    {
        ipcRenderer.sendSync('viewLocalFiles', state.path.standalone);
    }
    if(dir === 'vst')
    {
        ipcRenderer.sendSync('viewLocalFiles', state.path.vst);
    }
}

ipc.update = (productId, state)=>
{
    console.log('UPDATING: '+productId);
    const target = state.products[productId];
    const targetLatest = target.versions[target.latest];
    let dlPath;
    if(target.category === 'standalone')
    {
        dlPath = state.path.standalone;
    }
    if(target.category === 'vst')
    {
        dlPath = state.path.vst;
    }
    const arg = {
        dlPath: dlPath,
        file: targetLatest.file,
        md5: targetLatest.md5,
        productId: productId
    };
    ipcRenderer.send('update', arg);
}

// Incoming Messages
ipcRenderer.on('product-updated', (event, arg) =>{
    ra.finishProductUpdate(arg);
});