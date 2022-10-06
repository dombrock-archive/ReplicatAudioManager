const {ipcRenderer} = require('electron');

const ipc = {};

ipc.checkLocalVersions = ()=>
{
    const localCheck = ipcRenderer.sendSync('checkLocalVersion', state);
    console.log('Local Versions:');
    console.log(JSON.stringify(localCheck, null, 2));
    return localCheck;
}

ipc.viewDirectory = (dir)=>
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

ipc.update = (productId)=>
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
        md5: targetLatest.md5
    };
    alert('The update will start when you click OK. There is no progress bar at this time. You will be alerted when the update is complete.');
    const download = ipcRenderer.sendSync('update', arg);
    console.log('Download Message: '+download);
    if(download === 'success')
    {
        alert(target.name + ' updated to version '+targetLatest.version);
    }
    if(download === 'bad_hash')
    {
        alert(target.name + ' has a bad hash. Do not use! Try again! ');
    }
    refresh();
}