export interface Loan {
  id: string;
  bookId: string;
  studentId: string;
  status: string; // active, returned, overdue
  loanType: 'local' | 'online'; // local, online
  loanDate: string;
  dueDate: string;
  returnDate?: string;
  createdAt: string;
}