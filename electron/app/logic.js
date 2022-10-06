
console.log('Connected to: '+serverURL);

const ra = {};

ra.state = {
    motd: {},
    products:{},
    remote:{
        version: 'X.X.X',
        md5: '123',
    },
    local: 
    {

    },
    path: {
        vst: 'C:\\ReplicatAudio\\vst',
        standalone: 'C:\\ReplicatAudio\\standalone'
    },
    locked: false
};

ra.updateProduct = (productId) =>
{
    if(ra.state.locked)
    {
        ra.showModal('You can only download one product at a time!');
        return;
    }
    ra.state.locked = true;
    render.btnUpdateState(productId, false);
    ipc.update(productId, ra.state);
}

ra.finishProductUpdate = (res) =>
{
    const productId = res.originalArg.productId;
    console.log('UPDATED: '+productId);
    const target = ra.state.products[productId];
    const targetLatest = target.versions[target.latest];
    const msg = res.msg;
    console.log('Download Message: '+msg);
    if(msg === 'success')
    {
        ra.showModal(target.name + ' updated to version '+targetLatest.version, 'Update Complete');
    }
    if(msg === 'bad_hash')
    {
        ra.showModal(target.name + ' has a bad hash. Do not use! Try again! ', 'Update Error');
    }
    //render.btnUpdateState(productId, true);
    ra.state.locked = false;
    ra.refresh();
}

ra.viewDirectory = (dir) =>
{
    ipc.viewDirectory(dir, ra.state);
}

ra.updatePaths = () =>
{
  ra.state.path.vst = document.getElementById("vst-path").value;
  ra.state.path.standalone = document.getElementById("standalone-path").value;
}

ra.showModal = (text="Hello",title="Alert") =>
{
    console.log('Showing Modal');
    document.getElementById('modal-title').innerHTML = title;
    document.getElementById('modal-content').innerHTML = text;
    document.getElementById('modal-shade').style.visibility = 'visible';
    document.getElementById('modal').style.visibility = 'visible';
}
ra.closeModal = () =>
{
    document.getElementById('modal-content').innerHTML = '';
    document.getElementById('modal-shade').style.visibility = 'hidden';
    document.getElementById('modal').style.visibility = 'hidden';
}

ra.refresh = async (alert=false) =>
{
  console.log('Refresh!');
  
  render.btnRefreshState(false);

  ra.state.motd = await request.motd();
  ra.state.products = await request.products();

  // Must check local versions after remote
  // because we need to know which products to look for
  ra.updatePaths();
  ra.state.local = ipc.checkLocalVersions(ra.state);
  
  render.updateMOTD(ra.state);
  render.drawProducts(ra.state);

  render.btnRefreshState(true);
  if(alert)
  {
    ra.showModal('All data has been refreshed!', 'Refreshed');
  }
}
ra.refresh();

