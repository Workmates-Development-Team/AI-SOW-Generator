import type { Template } from './template';

export interface Slide {
  id: string;
  type: string;
  template?: Template | string;
  title: string;
  content: string;
  contentType: string;
  sowNumber?: string;
  sowDate?: string;
  overflowId?: number;
  sectionType?: string; // Added for robust section identification
}

export interface SOWData {
  title: string;
  template?: string;
  slides: Slide[];
  totalSlides: number;
  sowNumber?: string;
  clientName?: string;
  prompt?: any;
}

export interface SOWState {
  presentation: SOWData | null;
  loading: boolean;
  error: string | null;
}