import {
  Component, 
  Input, 
  OnInit, 
  ElementRef, 
  ViewChild, 
  NgZone
} from '@angular/core';
import {
  NgbModal, 
  ModalDismissReasons, 
  NgbDatepickerConfig, 
  NgbDateStruct, 
  NgbDateParserFormatter
} from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';

import { HttpService } from '../services/http.service';
import { CustomDatePipe } from '../pipes/date.pipe';
import { FormControl } from '@angular/forms';

import { MapsAPILoader } from '@agm/core';
import { EditableData } from '../data/data.component';

const now = new Date();

@Component({
  selector: 'editable-modal-component',
  templateUrl: './EditableDataModal.html',
  providers: [NgbDatepickerConfig, CustomDatePipe]
})
export class EditableDataModalComponent implements OnInit {


  @Input() editableData: EditableData;
  backgrounds;
  appCloseDate;
  private bgCount:number;
  private skillCount:number;
  skills; 
  private minDate: NgbDateStruct = {
    year: moment(now).subtract(30, 'days').year(),
    month: moment(now).subtract(30, 'days').month(),
    day: moment(now).subtract(30, 'days').date()
  }
  private maxDate: NgbDateStruct = {
    year: moment(now).add(90, 'days').year(),
    month: moment(now).add(90, 'days').month(),
    day: moment(now).add(90, 'days').date()
  }
  constructor(
    private modalService: NgbModal,
    private http: HttpService,
    config: NgbDatepickerConfig,
    private formatter: NgbDateParserFormatter) {
      this.backgrounds = [];
      this.skills = [];
  }

  ngOnInit() {
    console.log('editable modal');
    this.http.getBackgrounds().subscribe((res) =>{
      this.backgrounds = [...res.json()];
      this.bgCount = this.backgrounds.length;
    });
    this.http.getSkills().subscribe((res) => {
      this.skills = [...res.json()];
      this.skillCount = this.skills.length;
    });
  }

  open(content) {
    this.modalService.open(content).result
      .then((result) => {
        console.log()
      }, (reason) => {
        console.log(`Dismissed ${this.getDismissReason(reason)}`);
      });
  }
  
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }

  onChangeBG(background, isChecked: boolean) {
    if(isChecked) {
      this.editableData.Backgrounds.push(background);
    } else {
      let index = this.editableData.Backgrounds.findIndex((x: {name}) => x.name === background.name);
      this.editableData.Backgrounds.splice(index, 1);
    }
    console.log(this.editableData.Backgrounds)
  }


  checkBG(background) {
    let count = 0;
    this.editableData.Backgrounds.forEach((x: {name}) => {
      x.name === background.name ? count++ : count=count;
    })
    return count == 1 ? true : false;
  }

  onChangeSkill(skill, isChecked: boolean) {
    if(isChecked) {
      this.editableData.skills.push(skill);
    } else {
      let index = this.editableData.skills.findIndex((x: {name}) => x.name === skill.name);
      this.editableData.skills.splice(index, 1);
    }
  }

  checkSkill(skill) {
    let count = 0;
    this.editableData.skills.forEach((x: {name}) => {
      x.name === skill.name ? count++ : count=count;
    })
    return count == 1 ? true : false;
  }
}
