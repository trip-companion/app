import { DOCUMENT } from '@angular/common';
import { Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { LocationService } from '@app/services/location.service';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { IUserTrip , ITravelCategory } from '@app/interfaces/store/userTripList';
import IPageDataModel from '@app/interfaces/store/pageData';

import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { AppState } from '@app/store/app.state';
import { Store } from '@ngrx/store';
import { UserTripService } from '@app/services/user-trip.service';
import { EditUserTripAction } from '@app/store/actions/accountTripList.action';
import { UserTripModel } from '@app/models/trip-user.model';

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
  public pageDataContent: IPageDataModel;
  public trip: IUserTrip;

  public categoriesForm = new FormControl();
  public editTravelForm = new FormGroup({
    peoplesCountInput: new FormControl(1, Validators.required),
    startTravelDateInput: new FormControl('', Validators.required),
    endTravelDateInput: new FormControl('', Validators.required),
    destinationInput: new FormControl('', Validators.required),
    descriptionInput: new FormControl('', Validators.required),
  });
  public availableUserCategoriesForUser: ITravelCategory[] = [];
  public userCategoriesChoices: string[] = [];

  private subsPageData: Subscription = new Subscription();
  private subsCategoriesInput: Subscription = new Subscription();

  constructor(@Inject(DOCUMENT) private document: Document,
    private activeRoute: ActivatedRoute,
    public locationService: LocationService,
    private store: Store<AppState>,
    private userTripSrv: UserTripService,
  ) {}

  public ngOnInit(): void {
    this.availableUserCategoriesForUser = this.userTripSrv.availableUserCategories;
    this.subsPageData = this.activeRoute.data.subscribe(data => {
      this.pageDataContent = data.pageContent.page;
      this.trip = data.editTrip;
      this.initData();
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
    this.userCategoriesChoices.push(this.userTripSrv.availableUserCategories.find(
      category => category.displayName === event.option.viewValue
    ).id);
    this.categoryInput.nativeElement.value = '';
    this.categoriesForm.setValue(null);
    this.categoryInput.nativeElement.blur();
    this.availableUserCategoriesForUser = this.userTripSrv.setAvailableCategoryForUser(this.userCategoriesChoices);
  };

  public editTrip(): void {
    const editTrip = new UserTripModel({
      id: this.trip.id,
      userId: this.trip.userId,
      status: this.trip.status,
      statusDate:  this.trip.statusDate,
      travelCategiries: this.userCategoriesChoices,
      travelDescription: this.editTravelForm.value.descriptionInput,
      destination:  this.editTravelForm.value.destinationInput,
      startTrip: this.editTravelForm.value.startTravelDateInput.format('YYYY-MM-DD'),
      endTrip: this.editTravelForm.value.endTravelDateInput.format('YYYY-MM-DD'),
      peopleCount: this.getPeoplesCountField
    });
    console.log(editTrip);
    this.store.dispatch(new EditUserTripAction(editTrip));
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

  private initData(): void {
    this.editTravelForm.controls.peoplesCountInput.setValue(this.trip.peopleCount);
    this.editTravelForm.controls.startTravelDateInput.setValue(moment(this.trip.startTrip));
    this.editTravelForm.controls.endTravelDateInput.setValue(moment(this.trip.endTrip));
    this.editTravelForm.controls.destinationInput.setValue(this.trip.destination);
    this.editTravelForm.controls.descriptionInput.setValue(this.trip.travelDescription);

    this.userCategoriesChoices = this.trip.travelCategiries.slice();
    this.availableUserCategoriesForUser = this.userTripSrv.setAvailableCategoryForUser(this.userCategoriesChoices);
  }

  private get getPeoplesCountField(): any {
    return this.editTravelForm.get('peoplesCountInput').value;
  }

  private set setPeoplesCountField(value) {
    this.editTravelForm.get('peoplesCountInput').setValue(value);
  }
}
