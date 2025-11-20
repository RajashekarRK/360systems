
import React, { useEffect, useState } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { getPendingFacilitatorReviews, releaseReport } from '../services/mockBackend';
import { Participant } from '../types';
import { CheckCircle, FileText, MessageSquare } from 'lucide-react';

export const FacultyDashboard: React.FC = () => {
  const [pendingReviews, setPendingReviews] = useState<Participant[]>([]);

  useEffect(() => {
      // Simulate getting students assigned to this faculty who are pending review
      getPendingFacilitatorReviews('fac1').then(setPendingReviews);
  }, []);

  const handleRelease = async (id: string) => {
      const notes = prompt("Enter facilitator summary/notes for the student:");
      if (notes) {
          await releaseReport(id, notes);
          setPendingReviews(prev => prev.filter(p => p.id !== id));
          alert("Report released to student.");
      }
  }

  // Simulated Cohort Data
  const cohortData = [
    { name: 'Strategic Thinking', pre: 3.2, post: 4.1 },
    { name: 'Influencing', pre: 3.5, post: 3.8 },
    { name: 'Driving Results', pre: 4.0, post: 4.2 },
    { name: 'Talent Dev', pre: 2.8, post: 3.9 },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-slate-800">Faculty Dashboard</h2>
          <span className="px-4 py-1 bg-indigo-100 text-indigo-800 text-sm font-bold rounded-full">Active Module: 360 Diagnostic</span>
      </div>

      {/* Mentor Review Queue (PPSP Feature) */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="font-bold text-slate-700 mb-4 flex items-center">
              <FileText size={20} className="mr-2 text-indigo-600"/> Mentor Review Queue
          </h3>
          <p className="text-sm text-slate-500 mb-4">
              The following reports require your review and sign-off before being released to the students.
          </p>
          {pendingReviews.length === 0 ? (
              <div className="text-center py-8 text-slate-400 italic border-2 border-dashed border-slate-100 rounded-lg">
                  All reports have been reviewed and released.
              </div>
          ) : (
              <div className="space-y-3">
                  {pendingReviews.map(p => (
                      <div key={p.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg bg-slate-50">
                          <div className="flex items-center space-x-4">
                              <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                                  {p.name.charAt(0)}
                              </div>
                              <div>
                                  <p className="font-bold text-slate-800">{p.name}</p>
                                  <p className="text-xs text-slate-500">Status: {p.status}</p>
                              </div>
                          </div>
                          <div className="flex space-x-3">
                              <button className="px-4 py-2 bg-white border border-slate-300 text-slate-600 rounded text-sm font-medium hover:bg-slate-50">
                                  View Report
                              </button>
                              <button 
                                onClick={() => handleRelease(p.id)}
                                className="px-4 py-2 bg-indigo-600 text-white rounded text-sm font-medium hover:bg-indigo-700 flex items-center shadow-sm"
                              >
                                  <CheckCircle size={16} className="mr-2"/> Approve & Release
                              </button>
                          </div>
                      </div>
                  ))}
              </div>
          )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Delta Report Chart */}
          <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <h3 className="font-bold text-slate-700 mb-4">Program Impact: Pre vs Post Assessment</h3>
              <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={cohortData}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} />
                          <XAxis dataKey="name" tick={{fontSize: 12}} />
                          <YAxis domain={[0, 5]} />
                          <Tooltip cursor={{fill: 'transparent'}} />
                          <Legend />
                          <Bar dataKey="pre" name="Baseline (Start)" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="post" name="Current (6 Months)" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                      </BarChart>
                  </ResponsiveContainer>
              </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-6">
              <div>
                  <p className="text-sm text-slate-500">Cohort Size</p>
                  <p className="text-3xl font-bold text-slate-800">42 <span className="text-sm font-normal text-slate-400">participants</span></p>
              </div>
              <div>
                  <p className="text-sm text-slate-500">Completion Rate</p>
                  <p className="text-3xl font-bold text-emerald-600">88%</p>
              </div>
              <div>
                  <p className="text-sm text-slate-500">Lowest Competency</p>
                  <p className="text-lg font-semibold text-rose-500">Talent Development (3.2)</p>
                  <p className="text-xs text-slate-400">Recommended Action: Add workshop on coaching.</p>
              </div>
          </div>
      </div>

      {/* Competency Heatmap */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="font-bold text-slate-700 mb-4">Live Competency Heatmap</h3>
          <div className="overflow-x-auto">
              <div className="min-w-[600px] grid grid-cols-5 gap-1 text-sm">
                  <div className="font-bold text-slate-500 p-2">Participant</div>
                  <div className="font-bold text-slate-500 p-2 text-center">Strategy</div>
                  <div className="font-bold text-slate-500 p-2 text-center">Influence</div>
                  <div className="font-bold text-slate-500 p-2 text-center">Results</div>
                  <div className="font-bold text-slate-500 p-2 text-center">Talent</div>

                  {[...Array(8)].map((_, i) => (
                      <React.Fragment key={i}>
                          <div className="p-2 text-slate-700 border-t border-slate-50">Participant {i + 1}</div>
                          <div className="p-2 text-center border-t border-slate-50"><span className="bg-green-100 text-green-800 px-2 py-0.5 rounded">4.5</span></div>
                          <div className="p-2 text-center border-t border-slate-50"><span className="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">3.2</span></div>
                          <div className="p-2 text-center border-t border-slate-50"><span className="bg-green-100 text-green-800 px-2 py-0.5 rounded">4.1</span></div>
                          <div className="p-2 text-center border-t border-slate-50"><span className="bg-red-100 text-red-800 px-2 py-0.5 rounded">2.4</span></div>
                      </React.Fragment>
                  ))}
              </div>
          </div>
      </div>
    </div>
  );
};
