import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Pickaxe,
  Sparkles,
  Trophy,
  Volume2,
  RefreshCw,
  Search,
  CheckCircle,
  XCircle,
  Flame,
  Award,
  Zap,
} from 'lucide-react';
import {
  playMinecraftClick,
  playMiningHitSound,
  playLevelUpSound,
  playChestOpenSound,
  playCreeperHiss,
  playVillagerHrmm,
} from '../utils/minecraft-sounds.js';

interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const quizQuestions: QuizQuestion[] = [
  {
    question: 'What is the highest naturally occurring ore tier in Minecraft Survival?',
    options: ['Diamond Ore', 'Ancient Debris / Netherite', 'Emerald Ore', 'Redstone Ore'],
    correctIndex: 1,
    explanation: 'Ancient Debris can be smelted into Netherite scrap in the Nether dimension!',
  },
  {
    question: 'Which tool enchantment allows you to get more diamonds when mining diamond ore?',
    options: ['Silk Touch', 'Efficiency V', 'Fortune III', 'Unbreaking III'],
    correctIndex: 2,
    explanation: 'Fortune III can yield up to 4 diamonds from a single diamond ore block!',
  },
  {
    question: 'How do you cure a Zombie Villager in Minecraft?',
    options: ['Splash Potion of Weakness + Golden Apple', 'Milk Bucket + Honey', 'Totem of Undying', 'Holy Water'],
    correctIndex: 0,
    explanation: 'Throw a Splash Potion of Weakness, then feed them a Golden Apple and wait for the transformation!',
  },
  {
    question: 'What command teleports you back to your claimed home on AnajakSMP?',
    options: ['/spawn', '/sethome', '/home', '/warp wilderness'],
    correctIndex: 2,
    explanation: 'Use /home to teleport back to the location you set with /sethome!',
  },
];

