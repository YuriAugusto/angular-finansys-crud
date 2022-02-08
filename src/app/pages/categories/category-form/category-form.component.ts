import { AfterContentChecked, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { switchMap } from 'rxjs/operators';
import toastr from 'toastr';

import { Category } from '../shared/category.model';
import { CategoryService } from '../shared/category.service';


@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.css']
})
export class CategoryFormComponent implements OnInit, AfterContentChecked {

  currentAction: string;
  categoryForm: FormGroup;
  pageTitle: string;
  serverErrorMessages: string[] = null;
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

  submitForm(){
    this.submittingForm = true;

    if(this.currentAction == 'new')
      this.createCategory();
    else
      this.updateCategory();
  }

  private setCurrentAction() {
    //retorna um array da rota segmentada pelas '/' a partir de categories ex: categories/new url[0]==new
    if(this.route.snapshot.url[0].path == 'new')
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
        switchMap(params => this.categoryService.getByIdd(+params.get('id')))
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

  private createCategory(){
    //abaixo os valores preenchidos no form são recuperados, há tipagem dos dados e por fim atribuição
    const category: Category = Object.assign(new Category(), this.categoryForm.value);

    this.categoryService.create(category)
    .subscribe(
      category => this.actionsForSuccess(category),
      error => this.actionsForError(error)
    )
  }

  private updateCategory(){
    const category: Category = Object.assign(new Category(), this.categoryForm.value);

    this.categoryService.update(category)
    .subscribe(
      category => this.actionsForSuccess(category),
      error => this.actionsForError(error)
    )
  }

  private actionsForSuccess(category: Category){
    toastr.success('Solicitação processada com sucesso!');

    // esse método redireciona o usuário para '/categories' depois redireciona novamente para '/categories/:id/edit'
    // o objetivo disso é fazer o componente ser recarregado pois no onInit existem diversas functions essenciais
    // para o funcionamento do componente
    // skipLocationChange: true faz com que o usuário não consiga voltar pra determinada página
    this.router.navigateByUrl('categories', {skipLocationChange: true}).then(
      () => this.router.navigate(['categories', category.id, 'edit'])
    )
  }

  private actionsForError(error){
    toastr.error('Ocorreu um erro ao processar a sua solicitação!');

    this.submittingForm = false;

    if(error.status === 422)
      this.serverErrorMessages = JSON.parse(error._body).erros;//retorna um array de erros
    else
      this.serverErrorMessages = ["Falha na comunicação com o servidor. Por favor tente mais tarde."]
  }

}
