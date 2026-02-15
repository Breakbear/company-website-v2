import mongoose, { Document, Schema } from 'mongoose';

export interface ICategory extends Document {
  name: {
    zh: string;
    en: string;
  };
  type: 'product' | 'news';
  slug: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const categorySchema = new Schema<ICategory>(
  {
    name: {
      zh: { type: String, required: true },
      en: { type: String, required: true },
    },
    type: { type: String, enum: ['product', 'news'], required: true },
    slug: { type: String, required: true, unique: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

categorySchema.index({ type: 1, order: 1 });

export default mongoose.model<ICategory>('Category', categorySchema);
