import * as mongoose from 'mongoose';

export interface Blog {
  id: string;
  title: string;
  data: string;
  tags: string[];
  likes: number;
  dislikes: number;
  createdBy: string;
}

export const BlogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: [true, 'Please provide title'],
    },
    data: {
      type: String,
      trim: true,
    },
    tags: {
      type: [String],
      trim: true,
    },
    likes: {
      type: Number,
      default: 0,
    },
    dislikes: {
      type: Number,
      default: 0,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please provide user'],
    },
  },
  { timestamps: true },
);