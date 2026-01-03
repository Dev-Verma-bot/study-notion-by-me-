import axios from "axios";

export const axios_instance= axios.create({});

export const ApiConnect= (method,url,body_data,header,params)=>{
    return axios_instance({
        method:`${method}`,
        url:`${url}`,
        data:body_data?body_data:null,
        headers:header?header:null,
        params:params?params:null,
    })
}