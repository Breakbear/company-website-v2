import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
  name: {
    zh: string;
    en: string;
  };
  description: {
    zh: string;
    en: string;
  };
  category: string;
  images: string[];
  specifications: {
    key: string;
    value: string;
  }[];
  price?: number;
  featured: boolean;
  status: 'active' | 'inactive';
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>(
  {
    name: {
      zh: { type: String, required: true },
      en: { type: String, required: true },
    },
    description: {
      zh: { type: String, required: true },
      en: { type: String, required: true },
    },
    category: { type: String, required: true },
    images: [{ type: String }],
    specifications: [
      {
        key: { type: String },
        value: { type: String },
      },
    ],
    price: { type: Number },
    featured: { type: Boolean, default: false },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

productSchema.index({ category: 1, status: 1 });
productSchema.index({ featured: 1, status: 1 });

export default mongoose.model<IProduct>('Product', productSchema);
