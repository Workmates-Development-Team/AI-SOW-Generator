export interface Slide {
  id: string;
  type: string;
}

export interface HtmlSlide extends Slide {
  html: string;
}

export interface SOWData {
  title: string;
  theme: string;
  template?: string;
  slides: Slide[];
  totalSlides: number;
}

export interface SOWState {
  presentation: SOWData | null;
  loading: boolean;
  error: string | null;
}