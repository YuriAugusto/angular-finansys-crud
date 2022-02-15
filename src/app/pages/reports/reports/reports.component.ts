import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { Category } from '../../categories/shared/category.model';
import { CategoryService } from '../../categories/shared/category.service';
import { Entry } from '../../entries/shared/entry.model';
import { EntryService } from '../../entries/shared/entry.service';

import currencyFormatter from 'currency-formatter';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {

  expenseTotal: any = 0;
  revenueTotal: any = 0;
  balance: any = 0;

  expenseChartData: any;//propriedades exibidas nos gráficos
  revenueChartData: any;

  chartOptions = {
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true
        }
      }]
    }
  };

  categories: Category[] = [];
  entries: Entry[] = [];

  //recupera o elemento a partir de sua 'template variable' 'month' e 'year'
  @ViewChild('month') month: ElementRef = null;
  @ViewChild('year') year: ElementRef = null;

  constructor(private entryService:EntryService, private categoryService: CategoryService) { }

  ngOnInit() {
    this.categoryService.getAll()
      .subscribe(categories => this.categories = categories);
  }

  generateReports(){
    //aqui consigo acessar o valor atribuído ao select através da anotação '@ViewChild'
    const month = this.month.nativeElement.value;
    const year = this.year.nativeElement.value;

    if(!month || !year)
      alert('Você precisa selecionar Mês e Ano para gerar os relatórios');
    else
      this.entryService.getByMonthAndYear(month, year).subscribe(this.setValues.bind(this));
  }

  private setValues(entries: Entry[]){
    this.entries = entries;
    this.calculateBalance();
    this.setChartData();
  }

  private calculateBalance(){
    let revenueTotal = 0;
    let expenseTotal = 0;

    this.entries.forEach(entry => {
      if(entry.type == 'revenue')//'unformat()' remove formatação no formato BRL, ex: 15,50 convertido para 15.50
        revenueTotal += currencyFormatter.unformat(entry.amount, { code: 'BRL' });
      else
        expenseTotal += currencyFormatter.unformat(entry.amount, { code: 'BRL' });
    });

    // format() converte 15.50 para 15,50
    this.revenueTotal = currencyFormatter.format(revenueTotal, { code: 'BRL' });
    this.expenseTotal = currencyFormatter.format(expenseTotal, { code: 'BRL' });
    this.balance = currencyFormatter.format(revenueTotal - expenseTotal, { code: 'BRL' });
  }

  private setChartData(){
    this.revenueChartData = this.getChartData('revenue', 'Gráfico de Receitas', '#9CCC65');
    this.expenseChartData = this.getChartData('expense', 'Gráfico de Despesas', '#E03131');
  }

  private getChartData(entryType: string, title: string, color: string){
    const chartData = [];

    this.categories.forEach(category => {
      // filtro de lançamentos pela categoria e tipo'(despesa/receita)'
      const filteredEntries = this.entries.filter(
        entry => (entry.categoryId == category.id) && (entry.type == entryType)//retorna entry se as comparações resultarem em true
      );
      // se forem encontrados lançamentos então some os valores e adicione ao chartData
      if(filteredEntries.length >0 ){
        const totalAmount = filteredEntries.reduce(
          (total, entry) => total + currencyFormatter.unformat(entry.amount, { code: 'BRL' }), 0
        )

        //array de objetos com atributos 'categoryName' e 'totalAmount'
        chartData.push({
          categoryName: category.name,
          totalAmount: totalAmount
        })
      }
    });

    return {
      labels: chartData.map(item => item.categoryName),
      datasets: [{
        label: title,
        backgroundColor: color,
        data: chartData.map(item => item.totalAmount)
      }]
    }
  }
}
