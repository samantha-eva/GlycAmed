import { Schema, model, Document, Types } from "mongoose";
import { UserDocument } from "./user";

export interface ConsumptionDocument extends Document {
  _id: Types.ObjectId | ConsumptionDocument;
  users_id: Types.ObjectId | UserDocument;
  name: string;
  calories: number;
  sugar: number;
  caffeine: number;
  quantity: number;
  barcode: number;
  place: string;
  note?: string;
  when: Date;
  created_at: Date;
  modified_at: Date;
}

const ConsumptionSchema = new Schema<ConsumptionDocument>(
  {
    users_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    calories: { type: Number, required: true },
    sugar: { type: Number, required: true },
    caffeine: { type: Number, required: true },
    quantity: { type: Number, required: true },
    barcode: { type: Number, required: true },
    place: { type: String, required: true },
    note: { type: String },
    when: { type: Date, required: true },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "modified_at" },
  }
);

export const ConsumptionModel = model<ConsumptionDocument>(
  "Consumption",
  ConsumptionSchema
);
