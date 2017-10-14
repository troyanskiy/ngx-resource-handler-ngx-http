import { IRestRequest, IRestResponse, RestRequestMethod, RestResponseBodyType } from 'rest-core';
import { Injectable } from '@angular/core';
import { Http, Request, RequestMethod, Response, ResponseContentType } from '@angular/http';
import { RequestArgs } from '@angular/http/src/interfaces';
import { RestHandlerAbstract } from './RestHandlerAbstract';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class RestHandlerHttp extends RestHandlerAbstract {

  constructor(private http: Http) {
    super();
  }

  protected request(request: any): Observable<any> {
    return this.http.request(request);
  }

  protected prepareRequest(req: IRestRequest): Request {

    const options: RequestArgs = {
      url: req.url,
      body: req.body,
      withCredentials: req.withCredentials
    };

    switch (req.method) {

      case RestRequestMethod.Get:
        options.method = RequestMethod.Get;
        break;

      case RestRequestMethod.Post:
        options.method = RequestMethod.Post;
        break;

      case RestRequestMethod.Put:
        options.method = RequestMethod.Put;
        break;

      case RestRequestMethod.Delete:
        options.method = RequestMethod.Delete;
        break;

      case RestRequestMethod.Head:
        options.method = RequestMethod.Head;
        break;

      case RestRequestMethod.Options:
        options.method = RequestMethod.Options;
        break;

      case RestRequestMethod.Patch:
        options.method = RequestMethod.Patch;

    }

    switch (req.responseBodyType) {

      case RestResponseBodyType.Json:
        options.responseType = ResponseContentType.Json;
        break;

      case RestResponseBodyType.ArrayBuffer:
        options.responseType = ResponseContentType.ArrayBuffer;
        break;

      case RestResponseBodyType.Blob:
        options.responseType = ResponseContentType.Blob;
        break;

      default:
        options.responseType = ResponseContentType.Text;

    }

    if (req.headers) {
      options.headers = req.headers;
    }

    if (req.query) {
      options.params = req.query;
    }

    return new Request(options);

  }

  protected handleResponse(req: IRestRequest, response: Response): IRestResponse {

    let body: any;
    switch (req.responseBodyType) {

      case RestResponseBodyType.Json:
        body = response.json();
        break;

      case RestResponseBodyType.ArrayBuffer:
        body = response.arrayBuffer();
        break;

      case RestResponseBodyType.Blob:
        body = response.blob();
        break;

      default:
        body = response.text();

    }

    return {
      status: response.status,
      body,
      headers: response.headers.toJSON()
    };

  }

}

