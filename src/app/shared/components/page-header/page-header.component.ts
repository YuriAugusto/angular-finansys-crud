import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-page-header',
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.css']
})
export class PageHeaderComponent implements OnInit {

  // quando houver passagem de valor para as propriedades o bind deve
  // ser feito através de 'page-title', 'button-class', 'button-text' etc...
  @Input('page-title') pageTitle: string;
  @Input('show-button') showButton: boolean = true;//definição de valor default
  @Input('button-class') buttonClass: string;
  @Input('button-text') buttonText: string;
  @Input('button-link') buttonLink: string;

  constructor() { }

  ngOnInit() {
  }

}
