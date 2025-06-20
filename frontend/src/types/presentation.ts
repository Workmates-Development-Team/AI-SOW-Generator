export interface BaseSlide {
  id: string;
  type: string;
}

export interface HtmlSlide extends BaseSlide {
  type: 'title' | 'content' | 'image' | 'quote' | 'list' | 'conclusion' | 'infograph';
  html: string;
}

export type Slide = HtmlSlide;

export interface PresentationData {
  title: string;
  theme: string;
  slides: Slide[];
  totalSlides: number;
}