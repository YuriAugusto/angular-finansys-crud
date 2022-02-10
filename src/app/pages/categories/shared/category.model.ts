import { BaseResourceModel } from "src/app/shared/models/base-resource.model";

export class Category extends BaseResourceModel{
  constructor(
    public id?: number,
    public name?: string,
    public description?: string
  ){
    super();//faz referência o constructor da classe estendida
  }

  static fromJson(jsonData: any): Category {//método static
    return Object.assign(new Category(), jsonData)//faz o cast e retorna uma instância de Category
  }
}
