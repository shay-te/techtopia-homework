// src/api/DrawClient.ts
import axios, { AxiosInstance } from 'axios';

export interface Draw {
  id: number;
  name: string;
  svg: string;
}

export class DrawClient {
  private api: AxiosInstance;

  constructor(baseURL: string = 'http://localhost:3000') {
    this.api = axios.create({ baseURL });
  }

  // Create a new draw (upload SVG)
  async create(name: string, file: File): Promise<Draw> {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('svg', file);

    const response = await this.api.post<Draw>('/api/designs', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  }

  // Optional: fetch all draws (if your backend supports it)
  async list(): Promise<Draw[]> {
    const response = await this.api.get<Draw[]>('/api/designs');
    return response.data;
  }

}