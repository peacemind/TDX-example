import { useState, useCallback } from "react";
import jsSHA from "jssha";

const getAuthorizationHeader = () => {
    let id = 'f0f675b5f25b4db5ba0dcef0898d6e50';
    let key = 'ujqtxJlW5iQ7VJTyWLmE-GitlWQ';

    let GMTString = new Date().toGMTString();
    let ShaObj = new jsSHA('SHA-1', 'TEXT');
    ShaObj.setHMACKey(key, 'TEXT');
    ShaObj.update('x-date: ' + GMTString);
    let HMAC = ShaObj.getHMAC('B64');
    let Authorization = 'hmac username=\"' + id + '\", algorithm=\"hmac-sha1\", headers=\"x-date\", signature=\"' + HMAC + '\"';

    return { 'Authorization': Authorization, 'X-Date': GMTString /*,'Accept-Encoding': 'gzip'*/ }; //如果要將js運行在伺服器，可額外加入 'Accept-Encoding': 'gzip'，要求壓縮以減少網路傳輸資料量
}

const useFetch = () => {
    const [loading, setLoading] = useState(false);

    const fetchData = useCallback(async (url, setData) => {
        setLoading(true)
        try {

            const res = await fetch(url, {
                headers: getAuthorizationHeader()
            })
            if (!res.ok) {
                throw new Error(`Network got problem: ${res.status} ${res.statusText}`)
            }
            const data = await res.json()
            setData(data)

        } catch (error) {
            console.log(error.message)
        }
        setLoading(false)
    }, [])

    return [
        loading,
        fetchData
    ]
}

export default useFetch