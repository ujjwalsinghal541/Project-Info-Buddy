import { tavily } from "@tavily/core";
import { prisma } from "../lib/prisma";

const tvly = tavily({ apiKey: process.env.TAVILY_API_KEY });

export const searchResourcesForSubtopic = async (subtopicId: string, query: string, sources: { domain: string, id: string }[]) => {
  const domains = sources.map(s => s.domain);
  
  if (domains.length === 0) return [];

  const response = await tvly.search(query, {
    searchDepth: "basic",
    maxResults: 10,
    includeDomains: domains,
  });

  const resources = response.results.map((result: any) => ({
    title: result.title,
    url: result.url,
    sourceId: sources.find(s => s.domain === new URL(result.url).hostname.replace('www.', ''))?.id || sources[0].id,
    subtopicId: subtopicId,
  }));

  // Better matching for sourceId
  const resourcesWithCorrectSource = response.results.map((result: any) => {
    const url = new URL(result.url);
    const hostname = url.hostname.replace('www.', '');
    const source = sources.find(s => hostname.includes(s.domain));
    
    return {
      title: result.title,
      url: result.url,
      sourceId: source?.id,
      subtopicId: subtopicId,
    };
  }).filter((r: any) => r.sourceId !== undefined);

  return resourcesWithCorrectSource;
};
