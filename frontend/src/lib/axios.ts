import axios, { AxiosInstance, AxiosResponse, AxiosError } from "axios";
import { IApiError } from "@/types/api.type";

class AxiosClient {
  private static instance: AxiosClient;
  public readonly axiosInstance: AxiosInstance;

  private constructor() {
    this.axiosInstance = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000/api/v1",
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    this.registerRequestInterceptor();
    this.registerResponseInterceptor();
  }

  public static getInstance(): AxiosClient {
    if (!AxiosClient.instance) {
      AxiosClient.instance = new AxiosClient();
    }
    return AxiosClient.instance;
  }

  private registerRequestInterceptor(): void {
    this.axiosInstance.interceptors.request.use(
      (config: any) => {
        // In future: attach auth token here
        // const token = localStorage.getItem("accessToken");
        // if (token) config.headers.Authorization = `Bearer ${token}`;
        return config;
      },
      (error: AxiosError) => Promise.reject(error)
    );
  }

  private registerResponseInterceptor(): void {
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error: AxiosError<IApiError>) => {
        // In future: handle 401 → redirect to login
        // if (error.response?.status === 401) { ... }
        return Promise.reject(error);
      }
    );
  }
}

export const axiosInstance = AxiosClient.getInstance().axiosInstance;