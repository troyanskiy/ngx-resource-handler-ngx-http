import { ModuleWithProviders, NgModule, Provider } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ResourceHandler } from '@ngx-resource/core';
import { ResourceHandlerHttpClient } from './src/ResourceHandlerHttpClient';

export * from './src/ResourceHandlerHttpClient';

export interface IResourceModuleConfig {
  handler?: Provider;
}

@NgModule()
export class ResourceModule {

  /**
   * For root
   * @param {IResourceModuleConfig} config
   * @return {ModuleWithProviders}
   */
  static forRoot(config: IResourceModuleConfig = {}): ModuleWithProviders {
    return {
      ngModule: ResourceModule,
      providers: [
        config.handler || {provide: ResourceHandler, useClass: ResourceHandlerHttpClient, deps: [HttpClient]}
      ]
    };
  }

  /**
   * For child
   * @param {IResourceModuleConfig} config
   * @return {ModuleWithProviders}
   */
  static forChild(config: IResourceModuleConfig = {}): ModuleWithProviders {
    return {
      ngModule: ResourceModule,
      providers: [
        config.handler || {provide: ResourceHandler, useClass: ResourceHandlerHttpClient, deps: [HttpClient]}
      ]
    };
  }
}
