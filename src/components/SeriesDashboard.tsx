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

export type SeriesStatus = "continuing" | "ended" | "canceled" | "unknown";

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
  unknown: number;
}

export default function SeriesDashboard() {
  const [seriesList, setSeriesList] = useState<SeriesItem[]>([]);
  const [stats, setStats] = useState<StatsData>({
    totalSeries: 0,
    totalSeasonsWatched: 0,
    continuing: 0,
    ended: 0,
    canceled: 0,
    unknown: 0,
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
    const newWatched = Math.min(
      currentTotal,
      Math.max(0, currentWatched + delta),
    );

    // Optimistic UI update
    setSeriesList((prev) =>
      prev.map((s) =>
        s._id === seriesId
          ? { ...s, seasonsWatched: newWatched }
          : s
      )
    );

    try {
      const res = await fetch(`/api/series/${seriesId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          seasonsWatched: newWatched,
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
      setFormTotalSeasons(series.totalSeasons ?? 1);
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
    if (formSeasonsWatched > formTotalSeasons) {
      alert("Seasons watched cannot exceed available seasons");
      return;
    }

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
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            <span className="font-medium">{actionMessage}</span>
          </div>
          <button
            onClick={() => setActionMessage(null)}
            className="text-emerald-600 hover:text-emerald-800"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6 sm:gap-4">
        {/* Total Series */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500">
            <span>Total Series</span>
            <Tv className="h-4 w-4 text-indigo-600" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
            {stats.totalSeries}
          </div>
          <p className="mt-0.5 text-[11px] text-slate-400">Tracked in library</p>
        </div>

        {/* Total Seasons Watched */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500">
            <span>Seasons Watched</span>
            <TrendingUp className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="mt-2 text-2xl font-bold text-emerald-600 sm:text-3xl">
            {stats.totalSeasonsWatched}
          </div>
          <p className="mt-0.5 text-[11px] text-slate-400">Completed seasons</p>
        </div>

        {/* Continuing */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500">
            <span>Continuing</span>
            <Clock className="h-4 w-4 text-sky-600" />
          </div>
          <div className="mt-2 text-2xl font-bold text-sky-600 sm:text-3xl">
            {stats.continuing}
          </div>
          <p className="mt-0.5 text-[11px] text-slate-400">Awaiting seasons</p>
        </div>

        {/* Ended */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500">
            <span>Ended</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-800 sm:text-3xl">
            {stats.ended}
          </div>
          <p className="mt-0.5 text-[11px] text-slate-400">Finished series</p>
        </div>

        {/* Canceled */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500">
            <span>Canceled</span>
            <XCircle className="h-4 w-4 text-rose-600" />
          </div>
          <div className="mt-2 text-2xl font-bold text-rose-600 sm:text-3xl">
            {stats.canceled}
          </div>
          <p className="mt-0.5 text-[11px] text-slate-400">Discontinued</p>
        </div>
        {/* Unknown */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500">
            <span>Unknown</span>
            <Tv className="h-4 w-4 text-slate-500" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-600 sm:text-3xl">
            {stats.unknown}
          </div>
          <p className="mt-0.5 text-[11px] text-slate-400">Status not known</p>
        </div>
      </div>

      {/* Control Bar: Search, Filters, Add & Seed Buttons */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Search Input */}
        <div className="relative flex-1">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
            <Search className="h-4 w-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search TV series or notes (e.g., 'Silo', 'August 2026')..."
            className="block w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 shadow-xs transition focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleSeedData}
            disabled={isSeeding}
            title="Import all 35 TV shows to your account"
            className="inline-flex items-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50 px-3.5 py-2.5 text-xs font-semibold text-indigo-700 shadow-xs transition hover:bg-indigo-100 disabled:opacity-50"
          >
            {isSeeding ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4 text-indigo-600" />
            )}
            <span>Sync 35 Series</span>
          </button>

          <button
            onClick={() => openModal()}
            className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-600"
          >
            <Plus className="h-4 w-4" />
            <span>Add Series</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3 text-sm">
        <button
          onClick={() => setActiveTab("all")}
          className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
            activeTab === "all"
              ? "bg-slate-900 text-white font-semibold shadow-xs"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          All ({stats.totalSeries})
        </button>
        <button
          onClick={() => setActiveTab("continuing")}
          className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
            activeTab === "continuing"
              ? "bg-sky-100 text-sky-800 font-semibold border border-sky-300 shadow-xs"
              : "text-slate-600 hover:text-sky-700 hover:bg-sky-50"
          }`}
        >
          Continuing ({stats.continuing})
        </button>
        <button
          onClick={() => setActiveTab("ended")}
          className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
            activeTab === "ended"
              ? "bg-emerald-100 text-emerald-800 font-semibold border border-emerald-300 shadow-xs"
              : "text-slate-600 hover:text-emerald-700 hover:bg-emerald-50"
          }`}
        >
          Ended ({stats.ended})
        </button>
        <button
          onClick={() => setActiveTab("canceled")}
          className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
            activeTab === "canceled"
              ? "bg-rose-100 text-rose-800 font-semibold border border-rose-300 shadow-xs"
              : "text-slate-600 hover:text-rose-700 hover:bg-rose-50"
          }`}
        >
          Canceled ({stats.canceled})
        </button>
        <button
          onClick={() => setActiveTab("unknown")}
          className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
            activeTab === "unknown"
              ? "bg-slate-200 text-slate-800 font-semibold border border-slate-300 shadow-xs"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          Unknown ({stats.unknown})
        </button>
      </div>

      {/* Series Grid */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-500 space-y-3">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
          <p className="text-sm font-medium">Loading your TV series...</p>
        </div>
      ) : filteredSeries.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center space-y-4 shadow-xs">
          <Tv className="mx-auto h-12 w-12 text-slate-400" />
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-slate-900">
              No TV series found
            </h3>
            <p className="text-sm text-slate-500">
              {seriesList.length === 0
                ? "Your watchlist is empty. Click 'Sync 35 Series' to load your complete list!"
                : "No series match your current filter or search criteria."}
            </p>
          </div>
          {seriesList.length === 0 && (
            <button
              onClick={handleSeedData}
              disabled={isSeeding}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
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
            const total = item.totalSeasons ?? 0;
            const progressPercent = Math.min(
              100,
              Math.round((watched / Math.max(1, total)) * 100)
            );

            return (
              <div
                key={item._id}
                className="group flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs transition hover:border-slate-300 hover:shadow-md"
              >
                {/* Header & Status */}
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-slate-900 text-base leading-snug line-clamp-2">
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
                        className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold border cursor-pointer focus:outline-none transition ${
                          item.status === "continuing"
                            ? "bg-sky-50 border-sky-200 text-sky-700"
                            : item.status === "ended"
                            ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                              : item.status === "canceled"
                                ? "bg-rose-50 border-rose-200 text-rose-700"
                                : "bg-slate-100 border-slate-300 text-slate-700"
                        }`}
                      >
                        <option value="continuing" className="bg-white text-slate-900">
                          Continuing
                        </option>
                        <option value="ended" className="bg-white text-slate-900">
                          Ended
                        </option>
                        <option value="canceled" className="bg-white text-slate-900">
                          Canceled
                        </option>
                        <option value="unknown" className="bg-white text-slate-900">
                          Unknown
                        </option>
                      </select>
                    </div>
                  </div>

                  {/* Notes / Release Info */}
                  {item.notes ? (
                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed rounded-lg bg-slate-50 p-2.5 border border-slate-200/70">
                      {item.notes}
                    </p>
                  ) : (
                    <p className="text-xs text-slate-400 italic">No notes added</p>
                  )}
                </div>

                {/* Season Counter & Actions */}
                <div className="mt-5 space-y-3 pt-3 border-t border-slate-100">
                  {/* Progress Header */}
                  <div className="flex items-center justify-between text-xs text-slate-600">
                    <span>
                      Seasons watched:{" "}
                      <strong className="text-slate-900 font-semibold">{watched}</strong>{" "}
                      of {total} available
                      {total === 1 ? " season" : " seasons"}
                    </span>
                    <span className="font-mono text-[11px] text-slate-500 font-medium">
                      {progressPercent}%
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 rounded-full ${
                        item.status === "ended"
                          ? "bg-emerald-600"
                          : item.status === "canceled"
                          ? "bg-rose-600"
                          : item.status === "unknown"
                          ? "bg-slate-500"
                          : "bg-indigo-600"
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
                        className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-700 shadow-2xs transition hover:bg-slate-100 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <ChevronDown className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() =>
                          handleSeasonChange(item._id, 1, watched, total)
                        }
                        disabled={watched >= total}
                        title="Increment watched season"
                        className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-700 shadow-2xs transition hover:bg-indigo-600 hover:text-white hover:border-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <ChevronUp className="h-3.5 w-3.5" />
                      </button>
                      <span className="text-xs text-slate-500 pl-1 font-medium">
                        +1 Season
                      </span>
                    </div>

                    {/* Edit & Delete */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openModal(item)}
                        title="Edit Series"
                        className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(item._id, item.title)}
                        title="Delete Series"
                        className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl sm:p-8">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-700"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-xl font-bold text-slate-900 mb-5">
              {editingSeries ? "Edit TV Series" : "Add TV Series"}
            </h3>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                  Series Title *
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Silo, House of the Dragon"
                  className="w-full rounded-xl border border-slate-300 bg-slate-50/50 py-2.5 px-3.5 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600"
                />
              </div>

              {/* Seasons: Watched & Available */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                    Seasons Watched
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={formTotalSeasons}
                    value={formSeasonsWatched}
                    onChange={(e) =>
                      setFormSeasonsWatched(parseInt(e.target.value) || 0)
                    }
                    className="w-full rounded-xl border border-slate-300 bg-slate-50/50 py-2 px-3 text-sm text-slate-900 focus:bg-white focus:border-indigo-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                    Available Seasons
                  </label>
                  <input
                    type="number"
                    min={formSeasonsWatched}
                    value={formTotalSeasons}
                    onChange={(e) =>
                      setFormTotalSeasons(parseInt(e.target.value) || 0)
                    }
                    className="w-full rounded-xl border border-slate-300 bg-slate-50/50 py-2 px-3 text-sm text-slate-900 focus:bg-white focus:border-indigo-600 focus:outline-none"
                  />
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                  Show Status
                </label>
                <select
                  value={formStatus}
                  onChange={(e) =>
                    setFormStatus(e.target.value as SeriesStatus)
                  }
                  className="w-full rounded-xl border border-slate-300 bg-slate-50/50 py-2.5 px-3 text-sm text-slate-900 focus:bg-white focus:border-indigo-600 focus:outline-none"
                >
                  <option value="continuing">Continuing (Ongoing / Renewed)</option>
                  <option value="ended">Ended (Completed)</option>
                  <option value="canceled">Canceled (Discontinued)</option>
                  <option value="unknown">Unknown</option>
                </select>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                  Notes & Release Info
                </label>
                <textarea
                  rows={3}
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="e.g. Season 2 to release August 2026, awaiting final season..."
                  className="w-full rounded-xl border border-slate-300 bg-slate-50/50 py-2 px-3 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:border-indigo-600 focus:outline-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:opacity-50"
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
