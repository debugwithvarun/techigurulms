import React, { useState } from 'react';
import { Trash2, Plus, Code, Link, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

// ─── Types ─────────────────────────────────────────────────────────────────────
export interface ResourceItem { id: string | number; title: string; url: string; }
export interface CodeSnippetItem { id: string | number; language: string; code: string; }
export interface QuizOption { id: string | number; text: string; isCorrect: boolean; }
export interface QuizItem { id: string | number; question: string; options: QuizOption[]; }

export interface VideoSubSubPartItem {
    id: string | number; title: string; videoKey: string; duration: string; description: string;
    isFree: boolean; resources: ResourceItem[]; codeSnippets: CodeSnippetItem[]; quizzes: QuizItem[];
}
export interface VideoSubPartItem extends VideoSubSubPartItem { subParts: VideoSubSubPartItem[]; }
export interface VideoItem extends VideoSubSubPartItem { subParts: VideoSubPartItem[]; }

// ─── Helpers ───────────────────────────────────────────────────────────────────
const uid = () => Date.now() + Math.random();
const inp = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 bg-white transition-all placeholder:text-gray-400';
const TABS = [
    { id: 'resources', label: 'Resources', icon: Link },
    { id: 'code', label: 'Code', icon: Code },
    { id: 'quiz', label: 'Quiz', icon: HelpCircle },
];

interface VideoExtrasProps {
    video: VideoItem;
    topicId: any;
    videoId: any;
    updateVideo: (tId: any, vId: any, field: string, val: any) => void;
}

const VideoExtras: React.FC<VideoExtrasProps> = ({ video, topicId, videoId, updateVideo }) => {
    const [activeTab, setActiveTab] = useState<'resources' | 'code' | 'quiz'>('resources');

    const upd = (field: string, val: any) => updateVideo(topicId, videoId, field, val);

    // Resources
    const addResource = () => upd('resources', [...(video.resources || []), { id: uid(), title: '', url: '' }]);
    const updateResource = (id: any, f: 'title' | 'url', v: string) =>
        upd('resources', (video.resources || []).map(r => r.id === id ? { ...r, [f]: v } : r));
    const removeResource = (id: any) => upd('resources', (video.resources || []).filter(r => r.id !== id));

    // Code
    const addSnippet = () => upd('codeSnippets', [...(video.codeSnippets || []), { id: uid(), language: 'javascript', code: '' }]);
    const updateSnippet = (id: any, f: 'language' | 'code', v: string) =>
        upd('codeSnippets', (video.codeSnippets || []).map(s => s.id === id ? { ...s, [f]: v } : s));
    const removeSnippet = (id: any) => upd('codeSnippets', (video.codeSnippets || []).filter(s => s.id !== id));

    // Quiz
    const addQuiz = () => upd('quizzes', [...(video.quizzes || []), {
        id: uid(), question: '',
        options: [{ id: uid(), text: '', isCorrect: true }, { id: uid(), text: '', isCorrect: false }, { id: uid(), text: '', isCorrect: false }, { id: uid(), text: '', isCorrect: false }]
    }]);
    const updateQuiz = (qId: any, f: 'question', v: string) =>
        upd('quizzes', (video.quizzes || []).map(q => q.id === qId ? { ...q, [f]: v } : q));
    const removeQuiz = (qId: any) => upd('quizzes', (video.quizzes || []).filter(q => q.id !== qId));
    const updateOption = (qId: any, oId: any, f: 'text' | 'isCorrect', v: any) =>
        upd('quizzes', (video.quizzes || []).map(q => q.id === qId ? {
            ...q,
            options: f === 'isCorrect'
                ? q.options.map(o => ({ ...o, isCorrect: o.id === oId }))
                : q.options.map(o => o.id === oId ? { ...o, text: v } : o)
        } : q));

    const counts = {
        resources: (video.resources || []).length,
        code: (video.codeSnippets || []).length,
        quiz: (video.quizzes || []).length,
    };

    return (
        <div className="mt-3 border border-gray-200 rounded-xl overflow-hidden bg-white">
            {/* Tab Bar */}
            <div className="flex border-b border-gray-200 bg-gray-50">
                {TABS.map(t => (
                    <button
                        key={t.id}
                        onClick={() => setActiveTab(t.id as any)}
                        className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold transition-colors relative ${activeTab === t.id ? 'text-purple-700 bg-white' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}`}
                    >
                        <t.icon size={12} /> {t.label}
                        {counts[t.id as keyof typeof counts] > 0 && (
                            <span className="ml-1 w-4 h-4 flex items-center justify-center bg-purple-600 text-white rounded-full text-[10px]">{counts[t.id as keyof typeof counts]}</span>
                        )}
                        {activeTab === t.id && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600" />}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="p-3 space-y-2">
                {/* RESOURCES */}
                {activeTab === 'resources' && (
                    <>
                        {(video.resources || []).map(r => (
                            <div key={r.id} className="flex gap-2 items-center">
                                <input type="text" className={`${inp} flex-1`} placeholder="Resource title" value={r.title} onChange={e => updateResource(r.id, 'title', e.target.value)} />
                                <input type="url" className={`${inp} flex-1`} placeholder="URL (https://...)" value={r.url} onChange={e => updateResource(r.id, 'url', e.target.value)} />
                                <button onClick={() => removeResource(r.id)} className="p-1.5 text-gray-300 hover:text-red-500 rounded-lg transition-colors flex-shrink-0"><Trash2 size={13} /></button>
                            </div>
                        ))}
                        <button onClick={addResource} className="w-full py-2 border border-dashed border-gray-200 rounded-lg text-sm text-gray-400 hover:text-purple-600 hover:border-purple-200 transition-colors flex items-center justify-center gap-1.5 font-medium">
                            <Plus size={13} /> Add Resource
                        </button>
                    </>
                )}

                {/* CODE SNIPPETS */}
                {activeTab === 'code' && (
                    <>
                        {(video.codeSnippets || []).map(s => (
                            <div key={s.id} className="rounded-lg border border-gray-200 overflow-hidden">
                                <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 border-b border-gray-200">
                                    <select className="text-xs font-mono border border-gray-300 rounded-md px-2 py-1 outline-none focus:border-purple-400 bg-white" value={s.language} onChange={e => updateSnippet(s.id, 'language', e.target.value)}>
                                        {['javascript', 'typescript', 'python', 'java', 'cpp', 'csharp', 'html', 'css', 'sql', 'bash', 'json'].map(l => <option key={l} value={l}>{l}</option>)}
                                    </select>
                                    <span className="flex-1 text-xs text-gray-400 font-mono">code snippet</span>
                                    <button onClick={() => removeSnippet(s.id)} className="p-1 text-gray-300 hover:text-red-500 transition-colors"><Trash2 size={13} /></button>
                                </div>
                                <textarea className="w-full px-3 py-2 font-mono text-xs bg-gray-900 text-green-400 resize-none h-24 outline-none border-0" placeholder="// Write your code here..." value={s.code} onChange={e => updateSnippet(s.id, 'code', e.target.value)} />
                            </div>
                        ))}
                        <button onClick={addSnippet} className="w-full py-2 border border-dashed border-gray-200 rounded-lg text-sm text-gray-400 hover:text-purple-600 hover:border-purple-200 transition-colors flex items-center justify-center gap-1.5 font-medium">
                            <Plus size={13} /> Add Code Snippet
                        </button>
                    </>
                )}

                {/* QUIZ */}
                {activeTab === 'quiz' && (
                    <>
                        {(video.quizzes || []).map((q, qi) => (
                            <div key={q.id} className="rounded-lg border border-gray-200 p-3 space-y-2.5">
                                <div className="flex items-start gap-2">
                                    <span className="text-xs font-bold text-gray-400 mt-2.5 flex-shrink-0">Q{qi + 1}.</span>
                                    <input type="text" className={`${inp} flex-1`} placeholder="Enter your question" value={q.question} onChange={e => updateQuiz(q.id, 'question', e.target.value)} />
                                    <button onClick={() => removeQuiz(q.id)} className="p-1.5 text-gray-300 hover:text-red-500 rounded-lg transition-colors flex-shrink-0 mt-1"><Trash2 size={13} /></button>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 ml-5">
                                    {q.options.map((o, oi) => (
                                        <div key={o.id} className={`flex items-center gap-2 p-2 rounded-lg border ${o.isCorrect ? 'border-green-400 bg-green-50' : 'border-gray-200'}`}>
                                            <button onClick={() => updateOption(q.id, o.id, 'isCorrect', true)} className={`w-4 h-4 rounded-full border-2 flex-shrink-0 transition-colors ${o.isCorrect ? 'border-green-500 bg-green-500' : 'border-gray-300 hover:border-green-400'}`}>
                                                {o.isCorrect && <span className="block w-2 h-2 mx-auto mt-0.5 rounded-full bg-white" />}
                                            </button>
                                            <input type="text" className="flex-1 bg-transparent text-xs outline-none text-gray-800 placeholder:text-gray-400" placeholder={`Option ${oi + 1}`} value={o.text} onChange={e => updateOption(q.id, o.id, 'text', e.target.value)} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                        <button onClick={addQuiz} className="w-full py-2 border border-dashed border-gray-200 rounded-lg text-sm text-gray-400 hover:text-purple-600 hover:border-purple-200 transition-colors flex items-center justify-center gap-1.5 font-medium">
                            <Plus size={13} /> Add Quiz Question
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default VideoExtras;
