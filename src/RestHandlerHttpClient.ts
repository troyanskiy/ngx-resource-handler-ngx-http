import { IRestRequest, IRestResponse, RestRequestMethod, RestResponseBodyType } from 'rest-core';
import { Injectable } from '@angular/core';
import { HttpClient, HttpEventType, HttpHeaders, HttpParams, HttpRequest, HttpResponse } from '@angular/common/http';
import { RestHandlerAbstract } from './RestHandlerAbstract';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/filter';

@Injectable()
export class RestHandlerHttpClient extends RestHandlerAbstract {

  constructor(private http: HttpClient) {
    super();
  }

  protected request(request: any): Observable<any> {
    return this.http.request(request)
      .filter((resp: HttpResponse<any>) => resp.type === HttpEventType.Response);
  }

  protected prepareRequest(req: IRestRequest): HttpRequest<any> {

    let method: string = 'GET';

    switch (req.method) {

      case RestRequestMethod.Get:
        method = 'GET';
        break;

      case RestRequestMethod.Post:
        method = 'POST';
        break;

      case RestRequestMethod.Put:
        method = 'PUT';
        break;

      case RestRequestMethod.Delete:
        method = 'DELETE';
        break;

      case RestRequestMethod.Head:
        method = 'HEAD';
        break;

      case RestRequestMethod.Options:
        method = 'OPTIONS';
        break;

      case RestRequestMethod.Patch:
        method = 'PATCH';

    }

    const init: IHttpRequestInit = {
      withCredentials: req.withCredentials
    };

    switch (req.responseBodyType) {

      case RestResponseBodyType.Json:
        init.responseType = 'json';
        break;

      case RestResponseBodyType.ArrayBuffer:
        init.responseType = 'arraybuffer';
        break;

      case RestResponseBodyType.Blob:
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

  protected handleResponse(req: IRestRequest, response: HttpResponse<any>): IRestResponse {

    const headers: any = {};
    const keys = response.headers.keys();
    keys.forEach((key: string) => {
      headers[key] = response.headers.getAll(key);
    });

    return {
      status: response.status,
      body: response.body,
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
