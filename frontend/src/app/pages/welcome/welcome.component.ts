import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SharedService } from '@app/services/shared.service';
import { ActivatedRoute, Data } from '@angular/router';
import { Subscription } from 'rxjs';
import { LocationService } from '@app/services/location.service';
import { ApiService } from '@app/services/api.services';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit, OnDestroy {
  public peopleMin = 1;
  public peopleMax = 50;
  public color = 'default';
	public delayTimerForSerachDestination;
  public screenWidthDesc = this.document.documentElement.clientWidth > 767;
  public pageDataContent: Data;
  public minSearchDate: Date = new Date();
  public searchForm = new FormGroup({
    start: new FormControl('', Validators.compose([Validators.required])),
    end: new FormControl('', Validators.compose([Validators.required])),
    destinationValue: new FormControl('', Validators.compose([Validators.required])),
    formField: new FormControl(1, Validators.compose([Validators.required]))
  });
  private subsPageData: Subscription = new Subscription();

  constructor(@Inject(DOCUMENT) private document: Document,
    public sharedService: SharedService,
    private activeRoute: ActivatedRoute,
    private apiSvc: ApiService,
    public locationService: LocationService,) {}

  get getDestinationInput(): any { return this.searchForm.get('destinationValue'); }
  get getFormField(): any { return this.searchForm.get('formField'); }

  public ngOnInit(): void {
    this.subsPageData = this.activeRoute.data.subscribe(data => {
      this.pageDataContent = data.pageContent.page.mappings.main;
    });

    this.searchForm.controls.destinationValue.valueChanges.subscribe(value => {
		  clearTimeout(this.delayTimerForSerachDestination);
      this.delayTimerForSerachDestination = setTimeout(() => {
        this.apiSvc.postFindPlace(value)
          .subscribe(res => {
            console.log(res);
					  const newArr = res.features.filter(item => {
              // console.log(item.properties);
              if(item.properties.city) {return item;}
            });
		  			console.log(newArr);
          });
      }, 1000);
    });
  }

  public ngOnDestroy(): void {
    this.subsPageData.unsubscribe();
  }

  public searchOffers(): void {
    console.log('in searchOffers, form: ', this.searchForm);
    // get all offers for this params and redirect to page offers
  }

  public clearDestinationValue(): void{
    this.getDestinationInput.reset('');
  }

  public getColor(): string {
    return this.color;
  }

  public setColor(color: string): void {
    this.color = color;
  }

  public incrementValue(step: number = 1): void {
    const inputValue = this.searchForm.value.formField + step;
    this.getFormField.setValue(inputValue);
  }

  public shouldDisableDecrement(inputValue: number): boolean {
    return inputValue <= this.peopleMin;
  }

  public shouldDisableIncrement(inputValue: number): boolean {
    return inputValue >= this.peopleMax;
  }
}
