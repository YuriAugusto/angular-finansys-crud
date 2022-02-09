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
    super();//faz referência o constructor da classe estendida
  }

  static types = {//propriedade static
    expense: 'Despesa',
    revenue: 'Receita'
  };

  get paidText(): string {//método
    return this.paid ? 'Pago' : 'Pedente';
  }
}
