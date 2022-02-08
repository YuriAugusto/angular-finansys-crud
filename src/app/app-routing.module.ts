import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//quando a URI categories for acionada o módulo será carregado com todos os componentes que nele estão declarados
const routes: Routes = [
  { path: 'entries', loadChildren: './pages/entries/entries.module#EntriesModule' },
  { path: 'categories', loadChildren: './pages/categories/categories.module#CategoriesModule' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
