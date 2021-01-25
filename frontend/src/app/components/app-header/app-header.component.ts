import {Component, OnInit, ChangeDetectionStrategy, ViewEncapsulation, Renderer2,
	Inject, ChangeDetectorRef, AfterViewInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation : ViewEncapsulation.None
})
export class HeaderComponent implements OnInit, AfterViewInit, OnDestroy {

	public homePath: string;

	constructor(@Inject(DOCUMENT) private document: Document,
				private router: Router,
				private renderer: Renderer2,
				private cdRef: ChangeDetectorRef,) {
	}

	public ngOnInit(): void {

	}

	public ngAfterViewInit(): void {
		
	};

	public ngOnDestroy(): void {

	};


};
