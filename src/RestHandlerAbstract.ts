import { IRestHandlerResponse, IRestRequest, IRestResponse, RestHandler } from 'rest-core';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Injectable()
export abstract class RestHandlerAbstract extends RestHandler {


  handle(req: IRestRequest): IRestHandlerResponse {

    const request = this.prepareRequest(req);

    const resp: IRestHandlerResponse = {
      promise: null
    };

    resp.promise = new Promise((resolve, reject) => {

      let subscription = this.request(request)
        .subscribe(
          (resp: any) => {
            subscription = null;
            resolve(this.handleResponse(req, resp));
          },
          (err: any) => {
            subscription = null;
            reject(this.handleResponse(req, err));
          }
        );

      resp.abort = () => {
        if (subscription) {
          subscription.unsubscribe();
          subscription = null;
        }
      };

    });

    return resp;

  }

  protected abstract request(request: any): Observable<any>;

  protected abstract prepareRequest(req: IRestRequest): any;

  protected abstract handleResponse(req: IRestRequest, response: any): IRestResponse;

}

