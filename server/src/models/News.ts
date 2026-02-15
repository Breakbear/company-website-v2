import mongoose, { Document, Schema } from 'mongoose';

export interface INews extends Document {
  title: {
    zh: string;
    en: string;
  };
  content: {
    zh: string;
    en: string;
  };
  summary: {
    zh: string;
    en: string;
  };
  category: string;
  coverImage: string;
  author: string;
  views: number;
  status: 'published' | 'draft';
  publishedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const newsSchema = new Schema<INews>(
  {
    title: {
      zh: { type: String, required: true },
      en: { type: String, required: true },
    },
    content: {
      zh: { type: String, required: true },
      en: { type: String, required: true },
    },
    summary: {
      zh: { type: String },
      en: { type: String },
    },
    category: { type: String, required: true },
    coverImage: { type: String },
    author: { type: String, default: 'Admin' },
    views: { type: Number, default: 0 },
    status: { type: String, enum: ['published', 'draft'], default: 'published' },
    publishedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

newsSchema.index({ category: 1, status: 1 });
newsSchema.index({ publishedAt: -1 });

export default mongoose.model<INews>('News', newsSchema);
