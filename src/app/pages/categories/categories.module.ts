import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { CatecoryListComponent } from './catecory-list/catecory-list.component';
import { CategoriesRoutingModule } from './categories-routing.module';
import { CategoryFormComponent } from './category-form/category-form.component';

@NgModule({
  declarations: [CatecoryListComponent, CategoryFormComponent],
  imports: [
    CommonModule,
    CategoriesRoutingModule
  ]
})
export class CategoriesModule { }
