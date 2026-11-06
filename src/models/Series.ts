import mongoose, { Schema, Document, Model } from "mongoose";

export type SeriesStatus = "continuing" | "ended" | "canceled";

export interface ISeries extends Document {
  title: string;
  totalSeasons?: number;
  seasonsWatched?: number;
  status: SeriesStatus;
  rating?: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const SeriesSchema: Schema<ISeries> = new Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a title"],
      trim: true,
    },
    totalSeasons: {
      type: Number,
      default: 1,
      min: 0,
    },
    seasonsWatched: {
      type: Number,
      default: 0,
      min: 0,
    },
    status: {
      type: String,
      enum: ["continuing", "ended", "canceled"],
      default: "continuing",
    },
    rating: {
      type: Number,
      min: 0,
      max: 10,
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent re-registering model upon hot reload in Next.js development
export const Series: Model<ISeries> =
  mongoose.models.Series || mongoose.model<ISeries>("Series", SeriesSchema);

export default Series;
