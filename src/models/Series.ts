import mongoose, { Schema, Document, Model, Types } from "mongoose";

export type SeriesStatus = "continuing" | "ended" | "canceled" | "unknown";

export interface ISeries extends Document {
  userId: Types.ObjectId;
  title: string;
  totalSeasons: number;
  seasonsWatched: number;
  status: SeriesStatus;
  rating?: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const SeriesSchema: Schema<ISeries> = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Series must belong to a user"],
      index: true,
    },
    title: {
      type: String,
      required: [true, "Please provide a series title"],
      trim: true,
    },
    totalSeasons: {
      type: Number,
      default: 1,
      min: [0, "Available seasons cannot be negative"],
      validate: {
        validator: Number.isSafeInteger,
        message: "Available seasons must be a whole number",
      },
    },
    seasonsWatched: {
      type: Number,
      default: 0,
      min: [0, "Seasons watched cannot be negative"],
      validate: {
        validator: Number.isSafeInteger,
        message: "Seasons watched must be a whole number",
      },
    },
    status: {
      type: String,
      enum: {
        values: ["continuing", "ended", "canceled", "unknown"],
        message: "{VALUE} is not a valid series status",
      },
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
  },
);

SeriesSchema.pre("validate", function () {
  if (this.seasonsWatched > this.totalSeasons) {
    this.invalidate(
      "seasonsWatched",
      "Seasons watched cannot exceed available seasons",
    );
  }
});

// Compound index to speed up user-scoped title lookups.
SeriesSchema.index({ userId: 1, title: 1 });

const cachedSeriesModel = mongoose.models.Series as Model<ISeries> | undefined;
const cachedStatusEnum = cachedSeriesModel?.schema.path("status").options.enum;
const cachedStatusValues = Array.isArray(cachedStatusEnum)
  ? cachedStatusEnum
  : typeof cachedStatusEnum === "object" &&
      cachedStatusEnum !== null &&
      "values" in cachedStatusEnum &&
      Array.isArray(cachedStatusEnum.values)
    ? cachedStatusEnum.values
    : [];

// Refresh models cached by Next.js hot reload when the status enum changes.
if (cachedSeriesModel && !cachedStatusValues.includes("unknown")) {
  delete mongoose.models.Series;
}

export const Series: Model<ISeries> =
  mongoose.models.Series || mongoose.model<ISeries>("Series", SeriesSchema);

export default Series;
