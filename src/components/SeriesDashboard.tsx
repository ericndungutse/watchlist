"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import {
  Tv,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  XCircle,
  TrendingUp,
  Edit2,
  Trash2,
  Loader2,
  Sparkles,
  ChevronUp,
  ChevronDown,
  X,
} from "lucide-react";

export type SeriesStatus = "continuing" | "ended" | "canceled";

export interface SeriesItem {
  _id: string;
  title: string;
  totalSeasons: number;
  seasonsWatched: number;
  status: SeriesStatus;
  notes?: string;
  rating?: number;
  updatedAt: string;
}

interface StatsData {
  totalSeries: number;
  totalSeasonsWatched: number;
  continuing: number;
  ended: number;
  canceled: number;
}

export default function SeriesDashboard() {
  const [seriesList, setSeriesList] = useState<SeriesItem[]>([]);
  const [stats, setStats] = useState<StatsData>({
    totalSeries: 0,
    totalSeasonsWatched: 0,
    continuing: 0,
    ended: 0,
    canceled: 0,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | SeriesStatus>("all");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSeries, setEditingSeries] = useState<SeriesItem | null>(null);
  const [formTitle, setFormTitle] = useState("");
  const [formTotalSeasons, setFormTotalSeasons] = useState(1);
  const [formSeasonsWatched, setFormSeasonsWatched] = useState(0);
  const [formStatus, setFormStatus] = useState<SeriesStatus>("continuing");
  const [formNotes, setFormNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  // Fetch Series
  const fetchSeries = useCallback(async () => {
    try {
      const res = await fetch("/api/series");
      if (!res.ok) throw new Error("Failed to load series");
      const data = await res.json();
      setSeriesList(data.series || []);
      if (data.stats) setStats(data.stats);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    fetch("/api/series")
      .then((res) => res.json())
      .then((data) => {
        if (isMounted) {
          setSeriesList(data.series || []);
          if (data.stats) setStats(data.stats);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Seed user's 35 digitalized series
  const handleSeedData = async () => {
    setIsSeeding(true);
    setActionMessage(null);
    try {
      const res = await fetch("/api/series/seed", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to seed watchlist");
      setActionMessage("Successfully synchronized your 35 TV series!");
      await fetchSeries();
    } catch (err) {
      setActionMessage(err instanceof Error ? err.message : "Error syncing");
    } finally {
      setIsSeeding(false);
      setTimeout(() => setActionMessage(null), 4000);
    }
  };

  // Quick Season Increments / Decrements
  const handleSeasonChange = async (
    seriesId: string,
    delta: number,
    currentWatched: number,
    currentTotal: number
  ) => {
    const newWatched = Math.max(0, currentWatched + delta);
    const updatedTotal = Math.max(newWatched, currentTotal);

    // Optimistic UI update
    setSeriesList((prev) =>
      prev.map((s) =>
        s._id === seriesId
          ? { ...s, seasonsWatched: newWatched, totalSeasons: updatedTotal }
          : s
      )
    );

    try {
      const res = await fetch(`/api/series/${seriesId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          seasonsWatched: newWatched,
          totalSeasons: updatedTotal,
        }),
      });
      if (!res.ok) throw new Error("Update failed");
      await fetchSeries();
    } catch {
      // Revert if failed
      fetchSeries();
    }
  };

  // Quick Status change
  const handleStatusChange = async (
    seriesId: string,
    newStatus: SeriesStatus
  ) => {
    setSeriesList((prev) =>
      prev.map((s) => (s._id === seriesId ? { ...s, status: newStatus } : s))
    );

    try {
      const res = await fetch(`/api/series/${seriesId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error("Status update failed");
      await fetchSeries();
    } catch {
      fetchSeries();
    }
  };

  // Delete Series
  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

    setSeriesList((prev) => prev.filter((s) => s._id !== id));
    try {
      const res = await fetch(`/api/series/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      await fetchSeries();
    } catch {
      fetchSeries();
    }
  };

  // Open modal for Create or Edit
  const openModal = (series?: SeriesItem) => {
    if (series) {
      setEditingSeries(series);
      setFormTitle(series.title);
      setFormTotalSeasons(series.totalSeasons || 1);
      setFormSeasonsWatched(series.seasonsWatched || 0);
      setFormStatus(series.status);
      setFormNotes(series.notes || "");
    } else {
      setEditingSeries(null);
      setFormTitle("");
      setFormTotalSeasons(1);
      setFormSeasonsWatched(0);
      setFormStatus("continuing");
      setFormNotes("");
    }
    setIsModalOpen(true);
  };

  // Submit Modal Form
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    setIsSubmitting(true);
    try {
      const payload = {
        title: formTitle.trim(),
        totalSeasons: Math.max(0, Number(formTotalSeasons)),
        seasonsWatched: Math.max(0, Number(formSeasonsWatched)),
        status: formStatus,
        notes: formNotes.trim(),
      };

      let res: Response;
      if (editingSeries) {
        res = await fetch(`/api/series/${editingSeries._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch("/api/series", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save series");
      }

      setIsModalOpen(false);
      await fetchSeries();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error saving series");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filtered List
  const filteredSeries = useMemo(() => {
    return seriesList.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.notes &&
          item.notes.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesTab = activeTab === "all" || item.status === activeTab;
      return matchesSearch && matchesTab;
    });
  }, [seriesList, searchQuery, activeTab]);

  return (
    <div className="w-full space-y-8">
      {/* Action Notification */}
      {actionMessage && (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-400" />
            <span>{actionMessage}</span>
          </div>
          <button
            onClick={() => setActionMessage(null)}
            className="text-emerald-400 hover:text-emerald-200"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5 sm:gap-4">
        {/* Total Series */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 backdrop-blur-sm">
          <div className="flex items-center justify-between text-xs font-medium text-zinc-400">
            <span>Total Series</span>
            <Tv className="h-4 w-4 text-indigo-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-white sm:text-3xl">
            {stats.totalSeries}
          </div>
          <p className="mt-0.5 text-[11px] text-zinc-500">Tracked in library</p>
        </div>

        {/* Total Seasons Watched */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 backdrop-blur-sm">
          <div className="flex items-center justify-between text-xs font-medium text-zinc-400">
            <span>Seasons Watched</span>
            <TrendingUp className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-emerald-400 sm:text-3xl">
            {stats.totalSeasonsWatched}
          </div>
          <p className="mt-0.5 text-[11px] text-zinc-500">Completed seasons</p>
        </div>

        {/* Continuing */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 backdrop-blur-sm">
          <div className="flex items-center justify-between text-xs font-medium text-zinc-400">
            <span>Continuing</span>
            <Clock className="h-4 w-4 text-sky-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-sky-400 sm:text-3xl">
            {stats.continuing}
          </div>
          <p className="mt-0.5 text-[11px] text-zinc-500">Awaiting seasons</p>
        </div>

        {/* Ended */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 backdrop-blur-sm">
          <div className="flex items-center justify-between text-xs font-medium text-zinc-400">
            <span>Ended</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-zinc-200 sm:text-3xl">
            {stats.ended}
          </div>
          <p className="mt-0.5 text-[11px] text-zinc-500">Finished series</p>
        </div>

        {/* Canceled */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 backdrop-blur-sm col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-xs font-medium text-zinc-400">
            <span>Canceled</span>
            <XCircle className="h-4 w-4 text-rose-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-rose-400 sm:text-3xl">
            {stats.canceled}
          </div>
          <p className="mt-0.5 text-[11px] text-zinc-500">Discontinued</p>
        </div>
      </div>

      {/* Control Bar: Search, Filters, Add & Seed Buttons */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Search Input */}
        <div className="relative flex-1">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-zinc-500">
            <Search className="h-4 w-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search TV series or notes (e.g., 'Silo', 'August 2026')..."
            className="block w-full rounded-xl border border-zinc-800 bg-zinc-900/80 py-2.5 pl-10 pr-4 text-sm text-white placeholder-zinc-500 transition focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleSeedData}
            disabled={isSeeding}
            title="Import all 35 TV shows to your account"
            className="inline-flex items-center gap-1.5 rounded-xl border border-indigo-500/30 bg-indigo-500/10 px-3.5 py-2.5 text-xs font-semibold text-indigo-300 transition hover:bg-indigo-500/20 disabled:opacity-50"
          >
            {isSeeding ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
            <span>Sync 35 Series</span>
          </button>

          <button
            onClick={() => openModal()}
            className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <Plus className="h-4 w-4" />
            <span>Add Series</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-zinc-800 pb-3 text-sm">
        <button
          onClick={() => setActiveTab("all")}
          className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
            activeTab === "all"
              ? "bg-zinc-800 text-white font-semibold"
              : "text-zinc-400 hover:text-white"
          }`}
        >
          All ({stats.totalSeries})
        </button>
        <button
          onClick={() => setActiveTab("continuing")}
          className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
            activeTab === "continuing"
              ? "bg-sky-500/20 text-sky-300 font-semibold border border-sky-500/30"
              : "text-zinc-400 hover:text-sky-300"
          }`}
        >
          Continuing ({stats.continuing})
        </button>
        <button
          onClick={() => setActiveTab("ended")}
          className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
            activeTab === "ended"
              ? "bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30"
              : "text-zinc-400 hover:text-emerald-300"
          }`}
        >
          Ended ({stats.ended})
        </button>
        <button
          onClick={() => setActiveTab("canceled")}
          className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
            activeTab === "canceled"
              ? "bg-rose-500/20 text-rose-300 font-semibold border border-rose-500/30"
              : "text-zinc-400 hover:text-rose-300"
          }`}
        >
          Canceled ({stats.canceled})
        </button>
      </div>

      {/* Series Grid */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 text-zinc-500 space-y-3">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-400" />
          <p className="text-sm">Loading your TV series...</p>
        </div>
      ) : filteredSeries.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-zinc-800 p-12 text-center space-y-4">
          <Tv className="mx-auto h-12 w-12 text-zinc-600" />
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-white">
              No TV series found
            </h3>
            <p className="text-sm text-zinc-400">
              {seriesList.length === 0
                ? "Your watchlist is empty. Click 'Sync 35 Series' to load your complete list!"
                : "No series match your current filter or search criteria."}
            </p>
          </div>
          {seriesList.length === 0 && (
            <button
              onClick={handleSeedData}
              disabled={isSeeding}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500"
            >
              <Sparkles className="h-4 w-4" />
              <span>Load My 35 Series</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredSeries.map((item) => {
            const watched = item.seasonsWatched || 0;
            const total = item.totalSeasons || 1;
            const progressPercent = Math.min(
              100,
              Math.round((watched / Math.max(1, total)) * 100)
            );

            return (
              <div
                key={item._id}
                className="group flex flex-col justify-between rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 shadow-lg transition hover:border-zinc-700 hover:bg-zinc-900/90"
              >
                {/* Header & Status */}
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-white text-base leading-snug line-clamp-2">
                      {item.title}
                    </h3>
                    {/* Status Pill */}
                    <div className="shrink-0">
                      <select
                        value={item.status}
                        onChange={(e) =>
                          handleStatusChange(
                            item._id,
                            e.target.value as SeriesStatus
                          )
                        }
                        className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold border cursor-pointer focus:outline-none ${
                          item.status === "continuing"
                            ? "bg-sky-500/15 border-sky-500/30 text-sky-300"
                            : item.status === "ended"
                            ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-300"
                            : "bg-rose-500/15 border-rose-500/30 text-rose-300"
                        }`}
                      >
                        <option value="continuing" className="bg-zinc-900 text-white">
                          Continuing
                        </option>
                        <option value="ended" className="bg-zinc-900 text-white">
                          Ended
                        </option>
                        <option value="canceled" className="bg-zinc-900 text-white">
                          Canceled
                        </option>
                      </select>
                    </div>
                  </div>

                  {/* Notes / Release Info */}
                  {item.notes ? (
                    <p className="text-xs text-zinc-400 line-clamp-3 leading-relaxed rounded-lg bg-zinc-950/40 p-2.5 border border-zinc-800/60">
                      {item.notes}
                    </p>
                  ) : (
                    <p className="text-xs text-zinc-600 italic">No notes added</p>
                  )}
                </div>

                {/* Season Counter & Actions */}
                <div className="mt-5 space-y-3 pt-3 border-t border-zinc-800/70">
                  {/* Progress Header */}
                  <div className="flex items-center justify-between text-xs text-zinc-400">
                    <span>
                      Watched:{" "}
                      <strong className="text-white font-semibold">{watched}</strong>{" "}
                      of {total} {total === 1 ? "Season" : "Seasons"}
                    </span>
                    <span className="font-mono text-[11px] text-zinc-500">
                      {progressPercent}%
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="h-1.5 w-full rounded-full bg-zinc-800 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 rounded-full ${
                        item.status === "ended"
                          ? "bg-emerald-500"
                          : item.status === "canceled"
                          ? "bg-rose-500"
                          : "bg-indigo-500"
                      }`}
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>

                  {/* Quick Controls: + / - and Edit / Delete */}
                  <div className="flex items-center justify-between pt-1">
                    {/* Season Incrementor buttons */}
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() =>
                          handleSeasonChange(item._id, -1, watched, total)
                        }
                        disabled={watched <= 0}
                        title="Decrement watched season"
                        className="flex h-7 w-7 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-950 text-zinc-400 transition hover:bg-zinc-800 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <ChevronDown className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() =>
                          handleSeasonChange(item._id, 1, watched, total)
                        }
                        title="Increment watched season"
                        className="flex h-7 w-7 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-950 text-zinc-300 transition hover:bg-indigo-600 hover:text-white hover:border-indigo-500"
                      >
                        <ChevronUp className="h-3.5 w-3.5" />
                      </button>
                      <span className="text-xs text-zinc-500 pl-1">
                        +1 Season
                      </span>
                    </div>

                    {/* Edit & Delete */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openModal(item)}
                        title="Edit Series"
                        className="flex h-7 w-7 items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-800 hover:text-white transition"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(item._id, item.title)}
                        title="Delete Series"
                        className="flex h-7 w-7 items-center justify-center rounded-lg text-zinc-500 hover:bg-rose-500/20 hover:text-rose-400 transition"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Series Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl sm:p-8">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-4 top-4 text-zinc-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-xl font-bold text-white mb-5">
              {editingSeries ? "Edit TV Series" : "Add TV Series"}
            </h3>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-1">
                  Series Title *
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Silo, House of the Dragon"
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950 py-2.5 px-3.5 text-sm text-white placeholder-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              {/* Seasons: Watched & Total */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-1">
                    Seasons Watched
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={formSeasonsWatched}
                    onChange={(e) =>
                      setFormSeasonsWatched(parseInt(e.target.value) || 0)
                    }
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-950 py-2 px-3 text-sm text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-1">
                    Total Seasons
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={formTotalSeasons}
                    onChange={(e) =>
                      setFormTotalSeasons(parseInt(e.target.value) || 0)
                    }
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-950 py-2 px-3 text-sm text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-1">
                  Show Status
                </label>
                <select
                  value={formStatus}
                  onChange={(e) =>
                    setFormStatus(e.target.value as SeriesStatus)
                  }
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950 py-2.5 px-3 text-sm text-white focus:border-indigo-500 focus:outline-none"
                >
                  <option value="continuing">Continuing (Ongoing / Renewed)</option>
                  <option value="ended">Ended (Completed)</option>
                  <option value="canceled">Canceled (Discontinued)</option>
                </select>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-1">
                  Notes & Release Info
                </label>
                <textarea
                  rows={3}
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="e.g. Season 2 to release August 2026, awaiting final season..."
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950 py-2 px-3 text-sm text-white placeholder-zinc-500 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-zinc-800 px-4 py-2 text-xs font-semibold text-zinc-400 hover:bg-zinc-800 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-indigo-500 disabled:opacity-50"
                >
                  {isSubmitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  <span>{editingSeries ? "Save Changes" : "Add to Library"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
