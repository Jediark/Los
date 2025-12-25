
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { 
  LayoutDashboard, Target, Zap, Wallet, CheckSquare, MessageSquare, BookOpen, Plus, TrendingUp, User, LogOut, ChevronRight, Sparkles, Calendar, Trash2, Filter, ArrowUpRight, PieChart as PieChartIcon, Clock, GraduationCap, Heart, Briefcase, CheckCircle2, ExternalLink, Flame, Sun, Menu, X, Phone, Settings, ShieldCheck, Bell, HelpCircle, Share2, Activity, Award, Users, Compass, Smile, AlertTriangle, Library, Download, Mail, MessageCircle, RotateCcw, BrainCircuit, Star, CreditCard, Rocket, MapPin, Smartphone, Globe, Shield, Zap as ZapIcon, Send, Instagram, Twitter, Linkedin, Facebook, Search, ChevronDown, ListTodo, Quote, Lock, ShieldAlert, Rocket as RocketIcon, Gem, Anchor, Eye
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, AreaChart, Area, LineChart, Line, Legend
} from 'recharts';

import { Skill, Goal, Task, MaxwellLaw, ChatMessage, ViewType, SkillStatus, Course, PrayerItem, PortfolioProject, MoodEntry, Debt, Ebook, UserProfile, CommunityPost, AccountabilityPartner, ExperienceLevel } from './types';
import { INITIAL_SKILLS, INITIAL_GOALS, INITIAL_TASKS, MAXWELL_LAWS, INITIAL_COURSES, INITIAL_PRAYERS, INITIAL_PORTFOLIO, INITIAL_MOODS, INITIAL_DEBTS, INITIAL_EBOOKS, INITIAL_COMMUNITY_POSTS, INITIAL_PARTNERS } from './constants';
import { coachService } from './services/geminiService';

// --- Shared UI Components ---

const SidebarItem: React.FC<{ icon: any, label: string, active: boolean, onClick: () => void }> = ({ icon: Icon, label, active, onClick }) => (
  <button onClick={onClick} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${active ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-slate-600 hover:bg-slate-100'}`}>
    <Icon size={18} />
    <span className="font-medium text-xs lg:text-sm whitespace-nowrap">{label}</span>
  </button>
);

const Card: React.FC<{ children?: React.ReactNode, title?: string, className?: string, headerAction?: React.ReactNode, subtitle?: string }> = ({ children, title, className = "", headerAction, subtitle }) => (
  <div className={`bg-white rounded-2xl shadow-sm border border-slate-100 p-6 ${className}`}>
    {(title || headerAction) && (
      <div className="flex justify-between items-start mb-6">
        <div>
          {title && <h3 className="text-lg font-black text-slate-800 tracking-tight leading-none mb-1">{title}</h3>}
          {subtitle && <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{subtitle}</p>}
        </div>
        {headerAction}
      </div>
    )}
    {children}
  </div>
);

const ProgressLine = ({ value, color = "bg-blue-600" }: { value: number, color?: string }) => (
  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
    <div className={`h-full transition-all duration-500 ${color}`} style={{ width: `${Math.min(100, Math.max(0, value))}%` }}></div>
  </div>
);

// --- Auth Components ---

const LoginOverlay = ({ onLogin, onClose }: { onLogin: () => void, onClose: () => void }) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
    <div className="bg-white w-full max-w-md rounded-[40px] shadow-2xl p-10 relative animate-in zoom-in-95 duration-300 border border-slate-100">
      <button onClick={onClose} className="absolute top-8 right-8 text-slate-400 hover:text-slate-600 p-2"><X size={24}/></button>
      <div className="text-center mb-10">
        <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-6 shadow-xl shadow-blue-200">
          <Lock size={32} />
        </div>
        <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase mb-2">Access Portal.</h2>
        <p className="text-slate-400 font-bold text-sm">Enter your credentials to manage your vision.</p>
      </div>
      <form className="space-y-6" onSubmit={e => { e.preventDefault(); onLogin(); }}>
        <div className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
            <input 
              type="email" 
              defaultValue="akinola@lifeos.vision"
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-14 pr-6 py-4 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none" 
              placeholder="Email Address" 
            />
          </div>
          <div className="relative">
            <ShieldCheck className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
            <input 
              type="password" 
              defaultValue="********"
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-14 pr-6 py-4 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none" 
              placeholder="Password" 
            />
          </div>
        </div>
        <div className="flex items-center justify-between text-xs font-black uppercase tracking-widest">
          <label className="flex items-center gap-2 text-slate-400 cursor-pointer">
            <input type="checkbox" className="rounded text-blue-600" defaultChecked />
            Remember Me
          </label>
          <a href="#" className="text-blue-600 hover:underline">Forgot?</a>
        </div>
        <button className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-2xl hover:bg-slate-900 transition-all active:scale-95">
          Establish Secure Connection
        </button>
      </form>
      <p className="mt-8 text-center text-[10px] font-black uppercase tracking-widest text-slate-300">
        Verified Global Stability Engine v4.0
      </p>
    </div>
  </div>
);

// --- Public Web View Components (Marketing) ---

