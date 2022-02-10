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
    super("api/entries", injector);
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

  protected jsonDataToResources(jsonData: any[]): Entry[]{
    const entries: Entry[] = [];

    jsonData.forEach(element => {
      const entry: Entry = Object.assign(new Entry(), element);//faz um cast e retorna uma instância do objeto
      entries.push(entry);
    });

    return entries;
  }

  protected jsonDataToResource(jsonData: any): Entry{
    const entry: Entry = Object.assign(new Entry(), jsonData);
    return entry;
  }

}
