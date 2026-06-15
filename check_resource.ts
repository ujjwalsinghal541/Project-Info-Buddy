import { prisma } from './src/lib/prisma';

async function main() {
  const resources = await prisma.resource.findMany({
    where: {
      title: {
        contains: 'Think School'
      }
    }
  });

  console.log(JSON.stringify(resources, null, 2));
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
