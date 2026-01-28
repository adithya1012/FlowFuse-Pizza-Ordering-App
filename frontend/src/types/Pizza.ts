export interface Pizza {
  id: number;
  name: string;
  cost: number;
  category: 'veg' | 'non-veg' | 'special';
  available: boolean;
}
