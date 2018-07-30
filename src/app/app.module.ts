import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { HttpService } from './services/http.service';
import { EditableDataModalComponent } from './modal/EditableDataModal';
import { EditableDataModalContent } from './modal/content/EditableDataModalContent';
import { AgmCoreModule } from '@agm/core';

@NgModule({
  declarations: [
    AppComponent,
    EditableDataModalComponent,
    EditableDataModalContent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    NgbModule.forRoot(),
    AgmCoreModule.forRoot({
      apiKey: "AIzaSyD14V32mHo_pG-UH25dxdAN-fCZw3osd3U",
      libraries: ["places"]
    })
  ],
  entryComponents: [EditableDataModalContent],
  providers: [HttpService],
  bootstrap: [AppComponent]
})
export class AppModule { }
