import React, { useState, useRef, useEffect } from 'react';
import { Message, Role, ChatState } from './types';
import { sendMessageToGemini, initializeChat } from './services/geminiService';
import ChatMessage from './components/ChatMessage';
import { SendIcon, ShieldIcon, MenuIcon, XIcon, HomeIcon, InfoIcon, BookIcon, ChatBubbleIcon, ChevronRightIcon } from './components/Icons';
import { SUGGESTED_TOPICS } from './constants';

type View = 'home' | 'about' | 'policies' | 'chat';

function App() {
  const [currentView, setCurrentView] = useState<View>('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Chat State
  const [chatState, setChatState] = useState<ChatState>({
    messages: [],
    isLoading: false,
    error: null,
  });
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    initializeChat();
    // Pre-seed chat if empty
    if (chatState.messages.length === 0) {
        const welcomeMessage: Message = {
            id: 'welcome',
            role: Role.MODEL,
            text: "AlbionAI analysis:\n\nI am ready to assist. Please select a policy topic or ask a specific question regarding Reform UK's platform.",
            timestamp: new Date()
        };
        setChatState(prev => ({ ...prev, messages: [welcomeMessage] }));
    }
  }, []);

  useEffect(() => {
    if (currentView === 'chat') {
      scrollToBottom();
    }
  }, [chatState.messages, currentView]);

  const scrollToBottom = () => {
    setTimeout(() => {
        chatContainerRef.current?.scrollTo({
            top: chatContainerRef.current.scrollHeight,
            behavior: 'smooth'
        });
    }, 100);
  };

  const handleSend = async (textOverride?: string) => {
    const textToSend = textOverride || input;
    if (!textToSend.trim() || chatState.isLoading) return;

    // Switch to chat view if not already there
    if (currentView !== 'chat') setCurrentView('chat');

    const userMessage: Message = {
      id: Date.now().toString(),
      role: Role.USER,
      text: textToSend,
      timestamp: new Date(),
    };

    setChatState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isLoading: true,
      error: null
    }));
    setInput('');

    try {
      const responseText = await sendMessageToGemini(textToSend);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: Role.MODEL,
        text: responseText,
        timestamp: new Date(),
      };

      setChatState(prev => ({
        ...prev,
        messages: [...prev.messages, aiMessage],
        isLoading: false
      }));
    } catch (error) {
        console.error("Error in conversation flow", error);
        setChatState(prev => ({
            ...prev,
            isLoading: false,
            error: "Connection Interrupted."
        }));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const NavLink = ({ view, label, icon }: { view: View; label: string; icon: React.ReactNode }) => (
    <button 
        onClick={() => {
            setCurrentView(view);
            setMobileMenuOpen(false);
        }}
        className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors duration-200 border-b-2 ${currentView === view ? 'border-albion-blue text-albion-blue' : 'border-transparent text-slate-600 hover:text-albion-blue hover:border-blue-200'}`}
    >
        {icon}
        {label}
    </button>
  );

  return (
    <div className="min-h-screen font-sans flex flex-col relative overflow-x-hidden">
      
      {/* Sticky Header */}
      <header className="fixed top-0 left-0 right-0 h-20 bg-white/95 backdrop-blur-md border-b border-slate-200 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto h-full px-4 md:px-8 flex items-center justify-between">
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => setCurrentView('home')}
          >
            <div className="text-albion-blue group-hover:scale-105 transition-transform">
              <ShieldIcon />
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-bold tracking-tight text-albion-blue font-serif">THE ALBION PROJECT</h1>
            </div>
          </div>
          
          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-2">
            <NavLink view="home" label="Home" icon={<HomeIcon />} />
            <NavLink view="about" label="About Albion" icon={<InfoIcon />} />
            <NavLink view="policies" label="Reform Policies" icon={<BookIcon />} />
            <button 
                onClick={() => setCurrentView('chat')}
                className={`ml-4 flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all shadow-sm hover:shadow-md ${currentView === 'chat' ? 'bg-albion-blue text-white ring-2 ring-offset-2 ring-albion-blue' : 'bg-slate-800 text-white hover:bg-albion-blue'}`}
            >
                <ChatBubbleIcon />
                Ask AlbionAI
            </button>
          </nav>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden text-slate-600"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <XIcon /> : <MenuIcon />}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
          <div className="fixed inset-0 top-20 bg-white z-40 p-6 flex flex-col gap-4 md:hidden animate-in fade-in duration-200">
             <NavLink view="home" label="Home" icon={<HomeIcon />} />
             <NavLink view="about" label="About Albion" icon={<InfoIcon />} />
             <NavLink view="policies" label="Reform Policies" icon={<BookIcon />} />
             <NavLink view="chat" label="Ask AlbionAI" icon={<ChatBubbleIcon />} />
          </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 pt-20">
        
        {/* VIEW: HOME */}
        {currentView === 'home' && (
            <div className="animate-in fade-in duration-500">
                {/* Hero */}
                <section className="bg-white border-b border-slate-100 py-20 md:py-32 px-6">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="inline-block px-3 py-1 bg-blue-50 text-albion-blue text-xs font-bold tracking-widest uppercase mb-6 rounded-full">
                            Independent Policy Analysis
                        </div>
                        <h2 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6 font-serif leading-tight">
                            A New Independent Voice <br/> <span className="text-albion-blue">For Britain</span>
                        </h2>
                        <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
                            Clear, factual breakdowns of Reform UK policies — powered by AlbionAI. 
                            Understanding the future of British governance.
                        </p>
                        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                            <button 
                                onClick={() => setCurrentView('policies')}
                                className="w-full md:w-auto px-8 py-4 bg-albion-blue text-white font-bold rounded-lg shadow-lg hover:bg-blue-900 transition-colors flex items-center justify-center gap-2"
                            >
                                Launch Policy Explorer
                                <ChevronRightIcon />
                            </button>
                            <button 
                                onClick={() => setCurrentView('chat')}
                                className="w-full md:w-auto px-8 py-4 bg-white border border-slate-200 text-slate-700 font-bold rounded-lg hover:border-albion-blue hover:text-albion-blue transition-colors"
                            >
                                Ask AlbionAI
                            </button>
                        </div>
                    </div>
                </section>

                {/* Features */}
                <section className="py-20 px-6 max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { title: 'Immigration & Borders', desc: 'Understand the "One in, One out" policy and ECHR strategy.', icon: '🛡️', prompt: 'Explain the immigration policy.' },
                            { title: 'Economy & Tax', desc: 'Analysis of the £20k tax threshold and spending cuts.', icon: '💷', prompt: 'Explain the economic policy.' },
                            { title: 'NHS Reform', desc: 'Mechanisms for zero waiting lists and tax relief.', icon: '🏥', prompt: 'Explain the NHS reform plan.' }
                        ].map((feature, idx) => (
                            <div key={idx} className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 hover:shadow-md hover:border-albion-blue/30 transition-all group">
                                <div className="text-4xl mb-6 group-hover:scale-110 transition-transform duration-300">{feature.icon}</div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3 font-serif">{feature.title}</h3>
                                <p className="text-slate-600 mb-6 leading-relaxed">{feature.desc}</p>
                                <button 
                                    onClick={() => handleSend(feature.prompt)}
                                    className="text-albion-blue font-bold text-sm flex items-center gap-1 group-hover:gap-2 transition-all"
                                >
                                    Ask AlbionAI <ChevronRightIcon />
                                </button>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        )}

        {/* VIEW: ABOUT */}
        {currentView === 'about' && (
            <div className="max-w-3xl mx-auto px-6 py-16 animate-in slide-in-from-bottom-4 fade-in duration-500">
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-8 font-serif">About The Albion Project</h2>
                <div className="prose prose-lg prose-slate text-slate-600">
                    <p>
                        The Albion Project was established to provide clear, accessible, and mechanistic explanations of Reform UK's political platform. In an era of soundbites and headlines, we believe the British public deserves deep-dive analysis into how policies actually work.
                    </p>
                    <h3 className="text-slate-900 font-serif">Our Mission</h3>
                    <p>
                        To democratize access to political policy information. We use advanced AI to synthesize manifestos, interviews, and official documents into structured, readable briefings.
                    </p>
                    <h3 className="text-slate-900 font-serif">Why "Albion"?</h3>
                    <p>
                        Albion is the oldest known name for the island of Great Britain. It represents a timeless connection to our land, our history, and our shared future. We chose this name to reflect our commitment to national interest above partisan bickering.
                    </p>
                    <div className="bg-blue-50 border-l-4 border-albion-blue p-6 my-8 rounded-r-lg">
                        <h4 className="text-albion-blue font-bold mb-2">Statement of Independence</h4>
                        <p className="text-sm m-0">
                            The Albion Project is an independent educational initiative. While our AI is trained on Reform UK policy data to ensure accuracy, we are not directly affiliated with the party apparatus.
                        </p>
                    </div>
                </div>
            </div>
        )}

        {/* VIEW: POLICIES */}
        {currentView === 'policies' && (
            <div className="max-w-7xl mx-auto px-6 py-16 animate-in slide-in-from-bottom-4 fade-in duration-500">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4 font-serif">Policy Explorer</h2>
                    <p className="text-slate-600 max-w-2xl mx-auto">
                        Select a core pillar of the Reform UK platform to generate an instant AI briefing.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {SUGGESTED_TOPICS.map((topic) => (
                        <button
                            key={topic.id}
                            onClick={() => handleSend(topic.prompt)}
                            className="flex items-start gap-6 p-8 bg-white border border-slate-200 rounded-xl hover:border-albion-blue hover:shadow-lg transition-all text-left group"
                        >
                            <div className="text-4xl p-4 bg-slate-50 rounded-full group-hover:bg-blue-50 transition-colors">
                                {topic.icon}
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2 font-serif group-hover:text-albion-blue transition-colors">
                                    {topic.label}
                                </h3>
                                <p className="text-sm text-slate-500 mb-4 font-mono uppercase tracking-widest">
                                    Status: Active Policy
                                </p>
                                <span className="text-sm font-semibold text-albion-blue flex items-center gap-1">
                                    Generate Briefing <ChevronRightIcon />
                                </span>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        )}

        {/* VIEW: CHAT (Ask AlbionAI) */}
        {currentView === 'chat' && (
            <div className="flex flex-col md:flex-row h-[calc(100vh-80px)] animate-in fade-in duration-300">
                
                {/* Left Panel (Instructions) */}
                <div className="hidden md:flex w-1/3 bg-slate-50 border-r border-slate-200 p-8 flex-col justify-center">
                    <div className="max-w-sm mx-auto">
                        <div className="w-12 h-12 bg-albion-blue rounded-lg flex items-center justify-center text-white mb-6">
                            <ChatBubbleIcon />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4 font-serif">Ask AlbionAI</h2>
                        <p className="text-slate-600 mb-8 leading-relaxed">
                            Our AI assistant is trained on the full scope of Reform UK policies. Ask questions in natural language to get factual, structured answers.
                        </p>
                        
                        <div className="space-y-4">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Try asking:</p>
                            {SUGGESTED_TOPICS.slice(0, 3).map(t => (
                                <button 
                                    key={t.id}
                                    onClick={() => handleSend(t.prompt)}
                                    className="block w-full text-left p-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 hover:border-albion-blue hover:text-albion-blue transition-colors shadow-sm"
                                >
                                    "{t.prompt}"
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Panel (Chat Interface) */}
                <div className="flex-1 flex flex-col bg-white relative">
                    <div 
                        ref={chatContainerRef}
                        className="flex-1 overflow-y-auto p-6 md:p-10 scroll-smooth pb-32"
                    >
                        {chatState.messages.map((msg) => (
                            <ChatMessage key={msg.id} message={msg} />
                        ))}
                        
                        {chatState.isLoading && (
                           <div className="flex items-center gap-2 text-albion-blue font-bold text-sm animate-pulse ml-2">
                               <div className="w-2 h-2 bg-albion-blue rounded-full"></div>
                               Preparing analysis...
                           </div>
                        )}

                        {chatState.error && (
                             <div className="p-4 bg-red-50 text-red-600 rounded-lg border border-red-100 text-sm">
                                 {chatState.error}
                             </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-white/90 backdrop-blur border-t border-slate-100">
                        <div className="max-w-3xl mx-auto relative">
                             <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Ask a question about policy, immigration, or economics..."
                                className="w-full bg-slate-50 border border-slate-200 text-slate-800 px-6 py-4 pr-14 rounded-xl focus:outline-none focus:ring-2 focus:ring-albion-blue/20 focus:border-albion-blue transition-all shadow-sm placeholder:text-slate-400"
                                disabled={chatState.isLoading}
                                autoFocus
                            />
                            <button
                                onClick={() => handleSend()}
                                disabled={!input.trim() || chatState.isLoading}
                                className="absolute right-3 top-3 bottom-3 aspect-square bg-albion-blue text-white rounded-lg flex items-center justify-center hover:bg-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                            >
                                <SendIcon />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )}

      </main>

    </div>
  );
}

export default App;