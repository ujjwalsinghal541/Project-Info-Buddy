export const generateSubtopics = async (query: string): Promise<string[]> => {
  console.log("[MOCK_AI] Mocking subtopics for:", query);
  
  // Artificial delay to simulate network latency
  await new Promise(resolve => setTimeout(resolve, 500));

  const mockSubtopics: Record<string, string[]> = {
    "quantum computing": [
      "Introduction to Quantum Mechanics",
      "Qubits and Superposition",
      "Quantum Entanglement",
      "Quantum Algorithms (Shor's, Grover's)",
      "Quantum Hardware and Error Correction",
      "Future Applications of Quantum Computing"
    ],
    "machine learning": [
      "Supervised vs Unsupervised Learning",
      "Neural Networks Basics",
      "Decision Trees and Random Forests",
      "Optimization and Gradient Descent",
      "Deep Learning and Transformers"
    ]
  };

  const key = query.toLowerCase().trim();
  return mockSubtopics[key] || [
    `Foundations of ${query}`,
    `Advanced concepts in ${query}`,
    `Practical applications of ${query}`,
    `Future of ${query}`,
    `Tools and resources for ${query}`
  ];
};
