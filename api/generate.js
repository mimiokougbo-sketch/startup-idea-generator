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
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are a helpful startup adviser."
          },
          {
            role: "user",
            content: `Generate 5 startup concepts based on this idea: "${idea}".

For each concept, format the answer clearly using this structure:

Concept Title:
Problem:
Solution:
Target Market:
Revenue Model:
Launch Strategy:

Do not use markdown symbols like ### or **.
Make each concept different, practical, and easy to read.`
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

    const text =
      data.choices?.[0]?.message?.content || "No response returned.";

    return res.status(200).json({ result: text });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};
     
