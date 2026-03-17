module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { idea } = req.body || {};

    if (!idea) {
      return res.status(400).json({ error: "Missing idea" });
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are a startup advisor."
          },
          {
            role: "user",
            content: `
Generate 3 startup concepts based on this idea: "${idea}"

For each concept provide:

Concept Title
Problem
Solution
Target Market
Revenue Model
Launch Strategy
Startup Validation Score (score from 1–10)
Why This Idea Could Work

Keep everything simple and easy to read.
`
          }
        ],
        temperature: 0.7
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error(data);
      return res.status(500).json({
        error: data.error?.message || "OpenAI request failed"
      });
    }

    const text = data.choices?.[0]?.message?.content || "No response.";

    return res.status(200).json({ result: text });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};
