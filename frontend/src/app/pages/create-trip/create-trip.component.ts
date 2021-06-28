import { DOCUMENT } from '@angular/common';
import { Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { AuthenticationService } from '@app/services/authentication.service';
import { LocationService } from '@app/services/location.service';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import * as moment from 'moment';
import IPageDataModel from '@app/interfaces/store/pageData';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ITravelCategory } from '@app/interfaces/store/userTripList';
import { AppState , getUserId } from '@app/store/app.state';
import { Store } from '@ngrx/store';
import { UserTripService } from '@app/services/user-trip.service';
import { UserTripModel } from '@app/models/trip-user.model';
import { AddUserTripAction } from '@app/store/actions/accountTripList.action';


@Component({
  selector: 'app-create-trip',
  templateUrl: './create-trip.component.html',
  styleUrls: ['./create-trip.component.scss']
})
export class CreateTravelComponent implements OnInit, OnDestroy {
  @ViewChild('categoryInput') categoryInput: ElementRef<HTMLInputElement>;

  public userId: string;
  public peopleMin = 1;
  public peopleMax = 50;
  public userAuth = false;
  public minSearchDate: Date = new Date();
  public homePath = this.locationService.extractBasePATH();
  public pageDataContent: IPageDataModel = null;
  public categoriesForm = new FormControl();
  public createTravelForm = new FormGroup({
    peoplesCountInput: new FormControl(1, Validators.required),
    startTravelDateInput: new FormControl('', Validators.required),
    endTravelDateInput: new FormControl('', Validators.required),
    destinationInput: new FormControl('', Validators.required),
    descriptionInput: new FormControl('', Validators.required),
    statusDate: new FormControl(moment(new Date()), Validators.required),
  });
  public availableUserCategoriesForUser: ITravelCategory[] = [];
  public userCategoriesChoices: string[] = [];
  private subsPageData: Subscription = new Subscription();
  private subsCategoriesInput: Subscription = new Subscription();

  constructor(@Inject(DOCUMENT) private document: Document,
    private authenticationService: AuthenticationService,
    private activeRoute: ActivatedRoute,
    public locationService: LocationService,
    private store: Store<AppState>,
    private userTripSrv: UserTripService,
  ) {
    if (this.authenticationService.tokenValue) {
      this.userAuth = true;
      this.store.select(getUserId).subscribe(id => {this.userId = id;});
    }
  }

  public ngOnInit(): void {
    this.availableUserCategoriesForUser = this.userTripSrv.availableUserCategories;
    // console.log(this.createTravelForm.value.statusDate.format('YYYY-MM-DD'))
    this.subsPageData = this.activeRoute.data.subscribe(data => {
      this.pageDataContent = data.pageContent.page;
    });

    this.subsCategoriesInput = this.categoriesForm.valueChanges.subscribe(value => {
      this.availableUserCategoriesForUser = this.userTripSrv.setAvailableCategoryForUser(this.userCategoriesChoices);
      if(value) {
        this.availableUserCategoriesForUser = this.userTripSrv.filterCategories(value, this.availableUserCategoriesForUser);
        if(this.availableUserCategoriesForUser.length < 1) {
          this.availableUserCategoriesForUser = this.userTripSrv.setAvailableCategoryForUser(this.userCategoriesChoices);
        }
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
      this.availableUserCategoriesForUser = this.userTripSrv.setAvailableCategoryForUser(this.userCategoriesChoices);
    }
  };

  public selectedTripCategory(event: MatAutocompleteSelectedEvent): void {
    this.userCategoriesChoices.push(this.userTripSrv.availableUserCategories.find(category =>
      category.displayName === event.option.viewValue).id);
    this.categoryInput.nativeElement.value = '';
    this.categoriesForm.setValue(null);
    this.categoryInput.nativeElement.blur();
    this.availableUserCategoriesForUser = this.userTripSrv.setAvailableCategoryForUser(this.userCategoriesChoices);
  };

  public createNewTravel(): void {
    console.log(this.createTravelForm.controls);
    const trip = new UserTripModel({
      id: Math.floor(Math.random() * 100).toString(),
      userId: this.userId,
      status: true,
      statusDate: this.createTravelForm.value.statusDate.format('YYYY-MM-DD'),
      travelCategiries: this.userCategoriesChoices,
      travelDescription: this.createTravelForm.value.descriptionInput,
      destination:  this.createTravelForm.value.destinationInput,
      startTrip: this.createTravelForm.value.startTravelDateInput.format('YYYY-MM-DD'),
      endTrip: this.createTravelForm.value.endTravelDateInput.format('YYYY-MM-DD'),
      peopleCount: this.getPeoplesCountField
    });
    this.store.dispatch(new AddUserTripAction(trip));
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

  private get getPeoplesCountField(): any {
    return this.createTravelForm.get('peoplesCountInput').value;
  }

  private set setPeoplesCountField(value) {
    this.createTravelForm.get('peoplesCountInput').setValue(value);
  }
}
