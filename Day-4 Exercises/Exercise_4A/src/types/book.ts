export interface Book {
  id?: number;
  name: string; 
  author: string;
  price: number;
  pages: number;  
  created_at?: Date;
  updated_at?: Date;
};