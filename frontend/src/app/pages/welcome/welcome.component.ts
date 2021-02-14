import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl,  Validators } from '@angular/forms';
import { SharedService } from '@app/services/shared.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {
  public _min: number = 1;
  public _max: number = 50;
  public color: string = 'default';
  public screenWidthDesc = this.document.documentElement.clientWidth > 767;
  public pageDataContent: any;
  public minSearchDate: Date;

  constructor(@Inject(DOCUMENT) private document: Document,
    public sharedService: SharedService,
    private activeRoute: ActivatedRoute,) {
      this.minSearchDate  = new Date();
    }

  public searchForm = new FormGroup({
    start: new FormControl('',  Validators.compose([Validators.required])),
    end: new FormControl('',  Validators.compose([Validators.required])),
    destinationValue: new FormControl('',  Validators.compose([Validators.required])),
    formField: new FormControl(1,  Validators.compose([Validators.required]))
  });

  get getDestinationInput(): any { return this.searchForm.get('destinationValue')}
  get getFormField(): any { return this.searchForm.get('formField')}

  public ngOnInit() {
    this.pageDataContent = this.activeRoute.data['value'].pageContent.page.mappings.main;
  }

  public searchOffers(): void {
    console.log("in searchOffers, form: ", this.searchForm)
    //get all offers for this params and redirect to page offers
  }

  public clearDestinationValue(): void{
    this.getDestinationInput.reset('')
  }

  public getColor(): string {
    return this.color
  }

  public setColor(color: string): void {
    this.color = color;
  }

  public incrementValue(step: number = 1): void {
    const inputValue = this.searchForm.value.formField + step;
    this.getFormField.setValue(inputValue) 
  }

  public shouldDisableDecrement(inputValue: number): boolean {
    return inputValue <= this._min;
  }

  public shouldDisableIncrement(inputValue: number): boolean {
    return inputValue >= this._max;
  }

}
