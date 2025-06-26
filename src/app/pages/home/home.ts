import { Component } from '@angular/core';
import { HeroSectionComponent } from '../../components/hero-section/hero-section';
import { FeatureHighlightsComponent } from '../../components/feature-highlights/feature-highlights';
import { HowItWorksComponent } from '../../components/how-it-works/how-it-works';
import { CallToActionComponent } from '../../components/call-to-action/call-to-action';
import { NavbarComponent } from '../../components/shared/navbar/navbar';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    NavbarComponent,
    HeroSectionComponent,
    FeatureHighlightsComponent,
    HowItWorksComponent,
    CallToActionComponent
  ],
  templateUrl: './home.html',
  styleUrls: ['./home.scss']
})
export class HomeComponent {
  // Home page logic will go here
}
