import { AfterContentChecked, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { switchMap } from 'rxjs/operators';
import toastr from 'toastr';

import { Entry } from '../shared/entry.model';
import { EntryService } from '../shared/entry.service';


@Component({
  selector: 'app-entry-form',
  templateUrl: './entry-form.component.html',
  styleUrls: ['./entry-form.component.css']
})
export class EntryFormComponent implements OnInit, AfterContentChecked {

  currentAction: string;
  entryForm: FormGroup;
  pageTitle: string;
  serverErrorMessages: string[] = null;
  submittingForm: boolean = false;
  entry: Entry = new Entry();

  constructor(
    private entryService: EntryService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.setCurrentAction();//define a ação com base na uri da rota ex: edit ou new
    this.buildEntryForm();//construir o form
    this.loadEntry();//carregar o lançamento
  }

  ngAfterContentChecked(){//método invocado depois que tudo estiver sido carregado na página
    this.setPageTitle();
  }

  submitForm(){
    this.submittingForm = true;

    if(this.currentAction == 'new')
      this.createEntry();
    else
      this.updateEntry();
  }

  private setCurrentAction() {
    //retorna um array da rota segmentada pelas '/' a partir de entries ex: entries/new url[0]==new
    if(this.route.snapshot.url[0].path == 'new')
      this.currentAction = 'new';
    else
      this.currentAction = 'edit'
  }

  private buildEntryForm(){//constrói o formulário
    this.entryForm = this.formBuilder.group({
      id: [null],
      name: [null, [Validators.required, Validators.minLength(2)]],
      description: [null],
      type: [null, [Validators.required]],
      amount: [null, [Validators.required]],
      date: [null, [Validators.required]],
      paid: [null, [Validators.required]],
      categoryId: [null, [Validators.required]]
    })
  }

  private loadEntry(){
    if(this.currentAction == 'edit'){

      this.route.paramMap.pipe(
        switchMap(params => this.entryService.getByIdd(+params.get('id')))
      )
      .subscribe(
        (entry) => {
          this.entry = entry;
          this.entryForm.patchValue(entry);//bind do objeto entry com o form entryForm:FormGroup
        },
        (error) => alert('Ocorreu um erro no servidor, tente mais tarde.')
      )
    }
  }

  private setPageTitle(){
    if(this.currentAction == 'new')
      this.pageTitle = 'Cadastro de Novo Lançamento';
    else{
      const entryName = this.entry.name || '...';//this.entry.name se for null uma string vazia é atribuída
      this.pageTitle = 'Editando Lançamento: ' + entryName;
    }
  }

  private createEntry(){
    //abaixo os valores preenchidos no form são recuperados, há tipagem dos dados e por fim atribuição
    const entry: Entry = Object.assign(new Entry(), this.entryForm.value);

    this.entryService.create(entry)
    .subscribe(
      entry => this.actionsForSuccess(entry),
      error => this.actionsForError(error)
    )
  }

  private updateEntry(){
    const entry: Entry = Object.assign(new Entry(), this.entryForm.value);

    this.entryService.update(entry)
    .subscribe(
      entry => this.actionsForSuccess(entry),
      error => this.actionsForError(error)
    )
  }

  private actionsForSuccess(entry: Entry){
    toastr.success('Solicitação processada com sucesso!');

    this.router.navigateByUrl('entries', {skipLocationChange: true}).then(
      () => this.router.navigate(['entries', entry.id, 'edit'])
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
