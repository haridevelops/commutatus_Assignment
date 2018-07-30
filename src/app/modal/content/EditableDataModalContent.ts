import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { Input, Component, Output, EventEmitter, OnInit } from "@angular/core";
import { EditableData } from "../../app.component";

@Component({
    selector: 'editable-content',
    templateUrl: './EditableDataModalContent.html'
  })
  export class EditableDataModalContent implements OnInit {
    @Input() editableData: EditableData;   
    @Input() backgrounds: Array<{}>;
    @Input() skills: Array<{}>; 
    @Output() editedData = new EventEmitter<EditableData>();

    constructor(public activeModal: NgbActiveModal) {}

    ngOnInit() {
        this.backgrounds = [...this.editableData.Backgrounds];
        this.skills = [...this.editableData.skills];
        console.log(this.backgrounds)
        console.log(this.skills)
    }
  }