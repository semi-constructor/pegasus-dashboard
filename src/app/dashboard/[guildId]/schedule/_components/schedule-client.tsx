"use client";

import { useState } from "react";
import { Calendar, Clock, Gift } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { createScheduledGiveaway, createScheduledTrivia } from "../actions";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

export default function ScheduleClient({
  guildId,
  channels,
}: {
  guildId: string;
  channels: any[];
}) {
  const t = useTranslations('guildSchedule');
  const [loading, setLoading] = useState(false);
  const [prize, setPrize] = useState("");
  const [description, setDescription] = useState("");
  const [channelId, setChannelId] = useState(channels[0]?.id || "");
  const [winnerCount, setWinnerCount] = useState(1);
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [durationValue, setDurationValue] = useState(1);
  const [durationUnit, setDurationUnit] = useState(60 * 60 * 1000); // Default: hours in ms

  // Trivia states
  const [activeTab, setActiveTab] = useState<"giveaways" | "trivia">("giveaways");
  const [triviaType, setTriviaType] = useState<"preset" | "custom">("preset");
  const [preset, setPreset] = useState<"general" | "gaming" | "programming" | "science" | "history" | "movies">("general");
  const [questionCount, setQuestionCount] = useState(5);
  const [customQuestions, setCustomQuestions] = useState([{ question: "", options: ["", "", "", ""], correctIndex: 0 }]);
  const [rewardXp, setRewardXp] = useState(0);
  const [rewardCoins, setRewardCoins] = useState(0);

  const tabs = [
    { id: "giveaways", label: "Giveaways", icon: Gift },
    { id: "trivia", label: "Quests (Trivia)", icon: Calendar }
  ];

  const handleSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prize || !channelId || !startDate || !startTime) {
      toast.error(t('fillAll'));
      return;
    }

    const startDateTime = new Date(`${startDate}T${startTime}`);
    if (startDateTime <= new Date()) {
      toast.error(t('futureTime'));
      return;
    }

    try {
      setLoading(true);
      await createScheduledGiveaway(guildId, {
        prize,
        description,
        channelId,
        duration: durationValue * durationUnit,
        winnerCount,
        startTime: startDateTime.toISOString(),
      });
      toast.success(t('success'));
      
      // Reset form
      setPrize("");
      setDescription("");
      setStartDate("");
      setStartTime("");
    } catch (error: any) {
      toast.error(error.message || t('fail'));
    } finally {
      setLoading(false);
    }
  };

  const handleScheduleTrivia = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!channelId || !startDate || !startTime) {
      toast.error("Please fill in all required trivia fields!");
      return;
    }

    if (triviaType === "custom") {
      if (customQuestions.length === 0) {
        toast.error("Please add at least one question!");
        return;
      }
      for (const q of customQuestions) {
        if (!q.question || q.options.some((o) => !o)) {
          toast.error("Please fill in all question fields and options!");
          return;
        }
      }
    }

    const startDateTime = new Date(`${startDate}T${startTime}`);
    if (startDateTime <= new Date()) {
      toast.error(t('futureTime'));
      return;
    }

    try {
      setLoading(true);
      await createScheduledTrivia(guildId, {
        channelId,
        scheduledAt: startDateTime.toISOString(),
        rewardXp,
        rewardCoins,
        type: triviaType,
        preset: triviaType === "preset" ? preset : undefined,
        questionCount: triviaType === "preset" ? questionCount : undefined,
        questions: triviaType === "custom" ? customQuestions : undefined,
      });
      toast.success("Trivia game scheduled successfully!");
      
      // Reset form
      setCustomQuestions([{ question: "", options: ["", "", "", ""], correctIndex: 0 }]);
      setStartDate("");
      setStartTime("");
    } catch (error: any) {
      toast.error(error.message || "Failed to schedule trivia game.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-br from-foreground to-foreground/60 tracking-tight flex items-center gap-4">
          <div className="p-3 bg-foreground/5 rounded-2xl border border-border backdrop-blur-md">
            <Calendar className="w-8 h-8 text-indigo-400" />
          </div>
          {t('title')}
        </h1>
        <p className="text-foreground/40 mt-3 text-sm">{t('description')}</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-foreground/5 border border-border rounded-2xl shadow-2xl relative overflow-hidden flex flex-col backdrop-blur-md"
      >
        <div className="flex overflow-x-auto items-end bg-background/40 pt-3 sm:pt-4 px-2 sm:px-4 border-b border-border [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden shrink-0 touch-pan-x">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "group relative flex items-center gap-2 px-3.5 sm:px-6 py-2.5 sm:py-3 transition-all duration-300 font-bold text-xs sm:text-sm tracking-wide rounded-t-xl border-t border-x -mb-[1px] shrink-0 whitespace-nowrap",
                activeTab === tab.id
                  ? "bg-foreground/10 border-border text-foreground z-10 backdrop-blur-xl"
                  : "bg-transparent border-transparent text-foreground/40 hover:bg-foreground/5 hover:text-foreground/80 hover:border-border z-0"
              )}
            >
              <tab.icon className={cn("w-4 h-4 transition-colors shrink-0", activeTab === tab.id ? "text-foreground" : "text-foreground/40 group-hover:text-foreground/60")} />
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute -bottom-[1px] left-0 right-0 h-[2px] bg-[#0c0c0c]" />
              )}
            </button>
          ))}
        </div>
        
        <div className="p-3 sm:p-6 md:p-8 relative flex-1 overflow-hidden">
        
        {activeTab === "giveaways" && (
        <form onSubmit={handleSchedule} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground/80">{t('prize')}</label>
              <input
                type="text"
                value={prize}
                onChange={(e) => setPrize(e.target.value)}
                placeholder="e.g. 1 Month Nitro"
                className="w-full bg-background/40 border border-border rounded-lg p-3 text-sm focus:outline-none focus:border-indigo-500/50 transition-colors"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground/80">{t('channel')}</label>
              <select
                value={channelId}
                onChange={(e) => setChannelId(e.target.value)}
                className="w-full min-h-[40px] px-3 py-2 bg-background/40 border border-border rounded-lg text-sm uppercase text-foreground [&>option]:bg-neutral-900 outline-none focus-visible:ring-1 focus-visible:ring-primary/50 transition-all"
                required
              >
                {channels.map((c) => (
                  <option key={c.id} value={c.id}>#{c.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-foreground/80">{t('desc')}</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Optional details about the giveaway..."
                className="w-full bg-background/40 border border-border rounded-lg p-3 text-sm focus:outline-none focus:border-indigo-500/50 transition-colors h-24"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground/80">{t('startDate')}</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-background/40 border border-border rounded-lg p-3 text-sm focus:outline-none focus:border-indigo-500/50 transition-colors [color-scheme:dark]"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground/80">{t('startTime')}</label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full bg-background/40 border border-border rounded-lg p-3 text-sm focus:outline-none focus:border-indigo-500/50 transition-colors [color-scheme:dark]"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground/80">{t('duration')}</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  min="1"
                  value={durationValue}
                  onChange={(e) => setDurationValue(parseInt(e.target.value) || 1)}
                  className="w-full bg-background/40 border border-border rounded-lg p-3 text-sm focus:outline-none focus:border-indigo-500/50 transition-colors"
                  required
                />
                <select
                  value={durationUnit}
                  onChange={(e) => setDurationUnit(parseInt(e.target.value))}
                  className="w-full min-h-[40px] px-3 py-2 bg-background/40 border border-border rounded-lg text-sm uppercase text-foreground [&>option]:bg-neutral-900 outline-none focus-visible:ring-1 focus-visible:ring-primary/50 transition-all"
                >
                  <option value={60 * 1000}>{t('units.minutes')}</option>
                  <option value={60 * 60 * 1000}>{t('units.hours')}</option>
                  <option value={24 * 60 * 60 * 1000}>{t('units.days')}</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground/80">{t('winners')}</label>
              <input
                type="number"
                min="1"
                max="20"
                value={winnerCount}
                onChange={(e) => setWinnerCount(parseInt(e.target.value) || 1)}
                className="w-full bg-background/40 border border-border rounded-lg p-3 text-sm focus:outline-none focus:border-indigo-500/50 transition-colors"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-500 hover:bg-indigo-600 text-foreground font-medium py-3 rounded-xl transition-all shadow-[0_0_20px_rgba(99,102,241,0.2)] hover:shadow-[0_0_30px_rgba(99,102,241,0.4)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-border border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Clock className="w-5 h-5" />
                {t('btn')}
              </>
            )}
          </button>
        </form>
        )}

        {activeTab === "trivia" && (
        <form onSubmit={handleScheduleTrivia} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground/80">{t('type') || 'Type'}</label>
              <select
                value={triviaType}
                onChange={(e) => setTriviaType(e.target.value as any)}
                className="w-full min-h-[40px] px-3 py-2 bg-background/40 border border-border rounded-lg text-sm text-foreground [&>option]:bg-neutral-900 outline-none focus-visible:ring-1 focus-visible:ring-primary/50 transition-all"
              >
                <option value="preset">{t('preset') || 'Preset'}</option>
                <option value="custom">{t('custom') || 'Custom'}</option>
              </select>
            </div>

            {triviaType === "preset" ? (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground/80">{t('preset') || 'Preset Category'}</label>
                  <select
                    value={preset}
                    onChange={(e) => setPreset(e.target.value as any)}
                    className="w-full min-h-[40px] px-3 py-2 bg-background/40 border border-border rounded-lg text-sm text-foreground [&>option]:bg-neutral-900 outline-none focus-visible:ring-1 focus-visible:ring-primary/50 transition-all"
                  >
                    <option value="general">{t('general') || 'General Knowledge'}</option>
                    <option value="gaming">{t('gaming') || 'Gaming'}</option>
                    <option value="programming">{t('programming') || 'Programming'}</option>
                    <option value="science">{t('science') || 'Science'}</option>
                    <option value="history">{t('history') || 'History'}</option>
                    <option value="movies">{t('movies') || 'Movies'}</option>
                  </select>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-foreground/80">{t('questionCount') || 'Question Count'} (Max 25)</label>
                  <input
                    type="number"
                    min="1"
                    max="25"
                    value={questionCount}
                    onChange={(e) => setQuestionCount(parseInt(e.target.value) || 1)}
                    className="w-full bg-background/40 border border-border rounded-lg p-3 text-sm focus:outline-none focus:border-indigo-500/50 transition-colors"
                  />
                </div>
              </>
            ) : (
              <div className="md:col-span-2 space-y-4">
                {customQuestions.map((q, qIndex) => (
                  <div key={qIndex} className="p-4 border border-border rounded-xl space-y-4 bg-foreground/5 relative">
                    {customQuestions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => setCustomQuestions(customQuestions.filter((_, i) => i !== qIndex))}
                        className="absolute top-4 right-4 text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded hover:bg-red-500/40"
                      >
                        {t('removeQuestion') || 'Remove'}
                      </button>
                    )}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground/80">Question {qIndex + 1}</label>
                      <input
                        type="text"
                        value={q.question}
                        onChange={(e) => {
                          const newQ = [...customQuestions];
                          newQ[qIndex].question = e.target.value;
                          setCustomQuestions(newQ);
                        }}
                        className="w-full bg-background/40 border border-border rounded-lg p-3 text-sm focus:outline-none focus:border-indigo-500/50 transition-colors"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {q.options.map((opt, optIndex) => (
                        <div key={optIndex} className="space-y-2">
                          <label className="text-sm font-medium text-foreground/80">Option {optIndex + 1}</label>
                          <div className="flex items-center gap-2">
                            <input
                              type="radio"
                              name={`correct_${qIndex}`}
                              checked={q.correctIndex === optIndex}
                              onChange={() => {
                                const newQ = [...customQuestions];
                                newQ[qIndex].correctIndex = optIndex;
                                setCustomQuestions(newQ);
                              }}
                            />
                            <input
                              type="text"
                              value={opt}
                              onChange={(e) => {
                                const newQ = [...customQuestions];
                                newQ[qIndex].options[optIndex] = e.target.value;
                                setCustomQuestions(newQ);
                              }}
                              className="w-full bg-background/40 border border-border rounded-lg p-2 text-sm focus:outline-none focus:border-indigo-500/50 transition-colors"
                              required
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                {customQuestions.length < 25 && (
                  <button
                    type="button"
                    onClick={() => setCustomQuestions([...customQuestions, { question: "", options: ["", "", "", ""], correctIndex: 0 }])}
                    className="w-full border border-dashed border-border p-3 rounded-xl text-sm font-medium text-foreground/60 hover:text-foreground hover:border-border/40 hover:bg-foreground/5 transition-all"
                  >
                    + {t('addQuestion') || 'Add Question'}
                  </button>
                )}
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground/80">{t('channel')}</label>
              <select
                value={channelId}
                onChange={(e) => setChannelId(e.target.value)}
                className="w-full min-h-[40px] px-3 py-2 bg-background/40 border border-border rounded-lg text-sm uppercase text-foreground [&>option]:bg-neutral-900 outline-none focus-visible:ring-1 focus-visible:ring-primary/50 transition-all"
                required
              >
                {channels.map((c) => (
                  <option key={c.id} value={c.id}>#{c.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground/80">{t('startDate')}</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-background/40 border border-border rounded-lg p-3 text-sm focus:outline-none focus:border-indigo-500/50 transition-colors [color-scheme:dark]"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground/80">{t('startTime')}</label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full bg-background/40 border border-border rounded-lg p-3 text-sm focus:outline-none focus:border-indigo-500/50 transition-colors [color-scheme:dark]"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground/80">Reward XP</label>
              <input
                type="number"
                min="0"
                value={rewardXp}
                onChange={(e) => setRewardXp(parseInt(e.target.value) || 0)}
                className="w-full bg-background/40 border border-border rounded-lg p-3 text-sm focus:outline-none focus:border-indigo-500/50 transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground/80">Reward Coins</label>
              <input
                type="number"
                min="0"
                value={rewardCoins}
                onChange={(e) => setRewardCoins(parseInt(e.target.value) || 0)}
                className="w-full bg-background/40 border border-border rounded-lg p-3 text-sm focus:outline-none focus:border-indigo-500/50 transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-500 hover:bg-indigo-600 text-foreground font-medium py-3 rounded-xl transition-all shadow-[0_0_20px_rgba(99,102,241,0.2)] hover:shadow-[0_0_30px_rgba(99,102,241,0.4)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-border border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Clock className="w-5 h-5" />
                Schedule Quest (Trivia)
              </>
            )}
          </button>
        </form>
        )}
        </div>
      </motion.div>
    </div>
  );
}
