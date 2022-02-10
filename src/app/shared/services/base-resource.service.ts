import { HttpClient } from '@angular/common/http';
import { Injector } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { BaseResourceModel } from '../models/base-resource.model';

// T pode ser qualquer classe que herde de BaseResourceModel
export abstract class BaseResourceService<T extends BaseResourceModel> {

  protected http: HttpClient;

  constructor(
    protected apiPath: string,
    protected injector: Injector,
    protected jsonDataToResourceFn: (jsonData: any) => T
  ){//jsonDataToResourceFn é uma função que recebe um 'jsonData':'any' e devolve o objeto do tipo T
    this.http = injector.get(HttpClient);
  }

  getAll(): Observable<T[]>{
    return this.http.get(this.apiPath).pipe(
      // ao fazer o bind com this você passa o contexto do objeto T
      // dessa forma quando o método 'jsonDataToResourceFn' recebido no construtor da classe
      // for acionado dentro da function 'jsonDataToResources' o método a ser executado lá dentro
      // 'jsonDataToResourceFn' será o mesmo que foi recebido como argumento no construtor
      map(this.jsonDataToResources.bind(this)),
      catchError(this.handleError)
    )
  }

  getById(id: number): Observable<T>{
    const url = `${this.apiPath}/${id}`;

    return this.http.get(url).pipe(
      map(this.jsonDataToResource.bind(this)),
      catchError(this.handleError)
    )
  }

  create(resource: T): Observable<T>{
    return this.http.post(this.apiPath, resource).pipe(
      map(this.jsonDataToResource.bind(this)),
      catchError(this.handleError)
    )
  }

  update(resource: T): Observable<T>{
    const url = `${this.apiPath}/${resource.id}`;

    return this.http.put(url, resource).pipe(
      map(() => resource),
      catchError(this.handleError)
    )
  }

  delete(id: number): Observable<any>{
    const url = `${this.apiPath}/${id}`;

    return this.http.delete(url).pipe(
      map(() => null),
      catchError(this.handleError)
    )
  }

  protected jsonDataToResources(jsonData: any[]): T[]{
    const resources: T[] = [];
    jsonData.forEach(
      element => resources.push(this.jsonDataToResourceFn(element))
    );
    return resources;
  }

  protected jsonDataToResource(jsonData: any): T{
    return this.jsonDataToResourceFn(jsonData);
  }

  protected handleError(error: any): Observable<any>{
    console.log("ERRO NA REQUISIÇÃO => ", error);
    return throwError(error);
  }
}
