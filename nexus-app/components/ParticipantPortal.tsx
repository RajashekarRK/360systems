
import React, { useState, useEffect } from 'react';
import { getCurrentParticipant, getModules, getReportData, getParticipantNominations, addNomination, getEvaluationsForUser, saveEvaluationResponse, getCompetencyLibraries, updateUserProfile, getParticipantHistory, getGoals, addGoal, updateGoal, getPulseHistory, submitPulse, getKudos, sendKudos, getSuggestedPeers, getEndorsements, getDevelopmentPlans, updateMilestone, sendClarificationRequest, getReflections, addReflection, autoAssignRaters, getAdHocFeedback, generatePublicLink, submitSuggestion, getGoalComments, addGoalComment, getKPIs, getProjects, addProject, requestProjectFeedback, getProjectFeedbackRequests, getTeamGoals, analyzeSmartGoal, getLeaderboard } from '../services/mockBackend';
import { generateReportSummary } from '../services/geminiService';
import { Participant, Module, RaterNomination, ReportData, DegreeType, RaterType, EvaluationTarget, Competency, EvaluationHistory, ActionGoal, PulseResponse, Kudos, SuggestedPeer, SkillEndorsement, DevelopmentPlan, ReflectionEntry, CriticalFlag, AdHocFeedback, GoalComment, KPI, Project, ProjectFeedbackRequest, TeamGoal, LeaderboardEntry, CompetencyLibrary } from '../types';
import { CheckCircle2, UserPlus, ChevronRight, BarChart2, FileText, Star, ArrowRight, ChevronLeft, Lock, Users, Trash2, X, ChevronDown, MessageSquare, Save, Check, User, Download, FileSpreadsheet, History, Target, Heart, Smile, Zap, Wallet, Trophy, ThumbsUp, Sparkles, ScrollText, ShieldCheck, ArrowUpRight, ArrowDownRight, Minus, AlertTriangle, Mail, BookOpen, Flag, Send, Plus, Wand2, Link, MessageCircle, Tag, Copy, LayoutList, PlayCircle, ArrowLeft, Calendar, CheckSquare, TrendingUp, Building, Megaphone, PieChart, Activity, Folder, Share2, RefreshCw, AlertCircle, Video, Mic, Brain, Medal, HelpCircle, Info } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar, LineChart, Line, ScatterChart, Scatter, ZAxis, Cell } from 'recharts';
import { SmartButton, ValidatedInput } from '../App';

