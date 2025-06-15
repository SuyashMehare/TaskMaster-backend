import { Product } from '../models/product.model.js';
import { Epic } from '../models/epic.model.js';
import { Story } from '../models/story.model.js';

export const createProductStory = async (req, res) => {
  try {
    const { productId, epicId, ...storyData } = req.body;

    // 1. Create the new story
    const newStory = new Story(storyData);
    const savedStory = await newStory.save();

    // 2. Update Product to include the new story
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { $push: { stories: savedStory._id } },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    // 3. Update Epic to include the new story (if epicId provided)
    if (epicId) {
      const updatedEpic = await Epic.findByIdAndUpdate(
        epicId,
        { $push: { stories: savedStory._id } },
        { new: true }
      );

      if (!updatedEpic) {
        return res.status(404).json({
          success: false,
          error: 'Epic not found'
        });
      }
    }

    // 4. Return success response
    return res.status(201).json({
      success: true,
      data: {
        story: savedStory,
        product: updatedProduct,
        ...(epicId && { epic: updatedEpic })
      }
    });

  } catch (error) {
    let status = 400;
    let message = 'Failed to create story';

    if (error.name === 'ValidationError') {
      message = Object.values(error.errors).map(err => err.message).join(', ');
    } else if (error.code === 11000) {
      message = 'Story with this identifier already exists';
    } else {
      status = 500;
      message = 'Server error';
    }

    return res.status(status).json({
      success: false,
      error: message,
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    });
  }
};