import { ModuleWithProviders, NgModule, Provider } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RestHandler } from 'rest-core';
import { RestHandlerHttpClient } from './src/RestHandlerHttpClient';

export * from './src/RestHandlerHttpClient';

export interface IRestModuleConfig {
  handler?: Provider;
}

@NgModule()
export class RestModule {

  /**
   * For root
   * @param {IRestModuleConfig} config
   * @return {ModuleWithProviders}
   */
  static forRoot(config: IRestModuleConfig = {}): ModuleWithProviders {
    return {
      ngModule: RestModule,
      providers: [
        config.handler || {provide: RestHandler, useClass: RestHandlerHttpClient, deps: [HttpClient]}
      ]
    };
  }

  /**
   * For child
   * @param {IRestModuleConfig} config
   * @return {ModuleWithProviders}
   */
  static forChild(config: IRestModuleConfig = {}): ModuleWithProviders {
    return {
      ngModule: RestModule,
      providers: [
        config.handler || {provide: RestHandler, useClass: RestHandlerHttpClient, deps: [HttpClient]}
      ]
    };
  }
}
