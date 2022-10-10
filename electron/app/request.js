const axios = require('axios');

request = {};

request.products = async (state)=>
{
    const response = await axios.get(state.serverURL+"/products");
    //console.log(JSON.stringify(response.data,null,2));
    return response.data;
}

request.motd = async (state)=>
{
    const response = await axios.get(state.serverURL+"/motd");
    //console.log(JSON.stringify(response.data,null,2));
    return response.data;
}