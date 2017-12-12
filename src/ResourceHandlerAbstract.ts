import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { IResourceHandlerResponse, IResourceRequest, IResourceResponse, ResourceHandler } from '@ngx-resource/core';

@Injectable()
export abstract class ResourceHandlerAbstract extends ResourceHandler {


  handle(req: IResourceRequest): IResourceHandlerResponse {

    const request = this.prepareRequest(req);

    const resp: IResourceHandlerResponse = {
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

  protected abstract prepareRequest(req: IResourceRequest): any;

  protected abstract handleResponse(req: IResourceRequest, response: any): IResourceResponse;

}

