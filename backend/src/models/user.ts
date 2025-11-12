import { Schema, model, Document, Types } from "mongoose";
import { ConsumptionDocument } from "./consumption";
import bcrypt from "bcrypt";


export interface UserDocument extends Document {
  _id: Types.ObjectId;
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


// Hook pour hasher le password AVANT de sauvegarder
UserSchema.pre('save', async function(next) {
  // Si le password n'a pas été modifié, on ne le rehash pas
  if (!this.isModified('password')) {
    return next();
  }
  
  // Hasher le password avec bcrypt (coût : 10)
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Relation
UserSchema.virtual("consumptions", {  
  ref: "Consumption",
  localField: "_id",
  foreignField: "users_id",
});

export const UserModel = model<UserDocument>("User", UserSchema);
