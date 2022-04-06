import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { LoadingSpinnerComponent } from "./components/loading-spinner/loading-spinner.component";
import { DropdownDirective } from "./directives/dropdown.directive";
import { SearchPipe } from "./pipes/search.pipe";
import { ConfirmComponent } from "./components/confirm/confirm.component";
import { TranslocoModule } from "@ngneat/transloco";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";

@NgModule({
  declarations: [
    LoadingSpinnerComponent,
    DropdownDirective,
    SearchPipe,
    ConfirmComponent,
  ],
  imports: [CommonModule, TranslocoModule, FontAwesomeModule],
  exports: [
    LoadingSpinnerComponent,
    DropdownDirective,
    SearchPipe,
    ConfirmComponent,
  ],
})
export class SharedModule {}
