"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

interface Source {
  id: string;
  name: string;
  domain: string;
}

interface Resource {
  id: string;
  title: string;
  url: string;
  source: Source | null;
}

interface Subtopic {
  id: string;
  name: string;
  resources: Resource[];
}

interface Topic {
  id: string;
  query: string;
  createdAt: string;
  subtopics: Subtopic[];
}

export default function TopicPage() {
  const params = useParams();
  const id = params.id as string;

  const [topic, setTopic] = useState<Topic | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchTopic = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/topics/${id}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch topic");
        }

        setTopic(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTopic();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-zinc-600 dark:text-zinc-400 font-medium">Loading discovery results...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-4">
        <div className="bg-white dark:bg-zinc-900 p-8 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 max-w-md w-full text-center">
          <div className="text-red-500 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">Discovery Error</h2>
          <p className="text-zinc-600 dark:text-zinc-400 mb-6">{error}</p>
          <Link
            href="/"
            className="inline-block px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
          >
            Back to Search
          </Link>
        </div>
      </div>
    );
  }

  if (!topic) return null;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pb-20">
      {/* Header */}
      <header className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            New Search
          </Link>
          <div className="text-zinc-400 text-sm">
            {new Date(topic.createdAt).toLocaleDateString()}
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 pt-12">
        <div className="mb-12">
          <h1 className="text-4xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight mb-4">
            {topic.query}
          </h1>
          <div className="h-1 w-20 bg-blue-600 rounded-full"></div>
        </div>

        <div className="grid gap-12">
          {topic.subtopics.map((subtopic) => (
            <section key={subtopic.id} className="space-y-6">
              <h2 className="text-2xl font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm">
                  {subtopic.resources.length}
                </span>
                {subtopic.name}
              </h2>
              
              <div className="grid sm:grid-cols-2 gap-4">
                {subtopic.resources.map((resource) => (
                  <div 
                    key={resource.id}
                    className="relative group bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:border-blue-500 dark:hover:border-blue-500 transition-all shadow-sm hover:shadow-md"
                  >
                    <div className="flex flex-col h-full justify-between gap-4">
                      <div className="space-y-3">
                        {resource.source && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700">
                            {resource.source.name}
                          </span>
                        )}
                        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          <a 
                            href={resource.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="focus:outline-none"
                          >
                            <span className="absolute inset-0" aria-hidden="true" />
                            {resource.title}
                          </a>
                        </h3>
                      </div>
                      
                      <div className="flex items-center text-zinc-400 text-sm truncate">
                        <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.828a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                        </svg>
                        {new URL(resource.url).hostname}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>
    </div>
  );
}
