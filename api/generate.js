export default async function handler(req, res) {
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
            content: "You are a startup advisor."
          },
          {
            role: "user",
            content: `Generate a startup idea for: "${idea}"

Return the answer in this structure:

Problem:
Solution:
Target Market:
Revenue Model:`
          }
        ]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error(data);
      return res.status(500).json({ error: data.error?.message || "OpenAI error" });
    }

    const result = data.choices?.[0]?.message?.content || "No result";

    return res.status(200).json({ result });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
}


     
