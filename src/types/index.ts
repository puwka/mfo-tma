export interface MfoOffer {
  id: string;
  name: string;
  desc: string;
  logo: string;
  url: string;
  badge: string;
  rate: string;
  approved_count?: number;
  min_sum: number;
  max_sum: number;
  min_term: number;
  max_term: number;
}

export interface BrokerOffer {
  id: string;
  name: string;
  desc: string;
  logo: string;
  url: string;
  badge: string;
  rate: string;
  approved_count?: number;
}

export interface Article {
  id: string;
  title: string;
  preview: string;
  slug: string;
  content?: string;
}
