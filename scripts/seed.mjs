import mongoose from "mongoose";

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/ent-tracker";

const RAW_SERIES = [
  {
    title: "Black Doves",
    totalSeasons: 2,
    seasonsWatched: 1,
    status: "continuing",
    notes: "Watched Season 1. Watching Season 2.",
  },
  {
    title: "The Last Kingdom",
    totalSeasons: 5,
    seasonsWatched: 5,
    status: "ended",
    notes: "Complete series watched.",
  },
  {
    title: "Warrior Nun",
    totalSeasons: 2,
    seasonsWatched: 2,
    status: "canceled",
    notes: "Canceled by Netflix after Season 2.",
  },
  {
    title: "Hit & Run",
    totalSeasons: 1,
    seasonsWatched: 0,
    status: "canceled",
    notes: "Trailer watched / on watchlist. Canceled after Season 1.",
  },
  {
    title: "Percy Jackson and the Olympians",
    totalSeasons: 2,
    seasonsWatched: 1,
    status: "continuing",
    notes: "Season 1 watched. Season 2 in development.",
  },
  {
    title: "SEAL Team",
    totalSeasons: 7,
    seasonsWatched: 7,
    status: "ended",
    notes: "Completed all 7 seasons. Series concluded.",
  },
  {
    title: "Lupin",
    totalSeasons: 4,
    seasonsWatched: 2,
    status: "continuing",
    notes: "Seasons 1 & 2 watched. Seasons 3 & 4 released.",
  },
  {
    title: "The Night Agent",
    totalSeasons: 3,
    seasonsWatched: 3,
    status: "continuing",
    notes: "Seasons 1, 2 & 3 watched.",
  },
  {
    title: "The Lord of the Rings: The Rings of Power",
    totalSeasons: 2,
    seasonsWatched: 2,
    status: "continuing",
    notes: "Seasons 1 & 2 watched. Awaiting Season 3.",
  },
  {
    title: "House of the Dragon",
    totalSeasons: 3,
    seasonsWatched: 2,
    status: "continuing",
    notes: "Watched through Season 2. Awaiting Season 3.",
  },
  {
    title: "Hijack",
    totalSeasons: 2,
    seasonsWatched: 1,
    status: "continuing",
    notes: "Watched S01. Renewed for Season 2.",
  },
  {
    title: "The Witcher",
    totalSeasons: 4,
    seasonsWatched: 3,
    status: "continuing",
    notes: "Watched through Season 3. Awaiting final season.",
  },
  {
    title: "Monarch: Legacy of Monsters",
    totalSeasons: 2,
    seasonsWatched: 2,
    status: "continuing",
    notes: "Watched S01 and S02.",
  },
  {
    title: "Paradise",
    totalSeasons: 2,
    seasonsWatched: 2,
    status: "continuing",
    notes: "Watched S01 and S02.",
  },
  {
    title: "The Hunting Party",
    totalSeasons: 1,
    seasonsWatched: 1,
    status: "continuing",
    notes: "Watched S01.",
  },
  {
    title: "Daredevil: Born Again",
    totalSeasons: 2,
    seasonsWatched: 2,
    status: "continuing",
    notes: "Seasons 1 & 2 watched.",
  },
  {
    title: "Daredevil (2015)",
    totalSeasons: 3,
    seasonsWatched: 3,
    status: "ended",
    notes: "Seasons 1, 2, The Defenders, and Season 3 watched.",
  },
  {
    title: "The Boys",
    totalSeasons: 4,
    seasonsWatched: 4,
    status: "continuing",
    notes: "Watched all released seasons. Final Season 5 incoming.",
  },
  {
    title: "Dark Matter (Apple TV+)",
    totalSeasons: 2,
    seasonsWatched: 1,
    status: "continuing",
    notes:
      "Season 1 released in 2024 watched. Season 2 to release August 2026.",
  },
  {
    title: "The Veil (2024)",
    totalSeasons: 1,
    seasonsWatched: 1,
    status: "ended",
    notes: "Watched 2024 mini-series.",
  },
  {
    title: "In From the Cold",
    totalSeasons: 1,
    seasonsWatched: 1,
    status: "canceled",
    notes: "Season 1 watched. Canceled.",
  },
  {
    title: "Silo",
    totalSeasons: 3,
    seasonsWatched: 2,
    status: "continuing",
    notes:
      "Seasons 1 & 2 watched. Season 3 in release. Final season incoming in 2027.",
  },
  {
    title: "Avatar: The Last Airbender",
    totalSeasons: 3,
    seasonsWatched: 1,
    status: "continuing",
    notes: "First season 1 watched. Renewed for Seasons 2 & 3.",
  },
  {
    title: "3 Body Problem",
    totalSeasons: 2,
    seasonsWatched: 1,
    status: "continuing",
    notes: "Watched Season 1. Season 2 incoming in 2026.",
  },
  {
    title: "One Piece",
    totalSeasons: 2,
    seasonsWatched: 2,
    status: "continuing",
    notes: "Seasons 1 & 2 watched.",
  },
  {
    title: "Ponies",
    totalSeasons: 1,
    seasonsWatched: 1,
    status: "continuing",
    notes: "Watched Season 1.",
  },
  {
    title: "A Knight of the Seven Kingdoms",
    totalSeasons: 1,
    seasonsWatched: 1,
    status: "continuing",
    notes: "Watched Season 1.",
  },
  {
    title: "Man on Fire",
    totalSeasons: 1,
    seasonsWatched: 1,
    status: "continuing",
    notes: "Watched Season 1.",
  },
  {
    title: "Young Sherlock",
    totalSeasons: 1,
    seasonsWatched: 0,
    status: "continuing",
    notes: "Upcoming / to watch.",
  },
  {
    title: "The Last Thing He Told Me",
    totalSeasons: 2,
    seasonsWatched: 1,
    status: "continuing",
    notes: "Watched Season 1. Renewed for Season 2.",
  },
  {
    title: "Gangs of London",
    totalSeasons: 3,
    seasonsWatched: 2,
    status: "continuing",
    notes: "Seasons 1 & 2 watched. Season 3 continuing.",
  },
  {
    title: "Wanderman",
    totalSeasons: 1,
    seasonsWatched: 1,
    status: "ended",
    notes: "Mini-series watched.",
  },
  {
    title: "The Night Manager",
    totalSeasons: 3,
    seasonsWatched: 1,
    status: "continuing",
    notes: "Watched Season 1. Seasons 2 & 3 in production.",
  },
  {
    title: "Special Ops: Lioness",
    totalSeasons: 3,
    seasonsWatched: 3,
    status: "continuing",
    notes: "Seasons 1, 2 & 3 watched.",
  },
  {
    title: "Reacher",
    totalSeasons: 4,
    seasonsWatched: 4,
    status: "continuing",
    notes: "Season 4 watched.",
  },
];

async function run() {
  await mongoose.connect(MONGODB_URI);
  console.log("Connected to MongoDB at", MONGODB_URI);

  const User = mongoose.model(
    "User",
    new mongoose.Schema({}, { strict: false }),
  );
  const Series = mongoose.model(
    "Series",
    new mongoose.Schema({}, { strict: false }),
  );

  const users = await User.find({});
  if (users.length === 0) {
    console.log("No registered users found. Sign up via /signup first.");
    await mongoose.disconnect();
    return;
  }

  for (const user of users) {
    console.log(
      `Seeding 35 series for user: ${user.fullName} (${user.email})...`,
    );

    const operations = RAW_SERIES.map((item) => ({
      updateOne: {
        filter: { userId: user._id, title: item.title },
        update: {
          $set: {
            title: item.title,
            totalSeasons: item.totalSeasons,
            status: item.status,
          },
          $setOnInsert: {
            userId: user._id,
            seasonsWatched: item.seasonsWatched,
            notes: item.notes,
          },
        },
        upsert: true,
      },
    }));

    const result = await Series.bulkWrite(operations);
    console.log(
      `✓ Seeded for ${user.email}: ${result.upsertedCount} inserted, ${result.modifiedCount} updated.`,
    );
  }

  const count = await Series.countDocuments({});
  console.log(`Total series in database: ${count}`);

  await mongoose.disconnect();
  console.log("Disconnected successfully.");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
