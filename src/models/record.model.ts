export interface FinancialRecord {
  id: number
  created_by: number
  amount: number
  type: "income" | "expense"
  category: string
  date: string
  notes: string | null
  is_deleted: boolean
  created_at: Date
  updated_at: Date
}