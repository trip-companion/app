import { Component, OnInit, ChangeDetectionStrategy, ViewEncapsulation,
  Inject, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Subscription } from 'rxjs';
// services
import { SharedService } from '@app/services/shared.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import ILocalizationText from '../../interfaces/localization-text';

@Component({
  selector: 'app-global-event',
  templateUrl: './global-event.component.html',
  styleUrls: ['./global-event.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation : ViewEncapsulation.None
})
export class GlobalEventComponent implements OnInit, OnDestroy {

  public homePath: string;
  public modelLang: string;
  public isMatSelectOpen = false;
  public actionName: ILocalizationText = {
    ru: 'Закрыть',
    ua: 'Закрити',
    en: 'Close'
  };
  private subsDataGlobalEvent: Subscription = new Subscription();

  constructor(@Inject(DOCUMENT) private document: Document,
    private cdRef: ChangeDetectorRef,
    public sharedService: SharedService,
    private snackBar: MatSnackBar) {}

  public ngOnInit(): void {
    this.modelLang = this.sharedService.language;

    this.subsDataGlobalEvent = this.sharedService.$globalEventSubject.subscribe((objGlobalEvent) => {
      this.modelLang = this.sharedService.language;
      this.openSnackBar(objGlobalEvent.message, this.actionName[this.modelLang], objGlobalEvent.type);
    });
  }

  public ngOnDestroy(): void {
    this.subsDataGlobalEvent.unsubscribe();
  }

  public openSnackBar(message: string, action: string, type: string): void {
    this.snackBar.open(message, action, { duration: 5000, horizontalPosition: 'center', verticalPosition: 'top', panelClass: type});
  }

}
