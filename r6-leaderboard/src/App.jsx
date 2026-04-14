import { useEffect, useMemo, useState } from "react";

const RANK_MAP = {
  1: { name: "COPPER 5", img: "/ranks/copper_5.png" },
  2: { name: "COPPER 4", img: "/ranks/copper_4.png" },
  3: { name: "COPPER 3", img: "/ranks/copper_3.png" },
  4: { name: "COPPER 2", img: "/ranks/copper_2.png" },
  5: { name: "COPPER 1", img: "/ranks/copper_1.png" },
  6: { name: "BRONZE 5", img: "/ranks/bronze_5.png" },
  7: { name: "BRONZE 4", img: "/ranks/bronze_4.png" },
  8: { name: "BRONZE 3", img: "/ranks/bronze_3.png" },
  9: { name: "BRONZE 2", img: "/ranks/bronze_2.png" },
  10: { name: "BRONZE 1", img: "/ranks/bronze_1.png" },
  11: { name: "SILVER 5", img: "/ranks/silver_5.png" },
  12: { name: "SILVER 4", img: "/ranks/silver_4.png" },
  13: { name: "SILVER 3", img: "/ranks/silver_3.png" },
  14: { name: "SILVER 2", img: "/ranks/silver_2.png" },
  15: { name: "SILVER 1", img: "/ranks/silver_1.png" },
  16: { name: "GOLD 5", img: "/ranks/gold_5.png" },
  17: { name: "GOLD 4", img: "/ranks/gold_4.png" },
  18: { name: "GOLD 3", img: "/ranks/gold_3.png" },
  19: { name: "GOLD 2", img: "/ranks/gold_2.png" },
  20: { name: "GOLD 1", img: "/ranks/gold_1.png" },
  21: { name: "PLATINUM 3", img: "/ranks/platinum_3.png" },
  22: { name: "PLATINUM 2", img: "/ranks/platinum_2.png" },
  23: { name: "PLATINUM 1", img: "/ranks/platinum_1.png" },
};

const DEFAULT_PLAYERS = [
  {
    "name": "ElKillerX_X",
    "rank": 16,
    "matches": 127,
    "wins": 62,
    "losses": 65,
    "kills": 598,
    "deaths": 500,
    "headshots": 259,
    "hsPct": 43.3,
    "kd": 1.2,
    "clutches": 25,
    "clutch1v1": 11,
    "clutch1v2": 8,
    "clutch1v3": 2,
    "clutch1v4": 3,
    "clutch1v5": 0,
    "fourKs": 8,
    "aces": 1,
    "badge": "Frag King",
    "title": "Elite Carry Fragger",
    "trait": "Dominates fights and leads in raw impact.",
    "accent": "from-amber-400 to-orange-500"
  },
  {
    "name": "CancamoRVP",
    "rank": 22,
    "matches": 130,
    "wins": 69,
    "losses": 61,
    "kills": 579,
    "deaths": 555,
    "headshots": 222,
    "hsPct": 38.3,
    "kd": 1.04,
    "clutches": 28,
    "clutch1v1": 12,
    "clutch1v2": 7,
    "clutch1v3": 7,
    "clutch1v4": 2,
    "clutch1v5": 0,
    "fourKs": 8,
    "aces": 0,
    "badge": "Clutch King",
    "title": "Clutch Specialist",
    "trait": "Wins impossible rounds under pressure.",
    "accent": "from-fuchsia-400 to-pink-500"
  },
  {
    "name": "Captaincronico",
    "rank": 18,
    "matches": 119,
    "wins": 61,
    "losses": 58,
    "kills": 559,
    "deaths": 494,
    "headshots": 283,
    "hsPct": 50.6,
    "kd": 1.13,
    "clutches": 15,
    "clutch1v1": 9,
    "clutch1v2": 4,
    "clutch1v3": 2,
    "clutch1v4": 0,
    "clutch1v5": 0,
    "fourKs": 9,
    "aces": 1,
    "badge": "Sharpshooter",
    "title": "Precision Leader",
    "trait": "Highly efficient and extremely accurate.",
    "accent": "from-emerald-400 to-cyan-400"
  },
  {
    "name": "GAJ1194",
    "rank": 11,
    "matches": 134,
    "wins": 70,
    "losses": 62,
    "kills": 515,
    "deaths": 574,
    "headshots": 209,
    "hsPct": 40.6,
    "kd": 0.9,
    "clutches": 14,
    "clutch1v1": 10,
    "clutch1v2": 3,
    "clutch1v3": 1,
    "clutch1v4": 0,
    "clutch1v5": 0,
    "fourKs": 5,
    "aces": 2,
    "badge": "Ace Leader",
    "title": "Balanced Impact",
    "trait": "Contributes across all aspects of the game.",
    "accent": "from-violet-400 to-indigo-500"
  },
  {
    "name": "Salarcona",
    "rank": 13,
    "matches": 111,
    "wins": 58,
    "losses": 53,
    "kills": 406,
    "deaths": 464,
    "headshots": 225,
    "hsPct": 55.4,
    "kd": 0.88,
    "clutches": 7,
    "clutch1v1": 6,
    "clutch1v2": 1,
    "clutch1v3": 0,
    "clutch1v4": 0,
    "clutch1v5": 0,
    "fourKs": 1,
    "aces": 0,
    "badge": "Headshot King",
    "title": "Precision Support",
    "trait": "Elite accuracy but low impact.",
    "accent": "from-slate-400 to-zinc-500"
  }
];

