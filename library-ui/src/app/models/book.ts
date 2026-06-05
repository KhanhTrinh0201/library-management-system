export interface Book {
  id: number;
  title: string;
  author: string;
  category: string;
  quantity: number;
  availableQuantity: number; // Số lượng còn lại (để cho mượn)
  status: 'Available' | 'Borrowed'; // Trạng thái nhanh
  borrowerName?: string;
}