const axios = require('axios');

request = {};

request.products = async ()=>
{
    const response = await axios.get(serverURL+"/products");
    //console.log(JSON.stringify(response.data,null,2));
    return response.data;
}

request.motd = async ()=>
{
    const response = await axios.get(serverURL+"/motd");
    //console.log(JSON.stringify(response.data,null,2));
    return response.data;
}