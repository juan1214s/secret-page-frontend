export interface HeaderContent {
  phrase: string;
  buttonLabel: string;
  scrollTargetId: string;
}

export interface TestimonialItem {
  rating: number;
  quote: string;
}

export interface TestimonialsContent {
  heading: string;
  items: TestimonialItem[];
}

export interface AboutContent {
  heading: string;
  paragraphs: string[];
}

export interface ServiceItem {
  icon: string;
  title: string;
  description: string;
}

export interface ServicesContent {
  heading: string;
  items: ServiceItem[];
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface FaqContent {
  heading: string;
  items: FaqItem[];
}

export interface ContactContent {
  heading: string;
  text: string;
  buttonLabel: string;
  whatsappNumber: string;
  whatsappMessage: string;
}

export interface ProfilesContent {
  heading: string;
  subheading: string;
  showMoreLabel: string;
  emptyMessage: string;
  loadingMessage: string;
}

export interface FooterLink {
  label: string;
  fragment?: string;
  route?: string;
}

export interface FooterContent {
  copyright: string;
  links: FooterLink[];
  acceptedPaymentsLabel: string;
}

export interface TermsSection {
  heading: string;
  body: string;
}

export interface TermsContent {
  title: string;
  updatedAt: string;
  sections: TermsSection[];
}