export const FunPage: React.FC = () => {
  // Mining Clicker State
  const [clicks, setClicks] = useState(0);
  const [totalDiamonds, setTotalDiamonds] = useState(0);
  const [blockHealth, setBlockHealth] = useState(10);
  const [pickaxeTier, setPickaxeTier] = useState<'Wood' | 'Stone' | 'Iron' | 'Diamond' | 'Netherite'>('Wood');
  const [miningParticles, setMiningParticles] = useState<{ id: number; x: number; y: number }[]>([]);

  // Wheel State
  const [isSpinning, setIsSpinning] = useState(false);
  const [wheelRotation, setWheelRotation] = useState(0);
  const [wheelPrize, setWheelPrize] = useState<string | null>(null);

  // Skin Lookup State
  const [skinInput, setSkinInput] = useState('Dream');
  const [activeSkinUser, setActiveSkinUser] = useState('Dream');

  // Trivia State
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  // Mining Click Handler
  const handleMineBlock = (e: React.MouseEvent<HTMLButtonElement>) => {
    playMiningHitSound();

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const particleId = Date.now() + Math.random();
    setMiningParticles((prev) => [...prev, { id: particleId, x, y }]);
    setTimeout(() => {
      setMiningParticles((prev) => prev.filter((p) => p.id !== particleId));
    }, 700);

    const damagePerClick = pickaxeTier === 'Netherite' ? 5 : pickaxeTier === 'Diamond' ? 3 : pickaxeTier === 'Iron' ? 2 : 1;
    const newHealth = blockHealth - damagePerClick;

    if (newHealth <= 0) {
      // Block Broken!
      playLevelUpSound();
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#F5C542', '#38bdf8', '#ffffff'],
      });

      const diamondsGained = pickaxeTier === 'Netherite' ? 5 : pickaxeTier === 'Diamond' ? 3 : 1;
      setTotalDiamonds((prev) => prev + diamondsGained);
      setBlockHealth(10);

      // Check Pickaxe Upgrade
      const newTotal = totalDiamonds + diamondsGained;
      if (newTotal >= 50) setPickaxeTier('Netherite');
      else if (newTotal >= 25) setPickaxeTier('Diamond');
      else if (newTotal >= 10) setPickaxeTier('Iron');
      else if (newTotal >= 3) setPickaxeTier('Stone');
    } else {
      setBlockHealth(newHealth);
    }

    setClicks((c) => c + 1);
  };

  // Lucky Wheel Prizes
  const wheelPrizes = [
    { name: '1x Mythic Crate Key', color: '#f5c542', emoji: '🗝️' },
    { name: '50,000 In-Game Coins', color: '#10b981', emoji: '🪙' },
    { name: 'VIP Rank (1 Day Pass)', color: '#3b82f6', emoji: '👑' },
    { name: 'Golden Angel Wings', color: '#ec4899', emoji: '🪽' },
    { name: '10x Diamonds', color: '#06b6d4', emoji: '💎' },
    { name: 'Rotten Flesh (Better Luck!)', color: '#6b7280', emoji: '🧟' },
  ];

  const handleSpinWheel = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setWheelPrize(null);
    playMinecraftClick();

    // Random rotations + landing index
    const prizeIndex = Math.floor(Math.random() * wheelPrizes.length);
    const extraSpins = 5 * 360;
    const sliceDeg = 360 / wheelPrizes.length;
    const targetDeg = wheelRotation + extraSpins + (360 - prizeIndex * sliceDeg - sliceDeg / 2);

    setWheelRotation(targetDeg);

    setTimeout(() => {
      setIsSpinning(false);
      setWheelPrize(wheelPrizes[prizeIndex].name);
      playLevelUpSound();
      confetti({
        particleCount: 80,
        spread: 80,
        origin: { y: 0.6 },
      });
    }, 4000);
  };

  const handleQuizAnswer = (index: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(index);
    playMinecraftClick();

    const isCorrect = index === quizQuestions[currentQIndex].correctIndex;
    if (isCorrect) {
      setQuizScore((s) => s + 1);
      playLevelUpSound();
    }
  };

  const handleNextQuestion = () => {
    setSelectedAnswer(null);
    playMinecraftClick();
    if (currentQIndex + 1 < quizQuestions.length) {
      setCurrentQIndex((i) => i + 1);
    } else {
      setQuizCompleted(true);
      confetti({ particleCount: 60, spread: 70 });
    }
  };

  const restartQuiz = () => {
    setCurrentQIndex(0);
    setSelectedAnswer(null);
    setQuizScore(0);
    setQuizCompleted(false);
    playMinecraftClick();
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
      {/* Hero Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-gold/10 border border-gold/30 text-gold text-xs font-bold uppercase tracking-widest font-heading">
          <Sparkles className="w-3.5 h-3.5 text-gold" />
          <span>Interactive Arcade & Minecraft Playground</span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white font-heading tracking-wide">
          ANAJAKSMP <span className="text-gold">FUN ZONE</span>
        </h1>

        <p className="text-sm sm:text-base text-[#9a9ab0] leading-relaxed">
          Mine blocks, test your luck on the Mystery Wheel, listen to authentic 8-bit Minecraft sounds, and lookup any player&apos;s skin in real-time!
        </p>
      </div>

      {/* Grid: Mining Clicker & Lucky Wheel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Game 1: Diamond Mining Clicker */}
        <div className="rounded-3xl bg-gradient-to-b from-[#181827] to-[#12121d] border border-cyan-500/30 p-6 sm:p-8 space-y-6 flex flex-col justify-between relative overflow-hidden">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold font-heading">
                <Pickaxe className="w-3.5 h-3.5" />
                <span>Mini-Game 1: Block Clicker</span>
              </span>
              <span className="text-xs font-mono text-[#8c8ca0]">
                Tier: <span className="text-gold font-bold">{pickaxeTier} Pickaxe</span>
              </span>
            </div>

            <h3 className="text-2xl font-black text-white font-heading">
              DIAMOND ORE MINER
            </h3>
            <p className="text-xs text-[#a0a0b6]">
              Click the Diamond Ore to mine it! Upgrade your pickaxe from Wood to Netherite as you collect more diamonds.
            </p>
          </div>

          {/* Interactive Block Visual */}
          <div className="flex flex-col items-center justify-center py-6 space-y-4">
            <div className="relative">
              {/* Flying particles */}
              {miningParticles.map((p) => (
                <div
                  key={p.id}
                  style={{ left: `${p.x}px`, top: `${p.y}px` }}
                  className="absolute pointer-events-none text-sm font-bold text-cyan-300 animate-bounce"
                >
                  +1 💎
                </div>
              ))}

              <button
                onClick={handleMineBlock}
                className="w-40 h-40 sm:w-48 sm:h-48 rounded-2xl bg-[#2e3740] border-4 border-[#4f5d6c] shadow-[0_10px_0_#1a2026] active:translate-y-2 active:shadow-none transition-all flex flex-col items-center justify-center p-4 group relative overflow-hidden select-none cursor-pointer"
                aria-label="Mine Diamond Block"
              >
                {/* Ore texture overlay */}
                <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_15%,transparent_16%)] bg-[size:24px_24px] opacity-60" />
                <div className="relative z-10 flex flex-col items-center space-y-2">
                  <span className="text-5xl group-hover:scale-110 transition-transform">💎</span>
                  <span className="text-xs text-white font-black font-heading">
                    DIAMOND ORE
                  </span>
                </div>

                {/* Health Crack Overlay */}
                <div
                  className="absolute bottom-0 left-0 right-0 bg-red-500/20 transition-all pointer-events-none"
                  style={{ height: `${(10 - blockHealth) * 10}%` }}
                />
              </button>
            </div>

            {/* Health Bar */}
            <div className="w-48 space-y-1">
              <div className="flex justify-between text-[11px] font-mono text-[#8c8ca0]">
                <span>Block Durability</span>
                <span className="text-cyan-400 font-bold">{blockHealth} / 10</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-[#1e1e2d] overflow-hidden border border-[#2e2e42]">
                <div
                  className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-150"
                  style={{ width: `${(blockHealth / 10) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Stats Footer */}
          <div className="pt-4 border-t border-cyan-500/20 grid grid-cols-2 gap-4 text-center">
            <div className="p-3 rounded-xl bg-[#141422] border border-[#232335]">
              <span className="text-[10px] text-[#8c8ca0] block">TOTAL CLICKS</span>
              <span className="text-lg font-black text-white">{clicks}</span>
            </div>
            <div className="p-3 rounded-xl bg-[#141422] border border-[#232335]">
              <span className="text-[10px] text-[#8c8ca0] block">DIAMONDS MINED</span>
              <span className="text-lg font-black text-cyan-400">{totalDiamonds} 💎</span>
            </div>
          </div>
        </div>

        {/* Game 2: Lucky Wheel Spinner */}
        <div className="rounded-3xl bg-gradient-to-b from-[#191828] to-[#12121d] border border-gold/30 p-6 sm:p-8 space-y-6 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-gold/10 border border-gold/30 text-gold text-xs font-bold font-heading">
                <Trophy className="w-3.5 h-3.5" />
                <span>Mini-Game 2: Lucky Spinner</span>
              </span>
              <span className="text-xs font-mono text-gold font-bold">100% Free Fun</span>
            </div>

            <h3 className="text-2xl font-black text-white font-heading">
              LUCKY ANAJAK WHEEL
            </h3>
            <p className="text-xs text-[#a0a0b6]">
              Spin the mystical survival wheel! Test your luck and see what mythical crate drops or ranks you can hit.
            </p>
          </div>

          {/* Wheel Display */}
          <div className="flex flex-col items-center justify-center py-4 space-y-6">
            <div className="relative">
              {/* Pointer indicator */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[20px] border-t-gold drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" />

              {/* Wheel element */}
              <div
                className="w-56 h-56 rounded-full border-4 border-gold/60 shadow-[0_0_25px_rgba(245,197,66,0.25)] relative overflow-hidden transition-transform duration-[4000ms] ease-out flex items-center justify-center bg-[#181826]"
                style={{
                  transform: `rotate(${wheelRotation}deg)`,
                }}
              >
                {/* 6 Slices */}
                {wheelPrizes.map((p, idx) => {
                  const rotation = idx * 60;
                  return (
                    <div
                      key={idx}
                      className="absolute w-full h-full text-center pt-2"
                      style={{
                        transform: `rotate(${rotation}deg)`,
                        transformOrigin: '50% 50%',
                      }}
                    >
                      <span className="text-2xl block">{p.emoji}</span>
                      <span className="text-[9px] font-bold text-white/90 drop-shadow">
                        {p.name.split(' ')[0]}
                      </span>
                    </div>
                  );
                })}

                {/* Center Hub */}
                <div className="w-14 h-14 rounded-full bg-[#12121d] border-2 border-gold flex items-center justify-center z-10 shadow-lg">
                  <Zap className="w-6 h-6 text-gold fill-gold" />
                </div>
              </div>
            </div>

            {/* Winning Prize Display */}
            {wheelPrize && (
              <div className="p-3 rounded-xl bg-gold/15 border border-gold/40 text-center animate-bounce">
                <span className="text-xs text-[#a0a0b8] block">YOU WON:</span>
                <span className="text-sm font-black text-gold font-heading">
                  🎉 {wheelPrize}!
                </span>
              </div>
            )}

            <button
              onClick={handleSpinWheel}
              disabled={isSpinning}
              className={`gold-gradient-btn px-8 py-3 rounded-xl font-heading text-xs font-black tracking-wider uppercase flex items-center space-x-2 ${
                isSpinning ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 active:scale-95'
              }`}
            >
              <RefreshCw className={`w-4 h-4 ${isSpinning ? 'animate-spin' : ''}`} />
              <span>{isSpinning ? 'SPINNING WHEEL...' : 'SPIN THE WHEEL!'}</span>
            </button>
          </div>

          <div className="pt-4 border-t border-gold/20 text-center text-xs text-[#8c8ca0] font-mono">
            Unlimited free spins for AnajakSMP players!
          </div>
        </div>
      </div>

      {/* Interactive Soundboard & Trivia Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Feature 3: Minecraft Soundboard */}
        <div className="rounded-3xl bg-gradient-to-b from-[#181827] to-[#12121d] border border-purple-500/30 p-6 sm:p-8 space-y-6">
          <div className="space-y-2">
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-bold font-heading">
              <Volume2 className="w-3.5 h-3.5" />
              <span>Feature 3: 8-Bit Web Audio Jukebox</span>
            </span>
            <h3 className="text-2xl font-black text-white font-heading">
              MINECRAFT SOUNDBOARD
            </h3>
            <p className="text-xs text-[#a0a0b6]">
              Synthesized real-time Minecraft sound effects generated with the Web Audio API with zero external audio assets!
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { name: 'Level Up Chime', emoji: '🔔', play: playLevelUpSound, desc: 'Exp arpeggio' },
              { name: 'Mine Hit', emoji: '⛏️', play: playMiningHitSound, desc: 'Pickaxe punch' },
              { name: 'Chest Open', emoji: '📦', play: playChestOpenSound, desc: 'Loot crate' },
              { name: 'Creeper Hiss', emoji: '💥', play: playCreeperHiss, desc: 'Tssss... BOOM' },
              { name: 'Villager Hrmm', emoji: '👨‍🌾', play: playVillagerHrmm, desc: 'Emerald trade' },
              { name: 'Menu Click', emoji: '🖱️', play: playMinecraftClick, desc: 'Classic button' },
            ].map((sound, i) => (
              <button
                key={i}
                onClick={sound.play}
                className="p-4 rounded-2xl bg-[#141422] border border-[#28283e] hover:border-purple-400 hover:scale-105 active:scale-95 transition-all text-center space-y-1 group"
              >
                <span className="text-2xl block group-hover:scale-110 transition-transform">
                  {sound.emoji}
                </span>
                <span className="text-xs font-black text-white font-heading block">
                  {sound.name}
                </span>
                <span className="text-[10px] text-[#7d7d94] font-mono block">
                  {sound.desc}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Feature 4: Skin & Avatar 3D Viewer */}
        <div className="rounded-3xl bg-gradient-to-b from-[#181827] to-[#12121d] border border-emerald-500/30 p-6 sm:p-8 space-y-6 flex flex-col justify-between">
          <div className="space-y-2">
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold font-heading">
              <Search className="w-3.5 h-3.5" />
              <span>Feature 4: Live Player Skin Viewer</span>
            </span>
            <h3 className="text-2xl font-black text-white font-heading">
              SKIN & AVATAR VIEWER
            </h3>
            <p className="text-xs text-[#a0a0b6]">
              Type your own Minecraft Java username to preview your avatar skin and head bust live!
            </p>
          </div>

          {/* Search Box */}
          <div className="flex space-x-2">
            <input
              type="text"
              value={skinInput}
              onChange={(e) => setSkinInput(e.target.value)}
              placeholder="Minecraft username (e.g. Dream)..."
              className="flex-1 bg-[#131320] border border-[#2b2b40] focus:border-emerald-500 rounded-xl px-4 py-2 text-xs text-white outline-none font-mono"
            />
            <button
              onClick={() => {
                if (skinInput.trim()) {
                  setActiveSkinUser(skinInput.trim());
                  playMinecraftClick();
                }
              }}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-heading text-xs font-bold transition-colors"
            >
              Lookup
            </button>
          </div>

          {/* Renders Box */}
          <div className="p-4 rounded-2xl bg-[#131320] border border-[#252538] flex items-center justify-around">
            {/* Skin Head */}
            <div className="text-center space-y-2">
              <img
                src={`https://mc-heads.net/avatar/${activeSkinUser}/96`}
                alt={`${activeSkinUser} Avatar`}
                className="w-20 h-20 rounded-xl border border-[#3b3b55] mx-auto pixelated bg-[#1c1c2a]"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://mc-heads.net/avatar/Steve/96';
                }}
              />
              <span className="text-[11px] font-mono text-[#8c8ca0] block">Head Bust</span>
            </div>

            {/* Full Body 3D Render */}
            <div className="text-center space-y-2">
              <img
                src={`https://mc-heads.net/body/${activeSkinUser}/160`}
                alt={`${activeSkinUser} Body`}
                className="h-32 object-contain mx-auto pixelated filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.6)]"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://mc-heads.net/body/Steve/160';
                }}
              />
              <span className="text-[11px] font-heading text-emerald-400 font-bold block">
                {activeSkinUser}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Feature 5: Minecraft Trivia Quiz */}
      <div className="rounded-3xl bg-gradient-to-r from-[#171725] via-[#1a1a2b] to-[#171725] border border-gold/30 p-8 sm:p-10 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="inline-flex items-center space-x-1.5 px-3 py-0.5 rounded-full bg-gold/15 text-gold text-xs font-bold font-heading uppercase">
              <Award className="w-3.5 h-3.5" />
              <span>Feature 5: Minecraft Trivia Quiz</span>
            </span>
            <h3 className="text-2xl font-black text-white font-heading">
              HOW WELL DO YOU KNOW SURVIVAL?
            </h3>
          </div>

          <div className="text-xs font-mono text-gold bg-[#11111a] px-3 py-1.5 rounded-xl border border-[#28283c]">
            Score: <span className="font-bold text-base text-white">{quizScore}</span> / {quizQuestions.length}
          </div>
        </div>

        {!quizCompleted ? (
          <div className="space-y-6 max-w-2xl">
            <div className="flex items-center justify-between text-xs text-[#8c8ca0] font-mono">
              <span>Question {currentQIndex + 1} of {quizQuestions.length}</span>
            </div>

            <h4 className="text-lg font-bold text-white font-heading">
              {quizQuestions[currentQIndex].question}
            </h4>

            {/* Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {quizQuestions[currentQIndex].options.map((opt, i) => {
                let btnStyle = 'bg-[#151522] border-[#29293e] text-white hover:border-gold/50';
                if (selectedAnswer !== null) {
                  if (i === quizQuestions[currentQIndex].correctIndex) {
                    btnStyle = 'bg-status-success/20 border-status-success text-status-success';
                  } else if (i === selectedAnswer) {
                    btnStyle = 'bg-status-error/20 border-status-error text-status-error';
                  } else {
                    btnStyle = 'opacity-40 bg-[#151522] border-[#29293e] text-white';
                  }
                }
                return (
                  <button
                    key={i}
                    onClick={() => handleQuizAnswer(i)}
                    className={`p-3.5 rounded-xl border text-left text-xs font-semibold transition-all flex items-center justify-between ${btnStyle}`}
                  >
                    <span>{opt}</span>
                    {selectedAnswer !== null && i === quizQuestions[currentQIndex].correctIndex && (
                      <CheckCircle className="w-4 h-4 text-status-success shrink-0" />
                    )}
                    {selectedAnswer === i && i !== quizQuestions[currentQIndex].correctIndex && (
                      <XCircle className="w-4 h-4 text-status-error shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation & Next */}
            {selectedAnswer !== null && (
              <div className="p-4 rounded-xl bg-[#141420] border border-[#252538] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <p className="text-xs text-[#b8b8cc]">
                  💡 <span className="font-semibold text-white">Explanation:</span>{' '}
                  {quizQuestions[currentQIndex].explanation}
                </p>
                <button
                  onClick={handleNextQuestion}
                  className="gold-gradient-btn px-5 py-2 rounded-xl text-xs font-heading font-black shrink-0"
                >
                  {currentQIndex + 1 < quizQuestions.length ? 'NEXT QUESTION →' : 'SEE RESULTS 🎉'}
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-6 space-y-4 max-w-md mx-auto">
            <span className="text-4xl block">🏆</span>
            <h4 className="text-xl font-black text-white font-heading">
              QUIZ COMPLETED!
            </h4>
            <p className="text-xs text-[#a0a0b8]">
              You scored <span className="text-gold font-bold text-sm">{quizScore} / {quizQuestions.length}</span>!
              {quizScore === quizQuestions.length
                ? ' 🌟 Perfect score! You are a certified AnajakSMP Veteran!'
                : ' Great job! Head in-game to put your knowledge to the test!'}
            </p>
            <button
              onClick={restartQuiz}
              className="gold-gradient-btn px-6 py-2.5 rounded-xl font-heading text-xs font-bold"
            >
              PLAY AGAIN 🔄
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
