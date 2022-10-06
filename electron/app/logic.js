
console.log('Connected to: '+serverURL);
let state = {
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
};

function updateProduct(productId)
{
    alert('Update product '+productId);
}

function updatePaths()
{
  state.path.vst = document.getElementById("vst-path").value;
  state.path.standalone = document.getElementById("standalone-path").value;
  ipc.checkLocalVersions();
}

async function refresh(notification=false)
{
  console.log('Refresh!');
  state.motd = await request.motd();
  state.products = await request.products();
  updatePaths();
  state.local = ipc.checkLocalVersions();
  render.updateMOTD();
  render.drawProducts();
  //console.log('Current State:');
  //console.log(JSON.stringify(state));
  if(notification)
  {
    alert('Refreshed all data!');
  }
}
refresh();

