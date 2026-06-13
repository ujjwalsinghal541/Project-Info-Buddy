import { prisma } from '../src/lib/prisma';
import "dotenv/config";

const sources = [
  { name: "Wikipedia", domain: "wikipedia.org" },
  { name: "McKinsey Insights", domain: "mckinsey.com" },
  { name: "BCG Insights", domain: "bcg.com" },
  { name: "Bain Insights", domain: "bain.com" },
  { name: "InsideIIM", domain: "insideiim.com" },
  { name: "GeeksforGeeks", domain: "geeksforgeeks.org" },
  { name: "Coursera", domain: "coursera.org" },
  { name: "Khan Academy", domain: "khanacademy.org" },
  { name: "YouTube", domain: "youtube.com" },
  { name: "Think School", domain: "thinkschool.co.in" },
  { name: "MIT OpenCourseWare", domain: "ocw.mit.edu" },
  { name: "Harvard Business Review", domain: "hbr.org" },
  { name: "Stanford Online", domain: "online.stanford.edu" },
  { name: "arXiv", domain: "arxiv.org" },
  { name: "Investopedia", domain: "investopedia.com" }
];

async function main() {
  console.log('Start seeding...');
  
  let count = 0;
  for (const source of sources) {
    await prisma.source.upsert({
      where: { domain: source.domain },
      update: {
        name: source.name,
        enabled: true,
      },
      create: {
        name: source.name,
        domain: source.domain,
        enabled: true,
      },
    });
    count++;
  }
  
  console.log(`Seeding finished. Total sources seeded: ${count}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
