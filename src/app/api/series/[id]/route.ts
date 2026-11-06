import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Series from "@/models/Series";
import { getCurrentUser } from "@/lib/auth";

const isNonNegativeInteger = (value: unknown): boolean =>
  (typeof value === "number" ||
    (typeof value === "string" && value.trim() !== "")) &&
  Number.isSafeInteger(Number(value)) &&
  Number(value) >= 0;

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized. Please log in." },
        { status: 401 },
      );
    }

    const { id } = await params;
    const body = await req.json();
    const { title, totalSeasons, seasonsWatched, status, notes, rating } = body;

    await connectToDatabase();

    const existing = await Series.findOne({ _id: id, userId: user.userId });
    if (!existing) {
      return NextResponse.json({ error: "Series not found" }, { status: 404 });
    }

    if (
      (totalSeasons !== undefined && !isNonNegativeInteger(totalSeasons)) ||
      (seasonsWatched !== undefined && !isNonNegativeInteger(seasonsWatched))
    ) {
      return NextResponse.json(
        { error: "Season counts must be non-negative whole numbers" },
        { status: 400 },
      );
    }

    const nextTotalSeasons =
      totalSeasons === undefined ? existing.totalSeasons : Number(totalSeasons);
    const nextSeasonsWatched =
      seasonsWatched === undefined
        ? existing.seasonsWatched
        : Number(seasonsWatched);

    if (nextSeasonsWatched > nextTotalSeasons) {
      return NextResponse.json(
        { error: "Seasons watched cannot exceed total seasons" },
        { status: 400 },
      );
    }

    if (title !== undefined) existing.title = title.trim();
    if (totalSeasons !== undefined) existing.totalSeasons = nextTotalSeasons;
    if (seasonsWatched !== undefined)
      existing.seasonsWatched = nextSeasonsWatched;
    if (status && ["continuing", "ended", "canceled"].includes(status)) {
      existing.status = status;
    }
    if (notes !== undefined) existing.notes = String(notes).trim();
    if (rating !== undefined) existing.rating = Number(rating);

    await existing.save();

    return NextResponse.json({
      success: true,
      message: "Series updated successfully",
      series: existing,
    });
  } catch (error: unknown) {
    console.error("PUT /api/series/[id] error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to update series",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized. Please log in." },
        { status: 401 },
      );
    }

    const { id } = await params;
    await connectToDatabase();

    const result = await Series.findOneAndDelete({
      _id: id,
      userId: user.userId,
    });
    if (!result) {
      return NextResponse.json({ error: "Series not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Series deleted successfully",
    });
  } catch (error: unknown) {
    console.error("DELETE /api/series/[id] error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to delete series",
      },
      { status: 500 },
    );
  }
}
