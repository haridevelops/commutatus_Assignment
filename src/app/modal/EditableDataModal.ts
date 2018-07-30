import {Component, Input, OnInit, ElementRef, ViewChild, NgZone} from '@angular/core';
import {NgbModal, ModalDismissReasons, NgbDatepickerConfig} from '@ng-bootstrap/ng-bootstrap';

import { EditableData } from '../app.component';
import { HttpService } from '../services/http.service';
import { FormControl } from '@angular/forms';

import { MapsAPILoader } from '@agm/core';

@Component({
  selector: 'editable-modal-component',
  templateUrl: './EditableDataModal.html',
  providers: [NgbDatepickerConfig]
})
export class EditableDataModalComponent implements OnInit {


  @Input() editableData: EditableData;
  backgrounds;
  private bgCount:number;
  private skillCount:number;
  skills;
  constructor(private modalService: NgbModal,
  private http: HttpService,
config: NgbDatepickerConfig) {
    this.backgrounds = [];
    this.skills = [];
    
    // config.minDate = {year: new Date().getFullYear() - 30, month: 1, day: 1};
    // config.maxDate = {year: new Date().getFullYear() - 90, month: 12, day: 31};
  }

  ngOnInit() {
    this.http.getBackgrounds().subscribe((res) =>{
      this.backgrounds = [...res.json()];
      this.bgCount = this.backgrounds.length;
    })
    this.http.getSkills().subscribe((res) => {
      this.skills = [...res.json()];
      this.skillCount = this.skills.length;
    })
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
      let index = this.editableData.Backgrounds.findIndex(x => x.name === background.name);
      this.editableData.Backgrounds.splice(index, 1);
    }
    console.log(this.editableData.Backgrounds)
  }


  checkBG(background) {
    let count = 0;
    this.editableData.Backgrounds.forEach(x => {
      x.name === background.name ? count++ : count=count;
    })
    return count == 1 ? true : false;
  }

  onChangeSkill(skill: {}, isChecked: boolean) {
    if(isChecked) {
      this.editableData.skills.push(skill);
    } else {
      let index = this.editableData.skills.findIndex(x => x.name === skill.name);
      this.editableData.skills.splice(index, 1);
    }
  }

  checkSkill(skill) {
    let count = 0;
    this.editableData.skills.forEach(x => {
      x.name === skill.name ? count++ : count=count;
    })
    return count == 1 ? true : false;
  }
}