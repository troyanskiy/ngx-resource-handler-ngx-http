import { IRestRequest, IRestResponse, RestHandler, RestRequestMethod, RestResponseBodyType } from 'rest-core';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpRequest, HttpResponse } from '@angular/common/http';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class RestHandlerHttpClient extends RestHandler {

  constructor(private http: HttpClient) {
    super();
  }

  handle(req: IRestRequest): Promise<IRestResponse> {

    const request = this.prepareRequest(req);

    return this.http.request(request)
      .toPromise()
      .then((resp: HttpResponse<any>) => this.handleResponse(req, resp));

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
          init.params.append(key, req.query[key]);
        }
      }
    }

    return new HttpRequest(method, req.url, req.body, init);

  }

  protected handleResponse(req: IRestRequest, response: HttpResponse<any>): IRestResponse {

  }

}


export interface IHttpRequestInit {
  headers?: HttpHeaders;
  params?: HttpParams;
  responseType?: 'arraybuffer'|'blob'|'json'|'text';
  withCredentials?: boolean;
}
