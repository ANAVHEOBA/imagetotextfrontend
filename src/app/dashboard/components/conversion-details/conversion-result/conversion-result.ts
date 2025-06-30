import { Component, Input, SecurityContext, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { PreviewResponse } from '../../../../../lib/conversion/types';

declare global {
  interface Window {
    MathJax: any;
  }
}

@Component({
  selector: 'app-conversion-result',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './conversion-result.html',
  styleUrls: ['./conversion-result.scss']
})
export class ConversionResultComponent implements AfterViewInit, OnChanges {
  @Input() extractedText: string | null = null;
  @Input() preview: PreviewResponse | null = null;
  
  safeHtmlContent: SafeHtml | null = null;
  
  constructor(private sanitizer: DomSanitizer) {}
  
  ngOnChanges(changes: SimpleChanges) {
    if (changes['preview'] && this.preview?.html_content) {
      // Sanitize the HTML content before displaying
      this.safeHtmlContent = this.sanitizer.bypassSecurityTrustHtml(this.preview.html_content);
      // Schedule MathJax typesetting after the view updates
      setTimeout(() => this.renderMathJax(), 100);
    } else {
      this.safeHtmlContent = null;
    }
  }

  ngAfterViewInit() {
    this.loadMathJax();
  }

  private loadMathJax() {
    if (!window.MathJax) {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js';
      script.async = true;
      document.head.appendChild(script);
    }
  }

  private renderMathJax() {
    if (window.MathJax) {
      window.MathJax.typesetPromise?.()?.catch((err: any) => 
        console.error('MathJax typesetting failed:', err)
      );
    }
  }
  
  get showPreview(): boolean {
    return !!this.preview?.html_content && this.preview.status === 'ready';
  }
  
  get showExtractedText(): boolean {
    return !!this.extractedText && !this.showPreview;
  }
} 