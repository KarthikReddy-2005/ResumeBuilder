import ai from "../configs/ai.js";
import Resume from "../models/Resume.js";

export const enhanceProffessionalSummary = async (req, res) => {
  try {
    const { userContent } = req.body;

    if (!userContent) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: userContent",
      });
    }

    const response = await ai.chat.completions.create({
      model: process.env.OPENAI_MODEL,
      messages: [
        {
          role: "system",
          content:
            "You are an expert in resume writing. Enhance the professional summary of a resume in 1-2 sentences highlighting key skills, experience, and career objectives. Make it compelling and ATS-friendly. Return only the text, no options or formatting.",
        },
        { role: "user", content: userContent },
      ],
    });

    const enhancedContent =
      response?.choices?.[0]?.message?.content ||
      JSON.stringify(response?.choices?.[0]?.message || "No content");

    return res.status(200).json({
      success: true,
      enhancedContent,
    });
  } catch (error) {
    console.error("AI Enhancement Error:", error);
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const enhanceJobDescription = async (req, res) => {
  try {
    const { userContent } = req.body;

    if (!userContent) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: userContent",
      });
    }

    const response = await ai.chat.completions.create({
      model: process.env.OPENAI_MODEL,
      messages: [
        {
          role: "system",
          content:
            "You are an expert in resume writing. Enhance the job description in 1-2 sentences highlighting key responsibilities and achievements using action verbs and quantifiable results. Make it ATS-friendly. Return only plain text.",
        },
        { role: "user", content: userContent },
      ],
    });

    const enhancedContent =
      response?.choices?.[0]?.message?.content ||
      JSON.stringify(response?.choices?.[0]?.message || "No content");

    return res.status(200).json({
      success: true,
      enhancedContent,
    });
  } catch (error) {
    console.error("AI Job Description Error:", error);
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const uploadResume = async (req, res) => {
  try {
    const { resumeText, title } = req.body;
    const userId = req.userId;

    if (!resumeText || !title) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: resumeText or title",
      });
    }

    const systemPrompt =
      "You are an expert AI agent trained to extract structured data from resumes.";
    const userPrompt = `Extract key information from this resume text: ${resumeText}. Return data as a valid JSON object with the following structure (no extra text before or after):

{
  "professional_summary": "",
  "skills": [],
  "personal_info": {
    "image": "",
    "full_name": "",
    "profession": "",
    "email": "",
    "location": "",
    "phone": "",
    "linkedin": "",
    "website": ""
  },
  "experience": [
    {
      "company": "",
      "position": "",
      "start_date": "",
      "end_date": "",
      "description": "",
      "is_current": false
    }
  ],
  "project": [
    {
      "name": "",
      "type": "",
      "description": ""
    }
  ],
  "education": [
    {
      "institution": "",
      "degree": "",
      "field": "",
      "graduation_date": "",
      "gpa": ""
    }
  ]
}`;

    const response = await ai.chat.completions.create({
      model: process.env.OPENAI_MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      response_format: { type: "json_object" },
    });

    const extractedDataRaw =
      response?.choices?.[0]?.message?.content ||
      JSON.stringify(response?.choices?.[0]?.message || "{}");

    let parsedData;
    try {
      parsedData = JSON.parse(extractedDataRaw);
    } catch (err) {
      console.error("JSON parse failed. Raw data:", extractedDataRaw);
      throw new Error("Invalid JSON format returned by AI.");
    }

    const newResume = await Resume.create({
      userId,
      title,
      ...parsedData,
    });

    return res.status(201).json({
      success: true,
      resume: newResume,
    });
  } catch (error) {
    console.error("Upload Resume Error:", error);
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
