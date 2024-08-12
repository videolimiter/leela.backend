-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('admin', 'moderator', 'user', 'guest');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'user';
