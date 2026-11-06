import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Series from "@/models/Series";
import { getCurrentUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized. Please log in." },
        { status: 401 }
      );
    }

    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: any = { userId: user.userId };

    if (status && ["continuing", "ended", "canceled"].includes(status)) {
      query.status = status;
    }

    if (search && search.trim()) {
      query.title = { $regex: search.trim(), $options: "i" };
    }

    const series = await Series.find(query).sort({ updatedAt: -1 });

    // Compute stats across all series for this user (unfiltered by current query)
    const allUserSeries = await Series.find({ userId: user.userId });
    const stats = {
      totalSeries: allUserSeries.length,
      totalSeasonsWatched: allUserSeries.reduce(
        (sum, item) => sum + (item.seasonsWatched || 0),
        0
      ),
      continuing: allUserSeries.filter((s) => s.status === "continuing").length,
      ended: allUserSeries.filter((s) => s.status === "ended").length,
      canceled: allUserSeries.filter((s) => s.status === "canceled").length,
    };

    return NextResponse.json({
      success: true,
      stats,
      series,
    });
  } catch (error: unknown) {
    console.error("GET /api/series error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to fetch series list",
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized. Please log in." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { title, totalSeasons, seasonsWatched, status, notes, rating } = body;

    if (!title || typeof title !== "string" || !title.trim()) {
      return NextResponse.json(
        { error: "Series title is required" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const newSeries = await Series.create({
      userId: user.userId,
      title: title.trim(),
      totalSeasons: Number(totalSeasons) || 1,
      seasonsWatched: Number(seasonsWatched) || 0,
      status: ["continuing", "ended", "canceled"].includes(status)
        ? status
        : "continuing",
      notes: notes ? String(notes).trim() : undefined,
      rating: rating ? Number(rating) : undefined,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Series added successfully",
        series: newSeries,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("POST /api/series error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to create series",
      },
      { status: 500 }
    );
  }
}
