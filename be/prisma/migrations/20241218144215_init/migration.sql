/*
  Warnings:

  - Added the required column `category` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `imageName` to the `products` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "cash_inventory" ALTER COLUMN "type" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "category" TEXT NOT NULL,
ADD COLUMN     "imageName" TEXT NOT NULL;
