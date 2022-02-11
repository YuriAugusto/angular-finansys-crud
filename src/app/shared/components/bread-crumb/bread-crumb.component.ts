import { Component, Input, OnInit } from '@angular/core';

interface BreadCrumbItem {
  text: string;
  link?: string;//atributo opcional
}

@Component({
  selector: 'app-bread-crumb',
  templateUrl: './bread-crumb.component.html',
  styleUrls: ['./bread-crumb.component.css']
})
export class BreadCrumbComponent implements OnInit {

  //permite que o componente receba parâmetros
  @Input() items: Array<BreadCrumbItem> = [];

  constructor() { }

  ngOnInit() {
  }

  isTheLastItem(item: BreadCrumbItem): boolean{
    const index = this.items.indexOf(item);
    return index + 1 == this.items.length;// retorna true se for o último ou false caso não seja
  }

}
