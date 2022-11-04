import axios from "axios";
import {store} from "../redux/store"

axios.defaults.baseURL="http://localhost:5000"

axios.interceptors.request.use(config=>{
    store.dispatch({
        type:"change_loading",
        payload:true
    })
    return config
},err=>{
    return Promise.reject(err)
})
axios.interceptors.response.use(response=>{
    store.dispatch({
        type:"change_loading",
        payload:false
    })
    return response
},err=>{
    store.dispatch({
        type:"change_loading",
        payload:false
    })
    return Promise.reject(err)
})