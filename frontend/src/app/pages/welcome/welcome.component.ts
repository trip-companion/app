import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl,  Validators } from '@angular/forms';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {

  constructor() { }
  public destinationValue = '';
  public _value: number = 0;
  public _step: number = 1;
  public _min: number = 0;
  public _max: number = Infinity;
  public _wrap: boolean = false;
  public color: string = 'default';


  public searchForm = new FormGroup({
    start: new FormControl('',  Validators.compose([Validators.required])),
    end: new FormControl('',  Validators.compose([Validators.required])),
    destinationValue: new FormControl('',  Validators.compose([Validators.required])),
    formField: new FormControl(1,  Validators.compose([Validators.required]))
  });
  get getDestinationInput(): any { return this.searchForm.get('destinationValue')}
  get getFormField(): any { return this.searchForm.get('formField')}

  public ngOnInit() {
    
  }

  public searchOffers(): void {
    console.log("in searchOffers, form: ", this.searchForm)
  }

  public clearDestinationValue(): void{
    this.getDestinationInput.reset('')
  }

  /// start caunter
  public getColor(): string {
    return this.color
  }

  public setColor(color: string): void {
    this.color = color;
  }



  public incrementValue(step: number = 1): void {
    
    let inputValue = this.searchForm.value.formField + step;
    console.log(inputValue)
    this.getFormField.setValue(inputValue) 

    // let inputValue = this._value + step;

    // if (this._wrap) {
    //   inputValue = this.wrappedValue(inputValue);
    // }

    // this._value = inputValue;

  }

  public shouldDisableDecrement(inputValue: number): boolean {
    return !this._wrap && inputValue <= this._min;
  }

  public shouldDisableIncrement(inputValue: number): boolean {
    return !this._wrap && inputValue >= this._max;
  }

  private wrappedValue(inputValue): number {
    if (inputValue > this._max) {
      return this._min + inputValue - this._max;
    }

    if (inputValue < this._min) {

      if (this._max === Infinity) {
        return 0;
      }

      return this._max + inputValue;
    }

    return inputValue;
  }

}
