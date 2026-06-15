require('dotenv').config();
console.log("DATABASE_URL check:", !!process.env.DATABASE_URL);
console.log("OPENAI_API_KEY check:", !!process.env.OPENAI_API_KEY);
console.log("TAVILY_API_KEY check:", !!process.env.TAVILY_API_KEY);
