import OpenAI from "openai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { idea } = req.body;

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    const prompt = `
You are a startup advisor.

Generate a startup idea for: "${idea}"

Return the answer in this structure:

Problem:
Explain the problem.

Solution:
Describe the startup solution.

Target Market:
Who will use this product.

Revenue Model:
How the startup will make money.
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: prompt
        }
      ]
    });

    const result = completion.choices[0].message.content;

    res.status(200).json({ result });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "OpenAI request failed" });
  }
}
