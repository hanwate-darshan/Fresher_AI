import {
  HumanMessage,
  SystemMessage,
} from "@langchain/core/messages";

import llm from "../configs/llm.js";
import searchVideo from "../configs/youtube.js";

const resourceAgent = async (state) => {
  try {

    const roadmap = state.roadmap;

    // ----------------------------------
    // Get all module titles
    // ----------------------------------

    const moduleTitles = roadmap.modules
      .map((module) => module.title)
      .join("\n");

    // ----------------------------------
    // Single Groq Call
    // ----------------------------------

    const docsResponse = await llm.invoke([
      new SystemMessage(`
You are an expert software engineer.

For every module below return the official documentation or a high-quality learning article.

Return format:

[
  {
    "title":"",
    "article":""
  }
]

Rules:

1. Return ONLY valid JSON.
2. Do not explain anything.
3. Keep the same title exactly as given.
4. article must be a valid URL starting with https://
`),

      new HumanMessage(`
Modules:

${moduleTitles}
`),

    ]);

    let docs = [];

    try {

      docs = JSON.parse(
        docsResponse.content
          .replace(/```json/g, "")
          .replace(/```/g, "")
          .trim()
      );

    } catch {

      docs = [];

    }

    // ----------------------------------
    // Create Docs Map
    // ----------------------------------

    const docsMap = new Map();

    docs.forEach((item) => {

      docsMap.set(
        item.title.toLowerCase(),
        item.article
      );

    });

    // ----------------------------------
    // Parallel YouTube Search
    // ----------------------------------

    roadmap.modules = await Promise.all(

      roadmap.modules.map(async (module) => {

        let video = null;

        try {

          video = await searchVideo(module.title);

        } catch (err) {

          console.log(err.message);

        }

        const topic = encodeURIComponent(module.title);

        return {

          ...module,

          youtube: video?.url || `https://www.youtube.com/results?search_query=${topic}+tutorial`,

          article:
            docsMap.get(module.title.toLowerCase()) || `https://www.google.com/search?q=${topic}+tutorial`,

        };

      })

    );

    return {

      ...state,

      roadmap,

    };

  } catch (error) {

    console.log(error);

    return state;

  }
};

export default resourceAgent;