import { model, Schema, Document } from "mongoose";

export interface MongooseUser extends Document {
  name: string;
  email: string;
  phone?: string;
  password: string;
  isAdmin: boolean; 
}

const userSchema = new Schema<MongooseUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String },
  },
  { timestamps: true }
);

const User = model<MongooseUser>("User", userSchema);
 
export default User;