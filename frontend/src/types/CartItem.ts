import type { Pizza } from './Pizza';

export interface CartItem {
  pizza: Pizza;
  quantity: number;
}
