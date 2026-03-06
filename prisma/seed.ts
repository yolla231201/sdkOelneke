import { PrismaClient, Role } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10)

  const admin = await prisma.user.upsert({
    where: { email: 'admin@sekolah.com' },
    update: {},
    create: {
      name: 'Super Admin',
      email: 'admin@sekolah.com',
      password: hashedPassword,
      role: Role.ADMIN,
    },
  })

  console.log('✅ Admin created:', admin.email)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })