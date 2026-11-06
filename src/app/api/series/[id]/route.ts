import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Series from "@/models/Series";
import { getCurrentUser } from "@/lib/auth";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized. Please log in." },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await req.json();
    const { title, totalSeasons, seasonsWatched, status, notes, rating } = body;

    await connectToDatabase();

    const existing = await Series.findOne({ _id: id, userId: user.userId });
    if (!existing) {
      return NextResponse.json(
        { error: "Series not found" },
        { status: 404 }
      );
    }

    if (title !== undefined) existing.title = title.trim();
    if (totalSeasons !== undefined) existing.totalSeasons = Math.max(0, Number(totalSeasons));
    if (seasonsWatched !== undefined) existing.seasonsWatched = Math.max(0, Number(seasonsWatched));
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
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized. Please log in." },
        { status: 401 }
      );
    }

    const { id } = await params;
    await connectToDatabase();

    const result = await Series.findOneAndDelete({ _id: id, userId: user.userId });
    if (!result) {
      return NextResponse.json(
        { error: "Series not found" },
        { status: 404 }
      );
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
      { status: 500 }
    );
  }
}
