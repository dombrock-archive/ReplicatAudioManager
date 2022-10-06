let render = {};

render.drawProducts = (state)=>
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
    html += '<br><br>';
    html += '<button id="update-'+productData.id+'" onclick="ra.updateProduct(\''+productData.id+'\')">'+btnText+'</button>';
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

render.updateMOTD = (state)=>
{
  document.getElementById("motd").innerHTML = state.motd;
}

render.btnRefreshState = (available = true)=>
{
  const btn = document.getElementById("refresh");
  if(available)
  {
    btn.innerHTML = 'Refresh';
    btn.classList.remove('btn-disabled');
  }
  else
  {
    btn.innerHTML = '...';
    btn.classList.add('btn-disabled');
  }
}

render.btnUpdateState = (productId, available = true)=>
{
  console.log('Btn update state '+productId)
  const btn = document.getElementById("update-"+productId);
  if(available)
  {
    btn.innerHTML = 'Update';
    btn.classList.remove('btn-disabled');
  }
  else
  {
    btn.innerHTML = 'Downloading';
    btn.classList.add('btn-disabled');
  }
}