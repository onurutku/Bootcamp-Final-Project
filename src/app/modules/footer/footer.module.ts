import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FooterComponent } from "./components/footer/footer.component";
import { RouterModule } from "@angular/router";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { TranslocoModule } from "@ngneat/transloco";

@NgModule({
  declarations: [FooterComponent],
  imports: [CommonModule, RouterModule, FontAwesomeModule, TranslocoModule],
  exports: [FooterComponent],
})
export class FooterModule {}
