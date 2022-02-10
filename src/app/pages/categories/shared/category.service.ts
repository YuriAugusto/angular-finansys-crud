import { Injectable, Injector } from '@angular/core';
import { BaseResourceService } from 'src/app/shared/services/base-resource.service';

import { Category } from './category.model';

@Injectable({
  providedIn: 'root'
})
// é necessário informar dentro dos generics uma classe que herde de BaseResourceModel
export class CategoryService extends BaseResourceService<Category> {

  constructor(protected injector: Injector) {// injeto uma a dependência do tipo 'Injector'
    // o construtor da classe BaseResourceService recebe a 'apiPath' e uma instância de 'Injector'
    super('api/categories', injector);
  }

}
