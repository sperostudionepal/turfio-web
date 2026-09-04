import { useState, useRef } from 'react';
import { ArrowRight, ArrowLeft, Check, Sparkles, User, Calendar, MapPin, Activity, Trophy, Clock, Flame, Navigation, Shield, Footprints, Users, ChevronDown, X, AtSign, Hand, Compass, Target, Zap } from 'lucide-react';

function OnboardingPage({ onComplete, onClose, userData = {} }) {
  const [step, setStep] = useState(1);

  // Step 1 Form Data - Personal Details
  const randomSuffix = useRef(Math.floor(1000 + Math.random() * 9000)).current;
  const [username, setUsername] = useState(userData.firstName ? `${userData.firstName.toLowerCase().replace(/[^a-z0-9]/g, '')}${randomSuffix}` : `baller${randomSuffix}`);
  const [dob, setDob] = useState('2000-01-01');
  const [gender, setGender] = useState('Male');
  const [city, setCity] = useState('Kathmandu');
  const [preferredFoot, setPreferredFoot] = useState('Right');

  // Step 2 Form Data - Player Profile & Style
  const [position, setPosition] = useState('Midfielder');
  const [skillLevel, setSkillLevel] = useState('Weekend Warrior');
  const [playingStyle, setPlayingStyle] = useState(['Playmaker', 'Team Player']);
  const [matchType, setMatchType] = useState('5v5');
  const [playFrequency, setPlayFrequency] = useState('2-3 times/per week');

  // Step 3 Form Data - Game Customization
  const [preferredTime, setPreferredTime] = useState(['Evening']);
  const [travelDistance, setTravelDistance] = useState('5km');
  const [weeklyAvailability, setWeeklyAvailability] = useState(['Fri', 'Sat']);
  const [gameVibe, setGameVibe] = useState('Friendly');
  const [fitnessLevel, setFitnessLevel] = useState(3);

  // Position drag-to-scroll handler
  const positionScrollRef = useRef(null);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);

  const handleMouseDown = (e) => {
    if (!positionScrollRef.current) return;
    setIsMouseDown(true);
    setStartX(e.pageX - positionScrollRef.current.offsetLeft);
    setScrollLeftState(positionScrollRef.current.scrollLeft);
  };

  const handleMouseLeaveOrUp = () => {
    setIsMouseDown(false);
  };

  const handleMouseMove = (e) => {
    if (!isMouseDown || !positionScrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - positionScrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    positionScrollRef.current.scrollLeft = scrollLeftState - walk;
  };

  // Options list
  const positions = ['Goalkeeper', 'Defender', 'Midfielder', 'Winger', 'Striker'];
  const skillLevels = ['Casual', 'Weekend Warrior', 'Competitive', 'Professional'];
  const playingStylesList = [
    'Playmaker', 'Finisher', 'Dribbler', 'Fast Runner',
    'Long Passer', 'Defensive', 'Physical', 'Team Player',
    'Aggressive Press', 'Goal Poacher'
  ];
  const matchTypes = ['5v5', '7v7', 'Both'];
  const playFrequencies = ['Rarely', '1 time/week', '2-3 times/per week', '4-5 times/week', 'Everyday'];

  const timeSlots = ['Morning', 'Afternoon', 'Evening', 'Night'];
  const travelDistances = ['2km', '5km', '10km', '15km', '20km+'];
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const gameVibes = ['Just for Fun', 'Friendly', 'Competitive', 'Tournament'];

  const MAX_PLAYING_STYLES = 3;

  const togglePlayingStyle = (style) => {
    if (playingStyle.includes(style)) {
      setPlayingStyle(playingStyle.filter((s) => s !== style));
    } else if (playingStyle.length < MAX_PLAYING_STYLES) {
      setPlayingStyle([...playingStyle, style]);
    }
  };

  const toggleTimeSlot = (time) => {
    if (preferredTime.includes(time)) {
      setPreferredTime(preferredTime.filter((t) => t !== time));
    } else {
      setPreferredTime([...preferredTime, time]);
    }
  };

  const toggleDay = (day) => {
    if (weeklyAvailability.includes(day)) {
      setWeeklyAvailability(weeklyAvailability.filter((d) => d !== day));
    } else {
      setWeeklyAvailability([...weeklyAvailability, day]);
    }
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Complete Onboarding
      if (onComplete) {
        onComplete({
          username,
          dob,
          gender,
          city,
          preferredFoot,
          position,
          skillLevel,
          playingStyle,
          matchType,
          playFrequency,
          preferredTime,
          travelDistance,
          weeklyAvailability,
          gameVibe,
          fitnessLevel,
        });
      }
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const progressPercentage = step === 1 ? 33.3 : step === 2 ? 66.6 : 100;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto font-sans antialiased">
      <div className={`relative w-full transition-[max-width,width] duration-300 ease-out my-auto ${step === 1 ? 'max-w-[520px]' : 'max-w-[620px]'}`}>
        
        {/* Form Card Container */}
        <div className="relative w-full bg-white rounded-[28px] p-6 sm:p-10 shadow-2xl border border-slate-100/90 max-h-[90vh] overflow-y-auto transition-all duration-300 ease-out">
          
          {/* Modal Header & Step Bar */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <img src="/logo.png" alt="Turfio" className="h-6 w-auto object-contain" />
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Step {step} of 3</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-24 sm:w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-lime-400 transition-all duration-300 rounded-full"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              {onClose && (
                <button
                  type="button"
                  onClick={onClose}
                  className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>

          {/* Step 1: Personal Details */}
          {step === 1 && (
            <div key="step-1" className="space-y-6 sm:space-y-7 animate-step-fade">
              {/* Header */}
              <div className="text-left">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                  Let's get to know you
                </h1>
                <p className="mt-1 text-sm font-medium text-slate-500">
                  Set up your basic profile identity on Turfio.
                </p>
              </div>

              {/* Personal Details Section */}
              <div className="space-y-4 pt-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Username */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Username
                    </label>
                    <div className="relative">
                      <AtSign size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="username"
                        className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-lime-300 focus:border-lime-400 transition-all bg-white"
                      />
                    </div>
                  </div>

                  {/* Date of Birth */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Date of Birth
                    </label>
                    <div className="relative">
                      <Calendar size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      <input
                        type="date"
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-lime-300 focus:border-lime-400 transition-all bg-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Gender */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Gender
                    </label>
                    <div className="relative">
                      <Users size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        className="w-full pl-11 pr-8 py-3 rounded-2xl border border-slate-200 text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-lime-300 focus:border-lime-400 transition-all bg-white appearance-none cursor-pointer"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                      <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* City */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      City
                    </label>
                    <div className="relative">
                      <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="Kathmandu"
                        className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-lime-300 focus:border-lime-400 transition-all bg-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Preferred Foot with Radio Selection Tiles */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Which is your preferred foot?
                  </label>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { label: 'Left', icon: <Footprints size={24} className="-scale-x-100" /> },
                      { label: 'Right', icon: <Footprints size={24} /> },
                      {
                        label: 'Both',
                        icon: (
                          <span className="flex items-center -space-x-1.5">
                            <Footprints size={20} className="-scale-x-100" />
                            <Footprints size={20} />
                          </span>
                        ),
                      },
                    ].map((item) => {
                      const isSelected = preferredFoot === item.label;
                      return (
                        <button
                          key={item.label}
                          type="button"
                          onClick={() => setPreferredFoot(item.label)}
                          className={`relative py-5 sm:py-6 px-4 rounded-2xl border text-xs font-bold transition-all cursor-pointer flex flex-col items-center justify-center gap-2.5 ${
                            isSelected
                              ? 'bg-lime-400 border-lime-400 text-slate-900 shadow-2xs'
                              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          {/* Round Radio Check Circle */}
                          <div
                            className={`absolute top-2.5 right-2.5 w-4 h-4 rounded-full flex items-center justify-center transition-all ${
                              isSelected
                                ? 'border-2 border-slate-900 bg-slate-900'
                                : 'border border-slate-300 bg-white'
                            }`}
                          >
                            {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-lime-400" />}
                          </div>

                          {item.icon}
                          <span>{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Next Step Button */}
              <div className="pt-4">
                <button
                  type="button"
                  onClick={handleNext}
                  className="w-full py-3.5 px-6 rounded-full bg-lime-400 hover:bg-lime-500 active:scale-95 text-slate-900 font-semibold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <span>Continue to Player Profile</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Player Profile & Style */}
          {step === 2 && (
            <div key="step-2" className="space-y-6 animate-step-fade">
              {/* Header */}
              <div className="text-left">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                  Define your pitch style
                </h1>
                <p className="mt-1 text-sm font-medium text-slate-500">
                  Specify position, skill level, and tactical style.
                </p>
              </div>

              <div className="space-y-6 sm:space-y-7 pt-2">
                {/* Position */}
                <div className="w-full min-w-0">
                  <label className="block text-xs font-bold text-slate-700 mb-2.5">
                    1. What position do you usually play?
                  </label>
                  <div
                    ref={positionScrollRef}
                    onMouseDown={handleMouseDown}
                    onMouseLeave={handleMouseLeaveOrUp}
                    onMouseUp={handleMouseLeaveOrUp}
                    onMouseMove={handleMouseMove}
                    className="flex items-center gap-2 overflow-x-auto w-full max-w-full pb-1 pt-0.5 touch-pan-x cursor-grab active:cursor-grabbing select-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
                  >
                    {[
                      { label: 'Goalkeeper', icon: <Hand size={14} /> },
                      { label: 'Defender', icon: <Shield size={14} /> },
                      { label: 'Midfielder', icon: <Compass size={14} /> },
                      { label: 'Winger', icon: <Zap size={14} /> },
                      { label: 'Striker', icon: <Target size={14} /> },
                    ].map((item) => (
                      <button
                        key={item.label}
                        type="button"
                        onClick={() => setPosition(item.label)}
                        className={`shrink-0 whitespace-nowrap py-2.5 px-5 sm:px-6 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                          position === item.label
                            ? 'bg-lime-400 text-slate-900 shadow-2xs'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200/80 font-semibold'
                        }`}
                      >
                        {item.icon}
                        <span>{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Skill Level */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2.5">
                    2. What is your skill level?
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {skillLevels.map((lvl) => (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => setSkillLevel(lvl)}
                        className={`py-2.5 px-5 sm:px-6 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border ${
                          skillLevel === lvl
                            ? 'bg-lime-400 border-lime-400 text-slate-900 font-bold shadow-2xs'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Playing Style (Multi-select) */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2.5">
                    3. How would you describe your playing style? <span className="font-normal text-slate-400">(Select up to 3)</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {playingStylesList.map((style) => {
                      const isSelected = playingStyle.includes(style);
                      const isDisabled = !isSelected && playingStyle.length >= MAX_PLAYING_STYLES;
                      return (
                        <button
                          key={style}
                          type="button"
                          onClick={() => togglePlayingStyle(style)}
                          disabled={isDisabled}
                          className={`py-2.5 px-5 sm:px-6 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 border ${
                            isSelected
                              ? 'bg-lime-400 border-lime-400 text-slate-900 font-bold shadow-2xs cursor-pointer'
                              : isDisabled
                                ? 'bg-slate-50 border-slate-100 text-slate-300 cursor-not-allowed'
                                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer'
                          }`}
                        >
                          {isSelected && <Check size={12} className="stroke-[3]" />}
                          <span>{style}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Match Type & Frequency */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Preferred Match Type */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2.5">
                      4. What is your preferred match type?
                    </label>
                    <div className="flex rounded-2xl border border-slate-200 p-1 bg-slate-50">
                      {matchTypes.map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setMatchType(type)}
                          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                            matchType === type
                              ? 'bg-lime-400 text-slate-900 shadow-2xs'
                              : 'text-slate-500 hover:text-slate-900'
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* How Often Do You Play */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2.5">
                      5. How often do you play?
                    </label>
                    <div className="relative">
                      <Clock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      <select
                        value={playFrequency}
                        onChange={(e) => setPlayFrequency(e.target.value)}
                        className="w-full pl-11 pr-8 py-3 rounded-2xl border border-slate-200 text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-lime-300 focus:border-lime-400 transition-all bg-white appearance-none cursor-pointer"
                      >
                        {playFrequencies.map((freq) => (
                          <option key={freq} value={freq}>
                            {freq}
                          </option>
                        ))}
                      </select>
                      <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="flex items-center gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleBack}
                  className="py-3.5 px-6 rounded-full bg-slate-100/80 hover:bg-slate-200/70 text-slate-800 font-semibold text-sm transition-all flex items-center gap-2 cursor-pointer"
                >
                  <ArrowLeft size={16} />
                  <span>Back</span>
                </button>

                <button
                  type="button"
                  onClick={handleNext}
                  className="flex-1 py-3.5 px-6 rounded-full bg-lime-400 hover:bg-lime-500 active:scale-95 text-slate-900 font-semibold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <span>Continue to Game Customization</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Game Customization */}
          {step === 3 && (
            <div key="step-3" className="space-y-6 animate-step-fade">
              {/* Header */}
              <div className="text-left">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                  Match & Travel Preferences
                </h1>
                <p className="mt-1 text-sm font-medium text-slate-500">
                  Fine-tune schedule, distance range, vibe, and fitness level.
                </p>
              </div>

              <div className="space-y-6 sm:space-y-7 pt-2">
                {/* Preferred Time to Play */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2.5">
                    1. What is your preferred time to play?
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {timeSlots.map((time) => {
                      const isSelected = preferredTime.includes(time);
                      return (
                        <button
                          key={time}
                          type="button"
                          onClick={() => toggleTimeSlot(time)}
                          className={`py-2.5 px-3 rounded-2xl text-xs font-semibold transition-all cursor-pointer text-center border ${
                            isSelected
                              ? 'bg-lime-400 border-lime-400 text-slate-900 font-bold shadow-2xs'
                              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          {time}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Travel Preference */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2.5">
                    2. How far are you willing to travel?
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {travelDistances.map((dist) => (
                      <button
                        key={dist}
                        type="button"
                        onClick={() => setTravelDistance(dist)}
                        className={`py-2.5 px-5 sm:px-6 rounded-full text-xs font-bold transition-all cursor-pointer ${
                          travelDistance === dist
                            ? 'bg-lime-400 text-slate-900 shadow-2xs'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200/80 font-semibold'
                        }`}
                      >
                        {dist}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Weekly Availability */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2.5">
                    3. What is your weekly availability?
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {weekDays.map((day) => {
                      const isSelected = weeklyAvailability.includes(day);
                      return (
                        <button
                          key={day}
                          type="button"
                          onClick={() => toggleDay(day)}
                          className={`w-10 h-10 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center border ${
                            isSelected
                              ? 'bg-lime-400 border-lime-400 text-slate-900 shadow-2xs'
                              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          {day}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Game Vibe */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2.5">
                    4. What game vibe do you prefer?
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {gameVibes.map((vibe) => (
                      <button
                        key={vibe}
                        type="button"
                        onClick={() => setGameVibe(vibe)}
                        className={`py-2.5 px-5 sm:px-6 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border ${
                          gameVibe === vibe
                            ? 'bg-lime-400 border-lime-400 text-slate-900 font-bold shadow-2xs'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {vibe}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Fitness Level */}
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <label className="text-xs font-bold text-slate-700">
                      5. How would you rate your fitness level?
                    </label>
                    <span className="text-xs font-bold text-lime-800 bg-lime-100 px-2.5 py-0.5 rounded-full">
                      Level {fitnessLevel} / 5
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((lvl) => (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => setFitnessLevel(lvl)}
                        className={`flex-1 py-3 rounded-2xl font-extrabold text-sm transition-all cursor-pointer border ${
                          fitnessLevel >= lvl
                            ? 'bg-lime-400 border-lime-400 text-slate-900 shadow-2xs'
                            : 'bg-slate-100 border-slate-200 text-slate-400 hover:bg-slate-200'
                        }`}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleBack}
                  className="py-3.5 px-6 rounded-full bg-slate-100/80 hover:bg-slate-200/70 text-slate-800 font-semibold text-sm transition-all flex items-center gap-2 cursor-pointer"
                >
                  <ArrowLeft size={16} />
                  <span>Back</span>
                </button>

                <button
                  type="button"
                  onClick={handleNext}
                  className="flex-1 py-3.5 px-6 rounded-full bg-lime-400 hover:bg-lime-500 active:scale-95 text-slate-900 font-semibold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <span>Complete Setup & Launch</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default OnboardingPage;