const STORAGE_KEY = "r6-squad-board-v2";

const rankStyles = {
  1: "border-emerald-400/60 bg-emerald-500/10",
  2: "border-amber-400/60 bg-amber-500/10",
  3: "border-fuchsia-400/60 bg-fuchsia-500/10",
};

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function formatNumber(value, decimals = 2) {
  return Number(value || 0).toFixed(decimals);
}

function buildExportText(players) {
  return JSON.stringify(players, null, 2);
}

function parseLooseStatBlock(input) {
  const text = input.replace(/\r/g, "");
  const firstLine = text.split("\n")[0]?.trim() || "";
  const name = firstLine.replace(/:$/, "").trim();

  const findNumber = (patterns, fallback = null) => {
    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) {
        const raw = match[1].replace(/,/g, "").trim();
        const parsed = Number(raw);
        if (!Number.isNaN(parsed)) return parsed;
      }
    }
    return fallback;
  };

  const parsed = {
    name,
    rank: findNumber([/\bRank\s*(\d+(?:\.\d+)?)/i]),
    matches: findNumber([/\bMatches\s*(\d+(?:\.\d+)?)/i]),
    wins: findNumber([/\bWins\s*(\d+(?:\.\d+)?)/i]),
    losses: findNumber([/\bLosses\s*(\d+(?:\.\d+)?)/i]),
    kills: findNumber([/\bKills\s*(\d+(?:\.\d+)?)/i]),
    deaths: findNumber([/\bDeaths\s*(\d+(?:\.\d+)?)/i]),
    headshots: findNumber([/\bHeadshots\s*(\d+(?:\.\d+)?)/i]),
    hsPct: findNumber([/\bHS\s*%\s*(\d+(?:\.\d+)?)/i, /\bHS%\s*(\d+(?:\.\d+)?)/i]),
    kd: findNumber([/\bK\/D\s*(\d+(?:\.\d+)?)/i]),
    clutches: findNumber([/\bClutches\s*(\d+(?:\.\d+)?)/i]),
    clutch1v1: findNumber([/\bClutches\s*1v1\s*(\d+(?:\.\d+)?)/i]),
    clutch1v2: findNumber([/\bClutches\s*1v2\s*(\d+(?:\.\d+)?)/i]),
    clutch1v3: findNumber([/\bClutches\s*1v3\s*(\d+(?:\.\d+)?)/i]),
    clutch1v4: findNumber([/\bClutches\s*1v4\s*(\d+(?:\.\d+)?)/i]),
    clutch1v5: findNumber([/\bClutches\s*1v5\s*(\d+(?:\.\d+)?)/i]),
    fourKs: findNumber([/\bKills\s*4K\s*(\d+(?:\.\d+)?)/i, /\b4Ks?\s*(\d+(?:\.\d+)?)/i]),
    aces: findNumber([/\bAces\s*(\d+(?:\.\d+)?)/i]),
  };

  return parsed;
}

