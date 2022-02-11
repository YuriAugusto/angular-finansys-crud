import { OnInit } from '@angular/core';

import { BaseResourceModel } from 'src/app/shared/models/base-resource.model';
import { BaseResourceService } from '../../services/base-resource.service';

export abstract class BaseResourceListComponent<T extends BaseResourceModel> implements OnInit {

  resources: T[] = [];

  constructor(private resourceService: BaseResourceService<T>) { }

  ngOnInit() {
    this.resourceService.getAll().subscribe(
      //ordenação por ids, o maior id será o primeiro item a ser exibido da lista
      resources => this.resources = resources.sort((a, b) => b.id - a.id),
      error => alert("Erro ao carregar a lista")
    );
  }

  deleteResource(resource: T){
    const mustDelete = confirm('Deseja realmente excluir este item?');

    if(mustDelete){
      this.resourceService.delete(resource.id).subscribe(
        //um filtro é aplicado e será retornado um array de objetos exceto o que foi solicidata exclusão
        () => this.resources = this.resources.filter(element => element != resource),
        () => alert("Erro ao tentar excluir!")
      )
    }
  }

}
