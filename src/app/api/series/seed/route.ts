import { NextResponse } from "next/server";
import { Types } from "mongoose";
import connectToDatabase from "@/lib/mongodb";
import Series from "@/models/Series";
import { getCurrentUser } from "@/lib/auth";
import { INITIAL_USER_SERIES } from "@/lib/initialSeriesData";

export async function POST() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized. Please log in first." },
        { status: 401 }
      );
    }

    await connectToDatabase();
    const userObjectId = new Types.ObjectId(user.userId);

    const operations = INITIAL_USER_SERIES.map((item) => ({
      updateOne: {
        filter: { userId: userObjectId, title: item.title },
        update: {
          $set: {
            userId: userObjectId,
            title: item.title,
            totalSeasons: item.totalSeasons,
            seasonsWatched: item.seasonsWatched,
            status: item.status,
            notes: item.notes,
          },
        },
        upsert: true,
      },
    }));

    const result = await Series.bulkWrite(operations);

    const totalCount = await Series.countDocuments({ userId: userObjectId });

    return NextResponse.json({
      success: true,
      message: `Successfully synchronized ${INITIAL_USER_SERIES.length} series to your tracker!`,
      upsertedCount: result.upsertedCount,
      modifiedCount: result.modifiedCount,
      totalCount,
    });
  } catch (error: unknown) {
    console.error("POST /api/series/seed error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to seed watchlist",
      },
      { status: 500 }
    );
  }
}
