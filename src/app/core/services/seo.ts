import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { SEO_DATA, SeoData } from '../models/seo.model';

@Injectable({
  providedIn: 'root',
})
export class Seo {
  constructor(
    private title: Title,
    private meta: Meta,
  ) {}

  setPage(page: keyof typeof SEO_DATA): void {
    const seo: SeoData = SEO_DATA[page];

    this.setSeo(seo.title, seo.description, seo.canonical, seo.image || '', seo.type || 'website');
  }

  setSeo(
    title: string,
    description: string,
    canonical: string,
    image: string = '',
    type: string = 'website',
  ): void {
    this.title.setTitle(title);

    this.meta.updateTag({
      name: 'description',
      content: description,
    });

    this.meta.updateTag({
      name: 'robots',
      content: 'index, follow',
    });

    this.updateMeta('og:title', title);
    this.updateMeta('og:description', description);
    this.updateMeta('og:url', canonical);
    this.updateMeta('og:type', type);

    if (image) {
      this.updateMeta('og:image', image);
    }

    this.updateMeta('twitter:card', image ? 'summary_large_image' : 'summary');

    this.updateMeta('twitter:title', title);
    this.updateMeta('twitter:description', description);

    if (image) {
      this.updateMeta('twitter:image', image);
    }

    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;

    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }

    canonicalLink.setAttribute('href', canonical);
  }

  private updateMeta(property: string, content: string): void {
    let tag = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement | null;

    if (!tag) {
      tag = document.createElement('meta');
      tag.setAttribute('property', property);
      document.head.appendChild(tag);
    }

    tag.setAttribute('content', content);
  }
}
