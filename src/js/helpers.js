import {TIME_OUT} from './config'

export const getJSON = async function(url){
    try {
        const res = await Promise.race([fetch(url), timeout(TIME_OUT)])
        const data = await res.json();

        if (!res.ok) throw Error(`${data.message} ${res.status}`)

        return data
    }
    catch(err){
         throw err
    }
}

export const sendJSON = async function(url,uploadData){
    try{
        const fetching = fetch(url,{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify(uploadData)
        })
        const res = await Promise.race([fetching,timeout(TIME_OUT)])
        const data = await res.json();

        if (!res.ok) throw Error(`${data.message} ${res.status}`)
        return data

    }
    catch (err){
        console.error(err.message)
        throw err
    }
}

const timeout =function(s){
    return new Promise(function(_,reject){
        setTimeout(function(){reject(new Error(`Request took too long! Timeout after ${s} second.`))},1000*s)
    })
}