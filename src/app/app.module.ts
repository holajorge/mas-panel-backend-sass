import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import {BrowserModule} from '@angular/platform-browser';
import { NgModule } from "@angular/core";
import { FormsModule,ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { BsDropdownModule } from "ngx-bootstrap";
import { ToastrModule } from "ngx-toastr";
import { TagInputModule } from "ngx-chips";
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { ModalModule } from "ngx-bootstrap/modal";
import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-routing.module";
import { ComponentsModule } from "./components/components.module";
import { NgbModule,NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core'
import { HttpClientModule, HttpClient } from "@angular/common/http";
import { DateFormatterService } from "./service/date/date-formatter.service";
import { AuthModule } from "./auth/auth.module";
import { PagesModule } from "./pages/pages.module"
import { environment } from '../environments/environment';


export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  imports: [
    NgbModule,
    ModalModule.forRoot(),
    NgxDatatableModule,
    BrowserAnimationsModule,
    FormsModule,ReactiveFormsModule,
    HttpClientModule,
    ComponentsModule,
    RouterModule,
    BsDropdownModule.forRoot(),
    AppRoutingModule,
    ToastrModule.forRoot(),
    CollapseModule.forRoot(),
    TagInputModule,
    BrowserModule,
    TranslateModule.forRoot({
      loader: {
          provide: TranslateLoader,
          useFactory: (createTranslateLoader),
          deps: [HttpClient]
      }
    }),
    AuthModule,
    PagesModule,
  ],
  declarations: [
    AppComponent,
  ],
  providers: [{ provide: NgbDateParserFormatter, useClass: DateFormatterService }],
  bootstrap: [AppComponent]
})
export class AppModule {}