function mergePlayer(oldPlayer, update) {
  const merged = { ...oldPlayer };
  Object.entries(update).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== "") {
      merged[key] = value;
    }
  });

  if ((!merged.kd || Number.isNaN(Number(merged.kd))) && merged.kills != null && merged.deaths) {
    merged.kd = Number(merged.kills) / Number(merged.deaths);
  }

  if ((!merged.hsPct || Number.isNaN(Number(merged.hsPct))) && merged.headshots != null && merged.kills) {
    merged.hsPct = (Number(merged.headshots) / Number(merged.kills)) * 100;
  }

  return merged;
}

function withComputedStats(players) {
  const enriched = players.map((player) => {
    const matches = Math.max(1, Number(player.matches || 1));
    const wins = Number(player.wins || 0);
    const losses = Number(player.losses || 0);
    const kills = Number(player.kills || 0);
    const deaths = Number(player.deaths || 0);
    const headshots = Number(player.headshots || 0);
    const clutches = Number(player.clutches || 0);
    const fourKs = Number(player.fourKs || 0);
    const aces = Number(player.aces || 0);
    const hsPct = Number(player.hsPct || 0);
    const kd = Number(player.kd || (deaths ? kills / deaths : 0));

    const rawScore =
      kills * 1 +
      deaths * -0.5 +
      wins * 5 +
      headshots * 0.5 +
      clutches * 7 +
      fourKs * 5 +
      aces * 10;

    const score = rawScore / matches;

    return {
      ...player,
      wins,
      losses,
      kills,
      deaths,
      headshots,
      hsPct,
      kd,
      clutches,
      fourKs,
      aces,
      matches,
      score,
      winRate: wins + losses > 0 ? (wins / (wins + losses)) * 100 : 0,
    };
  });

  const topScore = Math.max(...enriched.map((p) => p.score), 1);

  return enriched
    .sort((a, b) => b.score - a.score)
    .map((player, index) => ({
      ...player,
      leaderboardPosition: index + 1,
      bar: clamp((player.score / topScore) * 100, 20, 100),
    }));
}

function getCategoryLeaders(players) {
  const getTop = (selector) => [...players].sort((a, b) => selector(b) - selector(a))[0];

  const mvp = getTop((p) => p.score);
  const clutch = getTop((p) => p.clutches);
  const frag = getTop((p) => p.kills);
  const hs = getTop((p) => p.hsPct);
  const ace = getTop((p) => p.aces);

  return [
    { label: "MVP", value: mvp?.name || "—", sub: `${formatNumber(mvp?.score || 0)} score/match` },
    { label: "Clutch King", value: clutch?.name || "—", sub: `${clutch?.clutches || 0} clutches` },
    { label: "Frag King", value: frag?.name || "—", sub: `${frag?.kills || 0} kills` },
    { label: "Sharpshooter", value: hs?.name || "—", sub: `${formatNumber(hs?.hsPct || 0, 1)}% HS` },
    { label: "Ace Leader", value: ace?.name || "—", sub: `${ace?.aces || 0} aces` },
  ];
}

