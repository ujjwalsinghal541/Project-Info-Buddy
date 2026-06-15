import { prisma } from "../lib/prisma";
import { generateSubtopics } from "./aiService";
import { searchResourcesForSubtopic } from "./searchService";

export const discoverTopic = async (query: string) => {
  try {
    // 1. Create Topic entry
    const topic = await prisma.topic.create({
      data: { query },
    });

    // 2. Generate subtopic names via Gemini
    const subtopicNames = await generateSubtopics(query);

    // 3. Save generated subtopics
    const subtopics = await Promise.all([
      // Add a hidden "main topic" subtopic to catch the most direct matches
      prisma.subtopic.create({
        data: { name: "Overview and Direct Matches", topicId: topic.id }
      }),
      ...subtopicNames.map((name) =>
        prisma.subtopic.create({
          data: {
            name,
            topicId: topic.id,
          },
        })
      )
    ]);

    // 4. Load enabled sources for targeted searching
    const sources = await prisma.source.findMany({
      where: { enabled: true },
      select: { id: true, domain: true, type: true, name: true },
    });

    // 5. Fetch and save resources for each subtopic in parallel
    await Promise.all(
      subtopics.map(async (subtopic) => {
        // If it's the "Overview" subtopic, use the main query. Otherwise, use the subtopic name.
        const searchQuery = subtopic.name === "Overview and Direct Matches" ? query : subtopic.name;
        
        const searchResults = await searchResourcesForSubtopic(
          subtopic.id,
          searchQuery,
          sources
        );

        if (searchResults.length > 0) {
          await Promise.all(
            searchResults.map((res) =>
              prisma.resource.upsert({
                where: {
                  url_subtopicId: {
                    url: res.url,
                    subtopicId: subtopic.id,
                  },
                },
                update: {},
                create: {
                  title: res.title,
                  url: res.url,
                  subtopicId: subtopic.id,
                  sourceId: res.sourceId,
                },
              })
            )
          );
        }
      })
    );

    // 6. Return the fully populated topic tree
    const fullTopic = await prisma.topic.findUnique({
      where: { id: topic.id },
      include: {
        subtopics: {
          include: {
            resources: {
              include: {
                source: true,
              },
            },
          },
        },
      },
    });

    return fullTopic;
  } catch (error) {
    console.error("Discovery Service Error:", error);
    throw new Error(`Knowledge discovery failed: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
};
