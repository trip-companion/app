import { DOCUMENT } from '@angular/common';
import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';

import { AuthenticationService } from '@app/services/authentication.service';
import { LocationService } from '@app/services/location.service';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';

import IPageDataModel from '@app/interfaces/store.models/pageData.model';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-create-travel',
  templateUrl: './create-travel.component.html',
  styleUrls: ['./create-travel.component.scss']
})
export class CreateTravelComponent implements OnInit {
  @ViewChild('categoryInput') categoryInput: ElementRef<HTMLInputElement>;
  @ViewChild('autoCategory') matAutocomplete: MatAutocomplete;

  public peopleMin = 1;
  public peopleMax = 50;
  public userAuth = false;
  public minSearchDate: Date = new Date();
  public homePath = this.locationService.extractBasePATH();
  public createTravelStaticData: IPageDataModel = {
    mappings: {
      noAuth: {
        title: {
          text: 'Вітаємо! Для цього крока вам потрібно увійти в систему.'
        },
        description: {
          text: `Для створення нових подорожей потрібно пройти реєстрацію, якщо Ви ще не зареєстровані.,
            З особистим кабінетом користувача ви зможете заповнити особисту інформацію 
            яку будуть бачити користувачі зацікавлені подорожами по вашому напрямку. Таким чином ви зможете зрозуміти чи співпадають ваші 
            інтереси та погляди. А також Ви зможете спілкуватись з іншими користувачами через чат, 
            відслідковувати статистику і залишати відгуки про ваші подорожі та супутників.`
        },
        buttons: {
          logIn: {
            text: 'Увійти'
          },
          singUp: {
            text: 'Зареєструватися'
          }
        }
      },
      okAuth: {
        title: {
          text: 'Заповніть форму згідно рекомендацій у підсказках'
        },
        category: {
          helper: {
            text: `Знайдінь і додайте серед ключових слів самі актуальні для вашої подорожі. 
            Для того щоб інші користувачі могли розуміти цілі вашої подорожі`
          },
          input: {
            text: 'Категорії подорожі',
            placeholder: {
              text: 'Додати нову категорію...'
            }
          },
        },
        description: {
          helper: {
            text: `Якомога детальніше опишіть вашу подорож: звідки ви, куди потрапити, чому хочете потрапити саме в це місце,
            чим плануєте займатися, тощо. Якщо плануєте їхати через інші містя - напишіть про це також.`
          },
          input: {
            text: 'Деталі подорожі',
            placeholder: {
              text: 'Опишіть вашу подорож.'
            }
          }
        },
        destination: {
          helper: {
            text: 'Вкажіть країну, місто чи регіон куди ви хочете потрапити.'
          },
          input: {
            text: 'Пункт призначення',
          }
        },
        datepicker: {
          helper: {
            text: 'Приблизний період вашої подорожі.'
          },
          inputs: {
            start:  {
              text: 'Дата початку'
            },
            end: {
              text: 'Дата завершення'
            },
          }
        },
        count: {
          helper: {
            text: `Вкажіть максимульну кількисть осіб для вашої подорожі. 
            Якщо ви вже подорожуєте з кимость, то потрібно вказати кількисть вільних місць.`
          },
          input: {
            text: 'Кількість осіб',
          }
        },
        info: {
          text: 'Детальна інформація про вас із вашого особистого кабінету буде автоматично додана до цього поста.'
        },
        button: {
          text: 'Створити подорож'
        }
      }
    }
  };
  public availableCategoryForUser = [
    {
      displayName: 'one',
      id: 'ssadsa1211'
    },
    {
      displayName: 'two',
      id: 'ssadsa1211'
    },
  ];
  public userCategoriesChoices = [
    {
      displayName: 'ffffff',
      id: 'ssadsa1211'
    },
    {
      displayName: 'fffffffffffffo',
      id: 'ssadsa1211'
    },
  ];
  public pageDataContent: IPageDataModel = null;
  public separatorKeysCodes: number[] = [ENTER, COMMA];
  public categoriesForm = new FormControl();
  public createTravelForm = new FormGroup({
    peoplesCountInput: new FormControl(1, Validators.required),
    startTravelDateInput: new FormControl('', Validators.required),
    endTravelDateInput: new FormControl('', Validators.required),
    destinationInput: new FormControl('', Validators.required),
    descriptionInput: new FormControl('', Validators.required),
  });
  private subsPageData: Subscription = new Subscription();

  constructor(@Inject(DOCUMENT) private document: Document,
    private authenticationService: AuthenticationService,
    private activeRoute: ActivatedRoute,
    public locationService: LocationService,
  ) {
    if (this.authenticationService.tokenValue) {
      this.userAuth = true;
    }
  }

  public ngOnInit(): void {

    this.subsPageData = this.activeRoute.data.subscribe(data => {
      this.pageDataContent = data.pageContent.page;
    });

    this.categoriesForm.valueChanges.subscribe(value => {
      console.log(value);
    });
  };


  public removeTripCategory(category): void {
    console.log(category);
  };

  public selectedTripCategory(event: MatAutocompleteSelectedEvent): void {
    console.log(event);

    this.categoryInput.nativeElement.value = '';
    this.categoriesForm.setValue(null);
    this.categoryInput.nativeElement.blur();
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

  private get getPeoplesCountField(): any {
    return this.createTravelForm.get('peoplesCountInput').value;
  }

  private set setPeoplesCountField(value) {
    this.createTravelForm.get('peoplesCountInput').setValue(value);
  }
}
