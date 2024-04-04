import { prisma } from "../src/lib/prisma"

async function seed() {
  await prisma.event.create({
    data: {
      id: 'e03c11bb-5439-424a-b09c-9a078c5dd043',
      title: "Unite Summit",
      slug: 'unite-summit',
      details: 'Um evento para devs apaixonados por código',
      maximumAttendees: 120,
    }
  })
}

seed().then(() => {
  console.log("Database seeded!")
  prisma.$disconnect()
})