const PublicNavbar = ({ activeView, setActiveView, onLaunch, onMenuToggle }: { activeView: ViewType, setActiveView: (v: ViewType) => void, onLaunch: () => void, onMenuToggle: () => void }) => (
  <nav className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-xl z-50 border-b border-slate-100 px-6 py-4">
    <div className="max-w-7xl mx-auto flex justify-between items-center">
      <div className="flex items-center space-x-2 cursor-pointer group" onClick={() => setActiveView('landing')}>
        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200 group-hover:scale-110 transition-transform">
          <Sparkles size={24} />
        </div>
        <span className="text-2xl font-black text-slate-800 tracking-tighter">LOS.</span>
      </div>
      
      <div className="hidden md:flex items-center space-x-8">
        {[
          { id: 'landing', label: 'Home' },
          { id: 'about', label: 'About' },
          { id: 'services', label: 'Services' },
          { id: 'pricing', label: 'Pricing' },
          { id: 'contact', label: 'Contact' }
        ].map(item => (
          <button 
            key={item.id} 
            onClick={() => setActiveView(item.id as ViewType)}
            className={`text-sm font-bold transition-all hover:text-blue-600 ${activeView === item.id ? 'text-blue-600' : 'text-slate-500'}`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="flex items-center space-x-4">
        <button onClick={onLaunch} className="hidden sm:block bg-slate-900 text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg hover:bg-blue-600 transition-all active:scale-95">
          Launch App
        </button>
        <button onClick={onMenuToggle} className="md:hidden p-2 text-slate-600 hover:bg-slate-50 rounded-xl transition-colors">
          <Menu size={24} />
        </button>
      </div>
    </div>
  </nav>
);

const AppStoreButtons = () => (
  <div className="flex flex-col sm:flex-row gap-4">
    <button className="flex items-center space-x-3 bg-slate-900 text-white px-6 py-3 rounded-2xl hover:bg-slate-800 transition-all border border-slate-700 shadow-xl">
      <Smartphone size={24} />
      <div className="text-left">
        <p className="text-[10px] font-bold uppercase opacity-60 leading-none">Download on the</p>
        <p className="text-lg font-black leading-none mt-1 tracking-tight">App Store</p>
      </div>
    </button>
    <button className="flex items-center space-x-3 bg-slate-900 text-white px-6 py-3 rounded-2xl hover:bg-slate-800 transition-all border border-slate-700 shadow-xl">
      <Rocket size={24} />
      <div className="text-left">
        <p className="text-[10px] font-bold uppercase opacity-60 leading-none">Get it on</p>
        <p className="text-lg font-black leading-none mt-1 tracking-tight">Google Play</p>
      </div>
    </button>
  </div>
);

// --- Public Marketing Sections ---

const LandingHero = ({ onLaunch }: { onLaunch: () => void }) => (
  <section className="pt-24 lg:pt-56 pb-24 px-6 bg-white overflow-hidden relative">
    <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-20">
      <div className="flex-1 space-y-12 relative z-10">
        <div className="inline-flex items-center space-x-2 bg-blue-50 border border-blue-100 px-5 py-2.5 rounded-full text-blue-600">
          <Sparkles size={16} />
          <span className="text-xs font-black uppercase tracking-widest">Global Stability Engine v4.0</span>
        </div>
        <h1 className="text-5xl md:text-7xl lg:text-[105px] font-black text-slate-900 tracking-tighter leading-[0.9] lg:leading-[0.85] filter drop-shadow-md">
          Your Full Life.<br />
          <span className="text-blue-600 underline decoration-blue-200 decoration-8 underline-offset-12">Operating.</span>
        </h1>
        <p className="text-xl md:text-2xl text-slate-600 max-w-xl leading-relaxed font-semibold">
          The world-class SaaS OS for multi-talented leaders to manage gifts, monetize skills, and build a lasting financial legacy.
        </p>
        <div className="flex flex-col gap-10">
          <button onClick={onLaunch} className="w-full sm:w-auto bg-blue-600 text-white px-12 py-7 rounded-[28px] font-black uppercase tracking-widest shadow-[0_20px_50px_rgba(37,99,235,0.4)] hover:scale-105 active:scale-95 transition-all text-xl">
            Execute Your Vision
          </button>
          <div className="space-y-4">
             <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Available Now on Mobile</p>
             <AppStoreButtons />
          </div>
        </div>
      </div>
      <div className="flex-1 relative hidden lg:block">
        <div className="absolute -inset-20 bg-blue-400 rounded-full blur-[140px] opacity-10 animate-pulse"></div>
        <Card className="relative z-10 border-0 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.2)] p-0 overflow-hidden transform rotate-3 scale-110">
           <div className="bg-slate-900 p-8 flex justify-between items-center text-white">
              <div className="flex space-x-2">
                 <div className="w-3 h-3 bg-red-500 rounded-full shadow-sm" />
                 <div className="w-3 h-3 bg-amber-500 rounded-full shadow-sm" />
                 <div className="w-3 h-3 bg-green-500 rounded-full shadow-sm" />
              </div>
              <p className="text-[10px] font-black tracking-widest uppercase opacity-40">System Console Active</p>
           </div>
           <div className="p-10 space-y-10 bg-slate-50">
              <div className="space-y-2">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Revenue Velocity</p>
                 <p className="text-5xl font-black text-slate-900">$4,750.00</p>
              </div>
              <ProgressLine value={72} />
              <div className="grid grid-cols-2 gap-4">
                <div className="p-5 bg-white rounded-3xl shadow-sm border border-slate-100">
                  <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Maxwell Law Focus</p>
                  <p className="text-sm font-black text-slate-800">Law of Intentionality</p>
                </div>
                <div className="p-5 bg-white rounded-3xl shadow-sm border border-slate-100">
                  <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Degree Momentum</p>
                  <p className="text-sm font-black text-slate-800">65% Progress</p>
                </div>
              </div>
           </div>
        </Card>
      </div>
    </div>
  </section>
);

const SocialProof = () => (
  <section className="py-24 border-y border-slate-100 bg-white px-6">
    <div className="max-w-7xl mx-auto">
      <p className="text-center text-[11px] font-black uppercase text-slate-400 tracking-[0.4em] mb-16">Endorsed by Global Leaders & Organizations</p>
      <div className="flex flex-wrap justify-center items-center gap-16 md:gap-32 opacity-25 grayscale contrast-125">
        {['Global Ministry Net', 'TechAlpha Systems', 'Maxwell Leadership', 'Engineering Union', 'Anchor Collective'].map(name => (
          <span key={name} className="text-3xl font-black tracking-tighter whitespace-nowrap">{name}</span>
        ))}
      </div>
    </div>
  </section>
);

const TestimonialsSection = () => (
  <section className="py-24 bg-slate-50/50 px-6 overflow-hidden">
    <div className="max-w-7xl mx-auto">
      <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
        <h2 className="text-5xl font-black text-slate-900 uppercase tracking-tighter">Verified Results.</h2>
        <p className="text-slate-500 font-bold leading-relaxed text-lg">See how multi-talented people are architecting their stability.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {[
          { name: 'Samuel K.', role: 'Author & Speaker', text: 'The Strategic Planning module transformed my writing output. I went from scattered ideas to a complete manuscript in 90 days.' },
          { name: 'Lydia M.', role: 'Counselor', text: 'Managing a ministry and BSc studies was constant chaos. LOS gave me the structure to focus without burning out.' },
          { name: 'Chris P.', role: 'AI Developer', text: 'The Financial Lab is the game changer. Monetizing my dev skills while tracking my degree progress has secured my future.' }
        ].map((t, idx) => (
          <Card key={idx} className="p-12 hover:-translate-y-4 hover:shadow-2xl transition-all duration-500 border-slate-100 relative group bg-white">
            <Quote size={60} className="absolute top-10 right-10 text-blue-50/80 group-hover:text-blue-50 transition-colors" />
            <div className="flex text-amber-400 mb-8">
              {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
            </div>
            <p className="text-slate-700 font-semibold italic leading-relaxed text-lg mb-10">"{t.text}"</p>
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center font-black text-slate-400 border border-slate-200 shadow-inner">{t.name[0]}</div>
              <div>
                <p className="text-lg font-black text-slate-900">{t.name}</p>
                <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{t.role}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  </section>
);

const PublicFooter = ({ setActiveView }: { setActiveView: (v: ViewType) => void }) => (
  <footer className="bg-slate-900 text-white pt-24 pb-12 px-6">
    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
      <div className="space-y-8 col-span-1 md:col-span-2">
        <div className="flex items-center space-x-2">
          <Sparkles size={28} className="text-blue-500" />
          <span className="font-black text-4xl tracking-tighter">LOS.</span>
        </div>
        <p className="text-slate-400 text-lg leading-relaxed max-w-sm font-medium">Engineering stability for multi-talented visionaries. Developed by and for AKINOLA OLUJOBI.</p>
        <div className="flex space-x-5 pt-4">
          <button className="w-12 h-12 bg-white/5 hover:bg-blue-600 rounded-2xl flex items-center justify-center transition-all shadow-lg"><Twitter size={20}/></button>
          <button className="w-12 h-12 bg-white/5 hover:bg-blue-600 rounded-2xl flex items-center justify-center transition-all shadow-lg"><Instagram size={20}/></button>
          <button className="w-12 h-12 bg-white/5 hover:bg-blue-600 rounded-2xl flex items-center justify-center transition-all shadow-lg"><Linkedin size={20}/></button>
        </div>
      </div>
      <div>
        <h4 className="font-black text-blue-500 mb-8 uppercase text-xs tracking-[0.2em]">The System</h4>
        <ul className="space-y-4 text-sm text-slate-400 font-bold">
          <li className="hover:text-white cursor-pointer transition-colors" onClick={() => setActiveView('services')}>Services</li>
          <li className="hover:text-white cursor-pointer transition-colors" onClick={() => setActiveView('pricing')}>Investment</li>
          <li className="hover:text-white cursor-pointer transition-colors" onClick={() => setActiveView('about')}>Our Story</li>
          <li className="hover:text-white cursor-pointer transition-colors" onClick={() => setActiveView('contact')}>Support</li>
        </ul>
      </div>
      <div>
        <h4 className="font-black text-blue-500 mb-8 uppercase text-xs tracking-[0.2em]">Secure Entry</h4>
        <div className="space-y-6">
          <button onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} className="text-sm font-black text-white hover:text-blue-500 transition-colors uppercase tracking-widest">Login to OS</button>
          <AppStoreButtons />
        </div>
      </div>
    </div>
    <div className="text-center text-[10px] text-slate-500 font-black uppercase tracking-[0.3em] pt-12 border-t border-white/5">
      © 2026 Life Operating System. Built by AKINOLA OLUJOBI. All rights reserved.
    </div>
  </footer>
);

// --- Private Components (OS Modules) ---

const GoalsView = ({ goals }: { goals: Goal[] }) => (
  <div className="space-y-8 animate-in fade-in duration-700">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {goals.map(goal => (
        <Card key={goal.id} title={goal.title} subtitle={goal.category}>
          <div className="mt-6 space-y-6">
            <div className="flex justify-between items-end">
              <div>
                <p className="text-4xl font-black text-slate-900">{goal.progress}%</p>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Completion</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-black text-slate-800">{goal.deadline}</p>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Target Deadline</p>
              </div>
            </div>
            <ProgressLine value={goal.progress} />
            <div className="flex items-center gap-2 text-[10px] font-black uppercase text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg w-fit">
              <TrendingUp size={14}/> {goal.velocity}% Growth Velocity
            </div>
          </div>
        </Card>
      ))}
      <button className="border-4 border-dashed border-slate-100 rounded-[32px] p-12 flex flex-col items-center justify-center text-slate-300 hover:border-blue-200 hover:text-blue-600 transition-all gap-4">
        <Plus size={48} strokeWidth={1} />
        <span className="text-[10px] font-black uppercase tracking-widest">New Strategic Goal</span>
      </button>
    </div>
  </div>
);

const TasksView = ({ tasks }: { tasks: Task[] }) => {
  const [filter, setFilter] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const filteredTasks = tasks.filter(t => t.scope === filter);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex items-center gap-4 bg-white p-2 rounded-2xl shadow-sm border border-slate-100 w-fit">
        {['daily', 'weekly', 'monthly'].map((f) => (
          <button 
            key={f}
            onClick={() => setFilter(f as any)}
            className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === f ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-4">
          {filteredTasks.map(task => (
            <div key={task.id} className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between group hover:border-blue-200 transition-all">
              <div className="flex items-center gap-6">
                <input type="checkbox" checked={task.completed} onChange={() => {}} className="w-6 h-6 rounded-lg border-slate-200 text-blue-600" />
                <div>
                  <p className={`text-lg font-black ${task.completed ? 'line-through text-slate-300' : 'text-slate-800'}`}>{task.title}</p>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Due {task.dueDate}</p>
                </div>
              </div>
              <div className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${task.priority === 'High' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
                {task.priority}
              </div>
            </div>
          ))}
          {filteredTasks.length === 0 && (
            <div className="py-20 text-center bg-slate-50 border-2 border-dashed border-slate-100 rounded-[40px] text-slate-300 font-black uppercase tracking-widest text-xs">
              No tasks established for this scope
            </div>
          )}
        </div>
        
        <Card title="Execution Metrics" subtitle="Weekly Performance Record">
          <div className="space-y-8 mt-6">
            <div className="flex justify-between items-center">
              <p className="text-sm font-bold text-slate-500">Completed</p>
              <p className="text-xl font-black text-slate-900">14</p>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-sm font-bold text-slate-500">Carried Over</p>
              <p className="text-xl font-black text-red-500">2</p>
            </div>
            <div className="pt-6 border-t border-slate-50">
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-4">Focus Intensity</p>
              <ProgressLine value={85} />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

const CoachView = ({ skills, goals, laws }: { skills: Skill[], goals: Goal[], laws: MaxwellLaw[] }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const response = await coachService.getResponse(input, {
      skills,
      goals,
      activeLaw: laws[0]
    });

    const aiMsg: ChatMessage = { id: (Date.now() + 1).toString(), role: 'model', text: response, timestamp: new Date() };
    setMessages(prev => [...prev, aiMsg]);
    setIsLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto h-[70vh] flex flex-col animate-in fade-in duration-700">
      <Card title="AI Strategic Coach" subtitle="Akinola's Executive Mentorship" className="flex-1 flex flex-col overflow-hidden p-0">
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-10 space-y-8 bg-slate-50/30">
          {messages.length === 0 && (
            <div className="text-center py-20 space-y-6">
              <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-[32px] flex items-center justify-center mx-auto shadow-xl shadow-blue-50 border-4 border-white">
                <BrainCircuit size={40} />
              </div>
              <h4 className="text-xl font-black text-slate-800 tracking-tighter uppercase">Establish Connection.</h4>
              <p className="text-slate-400 font-bold max-w-xs mx-auto text-sm">Akinola's AI Coach is ready to provide strategic clarity for your vision.</p>
            </div>
          )}
          {messages.map(msg => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-6 rounded-[28px] ${msg.role === 'user' ? 'bg-blue-600 text-white shadow-xl shadow-blue-200' : 'bg-white border border-slate-100 shadow-sm'}`}>
                <p className="text-sm font-semibold leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                <p className={`text-[8px] font-black uppercase mt-3 tracking-widest ${msg.role === 'user' ? 'text-blue-100' : 'text-slate-300'}`}>
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white border border-slate-100 p-6 rounded-[28px] flex gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
              </div>
            </div>
          )}
        </div>
        <div className="p-8 border-t border-slate-100 bg-white">
          <div className="relative">
            <input 
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="Query the system for strategic guidance..." 
              className="w-full bg-slate-50 border border-slate-100 rounded-[28px] pl-8 pr-20 py-6 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none" 
            />
            <button 
              onClick={handleSend}
              disabled={isLoading}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-14 h-14 bg-blue-600 text-white rounded-[22px] flex items-center justify-center shadow-xl shadow-blue-200 active:scale-95 transition-all disabled:opacity-50"
            >
              <Send size={24}/>
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
};

// ... (FinancialLabView, AcademicHubView, WellnessCenterView, CommunityFeedView, PortfolioHubView, SpiritualHubView, TransformationLibView, MaxwellGrowthView remain same) ...

const FinancialLabView = ({ skills, debts }: { skills: Skill[], debts: Debt[] }) => {
  const totalDebt = debts.reduce((acc, d) => acc + d.amount, 0);
  const totalIncome = skills.reduce((acc, s) => acc + s.monthlyIncome, 0);
  
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card title="Revenue Lab" subtitle="Skill-Based Income Streams">
          <div className="h-[300px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={skills}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold' }} />
                <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                <Bar dataKey="monthlyIncome" radius={[4, 4, 0, 0]}>
                  {skills.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color.replace('bg-', '#')} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-6 flex justify-between items-end">
            <div>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Total Monthly Yield</p>
              <p className="text-3xl font-black text-slate-900">${totalIncome}</p>
            </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest">Add Stream</button>
          </div>
        </Card>

        <Card title="Debt Snowball" subtitle="Aggressive Repayment Strategy">
          <div className="space-y-4">
            {debts.map(debt => (
              <div key={debt.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex justify-between items-center group hover:bg-white transition-all">
                <div>
                  <p className="text-sm font-black text-slate-800">{debt.name}</p>
                  <p className="text-[10px] text-slate-400 font-bold">{debt.interest}% Interest Rate</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-black text-slate-900">${debt.amount}</p>
                  <p className="text-[10px] text-blue-600 font-black uppercase">Min: ${debt.monthlyPayment}/mo</p>
                </div>
              </div>
            ))}
            <div className="pt-6 border-t border-slate-100">
               <div className="flex justify-between items-center text-sm font-black uppercase tracking-widest text-slate-400 mb-2">
                 <span>Strategic Balance</span>
                 <span className="text-red-500">${totalDebt}</span>
               </div>
               <ProgressLine value={20} color="bg-red-500" />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

const AcademicHubView = ({ courses }: { courses: Course[] }) => (
  <div className="space-y-8 animate-in fade-in duration-700">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <Card title="Total Credits" className="bg-blue-600 text-white border-0 shadow-blue-200 shadow-xl">
         <p className="text-5xl font-black mt-2">65 / 120</p>
         <p className="text-xs font-bold uppercase tracking-widest opacity-60 mt-4">BSc Engineering Velocity</p>
         <div className="mt-8 h-2 bg-white/20 rounded-full overflow-hidden">
           <div className="h-full bg-white w-[65%]" />
         </div>
      </Card>
      <div className="col-span-1 md:col-span-2">
         <Card title="Curriculum Roadmap" subtitle="Current Semester Performance">
            <div className="overflow-x-auto">
               <table className="w-full text-left">
                  <thead>
                     <tr className="text-[10px] font-black uppercase text-slate-400 tracking-widest border-b border-slate-100">
                        <th className="pb-4">Code</th>
                        <th className="pb-4">Course Title</th>
                        <th className="pb-4">Credits</th>
                        <th className="pb-4">Status</th>
                        <th className="pb-4 text-right">Grade</th>
                     </tr>
                  </thead>
                  <tbody className="text-sm">
                     {courses.map(course => (
                        <tr key={course.id} className="border-b border-slate-50 last:border-0 group hover:bg-slate-50 transition-colors">
                           <td className="py-4 font-bold text-slate-500">{course.code}</td>
                           <td className="py-4 font-black text-slate-800">{course.title}</td>
                           <td className="py-4 font-bold text-slate-500">{course.credits}</td>
                           <td className="py-4">
                              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${course.status === 'Completed' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                                 {course.status}
                              </span>
                           </td>
                           <td className="py-4 text-right font-black text-slate-800">{course.grade || '-'}</td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </Card>
      </div>
    </div>
  </div>
);

const WellnessCenterView = ({ moods }: { moods: MoodEntry[] }) => (
  <div className="space-y-8 animate-in fade-in duration-700">
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <Card title="Emotional Velocity" subtitle="Sentiment over 7 Days" className="lg:col-span-2">
        <div className="h-[300px] w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={moods}>
              <defs>
                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold' }} />
              <YAxis domain={[0, 10]} axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold' }} />
              <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
              <Area type="monotone" dataKey="score" stroke="#2563eb" fillOpacity={1} fill="url(#colorScore)" strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>
      <Card title="Wellness Tags" subtitle="Current Psychological Focus">
        <div className="flex flex-wrap gap-2 mt-4">
          {Array.from(new Set(moods.flatMap(m => m.tags))).map(tag => (
            <span key={tag} className="px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-100">
              {tag}
            </span>
          ))}
        </div>
        <div className="mt-8 space-y-4">
          <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Recent Reflection</p>
          <div className="p-4 bg-slate-50 rounded-2xl text-sm font-bold text-slate-700 italic border border-slate-100">
            "{moods[0].note}"
          </div>
        </div>
      </Card>
    </div>
  </div>
);

const CommunityFeedView = ({ posts }: { posts: CommunityPost[] }) => (
  <div className="space-y-8 animate-in fade-in duration-700">
    <div className="max-w-3xl mx-auto space-y-6">
      {posts.map(post => (
        <Card key={post.id} className="p-8">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center font-black">
                {post.userName[0]}
              </div>
              <div>
                <p className="text-sm font-black text-slate-900">{post.userName}</p>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{post.timestamp} • {post.category}</p>
              </div>
            </div>
            <button className="text-slate-300 hover:text-blue-600 transition-colors"><Share2 size={18}/></button>
          </div>
          <p className="mt-6 text-slate-600 font-bold leading-relaxed">{post.userName} {post.action}</p>
          <div className="mt-8 pt-6 border-t border-slate-50 flex items-center gap-6">
            <button className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400 hover:text-red-500 transition-all">
              <Heart size={16} /> {post.likes} Strategic Likes
            </button>
            <button className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400 hover:text-blue-600 transition-all">
              <MessageCircle size={16} /> Counsel
            </button>
          </div>
        </Card>
      ))}
    </div>
  </div>
);

const PortfolioHubView = ({ projects }: { projects: PortfolioProject[] }) => (
  <div className="space-y-8 animate-in fade-in duration-700">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {projects.map(project => (
        <Card key={project.id} title={project.title} subtitle={project.date}>
          <p className="text-slate-500 font-bold mt-4 leading-relaxed">{project.description}</p>
          <div className="mt-8 flex items-center justify-between">
            {project.link ? (
              <a href={project.link} target="_blank" className="text-blue-600 font-black text-[10px] uppercase tracking-widest flex items-center gap-2">
                View Project <ExternalLink size={14}/>
              </a>
            ) : (
              <span className="text-slate-300 font-black text-[10px] uppercase tracking-widest">Internal Asset</span>
            )}
            <button className="p-3 bg-slate-50 rounded-xl text-slate-400 hover:text-blue-600 transition-all"><Share2 size={16}/></button>
          </div>
        </Card>
      ))}
      <button className="h-full min-h-[200px] border-4 border-dashed border-slate-100 rounded-[32px] flex flex-col items-center justify-center text-slate-300 hover:border-blue-200 hover:text-blue-600 transition-all space-y-4">
        <Plus size={48} strokeWidth={1}/>
        <span className="text-[10px] font-black uppercase tracking-widest">Register New Strategic Asset</span>
      </button>
    </div>
  </div>
);

const SpiritualHubView = ({ prayers }: { prayers: PrayerItem[] }) => (
  <div className="space-y-8 animate-in fade-in duration-700">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <Card title="Prayer Wall" subtitle="Faith-Based Strategic Monitoring">
         <div className="space-y-4">
            {prayers.map(prayer => (
               <div key={prayer.id} className="p-5 bg-white rounded-2xl border border-slate-100 shadow-sm flex items-start space-x-4 hover:border-blue-200 transition-all">
                  <div className={`p-3 rounded-xl ${prayer.status === 'Answered' ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'}`}>
                     <Heart size={20} className={prayer.status === 'Answered' ? 'fill-green-600' : ''} />
                  </div>
                  <div className="flex-1">
                     <p className="text-sm font-bold text-slate-800">{prayer.request}</p>
                     <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest font-black">{prayer.date}</p>
                  </div>
                  {prayer.status === 'Active' && <button className="text-xs text-blue-600 font-black uppercase tracking-widest">Mark Answered</button>}
               </div>
            ))}
            <button className="w-full py-4 border-2 border-dashed border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:border-blue-200 hover:text-blue-600 transition-all mt-4">
               Add Prayer Request
            </button>
         </div>
      </Card>
      <Card title="Ministry Repository" subtitle="Sermons & Counseling Logs">
         <div className="space-y-6">
            <div className="p-6 bg-slate-900 rounded-[32px] text-white">
               <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-2">Next Sermon Outline</p>
               <p className="text-xl font-black">The Law of the Mirror in Ministry</p>
               <div className="mt-6 flex items-center space-x-4">
                  <span className="text-[10px] bg-white/10 px-3 py-1 rounded-full font-black uppercase tracking-widest">Sunday, Oct 26</span>
                  <span className="text-[10px] bg-blue-500 px-3 py-1 rounded-full font-black uppercase tracking-widest">Drafting</span>
               </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
               <button className="p-6 bg-slate-50 rounded-3xl border border-slate-100 text-center hover:border-blue-200 transition-all group">
                  <MessageCircle size={24} className="mx-auto text-blue-600 mb-2 group-hover:scale-110 transition-transform" />
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">Counseling Logs</p>
               </button>
               <button className="p-6 bg-slate-50 rounded-3xl border border-slate-100 text-center hover:border-blue-200 transition-all group">
                  <Library size={24} className="mx-auto text-blue-600 mb-2 group-hover:scale-110 transition-transform" />
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">Sermon Archive</p>
               </button>
            </div>
         </div>
      </Card>
    </div>
  </div>
);

const TransformationLibView = ({ ebooks }: { ebooks: Ebook[] }) => (
  <div className="space-y-8 animate-in fade-in duration-700">
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
      {ebooks.map(ebook => (
        <div key={ebook.id} className="group cursor-pointer">
           <div className={`aspect-[3/4] ${ebook.coverColor} rounded-2xl shadow-lg group-hover:shadow-2xl group-hover:-translate-y-2 transition-all p-6 flex flex-col justify-between border border-white/10`}>
              <div>
                <Sparkles size={16} className="text-white/40 mb-2" />
                <p className="text-white font-black leading-tight text-sm line-clamp-3">{ebook.title}</p>
              </div>
              <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest">{ebook.author}</p>
           </div>
           <p className="mt-4 text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-blue-600 transition-colors">{ebook.category}</p>
        </div>
      ))}
    </div>
  </div>
);

const MaxwellGrowthView = ({ laws, currentIdx }: { laws: MaxwellLaw[], currentIdx: number }) => (
  <div className="space-y-12 animate-in fade-in duration-700">
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
      <div className="lg:col-span-2 space-y-8">
        <h2 className="text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none">The 15 Laws of Growth.</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {laws.map((law, idx) => (
            <div key={law.number} className={`p-6 rounded-3xl border transition-all cursor-pointer ${idx === currentIdx ? 'bg-blue-600 text-white border-blue-600 shadow-2xl shadow-blue-200' : 'bg-white text-slate-800 border-slate-100 hover:border-blue-200'}`}>
               <div className="flex justify-between items-center mb-4">
                 <span className={`text-[10px] font-black uppercase tracking-widest ${idx === currentIdx ? 'text-white/60' : 'text-slate-400'}`}>Law No. {law.number}</span>
                 {idx === currentIdx && <CheckCircle2 size={16} />}
               </div>
               <p className="text-lg font-black leading-tight">{law.name}</p>
               <p className={`text-xs mt-2 line-clamp-1 ${idx === currentIdx ? 'text-white/80' : 'text-slate-500'}`}>{law.description}</p>
            </div>
          ))}
        </div>
      </div>
      <Card className="bg-slate-900 text-white border-0 shadow-2xl p-10 h-fit sticky top-12">
         <p className="text-[10px] font-black uppercase tracking-widest text-blue-400 mb-4">Deep Reflection Hub</p>
         <h3 className="text-3xl font-black mb-6">{laws[currentIdx].name}</h3>
         <div className="space-y-6">
            <p className="text-sm font-medium text-slate-300 italic">"{laws[currentIdx].description}"</p>
            <div className="p-6 bg-white/5 rounded-2xl border border-white/10 space-y-4">
               <p className="text-xs font-black text-blue-400 uppercase tracking-widest">Reflection Prompt</p>
               <p className="text-sm font-bold leading-relaxed">{laws[currentIdx].reflectionPrompt}</p>
            </div>
            <textarea className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-sm focus:ring-2 focus:ring-blue-500 outline-none text-white h-40" placeholder="Type your strategic reflection..."></textarea>
            <button className="w-full bg-blue-600 py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl hover:bg-white hover:text-blue-600 transition-all">
               Commit to Growth
            </button>
         </div>
      </Card>
    </div>
  </div>
);

// --- Content Sections ---

const AboutSection = () => (
  <section className="py-24 bg-white px-6">
    <div className="max-w-6xl mx-auto space-y-32">
      {/* Brand Manifesto */}
      <div className="space-y-12">
        <div className="inline-flex items-center space-x-2 bg-blue-50 border border-blue-100 px-6 py-3 rounded-full text-blue-600">
          <Sparkles size={18} />
          <span className="text-xs font-black uppercase tracking-widest">The Manifesto</span>
        </div>
        <h2 className="text-6xl md:text-8xl font-black text-slate-900 tracking-tighter uppercase leading-[0.85]">
          Gifts without <br />Systems are <br /><span className="text-blue-600">Noisy Chaos.</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 text-slate-600 font-semibold text-xl leading-relaxed">
          <p>
            Life Operating System (LOS) was established by **AKINOLA OLUJOBI** after recognizing a tragic pattern: the world's most gifted individuals—the multi-talented authors, engineers, pastors, and anchors—are often the most unstable. 
          </p>
          <p>
            The reason is simple. **Gift-Expression is not the same as Life-Management.** You are creating LOS because you realized that your diverse callings shouldn't fight for your attention—they should fuel your infrastructure.
          </p>
        </div>
      </div>

      {/* Vision & Mission Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <Card className="p-12 border-0 bg-slate-900 text-white shadow-2xl relative overflow-hidden group">
          <Eye size={120} className="absolute -bottom-10 -right-10 text-white/5 group-hover:scale-110 transition-transform duration-700" />
          <h3 className="text-4xl font-black uppercase tracking-tighter mb-8">Our Vision.</h3>
          <p className="text-2xl text-slate-400 font-bold leading-relaxed relative z-10">
            To be the global gold standard for <span className="text-white">infrastructure-as-a-life</span>, enabling every multi-talented leader to achieve absolute strategic stability and unhindered gift expression.
          </p>
        </Card>
        <Card className="p-12 border-0 bg-blue-600 text-white shadow-2xl relative overflow-hidden group">
          <RocketIcon size={120} className="absolute -bottom-10 -right-10 text-white/5 group-hover:translate-x-4 group-hover:-translate-y-4 transition-transform duration-700" />
          <h3 className="text-4xl font-black uppercase tracking-tighter mb-8">Our Mission.</h3>
          <p className="text-2xl text-blue-100 font-bold leading-relaxed relative z-10">
            To provide a world-class <span className="text-white">strategic framework</span> that synchronizes skills, monetizes hidden talents, and builds financial fortresses through data, discipline, and AI-driven coaching.
          </p>
        </Card>
      </div>

      {/* Core Values Section */}
      <div className="space-y-16">
        <div className="text-center space-y-4">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-600">The LOS Foundation</p>
          <h3 className="text-5xl font-black text-slate-900 uppercase tracking-tighter">Core Operating Values.</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { icon: ShieldCheck, title: "Order over Noise", text: "We believe complexity is manageable only through rigid systemization." },
            { icon: ZapIcon, title: "Execution Velocity", text: "A vision that doesn't move at the speed of high-performance tasking is a hallucination." },
            { icon: Gem, title: "Gift Stewardship", text: "Every talent you possess is a strategic asset. Leaving any skill unmonetized is a management failure." },
            { icon: Anchor, title: "Stability First", text: "Stability is the prerequisite for impact. We build the foundation so your gifts can touch the world." }
          ].map((v, i) => (
            <div key={i} className="space-y-6 group">
              <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                <v.icon size={28} />
              </div>
              <h4 className="text-xl font-black text-slate-900 uppercase tracking-tighter">{v.title}</h4>
              <p className="text-slate-500 font-bold leading-relaxed">{v.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* The Founder Footer */}
      <div className="pt-24 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-12">
        <div className="flex items-center space-x-8">
          <div className="w-24 h-24 bg-slate-200 rounded-[32px] overflow-hidden border-4 border-white shadow-2xl flex items-center justify-center">
             <User size={50} className="text-slate-400" />
          </div>
          <div>
            <p className="text-3xl font-black text-slate-900">AKINOLA OLUJOBI</p>
            <p className="text-sm font-black text-blue-600 uppercase tracking-[0.2em] mt-1">Lead Strategist & Founder</p>
          </div>
        </div>
        <div className="max-w-md">
          <p className="text-slate-400 font-bold italic text-lg leading-relaxed text-center md:text-right">
            "We are not just building software; we are engineering the lifestyle of the future multi-talented global leader."
          </p>
        </div>
      </div>
    </div>
  </section>
);

// --- Main App Component ---

export default function App() {
  const [profile, setProfile] = useState<UserProfile>({
    name: 'AKINOLA OLUJOBI',
    email: 'akinola@lifeos.vision',
    onboarded: true,
    tier: 'Premium',
    situation: 'Founder / Pastor',
    financialStatus: 'Stable'
  });
  
  const [activeView, setActiveView] = useState<ViewType>('landing');
  const [appMode, setAppMode] = useState<boolean>(false); 
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  
  const [skills, setSkills] = useState<Skill[]>(INITIAL_SKILLS);
  const [goals] = useState<Goal[]>(INITIAL_GOALS);
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [courses] = useState<Course[]>(INITIAL_COURSES);
  const [prayers] = useState<PrayerItem[]>(INITIAL_PRAYERS);
  const [portfolio] = useState<PortfolioProject[]>(INITIAL_PORTFOLIO);
  const [moods] = useState<MoodEntry[]>(INITIAL_MOODS);
  const [debts] = useState<Debt[]>(INITIAL_DEBTS);
  const [ebooks] = useState<Ebook[]>(INITIAL_EBOOKS);
  const [currentLawIdx, setCurrentLawIdx] = useState(0);

  const goalProgress = useMemo(() => goals.length ? Math.round(goals.reduce((acc, g) => acc + g.progress, 0) / goals.length) : 0, [goals]);
  const totalIncome = useMemo(() => skills.reduce((acc, s) => acc + s.monthlyIncome, 0), [skills]);

  const handleLaunchApp = () => {
    setIsLoginModalOpen(true);
  };

  const finalizeLogin = () => {
    setActiveView('dashboard');
    setAppMode(true);
    setIsLoginModalOpen(false);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateTo = (v: ViewType) => {
    setActiveView(v);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderInternalView = () => {
    switch (activeView) {
      case 'dashboard':
        return (
          <div className="animate-in fade-in duration-700">
             <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
                <div>
                   <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none">Execution Engine.</h2>
                   <p className="text-slate-500 font-bold mt-2">Logged in as {profile.name} • {profile.tier} Access</p>
                </div>
                <div className="flex items-center gap-3">
                   <button onClick={() => setAppMode(false)} className="bg-white border border-slate-200 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
                      <Globe size={14} className="mr-2 inline" />
                      View Website
                   </button>
                   <button onClick={() => setActiveView('coach')} className="bg-blue-600 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-200 hover:scale-105 active:scale-95 transition-all">
                      <MessageSquare size={14} className="mr-2 inline" />
                      Ask Coach
                   </button>
                </div>
             </header>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                <Card className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white border-0 shadow-2xl p-10 transform hover:scale-[1.02] transition-all">
                   <p className="text-blue-100 text-[10px] font-black uppercase tracking-widest mb-2 opacity-80">Stability Progress</p>
                   <p className="text-6xl font-black tracking-tighter">{goalProgress}%</p>
                   <div className="mt-8 h-2.5 w-full bg-white/20 rounded-full overflow-hidden">
                      <div className="h-full bg-white w-[65%]" />
                   </div>
                </Card>
                <Card className="bg-white shadow-xl p-10">
                   <div className="flex justify-between items-start">
                      <div>
                         <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Monthly Revenue</p>
                         <p className="text-5xl font-black text-slate-900 tracking-tighter">${totalIncome}</p>
                      </div>
                      <div className="p-4 bg-green-50 text-green-600 rounded-2xl"><TrendingUp size={28}/></div>
                   </div>
                   <p className="mt-8 text-green-600 font-black uppercase text-[10px] tracking-widest">+18.4% Velocity</p>
                </Card>
                <Card className="bg-slate-900 text-white border-0 shadow-2xl p-10 flex flex-col justify-between">
                   <div>
                      <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2 opacity-60">Maxwell Law Focus</p>
                      <p className="text-2xl font-black leading-tight">{MAXWELL_LAWS[currentLawIdx].name}</p>
                   </div>
                   <button onClick={() => setActiveView('growth')} className="text-[10px] font-black uppercase tracking-widest text-blue-400 hover:text-white transition-all text-left flex items-center gap-2 mt-4">
                      Open Growth Hub <ArrowUpRight size={14}/>
                   </button>
                </Card>
             </div>

             <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <Card title="Priority Tasks" headerAction={<button onClick={() => setActiveView('tasks')} className="text-[10px] font-black uppercase text-blue-600">Full Execution Hub</button>}>
                   <div className="space-y-4">
                      {tasks.slice(0, 4).map(task => (
                         <div key={task.id} className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-blue-200 transition-all hover:bg-white shadow-sm">
                            <div className="flex items-center space-x-4">
                               <input type="checkbox" checked={task.completed} onChange={() => {}} className="w-5 h-5 rounded border-slate-300 text-blue-600" />
                               <span className={`text-sm font-bold ${task.completed ? 'line-through text-slate-400' : 'text-slate-800'}`}>{task.title}</span>
                            </div>
                            <span className={`text-[10px] px-3 py-1 rounded-full font-black uppercase ${task.priority === 'High' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>{task.priority}</span>
                         </div>
                      ))}
                   </div>
                </Card>
                <Card title="Coach Session Insight" className="p-10 border-slate-100 shadow-xl">
                   <div className="space-y-6">
                      <div className="p-6 bg-slate-50 rounded-3xl border-l-8 border-l-blue-600 italic text-slate-700 font-medium leading-relaxed">
                         "Akinola, current momentum on the BSc track is high. I suggest moving the 'Calculus Intensive' block to Tuesday to free up your Thursday for Pastor-Counseling sessions. This harmonizes your stability."
                      </div>
                      <div className="flex items-center gap-4 pt-4 border-t border-slate-100">
                         <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center shadow-inner"><BrainCircuit size={24}/></div>
                         <div>
                            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Transformation suggested</p>
                            <p className="text-sm font-bold text-slate-800">Finalize Alpha release for AI Ethics Hub</p>
                         </div>
                      </div>
                   </div>
                </Card>
             </div>
          </div>
        );
      case 'goals': return <GoalsView goals={goals} />;
      case 'tasks': return <TasksView tasks={tasks} />;
      case 'coach': return <CoachView skills={skills} goals={goals} laws={MAXWELL_LAWS} />;
      case 'finance': return <FinancialLabView skills={skills} debts={debts} />;
      case 'education': return <AcademicHubView courses={courses} />;
      case 'spiritual': return <SpiritualHubView prayers={prayers} />;
      case 'library': return <TransformationLibView ebooks={ebooks} />;
      case 'growth': return <MaxwellGrowthView laws={MAXWELL_LAWS} currentIdx={currentLawIdx} />;
      case 'wellness': return <WellnessCenterView moods={moods} />;
      case 'community': return <CommunityFeedView posts={INITIAL_COMMUNITY_POSTS} />;
      case 'portfolio': return <PortfolioHubView projects={INITIAL_PORTFOLIO} />;
      default:
        return (
          <div className="flex flex-col items-center justify-center py-24 animate-in fade-in">
             <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center text-slate-300 mb-6">
               <Shield size={40} />
             </div>
             <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">Module Under Construction</h3>
             <p className="text-slate-500 font-medium mt-2">This OS component is being stabilized for production.</p>
             <button onClick={() => setActiveView('dashboard')} className="mt-8 text-blue-600 font-black uppercase tracking-widest text-xs flex items-center gap-2">
                <RotateCcw size={14}/> Return to Console
             </button>
          </div>
        );
    }
  };

  // --- Mobile Drawer Overlay ---
  const MobileMenu = ({ isOpen, onClose, views, activeView, onSelectView }: { isOpen: boolean, onClose: () => void, views: {id: string, label: string, icon?: any}[], activeView: ViewType, onSelectView: (v: ViewType) => void }) => {
    if (!isOpen) return null;
    return (
      <div className="fixed inset-0 z-[60] md:hidden">
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
        <aside className="absolute top-0 left-0 bottom-0 w-72 bg-white shadow-2xl p-6 flex flex-col animate-in slide-in-from-left duration-300">
          <div className="flex justify-between items-center mb-10">
            <div className="flex items-center space-x-2">
              <Sparkles className="text-blue-600" size={24} />
              <span className="font-black text-2xl tracking-tighter">LOS.</span>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-400">
              <X size={24} />
            </button>
          </div>
          <nav className="flex-1 space-y-2">
            {views.map(view => (
              <button
                key={view.id}
                onClick={() => onSelectView(view.id as ViewType)}
                className={`w-full flex items-center space-x-4 px-4 py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all ${activeView === view.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-slate-500 hover:bg-slate-50'}`}
              >
                {view.icon && <view.icon size={18} />}
                <span>{view.label}</span>
              </button>
            ))}
          </nav>
          <div className="pt-6 border-t border-slate-100 mt-6">
            <button onClick={handleLaunchApp} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl active:scale-95 transition-all">
              Launch App
            </button>
          </div>
        </aside>
      </div>
    );
  };

  if (!appMode) {
    const publicNavItems = [
      { id: 'landing', label: 'Home' },
      { id: 'about', label: 'About' },
      { id: 'services', label: 'Services' },
      { id: 'pricing', label: 'Pricing' },
      { id: 'contact', label: 'Contact' }
    ];

    return (
      <div className="min-h-screen bg-white flex flex-col font-inter">
        <PublicNavbar activeView={activeView} setActiveView={navigateTo} onLaunch={handleLaunchApp} onMenuToggle={() => setIsMobileMenuOpen(true)} />
        {isLoginModalOpen && <LoginOverlay onLogin={finalizeLogin} onClose={() => setIsLoginModalOpen(false)} />}
        <MobileMenu 
          isOpen={isMobileMenuOpen} 
          onClose={() => setIsMobileMenuOpen(false)} 
          views={publicNavItems} 
          activeView={activeView} 
          onSelectView={navigateTo} 
        />
        <main className="flex-1">
          {activeView === 'landing' && (
            <>
              <LandingHero onLaunch={handleLaunchApp} />
              <SocialProof />
              <ServicesSection />
              <TestimonialsSection />
            </>
          )}
          {activeView === 'about' && (
             <div className="pt-24"><AboutSection /></div>
          )}
          {activeView === 'services' && (
             <div className="pt-24"><ServicesSection /></div>
          )}
          {activeView === 'contact' && (
             <div className="pt-24"><ContactSection /></div>
          )}
          {activeView === 'pricing' && (
             <div className="pt-24">
                <PricingSection onLaunch={handleLaunchApp} />
             </div>
          )}
        </main>
        <PublicFooter setActiveView={navigateTo} />
      </div>
    );
  }

  const internalNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'goals', label: 'Strategic Planning', icon: Target },
    { id: 'finance', label: 'Financial Lab', icon: Wallet },
    { id: 'tasks', label: 'Execution Lab', icon: CheckSquare },
    { id: 'education', label: 'Academic Hub', icon: GraduationCap },
    { id: 'spiritual', label: 'Spiritual Hub', icon: Heart },
    { id: 'growth', label: 'Growth Hub', icon: BookOpen },
    { id: 'library', label: 'The Library', icon: Library },
    { id: 'portfolio', label: 'Portfolio Hub', icon: Briefcase },
    { id: 'wellness', label: 'Wellness Center', icon: Activity },
    { id: 'community', label: 'Community Feed', icon: Users },
    { id: 'coach', label: 'AI Coach', icon: MessageSquare }
  ];

  return (
    <div className="flex min-h-screen font-inter bg-slate-50">
      {/* Sidebar Desktop */}
      <aside className="w-64 bg-white border-r border-slate-100 hidden md:flex flex-col sticky top-0 h-screen p-6 overflow-y-auto">
        <div className="flex items-center space-x-2 mb-10 px-2 cursor-pointer" onClick={() => setAppMode(false)}>
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200"><Sparkles size={24} /></div>
          <span className="text-2xl font-black text-slate-800 tracking-tighter">LOS.</span>
        </div>
        <nav className="flex-1 space-y-1">
          {internalNavItems.map(item => (
            <SidebarItem key={item.id} icon={item.icon} label={item.label} active={activeView === item.id} onClick={() => navigateTo(item.id as ViewType)} />
          ))}
        </nav>
        <div className="mt-8 pt-6 border-t border-slate-100">
          <button onClick={() => navigateTo('profile')} className={`w-full flex items-center space-x-3 px-2 mb-4 group text-left ${activeView === 'profile' ? 'bg-slate-50 py-2 rounded-xl' : 'py-2'}`}>
            <div className="w-9 h-9 bg-slate-200 rounded-full flex items-center justify-center overflow-hidden border shadow-inner"><User size={18} className="text-slate-500" /></div>
            <div className="min-w-0">
               <p className="text-sm font-bold text-slate-800 truncate">{profile.name}</p>
               <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">{profile.tier} Access</p>
            </div>
          </button>
          <button onClick={() => setAppMode(false)} className="w-full flex items-center space-x-2 text-slate-400 hover:text-red-500 px-2 text-xs font-black uppercase tracking-widest transition-all">
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Internal Mobile Menu Overlay */}
      <MobileMenu 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
        views={internalNavItems} 
        activeView={activeView} 
        onSelectView={navigateTo} 
      />

      {/* Main OS View Area */}
      <main className="flex-1 min-w-0 flex flex-col overflow-y-auto">
        <div className="md:hidden sticky top-0 bg-white/90 backdrop-blur-xl border-b border-slate-100 p-4 flex justify-between items-center z-40">
          <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 text-slate-600 hover:bg-slate-50 rounded-xl transition-colors"><Menu size={24}/></button>
          <div className="flex items-center space-x-1" onClick={() => setAppMode(false)}><Sparkles size={18} className="text-blue-600"/><span className="font-black text-slate-800 tracking-tighter">LOS</span></div>
          <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center overflow-hidden border shadow-sm"><User size={16} className="text-slate-500"/></div>
        </div>

        <div className="max-w-7xl mx-auto w-full p-6 lg:p-12 pb-32">
           {renderInternalView()}
        </div>
      </main>

      {/* Mobile Actions Bottom Nav (Internal Only) */}
      <nav className="md:hidden fixed bottom-4 left-4 right-4 bg-slate-900/95 backdrop-blur-xl rounded-2xl p-2 flex justify-between items-center z-50 shadow-2xl border border-white/10">
        <button onClick={() => navigateTo('dashboard')} className={`flex flex-col items-center flex-1 p-2 ${activeView === 'dashboard' ? 'text-blue-400' : 'text-slate-400'}`}><LayoutDashboard size={20} /><span className="text-[8px] font-bold uppercase mt-1">Home</span></button>
        <button onClick={() => navigateTo('tasks')} className={`flex flex-col items-center flex-1 p-2 ${activeView === 'tasks' ? 'text-blue-400' : 'text-slate-400'}`}><CheckSquare size={20} /><span className="text-[8px] font-bold uppercase mt-1">Lab</span></button>
        <button onClick={() => navigateTo('coach')} className="p-4 rounded-xl shadow-2xl -mt-10 bg-blue-600 text-white transform active:scale-95 transition-all shadow-blue-500/40 border-4 border-slate-900"><MessageSquare size={24} /></button>
        <button onClick={() => navigateTo('finance')} className={`flex flex-col items-center flex-1 p-2 ${activeView === 'finance' ? 'text-blue-400' : 'text-slate-400'}`}><Wallet size={20} /><span className="text-[8px] font-bold uppercase mt-1">Cash</span></button>
        <button onClick={() => navigateTo('community')} className={`flex flex-col items-center flex-1 p-2 ${activeView === 'community' ? 'text-blue-400' : 'text-slate-400'}`}><Users size={20} /><span className="text-[8px] font-bold uppercase mt-1">Feed</span></button>
      </nav>
    </div>
  );
}

const ServicesSection = () => (
  <section className="py-24 bg-slate-50 px-6">
    <div className="max-w-7xl mx-auto space-y-20">
      <div className="text-center max-w-2xl mx-auto space-y-4">
         <h2 className="text-5xl font-black text-slate-900 uppercase tracking-tighter">Unified Ecosystem.</h2>
         <p className="text-slate-500 font-bold leading-relaxed text-lg">Integrated modules covering every dimension of a visionary life.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[
          { icon: Wallet, title: 'Financial Lab', desc: 'Monetize your high-level skills and execute aggressive debt-free strategies.' },
          { icon: BrainCircuit, title: 'AI Strategic Coach', desc: 'Personalized guidance rooted in Maxwell\'s Laws for complex decision-making.' },
          { icon: GraduationCap, title: 'Academic Hub', desc: 'Seamlessly track BSc progress while maintaining career momentum.' },
          { icon: Heart, title: 'Spiritual Support', desc: 'Maintain your core with integrated ministry logs and faith monitoring.' },
          { icon: CheckSquare, title: 'Execution Engine', desc: 'High-velocity task systems designed for multi-domain juggling.' },
          { icon: Activity, title: 'Wellness Center', desc: 'Monitor emotional sentiment and maintain peak state for execution.' }
        ].map((s, idx) => (
          <Card key={idx} className="p-12 hover:shadow-2xl transition-all group border-0 shadow-sm bg-white">
             <div className="w-16 h-16 bg-blue-600 text-white rounded-[20px] flex items-center justify-center mb-8 shadow-xl shadow-blue-100 group-hover:scale-110 transition-transform">
                <s.icon size={32} />
             </div>
             <h4 className="text-2xl font-black text-slate-800 mb-4 uppercase tracking-tighter">{s.title}</h4>
             <p className="text-slate-500 text-sm font-bold leading-relaxed">{s.desc}</p>
          </Card>
        ))}
      </div>
    </div>
  </section>
);

const PricingSection = ({ onLaunch }: { onLaunch: () => void }) => (
  <section className="py-24 bg-white px-6">
    <div className="max-w-7xl mx-auto space-y-20">
      <div className="text-center max-w-2xl mx-auto space-y-4">
         <h2 className="text-5xl font-black text-slate-900 uppercase tracking-tighter">Investment tiers.</h2>
         <p className="text-slate-500 font-bold leading-relaxed text-lg">Secure the level of infrastructure your vision demands.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { tier: 'Free', price: '$0', features: ['3 Skill Domains', 'Daily Execution Engine', 'Community Awareness Feed'] },
          { tier: 'Premium', price: '$29', popular: true, features: ['Unlimited Skills', 'AI Strategic Coach', 'Full Financial Lab', 'Academic Trackers', 'Maxwell Modules'] },
          { tier: 'Pro', price: '$99', features: ['Everything in Premium', 'Portfolio Showcase Hub', 'Accountability Partner AI', 'Direct Strategy Reviews'] }
        ].map((p, idx) => (
          <Card key={idx} className={`relative flex flex-col h-full border-2 p-12 ${p.popular ? 'border-blue-600 ring-4 ring-blue-50 shadow-2xl' : 'border-slate-100 shadow-xl'}`}>
            {p.popular && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl">Elite Choice</div>
            )}
            <div className="mb-12 text-center">
               <h4 className="text-2xl font-black text-slate-800 mb-4 uppercase tracking-tighter">{p.tier}</h4>
               <div className="flex items-baseline justify-center space-x-2">
                  <span className="text-6xl font-black text-slate-900">{p.price}</span>
                  <span className="text-slate-400 font-bold text-xl">/mo</span>
               </div>
            </div>
            <ul className="space-y-5 mb-12 flex-1">
               {p.features.map(f => (
                 <li key={f} className="flex items-center space-x-4 text-sm text-slate-600 font-bold">
                    <CheckCircle2 size={20} className="text-blue-600 flex-shrink-0" />
                    <span>{f}</span>
                 </li>
               ))}
            </ul>
            <button onClick={onLaunch} className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-2xl active:scale-95 ${p.popular ? 'bg-blue-600 text-white hover:bg-slate-900' : 'bg-slate-900 text-white hover:bg-blue-600'}`}>
               Initialize {p.tier} Tier
            </button>
          </Card>
        ))}
      </div>
    </div>
  </section>
);

const ContactSection = () => (
  <section className="py-24 bg-slate-50 px-6">
    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
       <div className="space-y-12">
          <h2 className="text-7xl font-black text-slate-900 tracking-tighter uppercase leading-[0.85]">Join the<br />Movement.</h2>
          <p className="text-2xl text-slate-500 font-bold leading-relaxed">Reach out for strategic partnerships or executive technical support.</p>
          <div className="space-y-8">
             <div className="flex items-center space-x-8 p-8 bg-white rounded-[32px] border border-slate-100 shadow-sm">
                <div className="w-16 h-16 bg-green-500 text-white rounded-2xl flex items-center justify-center shadow-xl"><Phone size={32}/></div>
                <div><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">WhatsApp Executive</p><p className="text-2xl font-black text-slate-800">+1 (800) VISION-OS</p></div>
             </div>
             <div className="flex items-center space-x-8 p-8 bg-white rounded-[32px] border border-slate-100 shadow-sm">
                <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-xl"><Mail size={32}/></div>
                <div><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Direct Email</p><p className="text-2xl font-black text-slate-800">system@lifeos.vision</p></div>
             </div>
          </div>
       </div>
       <Card className="shadow-2xl p-12 border-0 bg-white rounded-[48px]">
          <form className="space-y-8" onSubmit={e => e.preventDefault()}>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                   <p className="text-[10px] font-black uppercase text-slate-400 px-2 tracking-widest">Full Name</p>
                   <input type="text" className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-5 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Akinola Olujobi" />
                </div>
                <div className="space-y-2">
                   <p className="text-[10px] font-black uppercase text-slate-400 px-2 tracking-widest">Email Address</p>
                   <input type="email" className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-5 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none" placeholder="visionary@domain.com" />
                </div>
             </div>
             <div className="space-y-2">
                <p className="text-[10px] font-black uppercase text-slate-400 px-2 tracking-widest">Vision Description</p>
                <textarea rows={5} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-5 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Briefly describe your multi-talented goals..."></textarea>
             </div>
             <button className="w-full bg-blue-600 text-white py-6 rounded-2xl font-black uppercase tracking-widest text-xs shadow-2xl hover:bg-slate-900 transition-all active:scale-95 flex items-center justify-center gap-3">
                <Send size={20}/> Dispatch Strategic Inquiry
             </button>
          </form>
       </Card>
    </div>
  </section>
);
