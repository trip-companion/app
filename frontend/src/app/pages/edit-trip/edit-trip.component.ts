import { DOCUMENT } from '@angular/common';
import { Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { LocationService } from '@app/services/location.service';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { IUserTrip } from '@app/interfaces/store/userTripList';
import IPageDataModel from '@app/interfaces/store/pageData';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

import { AppState } from '@app/store/app.state';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-edit-trip',
  templateUrl: './edit-trip.component.html',
  styleUrls: ['./edit-trip.component.scss']
})
export class EditTripComponent implements OnInit, OnDestroy {
  @ViewChild('categoryInput') categoryInput: ElementRef<HTMLInputElement>;

  public peopleMin = 1;
  public peopleMax = 50;
  public minSearchDate: Date = new Date();
  public homePath = this.locationService.extractBasePATH();
  public pageDataContent: IPageDataModel = null;
  public trip: IUserTrip;

  public categoriesForm = new FormControl();
  public createTravelForm = new FormGroup({
    peoplesCountInput: new FormControl(1, Validators.required),
    startTravelDateInput: new FormControl('', Validators.required),
    endTravelDateInput: new FormControl('', Validators.required),
    destinationInput: new FormControl('', Validators.required),
    descriptionInput: new FormControl('', Validators.required),
  });
  public availableUserCategoriesForUser: {id: string; displayName: string}[] = [];
  public availableUserCategories: {id: string; displayName: string}[] = [
    {
      id: '123-123',
      displayName: 'ggg'
    },
    {
      id: '321-321',
      displayName: 'zzzz'
    },
    {
      id: '333-333',
      displayName: 'ssss'
    },

  ];
  public userCategoriesChoices: string[] = [];
  private subsPageData: Subscription = new Subscription();
  private subsCategoriesInput: Subscription = new Subscription();

  constructor(@Inject(DOCUMENT) private document: Document,
    private activeRoute: ActivatedRoute,
    public locationService: LocationService,
    private store: Store<AppState>,
  ) {}

  public ngOnInit(): void {
    this.availableUserCategoriesForUser = this.availableUserCategories;
    // this.store.dispatch(new AddUserTripAction({userId: '123-44-512313212'}));
    this.subsPageData = this.activeRoute.data.subscribe(data => {
      this.pageDataContent = data.pageContent.page;
      this.trip = data.editTrip;
      console.log(data);
    });

    this.subsCategoriesInput = this.categoriesForm.valueChanges.subscribe(value => {
      this.setAvailableCategoryForUser();
      if(value) {
        this.availableUserCategoriesForUser = this.filterCategories(value);
        if(this.availableUserCategoriesForUser.length < 1) {this.setAvailableCategoryForUser();}
      }
    });
  };

  public ngOnDestroy(): void {
    this.subsPageData.unsubscribe();
    this.subsCategoriesInput.unsubscribe();
  }

  public removeTripCategory(category): void {
    const index = this.userCategoriesChoices.indexOf(category);
    if (index >= 0) {
      this.userCategoriesChoices.splice(index, 1);
      this.setAvailableCategoryForUser();
    }
  };

  public selectedTripCategory(event: MatAutocompleteSelectedEvent): void {
    this.userCategoriesChoices.push(this.availableUserCategories.find(category => category.displayName === event.option.viewValue).id);
    this.categoryInput.nativeElement.value = '';
    this.categoriesForm.setValue(null);
    this.categoryInput.nativeElement.blur();
    this.setAvailableCategoryForUser();
  };

  public createNewTravel(): void {
    console.log(this.createTravelForm.controls);

  }

  public incrementValueOfPeoples(step: number = 1): void {
    this.setPeoplesCountField = this.getPeoplesCountField + step;
  }

  public shouldDisableDecrement(inputValue: number): boolean {
    return inputValue <= this.peopleMin;
  }

  public shouldDisableIncrement(inputValue: number): boolean {
    return inputValue >= this.peopleMax;
  }

  private filterCategories(value: string): {id: string; displayName: string}[] {
    const filterValue = value.toLowerCase();
    return this.availableUserCategoriesForUser.filter(category => category.displayName.toLowerCase().indexOf(filterValue) === 0);
  }

  private setAvailableCategoryForUser(): void {
    const newArr = this.userCategoriesChoices.length === 0
      ? this.availableUserCategories
      : this.availableUserCategories.filter(({ id: idInAll}) => !this.userCategoriesChoices.find((currentId) => currentId === idInAll));

    this.availableUserCategoriesForUser = newArr;
  }

  private get getPeoplesCountField(): any {
    return this.createTravelForm.get('peoplesCountInput').value;
  }

  private set setPeoplesCountField(value) {
    this.createTravelForm.get('peoplesCountInput').setValue(value);
  }
}
