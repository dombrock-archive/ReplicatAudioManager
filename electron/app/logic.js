console.log('Connected to: '+serverURL);

const ra = {};

ra.state = {
    serverURL: serverURL,//Default from config
    motd: {},
    products:{},
    productsFull:{},
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
    categories: [],
    filter: {
        categories: ['vst','standalone']
    },
    locked: false
};

ra.setServerURL = (newServerURL) => 
{
    ra.state.serverURL = newServerURL;
    console.log('Set server URL: '+newServerURL);
}

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

ra.buildCategories = () =>
{
    for(const product of Object.values(ra.state.productsFull))
    {
        if(ra.state.categories.includes(product.category) === false)
        {
            ra.state.categories.push(product.category);
        }
    }
    ra.state.filter.categories = [...ra.state.categories];
}

ra.filterProducts = () =>
{
    console.log('Filter Products');
    console.log(ra.state.filter.categories);
    let out = {};
    const categories = ra.state.filter.categories;
    if(categories.includes('all'))
    {
        ra.state.products = {...ra.state.productsFull};
        return;
    }
    for (const [productId, data] of Object.entries(ra.state.productsFull))
    {
        for (const category of categories)
        {
            if(data.category ===  category)
            {
                out[productId] = data;
            }
        }
    }
    ra.state.products = out;
}

ra.selectCategory = (category) =>
{
    console.log('Selected Category: '+category);
    if (ra.state.filter.categories.includes(category))
    {
        if(ra.state.filter.categories.length <= 1)
        {
            // Dont allow deselecting the last one
            ra.showModal('Must have at least one category selected! Select another category before deselecting this one!','Nope');
            return;
        }
        const index = ra.state.filter.categories.indexOf(category);
        if (index !== -1) {
            ra.state.filter.categories.splice(index, 1);
        }
        if(ra.state.filter.categories.length <= 0)
        {
            // Reset categories
            //ra.state.filter.categories = [...ra.state.categories];
        }
    }
    else{
        ra.state.filter.categories.push(category);
    }
    render.updateCategories(ra.state);
    ra.filterProducts();
    render.drawProducts(ra.state);
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

    ra.state.motd = await request.motd(ra.state);
    ra.state.productsFull = await request.products(ra.state);
    ra.buildCategories();
    render.drawCategories(ra.state);
    render.updateCategories(ra.state);
    ra.filterProducts();

    // Must check local versions after remote
    // because we need to know which products to look for
    ra.updatePaths();
    ra.state.local = ipc.checkLocalVersions(ra.state);
    
    render.updateMOTD(ra.state);
    render.updateServerURL(ra.state);
    render.drawProducts(ra.state);

    render.btnRefreshState(true);
    if(alert)
    {
        ra.showModal('All data has been refreshed!', 'Refreshed');
    }
}
ra.refresh();

