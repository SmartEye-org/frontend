import axiosClient from './axios-client'
import type { AxiosRequestConfig, AxiosResponse } from 'axios'

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

/**
 * Base API Service
 * All other services extend from this
 */
export class BaseApiService {
  protected baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  /**
   * GET request
   */
  protected async get<T>(url: string, params?: Record<string, unknown>): Promise<T> {
    const response: AxiosResponse<T> = await axiosClient.get(
      `${this.baseUrl}${url}`,
      { params }
    )
    return response.data
  }

  /**
   * POST request
   */
  protected async post<TResponse, TBody = unknown, TConfig extends AxiosRequestConfig = AxiosRequestConfig>(
    url: string,
    data?: TBody,
    config?: TConfig
  ): Promise<TResponse> {
    const response: AxiosResponse<TResponse> = await axiosClient.post(
      `${this.baseUrl}${url}`,
      data,
      config
    );

    return response.data;
  }

  /**
   * PUT request
   */
  protected async put<T>(url: string, data?: unknown): Promise<T> {
    const response: AxiosResponse<T> = await axiosClient.put(
      `${this.baseUrl}${url}`,
      data
    )
    return response.data
  }

  /**
   * DELETE request
   */
  protected async delete<T>(url: string): Promise<T> {
    const response: AxiosResponse<T> = await axiosClient.delete(
      `${this.baseUrl}${url}`
    )
    return response.data
  }

  /**
   * Upload file with FormData
   */
  protected async upload<T>(url: string, formData: FormData): Promise<T> {
    const response: AxiosResponse<T> = await axiosClient.post(
      `${this.baseUrl}${url}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    )
    return response.data
  }
}
