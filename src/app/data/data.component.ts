import { Component, OnInit, NgZone, ElementRef, ViewChild } from '@angular/core';

import { HttpService } from '../services/http.service';
import { DatePipe } from '@angular/common';
import { MapsAPILoader } from '@agm/core';
import { FormControl } from '@angular/forms';
import { NgbDateStruct, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';

declare var google: any;

export class EditableData {
  constructor(
    public title: string = '',
    public appCloseDate: NgbDateStruct = {year: 2018, month: 10, day: 1},
    public EarlyStartDate: NgbDateStruct = {year: 2018, month: 10, day: 1},
    public LatestEndDate: NgbDateStruct = {year: 2018, month: 10, day: 1},
    public Description: string = '',
    public Backgrounds: Array<{}> = [],
    public skills: Array<{}> = [],
    public selectionProcess: string = '',
    public salary: number = 0    
    ) {}
}

export class Overview {
  constructor(
    public orgName: string = '',
    public orgLocation: string = '',
    public roleDesc: string = '') {}
}

export class Background {
  constructor(
    public bgNationality: string = '',
    public bgSelectionProcess: string = ''){}
}

export class VisaAndLogistics {

    constructor(
      public workHours: string = '',
      public weekend: string = '',
      public insurance: string = '',
      public hostOffice: string = '',
      public type: string = '',
      public duration: string = '',
      public link: string = ''){}
}

@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.css'],
  providers: [DatePipe]
})
export class DataComponent implements OnInit {
 
  public latitude: number;
  public longitude: number;
  public searchControl: FormControl;
  public zoom: number;

  public editableData: EditableData;
  public overview: Overview;
  public backgrd: Background;
  public vL: VisaAndLogistics;

  url;

  background: Array<{}>;
  skills: Array<{}>;

  weekend: string;

  @ViewChild("search")
  public searchElementRef: ElementRef;

  constructor(
    private http: HttpService, private datePipe: DatePipe,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private formatter: NgbDateParserFormatter) {
      this.editableData = new EditableData();
      this.overview = new Overview();
      this.backgrd = new Background();
      this.vL = new VisaAndLogistics();
  }

  ngOnInit() {
    this.http.getOpportunity().subscribe((response) => {
      const obj = response.json();
      this.addToOverView(obj);
      this.addToBackGrounds(obj);
      this.addToVisaAndLog(obj);
      this.background = [...obj.backgrounds];
      this.skills = [...obj.skills];
      this.weekend = obj.specifics_info.saturday_work ? 'Weekends also' : 'Not on Weekends';
      this.addToEditableData(obj);
    });



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
          let place = autocomplete.getPlace();

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

  private addToOverView(obj) {
    this.overview = new Overview(
      obj.branch.organisation.name,
      obj.location,
      obj.description
    );
  }

  private addToVisaAndLog(obj) {
    this.vL =  new VisaAndLogistics(
      obj.specifics_info.expected_work_schedule.from,
      obj.specifics_info.saturday_work ? 'Weekends also' : 'Not on Weekends',
      obj.host_lc.full_name,
      obj.legal_info.health_insurance_info,
      obj.legal_info.visa_duration,
      obj.legal_info.visa_link,
      obj.legal_info.visa_type
    );
  }
  
  private addToBackGrounds(obj) {
    this.backgrd = new Background(
      obj.nationalities[0].name,
      obj.role_info.selection_process
    );
  }

  private addToEditableData(obj) {
    this.editableData = new EditableData(
      obj.title,
      this.formatter.parse(obj.applications_close_date),
      this.formatter.parse(obj.earliest_start_date),
      this.formatter.parse(obj.latest_end_date),
      obj.description,
      [...obj.backgrounds],
      [...obj.skills],
      obj.role_info.selection_process,
      obj.specifics_info.salary
    )
  }

  formatDate(date) {
    return this.datePipe.transform(date, 'yyyy-mm-dd');
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

}
