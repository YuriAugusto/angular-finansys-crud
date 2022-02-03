import { InMemoryDbService } from "angular-in-memory-web-api";
import { Category } from "./shared/category.model";


export class InMemoryDAtaBase implements InMemoryDbService{

  createDb(){
    const categories: Category[] =  [
      { id: 1, name: 'Moradia', description: 'Pagar contas de casa' },
      { id: 2, name: 'Saúde', description: 'Pagar plano de saúde' },
      { id: 3, name: 'Lazer', description: 'Cinema, parque e etc' },
      { id: 4, name: 'Salário', description: 'Recebimento de salário fixo' },
      { id: 5, name: 'Freelas', description: 'Recebimento de salário variado' }
    ];

    return { categories }
  }

}
