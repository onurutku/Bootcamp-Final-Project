import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { LoginComponent } from "src/app/modules/login/components/login/login.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { SharedModule } from "../../shared/shared.module";
import { TranslocoModule } from "@ngneat/transloco";

@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      {
        path: "",
        component: LoginComponent,
      },
    ]),
    FontAwesomeModule,
    SharedModule,
    TranslocoModule,
  ],
  exports: [LoginComponent],
})
export class LoginModule {}