export const ParticipantPortal: React.FC = () => {
  const [participant, setParticipant] = useState<Participant | null>(null);
  const [activeModule, setActiveModule] = useState<Module | null>(null);
  const [view, setView] = useState<'dashboard' | 'nomination' | 'survey' | 'report' | 'profile' | 'history' | 'plans' | 'kudos' | 'reflection' | 'inbox' | 'org' | 'projects' | 'leaderboard'>('dashboard');
  
  // Data States
  const [myNominations, setMyNominations] = useState<RaterNomination[]>([]);
  const [nominationLoading, setNominationLoading] = useState(false);
  const [isAddRaterModalOpen, setIsAddRaterModalOpen] = useState(false);
  const [newRaterForm, setNewRaterForm] = useState({ name: '', email: '', relation: RaterType.PEER });
  const [suggestedPeers, setSuggestedPeers] = useState<SuggestedPeer[]>([]);
  const [history, setHistory] = useState<EvaluationHistory[]>([]);
  const [pulseHistory, setPulseHistory] = useState<PulseResponse[]>([]);
  const [kudosList, setKudosList] = useState<Kudos[]>([]);
  const [todayPulseDone, setTodayPulseDone] = useState(false);
  const [reflections, setReflections] = useState<ReflectionEntry[]>([]);
  const [endorsements, setEndorsements] = useState<SkillEndorsement[]>([]);
  const [feedbackInbox, setFeedbackInbox] = useState<AdHocFeedback[]>([]);
  const [publicLink, setPublicLink] = useState('');
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [aiSummary, setAiSummary] = useState<string>('');
  const [generatingAi, setGeneratingAi] = useState(false);
  const [evaluations, setEvaluations] = useState<EvaluationTarget[]>([]);
  const [activeEvaluationId, setActiveEvaluationId] = useState<string | null>(null);
  const [goals, setGoals] = useState<ActionGoal[]>([]);
  const [teamGoals, setTeamGoals] = useState<TeamGoal[]>([]);
  const [activeGoalId, setActiveGoalId] = useState<string | null>(null);
  const [goalComments, setGoalComments] = useState<GoalComment[]>([]);
  const [newGoalComment, setNewGoalComment] = useState('');
  const [analyzingGoal, setAnalyzingGoal] = useState(false);
  const [suggestionText, setSuggestionText] = useState('');
  const [projects, setProjects] = useState<Project[]>([]);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [newProject, setNewProject] = useState<Partial<Project>>({});
  const [isKudosModalOpen, setIsKudosModalOpen] = useState(false);
  const [newKudos, setNewKudos] = useState({ toName: '', message: '', category: 'Teamwork' as const });
  const [reflectionContent, setReflectionContent] = useState('');
  const [showTour, setShowTour] = useState(true);

  useEffect(() => {
    getCurrentParticipant().then(async (p) => {
      setParticipant(p);
      const mods = await getModules(p.programId);
      if (mods.length > 0) setActiveModule(mods[0]);
      loadNominations(p.id);
      getParticipantHistory(p.id).then(setHistory);
      getGoals(p.id).then(setGoals);
      getTeamGoals('u_mgr').then(setTeamGoals); // Fetch team goals
      getPulseHistory(p.id).then(data => { setPulseHistory(data); setTodayPulseDone(data.some(p => p.date === new Date().toISOString().split('T')[0])); });
      getKudos(p.id).then(setKudosList);
      getEndorsements(p.id).then(setEndorsements);
      getReflections(p.id).then(setReflections);
      getAdHocFeedback(p.id).then(setFeedbackInbox);
      generatePublicLink(p.id).then(setPublicLink);
      getEvaluationsForUser(p.id).then(setEvaluations);
      getProjects(p.id).then(setProjects);
    });
  }, []);

  const loadNominations = (pid: string) => { getParticipantNominations(pid).then(setMyNominations); getSuggestedPeers(pid).then(setSuggestedPeers); }
  const handleViewReport = async () => { if (!participant) return; setView('report'); const data = await getReportData(participant.id); setReportData(data); if (!aiSummary) { setGeneratingAi(true); const summary = await generateReportSummary(participant.name, data.competencyScores); setAiSummary(summary); setGeneratingAi(false); } };
  const handleAddRater = async (e: React.FormEvent) => { e.preventDefault(); if(!participant) return; setNominationLoading(true); await addNomination({ subjectName: participant.name, raterName: newRaterForm.name, raterEmail: newRaterForm.email, relation: newRaterForm.relation }); setNewRaterForm({ name: '', email: '', relation: RaterType.PEER }); setIsAddRaterModalOpen(false); setNominationLoading(false); loadNominations(participant.id); }
  const handleAutoPopulate = async () => { if(!participant) return; setNominationLoading(true); await autoAssignRaters(participant.id); loadNominations(participant.id); setNominationLoading(false); alert('Raters auto-assigned from Org Chart!'); }
  const handleSubmitSuggestion = async () => { if(!suggestionText) return; await submitSuggestion(suggestionText, 'Culture'); setSuggestionText(''); alert("Suggestion submitted anonymously."); }
  const handleSendKudos = async () => { if(participant && newKudos.toName) { await sendKudos({ fromName: participant.name, toName: newKudos.toName, message: newKudos.message, category: newKudos.category }); alert('Kudos Sent!'); setIsKudosModalOpen(false); setNewKudos({ toName: '', message: '', category: 'Teamwork' }); } }
  const handleAnalyzeGoal = async (goalId: string) => { setAnalyzingGoal(true); const updatedGoal = await analyzeSmartGoal(goalId); setGoals(prev => prev.map(g => g.id === goalId ? updatedGoal : g)); setAnalyzingGoal(false); }
  const handleAddProject = async () => { if(participant && newProject.name) { await addProject({...newProject, userId: participant.id}); const updated = await getProjects(participant.id); setProjects(updated); setIsProjectModalOpen(false); setNewProject({}); } }
  const handleAddReflection = async () => { if(participant && reflectionContent) { await addReflection(participant.id, reflectionContent); const updated = await getReflections(participant.id); setReflections(updated); setReflectionContent(''); } }

  const handleAddMBO = async () => {
      if(!participant) return;
      const newG = await addGoal({ userId: participant.id, title: 'New Objective', description: 'Draft Description', weight: 0, status: 'Not Started' });
      setGoals([...goals, newG]);
  };

  const handleViewGoalComments = async (goalId: string) => {
      if (activeGoalId === goalId) {
          setActiveGoalId(null);
      } else {
          setActiveGoalId(goalId);
          const comments = await getGoalComments(goalId);
          setGoalComments(comments);
      }
  };

  const handleSubmitGoalComment = async () => {
      if (activeGoalId && newGoalComment && participant) {
          const c = await addGoalComment({ goalId: activeGoalId, authorName: participant.name, text: newGoalComment, type: 'Negotiation' });
          setGoalComments([...goalComments, c]);
          setNewGoalComment('');
      }
  };

  const handleAddSuggestedRater = async (p: SuggestedPeer) => {
      if(!participant) return;
      setNominationLoading(true);
      await addNomination({ subjectName: participant.name, raterName: p.name, raterEmail: p.email, relation: RaterType.PEER });
      loadNominations(participant.id);
      setNominationLoading(false);
  };

  // --- 1. Survey Runner with AI Coach ---
  const SurveyRunner = () => {
      const [currentEval, setCurrentEval] = useState<EvaluationTarget | null>(null);
      const [mockLibraries, setMockLibraries] = useState<CompetencyLibrary[]>([]);
      const [guidance, setGuidance] = useState<string | null>(null);

      useEffect(() => {
          if (activeEvaluationId) setCurrentEval(evaluations.find(e => e.id === activeEvaluationId) || null);
          getCompetencyLibraries().then(setMockLibraries);
      }, [activeEvaluationId]);

      const checkFeedbackQuality = (text: string) => {
          if (text.length < 10) setGuidance("Keep typing... good feedback is detailed.");
          else if (text.length > 10 && text.length < 30) setGuidance("Too brief. Can you add an example?");
          else if (text.toLowerCase().includes("bad") || text.toLowerCase().includes("terrible")) setGuidance("Try to frame feedback constructively. What could they do differently?");
          else setGuidance(null); // Good
      };

      if (!currentEval) {
          return (
              <div className="max-w-4xl mx-auto pb-10">
                  <button onClick={() => setView('dashboard')} className="mb-4 flex items-center text-slate-500 hover:text-indigo-600"><ArrowLeft size={16} className="mr-1"/> Back to Dashboard</button>
                  <h2 className="text-2xl font-bold mb-6">Pending Evaluations</h2>
                  <div className="grid gap-4">
                      {evaluations.map(ev => (
                          <div key={ev.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex justify-between items-center">
                              <div><h3 className="font-bold text-lg">{ev.name}</h3><p className="text-sm text-slate-500">{ev.role} • {ev.relation}</p></div>
                              <div className="flex items-center space-x-4">
                                  <div className="text-right"><p className="text-sm font-bold text-indigo-600">{ev.progress}%</p><div className="w-24 bg-slate-100 rounded-full h-1.5"><div className="bg-indigo-600 h-1.5 rounded-full" style={{width: `${ev.progress}%`}}></div></div></div>
                                  <SmartButton onClick={() => setActiveEvaluationId(ev.id)}>Start</SmartButton>
                              </div>
                          </div>
                      ))}
                  </div>
              </div>
          );
      }

      return (
          <div className="max-w-3xl mx-auto pb-20">
              <div className="flex justify-between items-center mb-6">
                  <button onClick={() => setActiveEvaluationId(null)} className="text-slate-500 hover:text-indigo-600 flex items-center"><ArrowLeft size={16} className="mr-1"/> Back</button>
                  <span className="font-bold text-slate-700">Evaluating: {currentEval.name}</span>
              </div>
              
              {mockLibraries[0]?.competencies.map((comp, idx) => (
                  <div key={comp.id} className="bg-white rounded-xl shadow-sm border border-slate-200 mb-6 overflow-hidden">
                      <div className="bg-slate-50 p-4 border-b border-slate-100"><h3 className="font-bold text-indigo-900">{comp.name}</h3><p className="text-sm text-slate-500">{comp.description}</p></div>
                      <div className="p-6 space-y-6">
                          {comp.questions.map((q) => (
                              <div key={q.id} className="space-y-3">
                                  <p className="font-medium text-slate-800">{q.text}</p>
                                  {q.type === 'Rating' && (
                                      <div className="flex space-x-4">
                                          {[1, 2, 3, 4, 5].map(val => (
                                              <button key={val} className="w-10 h-10 rounded-full border border-slate-200 hover:bg-indigo-50 hover:border-indigo-500 focus:bg-indigo-600 focus:text-white transition">{val}</button>
                                          ))}
                                      </div>
                                  )}
                                  {q.type === 'Text' && (
                                      <div className="relative">
                                          <textarea className="w-full border p-3 rounded-lg" rows={3} placeholder="Provide specific examples..." onChange={(e) => checkFeedbackQuality(e.target.value)} />
                                          {guidance && <div className="absolute bottom-3 right-3 bg-indigo-100 text-indigo-700 text-xs px-2 py-1 rounded-full flex items-center animate-pulse"><Sparkles size={12} className="mr-1"/> {guidance}</div>}
                                      </div>
                                  )}
                                  {q.type === 'Video' && (
                                      <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:bg-slate-50 cursor-pointer">
                                          <Video className="mx-auto text-slate-400 mb-2" size={32} />
                                          <p className="text-sm text-slate-500">Record Video Response</p>
                                      </div>
                                  )}
                              </div>
                          ))}
                      </div>
                  </div>
              ))}
              <div className="fixed bottom-6 right-6"><SmartButton onClick={() => {alert("Evaluation Saved!"); setActiveEvaluationId(null);}}>Submit Evaluation</SmartButton></div>
          </div>
      );
  };

  // --- 2. Report Viewer with Gap Analysis & Collaboration ---
  const ReportViewer = () => {
      const [activeTab, setActiveTab] = useState<'overview' | 'gaps' | 'comments'>('overview');
      const [collabComments, setCollabComments] = useState<{id: string, text: string, x: number, y: number}[]>([]);
      
      if (!reportData) return <div>Loading Report...</div>;

      const handleImageClick = (e: React.MouseEvent) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          const text = prompt("Add a collaborative comment:");
          if (text) setCollabComments([...collabComments, { id: `cc${Date.now()}`, text, x, y }]);
      };

      return (
          <div className="max-w-6xl mx-auto pb-10">
              <div className="flex justify-between items-center mb-6">
                  <button onClick={() => setView('dashboard')} className="flex items-center text-slate-500"><ArrowLeft size={16} className="mr-1"/> Dashboard</button>
                  <div className="flex space-x-2">
                      <button onClick={() => setActiveTab('overview')} className={`px-4 py-2 rounded-lg text-sm font-bold ${activeTab === 'overview' ? 'bg-indigo-600 text-white' : 'bg-white text-slate-600'}`}>Overview</button>
                      <button onClick={() => setActiveTab('gaps')} className={`px-4 py-2 rounded-lg text-sm font-bold ${activeTab === 'gaps' ? 'bg-indigo-600 text-white' : 'bg-white text-slate-600'}`}>Gap Analysis</button>
                      <button onClick={() => setActiveTab('comments')} className={`px-4 py-2 rounded-lg text-sm font-bold ${activeTab === 'comments' ? 'bg-indigo-600 text-white' : 'bg-white text-slate-600'}`}>Comments</button>
                  </div>
                  <button className="flex items-center text-indigo-600 text-sm font-bold border border-indigo-600 px-3 py-1.5 rounded-lg hover:bg-indigo-50"><Download size={16} className="mr-2"/> PDF</button>
              </div>

              {activeTab === 'overview' && (
                  <div className="space-y-6" onClick={handleImageClick} style={{position: 'relative'}}>
                      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                          <h3 className="font-bold text-lg mb-4 flex items-center"><Sparkles size={20} className="mr-2 text-amber-500"/> Executive AI Summary</h3>
                          {generatingAi ? <div className="animate-pulse h-16 bg-slate-100 rounded"></div> : <p className="text-slate-700 leading-relaxed">{aiSummary}</p>}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                              <h3 className="font-bold text-lg mb-4">Competency Radar</h3>
                              <div className="h-80"><ResponsiveContainer width="100%" height="100%"><RadarChart data={reportData.competencyScores}><PolarGrid /><PolarAngleAxis dataKey="competencyName" /><PolarRadiusAxis angle={30} domain={[0, 5]} /><Radar name="Self" dataKey="selfScore" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} /><Radar name="Manager" dataKey="managerScore" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.3} /><Legend /></RadarChart></ResponsiveContainer></div>
                          </div>
                          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                              <h3 className="font-bold text-lg mb-4">Scores by Rater</h3>
                              <div className="h-80"><ResponsiveContainer width="100%" height="100%"><BarChart data={reportData.competencyScores}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="competencyName" /><YAxis domain={[0, 5]} /><Tooltip /><Legend /><Bar dataKey="selfScore" fill="#8884d8" /><Bar dataKey="peerScore" fill="#82ca9d" /></BarChart></ResponsiveContainer></div>
                          </div>
                      </div>
                      {/* Render Collaborative Comments */}
                      {collabComments.map(c => (
                          <div key={c.id} style={{left: c.x, top: c.y}} className="absolute bg-yellow-100 border border-yellow-300 p-2 rounded shadow text-xs max-w-[150px] z-10">
                              <p>{c.text}</p>
                              <div className="w-2 h-2 bg-yellow-100 border-l border-b border-yellow-300 absolute -bottom-1 left-1/2 transform -translate-x-1/2 rotate-45"></div>
                          </div>
                      ))}
                  </div>
              )}

              {activeTab === 'gaps' && (
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                      <h3 className="font-bold text-lg mb-4">Gap Analysis (Blind Spots vs. Hidden Strengths)</h3>
                      <p className="text-sm text-slate-500 mb-4">Compare your self-perception (X-Axis) against others' perception (Y-Axis).</p>
                      <div className="h-[500px] w-full">
                          <ResponsiveContainer width="100%" height="100%">
                              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                                  <CartesianGrid />
                                  <XAxis type="number" dataKey="selfScore" name="Self Score" domain={[0, 5]} label={{ value: 'Self Rating', position: 'bottom', offset: 0 }} />
                                  <YAxis type="number" dataKey="peerScore" name="Peer Score" domain={[0, 5]} label={{ value: 'Others Rating', angle: -90, position: 'insideLeft' }} />
                                  <Tooltip cursor={{ strokeDasharray: '3 3' }} content={({ payload }) => {
                                      if (payload && payload.length) {
                                          const data = payload[0].payload;
                                          return <div className="bg-white p-2 border rounded shadow">
                                              <p className="font-bold">{data.competencyName}</p>
                                              <p className="text-xs">Self: {data.selfScore}, Others: {data.peerScore}</p>
                                              <p className={`text-xs font-bold ${data.category === 'Blind Spot' ? 'text-red-500' : 'text-green-500'}`}>{data.category}</p>
                                          </div>;
                                      }
                                      return null;
                                  }}/>
                                  <Scatter name="Competencies" data={reportData.competencyScores} fill="#8884d8">
                                      {reportData.competencyScores.map((entry, index) => (
                                          <Cell key={`cell-${index}`} fill={entry.category === 'Blind Spot' ? '#ef4444' : entry.category === 'Hidden Strength' ? '#10b981' : '#6366f1'} />
                                      ))}
                                  </Scatter>
                                  {/* Quadrant Lines */}
                                  <line x1={2.5} y1={0} x2={2.5} y2={5} stroke="#cbd5e1" strokeDasharray="5 5" />
                                  <line x1={0} y1={2.5} x2={5} y2={2.5} stroke="#cbd5e1" strokeDasharray="5 5" />
                              </ScatterChart>
                          </ResponsiveContainer>
                      </div>
                      <div className="flex justify-center space-x-4 mt-4 text-xs">
                          <span className="flex items-center"><div className="w-3 h-3 bg-rose-500 rounded-full mr-1"></div> Blind Spot (Over-confident)</span>
                          <span className="flex items-center"><div className="w-3 h-3 bg-emerald-500 rounded-full mr-1"></div> Hidden Strength (Under-confident)</span>
                          <span className="flex items-center"><div className="w-3 h-3 bg-indigo-500 rounded-full mr-1"></div> Aligned</span>
                      </div>
                  </div>
              )}

              {activeTab === 'comments' && (
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                      <h3 className="font-bold text-lg mb-4">Qualitative Feedback</h3>
                      <div className="space-y-4">
                          {reportData.comments.map(c => (
                              <div key={c.id} className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                                  <div className="flex justify-between mb-2">
                                      <span className="font-bold text-indigo-900 text-sm">{c.competencyName}</span>
                                      <span className="text-xs bg-white px-2 py-0.5 rounded border text-slate-500">{c.raterType}</span>
                                  </div>
                                  <p className="text-slate-700 text-sm">"{c.text}"</p>
                                  <button className="mt-2 text-xs text-indigo-600 hover:underline flex items-center"><MessageSquare size={12} className="mr-1"/> Request Clarification (Anon)</button>
                              </div>
                          ))}
                      </div>
                  </div>
              )}
          </div>
      );
  };

  // --- 3. Onboarding Tour Overlay ---
  const OnboardingTour = () => {
      if (!showTour) return null;
      return (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
              <div className="bg-white p-8 rounded-2xl max-w-md text-center shadow-2xl relative">
                  <button onClick={() => setShowTour(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"><X size={20}/></button>
                  <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4 text-indigo-600"><Sparkles size={32}/></div>
                  <h2 className="text-2xl font-bold text-slate-800 mb-2">Welcome to Nexus 360!</h2>
                  <p className="text-slate-600 mb-6">
                      Your personalized dashboard for feedback, growth, and goals. 
                      Here you can nominate peers, take surveys, and track your MBOs.
                  </p>
                  <div className="flex space-x-3 justify-center">
                      <button onClick={() => setShowTour(false)} className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700">Get Started</button>
                      <button className="px-6 py-2 border border-slate-200 text-slate-600 rounded-lg font-bold hover:bg-slate-50">Take Tour</button>
                  </div>
              </div>
          </div>
      );
  };

  // --- 4. MBO Scorecard (Full Logic) ---
  const MBOScorecard = () => {
    return (
        <div className="max-w-5xl mx-auto pb-10">
           <div className="flex items-center mb-6"><button onClick={() => setView('dashboard')}><ArrowLeft className="mr-2"/></button><h1 className="text-2xl font-bold">MBO Scorecard (Plan-Do-See)</h1><button onClick={handleAddMBO} className="ml-auto bg-indigo-600 text-white px-4 py-2 rounded">+ New Objective</button></div>
           
           {/* Cascading Goals Selection */}
           <div className="mb-8 p-4 bg-indigo-50 border border-indigo-100 rounded-xl">
               <h3 className="font-bold text-indigo-900 mb-2 flex items-center"><Target size={16} className="mr-2"/> Align with Team Goals</h3>
               <div className="flex space-x-4 overflow-x-auto pb-2">
                   {teamGoals.map(tg => (
                       <div key={tg.id} className="min-w-[200px] bg-white p-3 rounded-lg border border-indigo-200 shadow-sm cursor-pointer hover:border-indigo-500">
                           <p className="font-bold text-sm text-indigo-800">{tg.title}</p>
                           <p className="text-xs text-slate-500 mt-1">Due: {tg.dueDate}</p>
                       </div>
                   ))}
               </div>
           </div>

           {goals.map(g => (
               <div key={g.id} className="bg-white p-6 rounded-xl border border-slate-200 mb-4 shadow-sm">
                   <div className="flex justify-between items-start">
                       <div>
                           <div className="flex items-center space-x-2">
                               <h3 className="font-bold text-lg">{g.title}</h3>
                               <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${g.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{g.status}</span>
                           </div>
                           <p className="text-sm text-slate-600 mt-1">{g.description}</p>
                           <div className="mt-2 flex items-center space-x-4 text-xs text-slate-500">
                               <span>Weight: {g.weight}%</span>
                               <span>Due: {g.dueDate}</span>
                               <span>Progress: {g.progress}%</span>
                           </div>
                       </div>
                       <div className="flex space-x-2">
                            <button onClick={() => handleAnalyzeGoal(g.id)} className="p-2 text-indigo-600 bg-indigo-50 rounded hover:bg-indigo-100" title="AI SMART Analysis"><Wand2 size={16}/></button>
                            <button onClick={() => handleViewGoalComments(g.id)} className="p-2 text-slate-600 bg-slate-50 rounded hover:bg-slate-100" title="Negotiate"><MessageSquare size={16}/></button>
                       </div>
                   </div>
                   
                   {/* AI Analysis Result */}
                   {g.smartAnalysis && (
                       <div className="mt-4 bg-purple-50 border border-purple-100 p-3 rounded-lg text-sm">
                           <p className="font-bold text-purple-800 flex items-center"><Sparkles size={14} className="mr-2"/> AI Feedback ({g.smartAnalysis.score}/100)</p>
                           <p className="text-purple-700 mt-1">{g.smartAnalysis.feedback}</p>
                           <div className="flex space-x-2 mt-2">
                               {g.smartAnalysis.isSpecific ? <span className="text-xs bg-white px-2 py-0.5 rounded text-purple-600 border border-purple-200">Specific ✅</span> : <span className="text-xs bg-white px-2 py-0.5 rounded text-slate-400 border">Specific ❌</span>}
                               {g.smartAnalysis.isMeasurable ? <span className="text-xs bg-white px-2 py-0.5 rounded text-purple-600 border border-purple-200">Measurable ✅</span> : <span className="text-xs bg-white px-2 py-0.5 rounded text-slate-400 border">Measurable ❌</span>}
                           </div>
                       </div>
                   )}

                   {/* Negotiation Thread */}
                   {activeGoalId === g.id && (
                       <div className="mt-4 pt-4 border-t border-slate-100">
                           <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Negotiation & Feedback Log</h4>
                           <div className="bg-slate-50 rounded-lg p-3 max-h-40 overflow-y-auto space-y-2 mb-2">
                               {goalComments.map(c => (
                                   <div key={c.id} className="text-xs">
                                       <span className="font-bold text-slate-700">{c.authorName}:</span> <span className="text-slate-600">{c.text}</span>
                                   </div>
                               ))}
                           </div>
                           <div className="flex space-x-2">
                               <input className="flex-1 border p-2 rounded text-xs" placeholder="Add comment or update..." value={newGoalComment} onChange={e => setNewGoalComment(e.target.value)} />
                               <button onClick={handleSubmitGoalComment} className="bg-indigo-600 text-white px-3 py-1 rounded text-xs font-bold">Send</button>
                           </div>
                       </div>
                   )}
               </div>
           ))}
        </div>
    )
  }

  const NominationWizard = () => (
    <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6"><h2 className="text-2xl font-bold">Rater Nomination</h2><SmartButton onClick={() => setIsAddRaterModalOpen(true)}>+ Add Rater</SmartButton></div>
        <div className="bg-white p-6 rounded-xl shadow-sm border mb-6">
            <h3 className="font-bold mb-4">Your Nominees</h3>
            <table className="w-full text-sm text-left">
                <thead className="bg-slate-50"><tr><th className="p-3">Name</th><th className="p-3">Relation</th><th className="p-3">Status</th></tr></thead>
                <tbody>{myNominations.map(n => <tr key={n.id} className="border-t">
                    <td className="p-3">{n.raterName}</td><td className="p-3 capitalize">{n.relation}</td>
                    <td className="p-3"><span className={`px-2 py-1 rounded text-xs font-bold ${n.status==='approved'?'bg-emerald-100 text-emerald-700':'bg-amber-100 text-amber-700'}`}>{n.status}</span></td>
                </tr>)}</tbody>
            </table>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100">
                <h3 className="font-bold text-indigo-900 mb-3">AI Suggested Peers</h3>
                {suggestedPeers.map(p => (
                    <div key={p.id} className="flex justify-between items-center bg-white p-3 rounded mb-2 shadow-sm">
                        <div><p className="font-bold text-sm">{p.name}</p><p className="text-xs text-slate-500">{p.reason}</p></div>
                        <button onClick={() => handleAddSuggestedRater(p)} className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded font-bold hover:bg-indigo-200">Add</button>
                    </div>
                ))}
            </div>
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 flex items-center justify-center">
                <button onClick={handleAutoPopulate} className="bg-white border border-slate-300 px-4 py-2 rounded-lg shadow-sm text-sm font-bold hover:bg-slate-50 flex items-center">
                    <Wand2 size={16} className="mr-2"/> Auto-Populate from Org Chart
                </button>
            </div>
        </div>
        {isAddRaterModalOpen && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-xl w-full max-w-md">
                    <h3 className="font-bold mb-4">Add Rater</h3>
                    <div className="space-y-3">
                        <input className="w-full border p-2 rounded" placeholder="Name" value={newRaterForm.name} onChange={e => setNewRaterForm({...newRaterForm, name: e.target.value})} />
                        <input className="w-full border p-2 rounded" placeholder="Email" value={newRaterForm.email} onChange={e => setNewRaterForm({...newRaterForm, email: e.target.value})} />
                        <select className="w-full border p-2 rounded" value={newRaterForm.relation} onChange={e => setNewRaterForm({...newRaterForm, relation: e.target.value as any})}><option value="peer">Peer</option><option value="direct_report">Direct Report</option><option value="external">External</option></select>
                    </div>
                    <div className="flex justify-end mt-4 space-x-2"><button onClick={() => setIsAddRaterModalOpen(false)} className="px-4 py-2 text-slate-500">Cancel</button><SmartButton onClick={handleAddRater}>Add</SmartButton></div>
                </div>
            </div>
        )}
    </div>
  );

  const HistoryView = () => (
      <div className="max-w-4xl mx-auto">
          <button onClick={() => setView('dashboard')} className="mb-4 flex items-center text-slate-500 hover:text-indigo-600"><ArrowLeft size={16} className="mr-1"/> Back</button>
          <h2 className="text-2xl font-bold mb-6">Assessment History</h2>
          <div className="space-y-4">
              {history.map(h => (
                  <div key={h.id} className="bg-white p-6 rounded-xl border border-slate-200 flex justify-between items-center shadow-sm">
                      <div><h3 className="font-bold text-lg">{h.programName}</h3><p className="text-sm text-slate-500">{h.date}</p></div>
                      <div className="text-right"><div className="text-3xl font-bold text-indigo-600">{h.overallScore}</div><div className="text-xs text-slate-400 uppercase font-bold">Score</div></div>
                  </div>
              ))}
          </div>
      </div>
  );

  const InboxView = () => (
      <div className="max-w-4xl mx-auto">
          <button onClick={() => setView('dashboard')} className="mb-4 flex items-center text-slate-500 hover:text-indigo-600"><ArrowLeft size={16} className="mr-1"/> Back</button>
          <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Feedback Inbox</h2>
              <button onClick={() => {navigator.clipboard.writeText(publicLink); alert("Link copied!");}} className="flex items-center space-x-2 text-sm bg-white border px-3 py-2 rounded-lg hover:bg-slate-50"><Link size={14}/><span>Copy Public Link</span></button>
          </div>
          <div className="grid gap-4">
              {feedbackInbox.map(f => (
                  <div key={f.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                      <div className="flex justify-between mb-2">
                          <span className="font-bold text-slate-700">{f.senderName}</span>
                          <div className="flex items-center text-xs text-slate-400"><Calendar size={12} className="mr-1"/> {f.date}</div>
                      </div>
                      <p className="text-slate-600 italic mb-3">"{f.message}"</p>
                      <div className="flex gap-2">{f.tags.map(t => <span key={t} className="text-xs bg-indigo-50 text-indigo-600 px-2 py-1 rounded">{t}</span>)}</div>
                  </div>
              ))}
          </div>
      </div>
  );

  const KudosView = () => (
      <div className="max-w-4xl mx-auto">
          <button onClick={() => setView('dashboard')} className="mb-4 flex items-center text-slate-500 hover:text-indigo-600"><ArrowLeft size={16} className="mr-1"/> Back</button>
          <div className="flex justify-between items-center mb-6"><h2 className="text-2xl font-bold">Kudos & Recognition</h2><SmartButton onClick={() => setIsKudosModalOpen(true)}>Send Kudos</SmartButton></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {kudosList.map(k => (
                  <div key={k.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-4 text-indigo-100"><Medal size={48}/></div>
                      <div className="relative z-10">
                          <p className="text-xs font-bold text-indigo-600 uppercase mb-1">{k.category}</p>
                          <p className="text-lg font-bold text-slate-800 mb-2">{k.fromName}</p>
                          <p className="text-slate-600">"{k.message}"</p>
                          <p className="text-xs text-slate-400 mt-4">{k.date}</p>
                      </div>
                  </div>
              ))}
          </div>
          {isKudosModalOpen && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                  <div className="bg-white p-6 rounded-xl w-full max-w-md">
                      <h3 className="font-bold mb-4">Send Kudos</h3>
                      <div className="space-y-3">
                          <input className="w-full border p-2 rounded" placeholder="Recipient Name" value={newKudos.toName} onChange={e => setNewKudos({...newKudos, toName: e.target.value})} />
                          <textarea className="w-full border p-2 rounded" placeholder="Message" value={newKudos.message} onChange={e => setNewKudos({...newKudos, message: e.target.value})} />
                          <select className="w-full border p-2 rounded" value={newKudos.category} onChange={e => setNewKudos({...newKudos, category: e.target.value as any})}><option>Teamwork</option><option>Leadership</option><option>Innovation</option><option>Grit</option></select>
                      </div>
                      <div className="flex justify-end mt-4 space-x-2"><button onClick={() => setIsKudosModalOpen(false)} className="px-4 py-2 text-slate-500">Cancel</button><SmartButton onClick={handleSendKudos}>Send</SmartButton></div>
                  </div>
              </div>
          )}
      </div>
  );

  const ProjectsView = () => (
      <div className="max-w-4xl mx-auto">
          <button onClick={() => setView('dashboard')} className="mb-4 flex items-center text-slate-500 hover:text-indigo-600"><ArrowLeft size={16} className="mr-1"/> Back</button>
          <div className="flex justify-between items-center mb-6"><h2 className="text-2xl font-bold">Project Portfolio</h2><SmartButton onClick={() => setIsProjectModalOpen(true)}>+ Add Project</SmartButton></div>
          <div className="space-y-4">
              {projects.map(p => (
                  <div key={p.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                      <div className="flex justify-between">
                          <h3 className="font-bold text-lg">{p.name}</h3>
                          <span className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-600">{p.role}</span>
                      </div>
                      <p className="text-slate-600 my-2">{p.description}</p>
                      <div className="flex justify-between items-center mt-4">
                          <span className="text-xs text-slate-400">Completed: {p.completionDate}</span>
                          <button onClick={() => alert('Request feedback logic')} className="text-sm text-indigo-600 font-bold hover:underline">Request Feedback ({p.feedbackCount})</button>
                      </div>
                  </div>
              ))}
          </div>
          {isProjectModalOpen && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                  <div className="bg-white p-6 rounded-xl w-full max-w-md">
                      <h3 className="font-bold mb-4">Add Project</h3>
                      <div className="space-y-3">
                          <input className="w-full border p-2 rounded" placeholder="Project Name" value={newProject.name || ''} onChange={e => setNewProject({...newProject, name: e.target.value})} />
                          <input className="w-full border p-2 rounded" placeholder="Role" value={newProject.role || ''} onChange={e => setNewProject({...newProject, role: e.target.value})} />
                          <textarea className="w-full border p-2 rounded" placeholder="Description" value={newProject.description || ''} onChange={e => setNewProject({...newProject, description: e.target.value})} />
                          <input type="date" className="w-full border p-2 rounded" value={newProject.completionDate || ''} onChange={e => setNewProject({...newProject, completionDate: e.target.value})} />
                      </div>
                      <div className="flex justify-end mt-4 space-x-2"><button onClick={() => setIsProjectModalOpen(false)} className="px-4 py-2 text-slate-500">Cancel</button><SmartButton onClick={handleAddProject}>Save</SmartButton></div>
                  </div>
              </div>
          )}
      </div>
  );

  const PulseView = () => (
      <div className="max-w-4xl mx-auto">
          <button onClick={() => setView('dashboard')} className="mb-4 flex items-center text-slate-500 hover:text-indigo-600"><ArrowLeft size={16} className="mr-1"/> Back</button>
          <h2 className="text-2xl font-bold mb-6">Organizational Pulse</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                   <h3 className="font-bold text-lg mb-4">Daily Check-in</h3>
                   {todayPulseDone ? (
                       <div className="text-center py-8 text-emerald-600"><CheckCircle size={48} className="mx-auto mb-2"/> You've checked in today!</div>
                   ) : (
                       <div className="flex justify-around my-6">
                           {[1,2,3,4,5].map(s => (
                               <button key={s} onClick={() => {submitPulse(participant!.id, s); setTodayPulseDone(true);}} className="w-10 h-10 rounded-full border border-slate-300 hover:bg-indigo-50 hover:border-indigo-500 flex items-center justify-center transition">{s}</button>
                           ))}
                       </div>
                   )}
               </div>
               <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                   <h3 className="font-bold text-lg mb-4">Suggestion Box (Anonymous)</h3>
                   <textarea className="w-full border p-3 rounded-lg mb-3" rows={4} placeholder="Any ideas for improvement?" value={suggestionText} onChange={e => setSuggestionText(e.target.value)} />
                   <div className="flex justify-end"><SmartButton onClick={handleSubmitSuggestion}>Submit</SmartButton></div>
               </div>
          </div>
      </div>
  );

  const ReflectionView = () => (
      <div className="max-w-4xl mx-auto">
          <button onClick={() => setView('dashboard')} className="mb-4 flex items-center text-slate-500 hover:text-indigo-600"><ArrowLeft size={16} className="mr-1"/> Back</button>
          <div className="flex justify-between items-center mb-6"><h2 className="text-2xl font-bold">Learning Journal</h2></div>
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm mb-6">
              <h3 className="font-bold mb-3">New Entry</h3>
              <textarea className="w-full border p-3 rounded-lg mb-3" rows={3} placeholder="What did you learn today?" value={reflectionContent} onChange={e => setReflectionContent(e.target.value)} />
              <div className="flex justify-end"><SmartButton onClick={handleAddReflection}>Save Entry</SmartButton></div>
          </div>
          <div className="space-y-4">
              {reflections.map(r => (
                  <div key={r.id} className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                      <p className="text-xs text-slate-400 mb-1">{r.date}</p>
                      <p className="text-slate-700">{r.content}</p>
                  </div>
              ))}
          </div>
      </div>
  );

  if (!participant || !activeModule) return <div className="p-10 text-center">Loading Portal...</div>;

  return (
      <div className="h-full flex flex-col">
          <OnboardingTour />
          {view === 'dashboard' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-10">
                  {/* Quick Stats & Hero */}
                  <div className="md:col-span-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 text-white shadow-lg relative overflow-hidden">
                      <div className="relative z-10"><h2 className="text-2xl font-bold mb-2">Welcome back, {participant.name.split(' ')[0]}!</h2><p className="text-indigo-100 mb-6 max-w-md">You have completed {participant.progress}% of your assessment journey.</p><div className="flex space-x-4"><div className="bg-white/20 backdrop-blur-sm p-3 rounded-lg"><p className="text-xs text-indigo-200 uppercase font-bold">Points</p><p className="text-2xl font-bold">{participant.points}</p></div></div></div><Trophy className="absolute right-4 bottom-4 text-white/10" size={120} />
                  </div>

                  {/* Action Cards */}
                  <div className="col-span-full grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                      <button onClick={() => setView('nomination')} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition text-left"><div className="bg-indigo-50 w-10 h-10 rounded-lg flex items-center justify-center text-indigo-600 mb-3"><Users/></div><h3 className="font-bold text-slate-800">Nominations</h3></button>
                      <button onClick={() => setView('survey')} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition text-left"><div className="bg-emerald-50 w-10 h-10 rounded-lg flex items-center justify-center text-emerald-600 mb-3"><CheckCircle2/></div><h3 className="font-bold text-slate-800">Give Feedback</h3></button>
                      <button onClick={handleViewReport} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition text-left"><div className="bg-blue-50 w-10 h-10 rounded-lg flex items-center justify-center text-blue-600 mb-3"><BarChart2/></div><h3 className="font-bold text-slate-800">My Report</h3></button>
                      <button onClick={() => setView('plans')} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition text-left"><div className="bg-purple-50 w-10 h-10 rounded-lg flex items-center justify-center text-purple-600 mb-3"><Target/></div><h3 className="font-bold text-slate-800">Goals (MBO)</h3></button>
                  </div>
                  
                  {/* Sidebar Links in Dashboard */}
                  <div className="bg-white rounded-xl p-4 border shadow-sm space-y-2">
                      <button onClick={() => setView('history')} className="w-full text-left p-2 hover:bg-slate-50 rounded flex items-center"><History size={16} className="mr-2"/> History</button>
                      <button onClick={() => setView('inbox')} className="w-full text-left p-2 hover:bg-slate-50 rounded flex items-center"><Mail size={16} className="mr-2"/> Feedback Inbox</button>
                      <button onClick={() => setView('kudos')} className="w-full text-left p-2 hover:bg-slate-50 rounded flex items-center"><Medal size={16} className="mr-2"/> Kudos</button>
                      <button onClick={() => setView('projects')} className="w-full text-left p-2 hover:bg-slate-50 rounded flex items-center"><Folder size={16} className="mr-2"/> Projects</button>
                      <button onClick={() => setView('org')} className="w-full text-left p-2 hover:bg-slate-50 rounded flex items-center"><Activity size={16} className="mr-2"/> Org Pulse</button>
                      <button onClick={() => setView('reflection')} className="w-full text-left p-2 hover:bg-slate-50 rounded flex items-center"><BookOpen size={16} className="mr-2"/> Journal</button>
                  </div>
              </div>
          )}
          
          {view === 'nomination' && <NominationWizard />}
          {view === 'survey' && <SurveyRunner />}
          {view === 'report' && <ReportViewer />}
          {view === 'plans' && <MBOScorecard />}
          {view === 'history' && <HistoryView />}
          {view === 'inbox' && <InboxView />}
          {view === 'kudos' && <KudosView />}
          {view === 'projects' && <ProjectsView />}
          {view === 'org' && <PulseView />}
          {view === 'reflection' && <ReflectionView />}
      </div>
  );
};
