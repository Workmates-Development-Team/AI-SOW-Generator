export interface Slide {
  id: string;
  type: string;
  template?: string;
  title: string;
  content: string;
  contentType: string;
}

export interface SOWData {
  title: string;
  template?: string;
  slides: Slide[];
  totalSlides: number;
  sowNumber?: string;
  clientName?: string;
}

export interface SOWState {
  presentation: SOWData | null;
  loading: boolean;
  error: string | null;
}