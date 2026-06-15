import { tavily } from "@tavily/core";
import { prisma } from "../lib/prisma";
import { SearchSource } from "../types";

const tvly = tavily({ apiKey: process.env.TAVILY_API_KEY });

export const searchResourcesForSubtopic = async (subtopicId: string, query: string, sources: SearchSource[]) => {
  const websiteDomains = sources.filter(s => s.type === 'WEBSITE').map(s => s.domain);
  const youtubeSources = sources.filter(s => s.type === 'YOUTUBE');
  
  const allResults: any[] = [];

  // 1. Search general websites if any
  if (websiteDomains.length > 0) {
    const webResponse = await tvly.search(query, {
      searchDepth: "basic",
      maxResults: 10,
      includeDomains: websiteDomains,
    });
    
    webResponse.results.forEach((result: any) => {
      const hostname = new URL(result.url).hostname.replace('www.', '');
      const source = sources.find(s => hostname.includes(s.domain));
      if (source) {
        allResults.push({
          title: result.title,
          url: result.url,
          sourceId: source.id,
          subtopicId: subtopicId,
        });
      }
    });
  }

  // 2. Search YouTube channels specifically
  for (const ytSource of youtubeSources) {
    // Extract the handle (e.g., @ThinkSchool) for strict URL/content matching
    const handleMatch = ytSource.domain.match(/(@[a-zA-Z0-9._-]+)/);
    const handle = handleMatch ? handleMatch[1] : '';
    
    // Construct a query that combines the channel name and the search terms
    const ytQuery = `"${ytSource.name}" ${query} site:youtube.com`;
    
    const ytResponse = await tvly.search(ytQuery, {
      searchDepth: "advanced", // Use advanced for better snippets and metadata
      maxResults: 20,
    });

    ytResponse.results.forEach((result: any) => {
      console.log('--- Tavily Result ---');
      console.log('Title:', result.title);
      console.log('URL:', result.url);
      
      const isYouTube = result.url.includes('youtube.com') || result.url.includes('youtu.be');
      
      // Strict Verification:
      // Tavily's advanced snippets for YouTube often start with:
      // # Video Title
      // ## Channel Name
      // Subscriber info...
      
      const lowerContent = (result.content || '').toLowerCase();
      const lowerChannelName = ytSource.name.toLowerCase();
      const lowerHandle = handle.toLowerCase();

      // Check for exact channel block in snippet: "## [Channel Name]"
      const hasExactChannelHeader = lowerContent.includes(`## ${lowerChannelName}`);
      
      // Check for handle in snippet or URL
      const hasHandle = lowerHandle && (result.url.includes(lowerHandle) || lowerContent.includes(lowerHandle));
      
      // Final decision: Must be YouTube AND definitively from this channel
      if (isYouTube && (hasExactChannelHeader || hasHandle)) {
        allResults.push({
          title: result.title,
          url: result.url,
          sourceId: ytSource.id,
          subtopicId: subtopicId,
        });
      }
    });
  }

  return allResults;
};
