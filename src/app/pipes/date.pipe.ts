import { Pipe, PipeTransform } from '@angular/core';
import { NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';


@Pipe({
  name:"CustomDatePipe"
})
export class CustomDatePipe implements PipeTransform {
    
    constructor(private dp: NgbDateParserFormatter) {}
    
    transform(value: NgbDateStruct): string {
        return this.dp.format(value);
    }
}