import { injectable } from 'inversify';
import fetch, { HeadersInit, BodyInit, Response } from 'node-fetch';
import { HTTPMethods } from '../types/HTTPMethods';

export interface FetchParams {
  url: string,
  body?: BodyInit,
  headers?: HeadersInit,
}

export interface FetcherInterface {
  post(params: FetchParams): Promise<Response>;

  delete(params: FetchParams): Promise<Response>;

  get(params: FetchParams): Promise<Response>;
}

@injectable()
export class Fetcher implements FetcherInterface {
  private static fetch(method: HTTPMethods, params: FetchParams): Promise<Response> {
    return fetch(params.url, {
      method: method as string,
      body: params.body,
      headers: params.headers,
    });
  }

  post(params: FetchParams): Promise<Response> {
    return Fetcher.fetch(HTTPMethods.Post, params);
  }

  delete(params: FetchParams): Promise<Response> {
    return Fetcher.fetch(HTTPMethods.Delete, params);
  }

  get(params: FetchParams): Promise<Response> {
    return Fetcher.fetch(HTTPMethods.Get, params);
  }
}
