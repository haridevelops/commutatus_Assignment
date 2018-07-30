import { Component, OnInit, NgZone, ElementRef, ViewChild } from '@angular/core';

import { HttpService } from './services/http.service';
import { DatePipe } from '@angular/common';
import { MapsAPILoader } from '@agm/core';
import { FormControl } from '@angular/forms';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

export interface EditableData {
  title: string;
  appCloseDate: string;
  EarlyStartDate: string;
  LatestEndDate: string;
  Description: string;
  Backgrounds: Array<{}>;
  skills: Array<{}>;
  selectionProcess: string;
  salary: number;
}


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [DatePipe]
})
export class AppComponent implements OnInit {

  public latitude: number;
  public longitude: number;
  public searchControl: FormControl;
  public zoom: number;
  
  editableData: EditableData;
  obj;
  url;
  org_name;
  background: Array<{}>;
  skills: Array<{}>;
  weekend: string;
  @ViewChild("search")
  public searchElementRef: ElementRef;
  constructor(private http: HttpService, private datePipe: DatePipe,
    private mapsAPILoader: MapsAPILoader,
  private ngZone: NgZone) {
    this.http.getOpportunity().subscribe((response) => {      
      this.obj = response.json();
      this.background = [...this.obj.backgrounds]
      this.org_name = this.obj.branch.organisation.name;
      this.skills = [...this.obj.skills]
      this.weekend = this.obj.specifics_info.saturday_work ? 'Weekends also' : 'Not on Weekends';
      this.addToEditableData();
      console.log(this.editableData)
    });
  }

  ngOnInit() {
        //set google maps defaults
        this.zoom = 4;
        this.latitude = 39.8282;
        this.longitude = -98.5795;
    
        //create search FormControl
        this.searchControl = new FormControl();
      
        //set current position
        this.setCurrentPosition();
    
        //load Places Autocomplete
        this.mapsAPILoader.load().then(() => {
          let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
            types: ["address"]
          });
          autocomplete.addListener("place_changed", () => {
            this.ngZone.run(() => {
              //get the place result
              let place: google.maps.places.PlaceResult = autocomplete.getPlace();
    
              //verify result
              if (place.geometry === undefined || place.geometry === null) {
                return;
              }
    
              //set latitude, longitude and zoom
              this.latitude = place.geometry.location.lat();
              this.longitude = place.geometry.location.lng();
              this.zoom = 12;
            });
          });
        });
  }

  addToEditableData() {
    this.editableData = {
      title: this.obj.title,
      appCloseDate: this.formatDate(this.obj.applications_close_date),
      EarlyStartDate: this.formatDate(this.obj.earliest_start_date),
      LatestEndDate: this.formatDate(this.obj.latest_end_date),
      Description: this.obj.description,
      Backgrounds: [...this.obj.backgrounds],
      skills: [...this.obj.skills],
      selectionProcess: this.obj.role_info.selection_process,
      salary: this.obj.specifics_info.salary
    }
  }

  formatDate(date) {
    return this.datePipe.transform(date, 'yyyy-mm-dd');
  }
  
  parse(value: string): NgbDateStruct {
    if (value) {
      const dateParts = value.trim().split('-');
      if (dateParts.length === 1 && this.isNumber(dateParts[0])) {
        return {year: this.toInteger(dateParts[0]), month: null, day: null};
      } else if (dateParts.length === 2 && this.isNumber(dateParts[0]) && this.isNumber(dateParts[1])) {
        return {year: this.toInteger(dateParts[0]), month: this.toInteger(dateParts[1]), day: null};
      } else if (dateParts.length === 3 && this.isNumber(dateParts[0]) && this.isNumber(dateParts[1]) && this.isNumber(dateParts[2])) {
        return {year: this.toInteger(dateParts[0]), month: this.toInteger(dateParts[1]), day: this.toInteger(dateParts[2])};
      }
    }
    return null;
  }


  update() {
    console.log(JSON.stringify(this.editableData));
    console.log(this.searchElementRef.nativeElement.value);
  }

  private setCurrentPosition() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.zoom = 12;
      });
    }
  }

  isNumber(value: any): value is number {
    return !isNaN(this.toInteger(value));
  }

  isInteger(value: any): value is number {
    return typeof value === 'number' && isFinite(value) && Math.floor(value) === value;
  }

  toInteger(value: any): number {
    return parseInt(`${value}`, 10);
  }
}