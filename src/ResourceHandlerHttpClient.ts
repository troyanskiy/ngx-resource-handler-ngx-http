import { Injectable } from '@angular/core';
import {
  HttpClient, HttpErrorResponse, HttpEventType, HttpHeaders, HttpParams, HttpRequest,
  HttpResponse
} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import {
  IResourceRequest, IResourceResponse, ResourceRequestMethod,
  ResourceResponseBodyType
} from '@ngx-resource/core';

import { ResourceHandlerAbstract } from './ResourceHandlerAbstract';

import 'rxjs/add/operator/filter';

@Injectable()
export class ResourceHandlerHttpClient extends ResourceHandlerAbstract {

  constructor(private http: HttpClient) {
    super();
  }

  protected request(request: any): Observable<any> {
    return this.http.request(request)
      .filter((resp: HttpResponse<object>) => resp.type === HttpEventType.Response);
  }

  protected prepareRequest(req: IResourceRequest): HttpRequest<any> {

    let method: string = 'GET';

    switch (req.method) {

      case ResourceRequestMethod.Get:
        method = 'GET';
        break;

      case ResourceRequestMethod.Post:
        method = 'POST';
        break;

      case ResourceRequestMethod.Put:
        method = 'PUT';
        break;

      case ResourceRequestMethod.Delete:
        method = 'DELETE';
        break;

      case ResourceRequestMethod.Head:
        method = 'HEAD';
        break;

      case ResourceRequestMethod.Options:
        method = 'OPTIONS';
        break;

      case ResourceRequestMethod.Patch:
        method = 'PATCH';

    }

    const init: IHttpRequestInit = {
      withCredentials: req.withCredentials
    };

    switch (req.responseBodyType) {

      case ResourceResponseBodyType.Json:
        init.responseType = 'json';
        break;

      case ResourceResponseBodyType.ArrayBuffer:
        init.responseType = 'arraybuffer';
        break;

      case ResourceResponseBodyType.Blob:
        init.responseType = 'blob';
        break;

      default:
        init.responseType = 'text';

    }

    if (req.headers) {
      init.headers = new HttpHeaders(req.headers);
    }

    if (req.query) {
      init.params = new HttpParams();
      for (const key in req.query) {
        if (req.query.hasOwnProperty(key)) {
          init.params = init.params.set(key, req.query[key]);
        }
      }
    }

    return new HttpRequest(method, req.url, req.body, init);

  }

  protected handleResponse(req: IResourceRequest, response: HttpResponse<any> | HttpErrorResponse): IResourceResponse {

    const headers: any = {};
    const keys = response.headers.keys();
    keys.forEach((key: string) => {
      headers[key] = response.headers.getAll(key);
    });

    return {
      status: response.status,
      body: (response as HttpResponse<any>).body || (response as HttpErrorResponse).error,
      headers: headers
    };
  }

}


export interface IHttpRequestInit {
  headers?: HttpHeaders;
  params?: HttpParams;
  responseType?: 'arraybuffer' | 'blob' | 'json' | 'text';
  withCredentials?: boolean;
}
