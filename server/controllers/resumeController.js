import Resume from "../models/Resume.js";
import imagekit from "../configs/imageKit.js";
import fs from "fs";

export const createResume = async (req, res) => {
  try {
    const userId = req.userId;
    const { title } = req.body;
    //create a new resume
    const newResume = await Resume.create({ userId, title });
    return res.status(201).json({
      success: true,
      message: "Resume created successfully",
      resume: newResume,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

//delete resume
export const deleteResume = async (req, res) => {
  try {
    const userId = req.userId;
    const { resumeId } = req.params;
    //find and delete resume
    await Resume.findOneAndDelete({ userId, _id: resumeId });
    return res.status(200).json({
      success: true,
      message: "Resume deleted successfully",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getResumeById = async (req, res) => {
  try {
    const userId = req.userId;
    const { resumeId } = req.params;

    const resume = await Resume.findOne({ userId, _id: resumeId });
    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }
    resume.__v = undefined;
    resume.createdAt = undefined;
    resume.updatedAt = undefined;
    return res.status(200).json({
      success: true,
      resume,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

//get resumeby id public

export const getPublicResumeById = async (req, res) => {
  try {
    const { resumeId } = req.params;
    const resume = await Resume.findOne({ public: true, _id: resumeId });
    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }
    return res.status(200).json({
      success: true,
      resume,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateResume = async (req, res) => {
  try {
    const userId = req.userId;
    const { resumeId, removeBackground } = req.body;
    let { resumeData } = req.body;
    const image = req.file;

    // Now make a deep copy safely
    let resumeDataCopy;
    if (typeof resumeData === "string") {
      resumeDataCopy = await JSON.parse(resumeData);
    } else {
      resumeDataCopy = structuredClone(resumeData);
    }

    // Upload image if provided
    if (image) {
      const imageBufferData = fs.createReadStream(image.path);
      const response = await imagekit.files.upload({
        file: imageBufferData,
        fileName: "resume.png",
        folder: "user-resumes",
        transformation: {
          pre:
            "w-300,h-300,fo-face,z-0.75" +
            (removeBackground ? ",e-bgremove" : ""),
        },
      });
      resumeDataCopy.personal_info.image = response.url;
    }

    const resume = await Resume.findOneAndUpdate(
      { userId, _id: resumeId },
      resumeDataCopy,
      { new: true }
    );

    return res.status(200).json({
      success: true,
      resume,
      message: "Resume updated successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
