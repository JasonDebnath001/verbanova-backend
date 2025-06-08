import fs from "fs";
import imagekit from "../config/imagekit.js";
import blogModel from "../models/blogModel.js";
import comment from "../models/commentModel.js";
import main from "../config/gemini.js";

export const addBlog = async (req, res) => {
  try {
    let blogData;
    try {
      blogData =
        typeof req.body.blog === "string"
          ? JSON.parse(req.body.blog)
          : req.body.blog;
    } catch (parseError) {
      return res.status(400).json({
        success: false,
        msg: "Invalid blog data format. Please ensure the blog data is properly formatted JSON.",
      });
    }

    const { title, subTitle, description, category, isPublished } = blogData;
    const imageFile = req.file;

    // check if all fields are present
    if (!title || !description || !category || !imageFile) {
      return res.status(400).json({
        success: false,
        msg: "Missing required fields: title, description, category, and image are required",
      });
    }

    const fileBuffer = fs.readFileSync(imageFile.path);
    const response = await imagekit.upload({
      file: fileBuffer,
      fileName: imageFile.originalname,
      folder: "/blogs",
    });

    const optimizeImageUrl = imagekit.url({
      path: response.filePath,
      transformation: [
        { quality: "auto" },
        { format: "webp" },
        { width: "1280" },
      ],
    });

    await blogModel.create({
      title,
      subTitle,
      description,
      category,
      image: optimizeImageUrl,
      isPublished: isPublished || false,
    });

    // Clean up the temporary file
    fs.unlinkSync(imageFile.path);

    res.status(201).json({ success: true, msg: "Blog added successfully" });
  } catch (error) {
    console.error("Error adding blog:", error);
    res.status(500).json({
      success: false,
      msg: "An error occurred while adding the blog",
    });
  }
};

export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await blogModel.find({ isPublished: true });
    res.json({ success: true, blogs });
  } catch (error) {
    console.log(error);
  }
};

export const getBlogById = async (req, res) => {
  try {
    const { blogId } = req.params;
    const singleBlog = await blogModel.findById(blogId);
    if (!singleBlog) {
      return res.json({ success: false, msg: "Blog not found" });
    }
    res.json({ success: true, singleBlog });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, msg: "Error fetching blog" });
  }
};

export const deleteBlogById = async (req, res) => {
  try {
    const { id } = req.body;
    await blogModel.findByIdAndDelete(id);
    await comment.deleteMany({ blog: id });
    res.json({ success: true, msg: "Blog deleted successfully" });
  } catch (error) {
    console.log(error);
  }
};

export const togglePublish = async (req, res) => {
  try {
    const { id } = req.body;
    const singleBlog = await blogModel.findById(id);
    singleBlog.isPublished = !singleBlog.isPublished;
    await singleBlog.save();
    res.json({ success: true, msg: "Blog status updated" });
  } catch (error) {
    console.log(error);
  }
};

export const addComment = async (req, res) => {
  try {
    const { blog, name, content } = req.body;

    // Validate required fields
    if (!blog || !name || !content) {
      return res.status(400).json({
        success: false,
        msg: "Missing required fields: blog, name, and content are required",
      });
    }

    // Verify if the blog exists
    const blogExists = await blogModel.findById(blog);
    if (!blogExists) {
      return res.status(404).json({
        success: false,
        msg: "Blog not found",
      });
    }

    // Create the comment
    const newComment = await comment.create({
      blog,
      name,
      content,
      isApproved: false,
    });

    res.status(201).json({
      success: true,
      msg: "Comment submitted successfully",
      comment: newComment,
    });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({
      success: false,
      msg: "An error occurred while adding the comment",
    });
  }
};

export const getBlogComment = async (req, res) => {
  try {
    const { blogId } = req.params;
    const comments = await comment
      .find({ blog: blogId, isApproved: true })
      .sort({ createdAt: -1 });
    res.json({ success: true, comments });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, msg: "Error fetching comments" });
  }
};

export const generateContent = async (req, res) => {
  try {
    const { prompt } = req.body;
    const content = await main(
      prompt +
        " write a comprehensive blog fot this topic in simple text format"
    );
    res.json({ success: true, content });
  } catch (error) {
    console.log(error);
  }
};
