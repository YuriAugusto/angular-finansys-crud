import { AfterContentChecked, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { switchMap } from "rxjs/operators";

import { Category } from '../shared/category.model';
import { CategoryService } from '../shared/category.service';

import toastr from "toastr";

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.css']
})
export class CategoryFormComponent implements OnInit, AfterContentChecked {

  currentAction: string;
  categoryForm: FormGroup;
  pageTitle: string;
  serverErrormessages: string[] = null;
  submittingForm: boolean = false;
  category: Category = new Category();

  constructor(
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.setCurrentAction();//define a ação com base na uri da rota ex: edit ou new
    this.buildCategoryForm();//construir o form
    this.loadCategory();//carregar a categoria
  }

  ngAfterContentChecked(){//método invocado depois que tudo estiver sido carregado na página
    this.setPageTitle();
  }

  private setCurrentAction() {
    //retorna um array da rota segmentada pelas "/" a partir de categories ex: categories/new url[0]==new
    if(this.route.snapshot.url[0].path == "new")
      this.currentAction = 'new';
    else
      this.currentAction = 'edit'
  }

  private buildCategoryForm(){//constrói o formulário
    this.categoryForm = this.formBuilder.group({
      id: [null],
      name: [null, [Validators.required, Validators.minLength(2)]],
      description: [null]
    })
  }

  private loadCategory(){
    if(this.currentAction == 'edit'){

      this.route.paramMap.pipe(
        switchMap(params => this.categoryService.getByIdd(+params.get("id")))
      )
      .subscribe(
        (category) => {
          this.category = category;
          this.categoryForm.patchValue(category);//bind do objeto category com o form categoryForm:FormGroup
        },
        (error) => alert('Ocorreu um erro no servidor, tente mais tarde.')
      )
    }
  }

  private setPageTitle(){
    if(this.currentAction == 'new')
      this.pageTitle = 'Cadastro de Nova Categoria';
    else{
      const categoryName = this.category.name || '...';//this.category.name se for null uma string vazia é atribuída
      this.pageTitle = 'Editando Categoria: ' + categoryName;
    }
  }

}
