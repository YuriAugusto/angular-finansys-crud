import { BaseResourceModel } from "src/app/shared/models/base-resource.model";
import { Category } from "../../categories/shared/category.model";

export class Entry extends BaseResourceModel{
  constructor(
    public id?: number,
    public name?: string,
    public description?: string,
    public type?: string,
    public amount?: string,
    public date?: string,
    public paid?: boolean,
    public categoryId?: number,
    public category?: Category
  ){
    super();//faz referência ao construtor da super class
  }

  static types = {//propriedade static
    expense: 'Despesa',
    revenue: 'Receita'
  };

  static fromJson(jsonData: any): Entry {//método static
    return Object.assign(new Entry(), jsonData)//faz o cast e retorna uma instância de Entry
  }

  get paidText(): string {//método
    return this.paid ? 'Pago' : 'Pedente';
  }
}
