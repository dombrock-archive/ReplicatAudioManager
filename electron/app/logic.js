const {ipcRenderer} = require('electron');
const {serverURL} = require('./../config.js');
const axios = require('axios');
console.log('Connected to: '+serverURL);
let state = {
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
async function checkProducts()
{
  const response = await axios.get(serverURL+"/products");
  state.products = response.data;
  console.log(JSON.stringify(state.products,null,2));
  redrawProducts();
}
function redrawProducts()
{
  let html = '';
  const productsArea = document.getElementById('products-area');
  for(let [productId, productData] of Object.entries(state.products))
  {
    const latestRemote = productData.versions[productData.latest];
    const localProduct = state.local[productData.id]
    let latestLocal = {
          "version":"NA",
          "id":-1,
          "file":"NA",
          "md5":"NA",
          "md5local":"NA",
          "path":"NA"
    };
    if(localProduct)
    {
      const localVersionsCount = localProduct.length;
      if(localProduct.length)
      {
        latestLocal = localProduct[localVersionsCount-1];
      }
    }
    let btnText = 'Reinstall';
    if(latestLocal.md5 !== latestLocal.md5local)
    {
      btnText = 'Fix';
    }
    if(latestRemote.version !== latestLocal.version)
    {
      btnText = 'Update';
    }
    if(latestLocal.version === "NA")
    {
      btnText = 'Install';
    }
    html += '<div class="card">';
    html += '<img class="product-icon" src="'+serverURL+'/icons/'+productData.icon+'">';
    html += '<div class="card-title">';
    html += productData.name;
    html += '</div>';
    html += '<div class="card-developer">';
    html += productData.developer;
    html += '</div>';
    html += '<div class="card-meta">';
    html += '<div class="card-tag">';
    html += productData.category.toUpperCase();
    html += '</div>';
    html += '<br>';
    html += '<div class="card-tag">';
    html += productData.license.toUpperCase();
    html += '</div>';
    html += '</div>';
    html += '<hr>';
    html += '<img class="product-ss" src="'+serverURL+'/screenshots/'+productData.screenshots[0]+'">';
    html += '<br>';
    html += productData.description;
    html += '<br>';
    html += '<button onclick="update(\''+productData.id+'\')">'+btnText+'</button>';
    html += '<br>';
    html += '<br>';
    html += 'Available: v'+latestRemote.version;
    html += '<div class="small">';
    html += '['+latestRemote.md5+']';
    html += '</div>';
    html += 'Installed: v'+latestLocal.version;;
    html += '<div class="small">';
    html += '['+latestLocal.md5local+']';
    html += '</div>';
    html += '</div>';
  }
  productsArea.innerHTML = html;
}
function checkRemoteVersion()
{
  const xhttp = new XMLHttpRequest();
  xhttp.onload = function() {
    // Should check status code
    const responseJSON = JSON.parse(this.response);
    state.remote.version = responseJSON.version;
    state.remote.md5 = responseJSON.md5;
  }
  xhttp.open("GET", serverURL+"/currentVersion");
  xhttp.send();
}
function checkLocalVersion()
{
  const localCheck = ipcRenderer.sendSync('checkLocalVersion', state);
  state.local = localCheck;
  console.log('Local Versions:');
  console.log(JSON.stringify(state.local, null, 2));
}
function update(productId)
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
function updatePaths()
{
  state.path.vst = document.getElementById("vst-path").value;
  state.path.standalone = document.getElementById("standalone-path").value;
  checkLocalVersion();
}
function checkMOTD()
{
  const xhttp = new XMLHttpRequest();
  xhttp.onload = function() {
    // Should check status code
    state.motd = this.responseText;
    redrawMOTD();
  }
  xhttp.open("GET", serverURL+"/motd");
  xhttp.send();
}
function redrawMOTD()
{
  document.getElementById("motd").innerHTML = state.motd;
}
function viewDirectory(dir)
{
  updatePaths();
  if(dir === 'standalone')
  {
    ipcRenderer.sendSync('viewLocalFiles', state.path.standalone);
  }
  if(dir === 'vst')
  {
    ipcRenderer.sendSync('viewLocalFiles', state.path.vst);
  }
}
async function refresh(notification=false)
{
  console.log('Refresh!');
  await checkProducts();
  updatePaths();
  checkRemoteVersion();
  redrawProducts();
  checkLocalVersion();
  //redrawLocalVersion();
  checkMOTD();
  console.log('Current State:');
  console.log(JSON.stringify(state));
  if(notification)
  {
    alert('Refreshed all data!');
  }
}
refresh();

