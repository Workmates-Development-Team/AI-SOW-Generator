export interface Slide {
  id: string;
  type: string;
  template?: string;
  title: string;
  content: string;
  contentType: 'text' | 'list' | 'table' | 'mixed';
}

export interface SOWData {
  title: string;
  template?: string;
  slides: Slide[];
  totalSlides: number;
}

export interface SOWState {
  presentation: SOWData | null;
  loading: boolean;
  error: string | null;
}