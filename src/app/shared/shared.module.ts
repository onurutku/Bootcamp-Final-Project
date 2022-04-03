import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { LoadingSpinnerComponent } from "./components/loading-spinner/loading-spinner.component";
import { DropdownDirective } from "./directives/dropdown.directive";
import { SearchPipe } from "./pipes/search.pipe";
import { ConfirmComponent } from "./components/confirm/confirm.component";

@NgModule({
  declarations: [
    LoadingSpinnerComponent,
    DropdownDirective,
    SearchPipe,
    ConfirmComponent,
  ],
  imports: [CommonModule],
  exports: [
    LoadingSpinnerComponent,
    DropdownDirective,
    SearchPipe,
    ConfirmComponent,
  ],
})
export class SharedModule {}
