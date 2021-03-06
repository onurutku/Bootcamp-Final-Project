import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RegisterComponent } from "./components/register/register.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { RouterModule } from "@angular/router";
import { SharedModule } from "../../shared/shared.module";
import { TranslocoModule } from "@ngneat/transloco";

@NgModule({
  declarations: [RegisterComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: "",
        component: RegisterComponent,
      },
    ]),
    FormsModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    SharedModule,
    TranslocoModule,
  ],
  exports: [RegisterComponent],
})
export class RegisterModule {}
