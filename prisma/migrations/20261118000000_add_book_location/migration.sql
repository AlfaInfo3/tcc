-- AlterTable: localização física opcional dos exemplares.
-- Livros já cadastrados permanecem com os campos nulos.
ALTER TABLE "Book"
  ADD COLUMN IF NOT EXISTS "corridor" TEXT,
  ADD COLUMN IF NOT EXISTS "shelf" TEXT,
  ADD COLUMN IF NOT EXISTS "shelfLevel" TEXT;
