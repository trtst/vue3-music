import axios from 'axios';

const instance = axios.create({
    timeout: 1000 * 60,
    // `withCredentials` 表示跨域请求时是否需要使用凭证
    withCredentials: true,
    // `validateStatus` 定义对于给定的HTTP 响应状态码是 resolve 或 reject  promise 。
    // 如果 `validateStatus` 返回 `true` (或者设置为 `null` 或 `undefined`)，promise 将被 resolve; 否则，promise 将被 rejecte
    validateStatus: status => {
        return status >= 200 && status < 300; // default
    },
    baseURL: 'https://www.xxx.com' // 服务端域名
});

// 添加请求拦截器
instance.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    return config;
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});

// 添加响应拦截器
instance.interceptors.response.use(function (response) {
    // 对响应数据做点什么
    return response;
}, function (error) {
    // 对响应错误做点什么
    return Promise.reject(error);
});

const ajaxMethod = ['get', 'post']
const api = {}
ajaxMethod.forEach(method => {
    api[method] = function (uri, data, config) {
        return new Promise(function (resolve, reject) {
            instance[method](uri, data, config)
            .then(response => {
                resolve(response)
            })
            .catch(error => {
                reject(error)
            })
        })
    }
});

export default api;