export default function R6SquadLeaderboard() {
  const [players, setPlayers] = useState(DEFAULT_PLAYERS);
  const [pasteText, setPasteText] = useState("");
  const [status, setStatus] = useState("Ready.");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setPlayers(JSON.parse(saved));
      }
    } catch {
      setStatus("Could not read saved local data.");
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(players));
    } catch {
      setStatus("Could not save local data.");
    }
  }, [players]);

  const rankedPlayers = useMemo(() => withComputedStats(players), [players]);
  const categoryLeaders = useMemo(() => getCategoryLeaders(rankedPlayers), [rankedPlayers]);
  const mvp = rankedPlayers[0];

  const handleApplyUpdate = () => {
    const parsed = parseLooseStatBlock(pasteText);
    if (!parsed.name) {
      setStatus("Could not identify player name. Start the text with 'PlayerName:'");
      return;
    }

    const existing = players.find((p) => p.name.toLowerCase() === parsed.name.toLowerCase());
    if (!existing) {
      setStatus(`Player '${parsed.name}' not found.`);
      return;
    }

    const updated = players.map((player) =>
      player.name.toLowerCase() === parsed.name.toLowerCase() ? mergePlayer(player, parsed) : player
    );

    setPlayers(updated);
    setStatus(`Updated ${parsed.name} successfully.`);
    setPasteText("");
  };

  const handleReset = () => {
    setPlayers(DEFAULT_PLAYERS);
    localStorage.removeItem(STORAGE_KEY);
    setStatus("Board reset to default season data.");
  };

  const handleExport = async () => {
    const payload = buildExportText(players);
    try {
      await navigator.clipboard.writeText(payload);
      setStatus("Player data copied to clipboard as JSON.");
    } catch {
      setStatus("Could not copy to clipboard. You can still select and copy manually.");
    }
  };

  return (


    <div className="relative min-h-screen overflow-hidden bg-[#06080f] text-white">

      {/* Background Header Image */}
      <img
        src="/header.jpg"
        alt=""
        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-15"
      />

      {/* Dark Overlay (optional but recommended) */}
      <div className="absolute inset-0 bg-[#06080f]/20" />

      {/* Main Content */}
      <div className="relative z-10 p-6 md:p-10">
        <div className="mx-auto max-w-7xl space-y-6">
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#0b1220] via-[#0a0f19] to-[#05070c] p-6 md:p-8 shadow-2xl">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,.12),transparent_28%),radial-gradient(circle_at_left,rgba(59,130,246,.08),transparent_20%)]" />
            <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <div className="mb-2 inline-flex items-center rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-emerald-300">
                  Rainbow Six Siege X · Season Stats · Fair Normalized Ranking
                </div>
                <h1 className="text-3xl font-black tracking-tight md:text-5xl">Squad Performance Board</h1>
                <p className="mt-3 max-w-2xl text-sm text-white/70 md:text-base">
                  Dynamic season leaderboard normalized by matches played. Paste a player summary in text format, update instantly, and keep everything saved locally in your browser.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <div className="text-xs uppercase tracking-[0.2em] text-white/45">Mode</div>
                  <div className="mt-1 text-2xl font-bold">Season</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <div className="text-xs uppercase tracking-[0.2em] text-white/45">Players</div>
                  <div className="mt-1 text-2xl font-bold">{rankedPlayers.length}</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <div className="text-xs uppercase tracking-[0.2em] text-white/45">Top Score</div>
                  <div className="mt-1 text-2xl font-bold">{formatNumber(mvp?.score || 0)}</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <div className="text-xs uppercase tracking-[0.2em] text-white/45">Storage</div>
                  <div className="mt-1 text-sm font-semibold text-white/85">Browser Local</div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-3xl border border-white/10 bg-[#0b111c] p-4 md:p-5 shadow-xl">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold md:text-2xl">Overall Leaderboard</h2>
                  <p className="text-sm text-white/55">Ranked by normalized score per match</p>
                </div>
                <div className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300">
                  Dynamic Board
                </div>
              </div>


              <div className="space-y-4">
                {rankedPlayers.map((player) => {
                  const rankData = RANK_MAP[player.rank] || { name: "UNRANKED", img: "" };

                  return (
                    <div
                      key={player.name}
                      className={`rounded-3xl border p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.06] ${rankStyles[player.leaderboardPosition] || "border-white/10 bg-white/[0.03]"}`}
                    >
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex items-start gap-4">
                          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-black/25 text-xl font-black">
                            #{player.leaderboardPosition}
                          </div>

                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="text-xl font-bold">{player.name}</h3>
                              <span className={`rounded-full bg-gradient-to-r ${player.accent} px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-black`}>
                                {player.badge}
                              </span>
                            </div>

                            <div className="mt-3 flex items-center gap-3">
                              {rankData.img ? (
                                <img
                                  src={rankData.img}
                                  alt={rankData.name}
                                  className="h-12 w-12 object-contain" />
                              ) : null}

                              <div>
                                <div className="text-[10px] uppercase tracking-[0.2em] text-white/40">
                                  Current Rank
                                </div>
                                <div className="text-sm font-bold text-white/85">
                                  {rankData.name}
                                </div>
                              </div>
                            </div>

                            <p className="mt-1 text-sm text-white/65">{player.title}</p>
                            <p className="mt-2 text-sm italic text-white/50">“{player.trait}”</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5 lg:min-w-[520px]">
                          <div className="rounded-2xl border border-white/10 bg-black/20 px-3 py-2">
                            <div className="text-[10px] uppercase tracking-[0.2em] text-white/40">Score/Match</div>
                            <div className="mt-1 text-2xl font-black">{formatNumber(player.score)}</div>
                          </div>
                          <div className="rounded-2xl border border-white/10 bg-black/20 px-3 py-2">
                            <div className="text-[10px] uppercase tracking-[0.2em] text-white/40">Matches</div>
                            <div className="mt-1 text-2xl font-black">{player.matches}</div>
                          </div>
                          <div className="rounded-2xl border border-white/10 bg-black/20 px-3 py-2">
                            <div className="text-[10px] uppercase tracking-[0.2em] text-white/40">W/R</div>
                            <div className="mt-1 text-2xl font-black">{formatNumber(player.winRate, 1)}%</div>
                          </div>
                          <div className="rounded-2xl border border-white/10 bg-black/20 px-3 py-2">
                            <div className="text-[10px] uppercase tracking-[0.2em] text-white/40">K/D</div>
                            <div className="mt-1 text-2xl font-black">{formatNumber(player.kd)}</div>
                          </div>
                          <div className="rounded-2xl border border-white/10 bg-black/20 px-3 py-2">
                            <div className="text-[10px] uppercase tracking-[0.2em] text-white/40">HS%</div>
                            <div className="mt-1 text-2xl font-black">{formatNumber(player.hsPct, 1)}%</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-3xl border border-cyan-400/20 bg-gradient-to-br from-cyan-500/12 to-blue-500/10 p-5 shadow-xl">
                <div className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300">Text Update Console</div>
                <p className="mt-3 text-sm text-white/70">
                  Paste one player summary exactly like the tracker text, then click apply update. The board recalculates automatically.
                </p>
                <textarea
                  value={pasteText}
                  onChange={(e) => setPasteText(e.target.value)}
                  placeholder={`Captaincronico:\nMatches 101\nWins 51\nLosses 50\nKills 467\nDeaths 407\nHeadshots 236\nHS % 50.5%\nK/D 1.15\nClutches 13\nClutches 1v1 9\nClutches 1v2 2\nClutches 1v3 2\nKills 4K 7\nAces 0`}
                  className="mt-4 h-72 w-full rounded-2xl border border-white/10 bg-black/25 p-4 text-sm text-white placeholder:text-white/30 focus:border-cyan-400/40 focus:outline-none" />
                <div className="mt-4 flex flex-wrap gap-3">
                  <button onClick={handleApplyUpdate} className="rounded-2xl bg-cyan-400 px-4 py-3 text-sm font-black text-black transition hover:scale-[1.02]">
                    Apply Update
                  </button>
                  <button onClick={handleExport} className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-bold text-white transition hover:bg-white/[0.08]">
                    Copy JSON Backup
                  </button>
                  <button onClick={handleReset} className="rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm font-bold text-red-200 transition hover:bg-red-500/20">
                    Reset Board
                  </button>
                </div>
                <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/70">Status: {status}</div>
              </div>

              <div className="rounded-3xl border border-amber-400/20 bg-gradient-to-br from-amber-500/12 to-orange-500/10 p-5 shadow-xl">
                <div className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-300">Squad MVP</div>
                <div className="mt-3 flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-black/25 text-3xl">👑</div>
                  <div>
                    <h3 className="text-2xl font-black">{mvp?.name || "—"}</h3>
                    <p className="text-sm text-white/70">Best normalized impact across the season</p>
                  </div>
                </div>
                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                    <div className="text-[10px] uppercase tracking-[0.2em] text-white/40">Score/Match</div>
                    <div className="mt-1 text-2xl font-black">{formatNumber(mvp?.score || 0)}</div>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                    <div className="text-[10px] uppercase tracking-[0.2em] text-white/40">Kills</div>
                    <div className="mt-1 text-2xl font-black">{mvp?.kills || 0}</div>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                    <div className="text-[10px] uppercase tracking-[0.2em] text-white/40">K/D</div>
                    <div className="mt-1 text-2xl font-black">{formatNumber(mvp?.kd || 0)}</div>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                    <div className="text-[10px] uppercase tracking-[0.2em] text-white/40">HS%</div>
                    <div className="mt-1 text-2xl font-black">{formatNumber(mvp?.hsPct || 0, 1)}%</div>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-[#0b111c] p-5 shadow-xl">
                <div className="mb-4">
                  <h3 className="text-xl font-bold">Category Leaders</h3>
                  <p className="text-sm text-white/55">Awards and superlatives</p>
                </div>
                <div className="space-y-3">
                  {categoryLeaders.map((item) => (
                    <div key={item.label} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
                      <div>
                        <div className="text-[10px] uppercase tracking-[0.2em] text-white/40">{item.label}</div>
                        <div className="mt-1 font-bold">{item.value}</div>
                      </div>
                      <div className="text-sm font-semibold text-cyan-300">{item.sub}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-[#0b111c] p-5 shadow-xl">
                <div className="mb-4">
                  <h3 className="text-xl font-bold">Scoring Logic</h3>
                  <p className="text-sm text-white/55">Season totals, normalized for fairness</p>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {[
                    ["Kill", "+1"],
                    ["Death", "-0.5"],
                    ["Win", "+5"],
                    ["Headshot", "+0.5"],
                    ["Clutch", "+7"],
                    ["4K", "+5"],
                    ["Ace", "+10"],
                    ["Ranking Basis", "Score / Match"],
                  ].map(([k, v]) => (
                    <div key={String(k)} className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
                      <div className="text-[10px] uppercase tracking-[0.2em] text-white/40">{k}</div>
                      <div className="mt-1 text-base font-bold">{v}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
          <div className="rounded-3xl border border-white/10 bg-[#0b111c] p-5 shadow-xl">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold md:text-2xl">Player Detail Cards</h2>
                <p className="text-sm text-white/55">Season gameplay summary for each player</p>
              </div>
              <div className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs uppercase tracking-[0.22em] text-white/50">
                Tactical Profiles
              </div>
            </div>


            <div className="grid gap-4 lg:grid-cols-2">
              {rankedPlayers.map((player) => (
                <div key={`${player.name}-detail`} className="rounded-3xl border border-white/10 bg-black/20 p-5">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="text-xs uppercase tracking-[0.25em] text-white/40">Player #{player.leaderboardPosition}</div>
                      <h3 className="mt-1 text-2xl font-black">{player.name}</h3>
                      <p className="mt-1 text-sm text-white/60">{player.title}</p>
                    </div>
                    <div className={`rounded-2xl bg-gradient-to-r ${player.accent} px-4 py-2 text-sm font-black text-black`}>
                      {formatNumber(player.score)} / match
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
                    {[
                      ["Matches", player.matches],
                      ["Kills", player.kills],
                      ["Deaths", player.deaths],
                      ["K/D", formatNumber(player.kd)],
                      ["HS%", `${formatNumber(player.hsPct, 1)}%`],
                      ["Win Rate", `${formatNumber(player.winRate, 1)}%`],
                      ["Clutches", player.clutches],
                      ["4Ks", player.fourKs],
                    ].map(([label, value]) => (
                      <div key={String(label)} className="rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-3">
                        <div className="text-[10px] uppercase tracking-[0.2em] text-white/40">{label}</div>
                        <div className="mt-1 text-lg font-bold">{value}</div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <div className="text-[10px] uppercase tracking-[0.2em] text-white/40">Gameplay Insight</div>
                    <p className="mt-2 text-sm leading-6 text-white/75">{player.trait}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
