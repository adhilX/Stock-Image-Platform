import { model, Schema, Document } from "mongoose";

export interface MongooseImage extends Document {
  userId: Schema.Types.ObjectId;
  image: string;
  title: string;
  order: number;
}

const imageSchema = new Schema<MongooseImage>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    order: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const Image = model<MongooseImage>("Image", imageSchema);

export default Image;