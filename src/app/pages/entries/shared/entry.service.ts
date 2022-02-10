import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { flatMap } from 'rxjs/operators';
import { BaseResourceService } from 'src/app/shared/services/base-resource.service';

import { CategoryService } from './../../categories/shared/category.service';
import { Entry } from './entry.model';

@Injectable({
  providedIn: 'root'
})
export class EntryService extends BaseResourceService<Entry>{

  constructor(protected injector: Injector, private categoryService: CategoryService) {
    // ao passar o método/funcao por argumento sem '()' a função não é executada, dessa forma
    // é possível utilizar a funcao dentro da super class 'BaseResourceService'
    super("api/entries", injector, Entry.fromJson);
  }

  create(entry: Entry): Observable<Entry>{
    return this.categoryService.getById(entry.categoryId).pipe(
      flatMap(category => {
        entry.category = category;
        return super.create(entry)//invocação do método genérico 'create()' da super class
      })
    )
  }

  update(entry: Entry): Observable<Entry>{
    return this.categoryService.getById(entry.categoryId).pipe(
      flatMap(category => {
        entry.category = category;
        return super.update(entry)//invocação do método genérico 'create()' da super class
      })
    )
  }

}
