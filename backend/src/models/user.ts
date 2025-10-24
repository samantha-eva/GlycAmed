import { Schema, model, Document } from "mongoose";
import { ConsumptionDocument } from "./consumption";

export interface UserDocument extends Document {
  name: string;
  surname: string;
  email: string;
  password: string;
  created_at: Date;
  modified_at: Date;
  consumptions?: ConsumptionDocument[];
}

const UserSchema = new Schema<UserDocument>(
  {
    name: { type: String, required: true },
    surname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "modified_at" },
  }
);

// Relation
UserSchema.virtual("consumption", {
  ref: "Consumption",
  localField: "_id",
  foreignField: "users_id",
});

export const UserModel = model<UserDocument>("User", UserSchema);
