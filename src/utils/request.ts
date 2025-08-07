import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
interface RequestOptions extends Omit<AxiosRequestConfig, 'headers'> {
  skipErrorHandler?: boolean;
  withToken?: boolean;
  headers?: Record<string, string>;
}

interface Response<T = any> {
  code: number;
  data: T;
  message: string;
  success: boolean;
}

// 自定义请求配置类型
interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  skipErrorHandler?: boolean;
  withToken?: boolean;
}

// 创建 axios 实例
const instance: AxiosInstance = axios.create({
  baseURL: import.meta.env.PUBLIC_API_BASE_URL || '',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const customConfig = config as CustomAxiosRequestConfig;
    // 如果需要携带 token
    if (customConfig.withToken !== false) {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
instance.interceptors.response.use(
  (response: AxiosResponse) => {
    const res = response.data as Response;
    
    // 根据自定义 code 判断请求是否成功
    if (res.code !== 200 && res.code !== 0) {
      const customConfig = response.config as CustomAxiosRequestConfig;
      if (!customConfig.skipErrorHandler) {
        // 可以集成消息提示，例如使用 antd 的 message
        console.error(res.message || '请求出错');
        
        // 401: 未登录或 token 过期
        if (res.code === 401) {
          // 可以在这里处理登出逻辑
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
      }
      return Promise.reject(new Error(res.message || '请求出错'));
    }
    
    return res as unknown as AxiosResponse;
  },
  (error) => {
    const customConfig = error.config as CustomAxiosRequestConfig | undefined;
    if (!customConfig?.skipErrorHandler) {
      // 处理 HTTP 状态码错误
      let message = '网络请求错误';
      if (error.response) {
        switch (error.response.status) {
          case 400:
            message = '请求错误';
            break;
          case 401:
            message = '未授权，请登录';
            localStorage.removeItem('token');
            window.location.href = '/login';
            break;
          case 403:
            message = '拒绝访问';
            break;
          case 404:
            message = '请求地址出错';
            break;
          case 408:
            message = '请求超时';
            break;
          case 500:
            message = '服务器内部错误';
            break;
          case 501:
            message = '服务未实现';
            break;
          case 502:
            message = '网关错误';
            break;
          case 503:
            message = '服务不可用';
            break;
          case 504:
            message = '网关超时';
            break;
          case 505:
            message = 'HTTP版本不支持';
            break;
          default:
            message = `未知错误${error.response.status}`;
        }
      } else if (error.request) {
        message = '服务器未响应';
      }
      console.error(message);
    }
    return Promise.reject(error);
  }
);

// 封装请求方法
const request = {
  get<T = any>(url: string, params?: object, options?: RequestOptions): Promise<Response<T>> {
    return instance.get(url, { params, ...options }).then(res => res as unknown as Response<T>);
  },
  
  post<T = any>(url: string, data?: object, options?: RequestOptions): Promise<Response<T>> {
    return instance.post(url, data, options).then(res => res as unknown as Response<T>);
  },
  
  put<T = any>(url: string, data?: object, options?: RequestOptions): Promise<Response<T>> {
    return instance.put(url, data, options).then(res => res as unknown as Response<T>);
  },
  
  delete<T = any>(url: string, options?: RequestOptions): Promise<Response<T>> {
    return instance.delete(url, options).then(res => res as unknown as Response<T>);
  },
  
  // 上传文件
  upload<T = any>(url: string, file: File, options?: RequestOptions): Promise<Response<T>> {
    const formData = new FormData();
    formData.append('file', file);
    
    return instance.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      ...options,
    }).then(res => res as unknown as Response<T>);
  },
  
  // 下载文件
  download(url: string, params?: object, options?: RequestOptions): void {
    const queryString = params 
      ? '?' + Object.entries(params)
          .map(([key, value]) => `${key}=${encodeURIComponent(String(value))}`)
          .join('&') 
      : '';
    
    const token = localStorage.getItem('token');
    const headers: Record<string, string> = {};
    if (token && options?.withToken !== false) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    // 使用原生方式处理文件下载
    const link = document.createElement('a');
    // 使用与实例相同的baseURL
    const baseURL = import.meta.env.PUBLIC_API_BASE_URL || '';
    link.href = `${baseURL}${url}${queryString}`;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

export default request;
