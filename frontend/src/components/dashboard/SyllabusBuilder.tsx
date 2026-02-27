import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BookOpen, Plus, ChevronDown, ChevronUp, Trash2,
    AlignLeft, Clock, Tag, GripVertical, List, ChevronRight
} from 'lucide-react';

export interface SyllabusSubSubTopic {
    id: number | string;
    title: string;
    description: string;
    duration: string;
}

export interface SyllabusSubTopic {
    id: number | string;
    title: string;
    description: string;
    duration: string;
    subTopics: SyllabusSubSubTopic[];
}

export interface SyllabusTopic {
    id: number | string;
    title: string;
    description: string;
    duration: string;
    subTopics: SyllabusSubTopic[];
}

interface SyllabusBuilderProps {
    syllabus: SyllabusTopic[];
    onChange: (updated: SyllabusTopic[]) => void;
}

const emptySubSubTopic = (): SyllabusSubSubTopic => ({
    id: Date.now() + Math.random(), title: '', description: '', duration: ''
});

const emptySubTopic = (): SyllabusSubTopic => ({
    id: Date.now() + Math.random(), title: '', description: '', duration: '', subTopics: []
});

const emptyTopic = (): SyllabusTopic => ({
    id: Date.now() + Math.random(), title: '', description: '', duration: '', subTopics: []
});

const SyllabusBuilder: React.FC<SyllabusBuilderProps> = ({ syllabus, onChange }) => {
    const [expandedTopics, setExpandedTopics] = useState<Record<string, boolean>>({});
    const [expandedSubTopics, setExpandedSubTopics] = useState<Record<string, boolean>>({});

    const toggleTopic = (id: any) => setExpandedTopics(prev => ({ ...prev, [id]: !prev[id] }));
    const toggleSubTopic = (id: any) => setExpandedSubTopics(prev => ({ ...prev, [id]: !prev[id] }));

    const addTopic = () => {
        const t = emptyTopic();
        onChange([...syllabus, t]);
        setExpandedTopics(prev => ({ ...prev, [t.id]: true }));
    };

    const updateTopic = (id: any, field: keyof SyllabusTopic, val: any) => {
        onChange(syllabus.map(t => t.id === id ? { ...t, [field]: val } : t));
    };

    const deleteTopic = (id: any) => onChange(syllabus.filter(t => t.id !== id));

    const addSubTopic = (topicId: any) => {
        const st = emptySubTopic();
        onChange(syllabus.map(t => t.id === topicId ? { ...t, subTopics: [...t.subTopics, st] } : t));
        setExpandedSubTopics(prev => ({ ...prev, [st.id]: true }));
    };

    const updateSubTopic = (topicId: any, subId: any, field: keyof SyllabusSubTopic, val: any) => {
        onChange(syllabus.map(t => t.id === topicId
            ? { ...t, subTopics: t.subTopics.map(st => st.id === subId ? { ...st, [field]: val } : st) }
            : t
        ));
    };

    const deleteSubTopic = (topicId: any, subId: any) => {
        onChange(syllabus.map(t => t.id === topicId
            ? { ...t, subTopics: t.subTopics.filter(st => st.id !== subId) }
            : t
        ));
    };

    const addSubSubTopic = (topicId: any, subId: any) => {
        const sst = emptySubSubTopic();
        onChange(syllabus.map(t => t.id === topicId
            ? {
                ...t, subTopics: t.subTopics.map(st =>
                    st.id === subId ? { ...st, subTopics: [...st.subTopics, sst] } : st
                )
            }
            : t
        ));
    };

    const updateSubSubTopic = (topicId: any, subId: any, ssId: any, field: keyof SyllabusSubSubTopic, val: any) => {
        onChange(syllabus.map(t => t.id === topicId
            ? {
                ...t, subTopics: t.subTopics.map(st =>
                    st.id === subId
                        ? { ...st, subTopics: st.subTopics.map(ss => ss.id === ssId ? { ...ss, [field]: val } : ss) }
                        : st
                )
            }
            : t
        ));
    };

    const deleteSubSubTopic = (topicId: any, subId: any, ssId: any) => {
        onChange(syllabus.map(t => t.id === topicId
            ? {
                ...t, subTopics: t.subTopics.map(st =>
                    st.id === subId ? { ...st, subTopics: st.subTopics.filter(ss => ss.id !== ssId) } : st
                )
            }
            : t
        ));
    };

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-200">
                        <BookOpen size={18} className="text-white" />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-800 text-base">Syllabus Builder</h3>
                        <p className="text-xs text-slate-500">{syllabus.length} topic{syllabus.length !== 1 ? 's' : ''} · Nested sub-topics supported</p>
                    </div>
                </div>
                <button
                    onClick={addTopic}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-semibold text-sm shadow-md shadow-emerald-200 hover:shadow-lg hover:-translate-y-0.5 transition-all"
                >
                    <Plus size={15} /> Add Topic
                </button>
            </div>

            {syllabus.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 border-2 border-dashed border-emerald-200 rounded-2xl text-slate-400 bg-emerald-50/30">
                    <BookOpen size={40} className="mb-3 opacity-20" />
                    <p className="text-sm font-medium">No syllabus yet. Click "Add Topic" to start.</p>
                </div>
            )}

            <AnimatePresence>
                {syllabus.map((topic, tIndex) => (
                    <motion.div
                        key={topic.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.97 }}
                        className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm"
                    >
                        {/* Topic Header */}
                        <div className="bg-gradient-to-r from-slate-50 to-emerald-50/30 p-4 border-b border-slate-100">
                            <div className="flex items-start gap-3">
                                <div className="w-7 h-7 bg-emerald-100 text-emerald-700 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 mt-1">
                                    {tIndex + 1}
                                </div>
                                <div className="flex-1 space-y-2">
                                    <input
                                        type="text"
                                        placeholder="Topic Title *"
                                        className="w-full bg-transparent text-slate-800 font-bold text-base placeholder:text-slate-400 outline-none border-b border-transparent focus:border-emerald-400 pb-1"
                                        value={topic.title}
                                        onChange={(e) => updateTopic(topic.id, 'title', e.target.value)}
                                    />
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="relative">
                                            <AlignLeft size={12} className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400" />
                                            <input
                                                type="text"
                                                placeholder="Short description..."
                                                className="w-full pl-7 pr-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-600 outline-none focus:border-emerald-400"
                                                value={topic.description}
                                                onChange={(e) => updateTopic(topic.id, 'description', e.target.value)}
                                            />
                                        </div>
                                        <div className="relative">
                                            <Clock size={12} className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400" />
                                            <input
                                                type="text"
                                                placeholder="Duration (e.g. 2h 30m)"
                                                className="w-full pl-7 pr-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-600 outline-none focus:border-emerald-400"
                                                value={topic.duration}
                                                onChange={(e) => updateTopic(topic.id, 'duration', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1.5 shrink-0">
                                    <button onClick={() => addSubTopic(topic.id)} className="p-1.5 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-colors" title="Add sub-topic">
                                        <Plus size={15} />
                                    </button>
                                    <button onClick={() => toggleTopic(topic.id)} className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
                                        {expandedTopics[topic.id] ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                                    </button>
                                    <button onClick={() => deleteTopic(topic.id)} className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Delete topic">
                                        <Trash2 size={15} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Sub-Topics */}
                        <AnimatePresence>
                            {expandedTopics[topic.id] && (
                                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                                    <div className="p-4 space-y-3 bg-white">
                                        {topic.subTopics.length === 0 && (
                                            <div className="text-xs text-slate-400 italic text-center py-3">No sub-topics yet. Click <span className="text-emerald-600 font-semibold">+</span> to add one.</div>
                                        )}
                                        <AnimatePresence>
                                            {topic.subTopics.map((subTopic, sIndex) => (
                                                <motion.div key={subTopic.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="ml-4 pl-4 border-l-2 border-emerald-200">
                                                    <div className="bg-emerald-50/30 border border-emerald-100 rounded-xl overflow-hidden">
                                                        {/* SubTopic Header */}
                                                        <div className="p-3 flex items-start gap-3">
                                                            <div className="w-5 h-5 bg-emerald-100 text-emerald-600 rounded flex items-center justify-center text-[10px] font-bold shrink-0 mt-1">
                                                                {tIndex + 1}.{sIndex + 1}
                                                            </div>
                                                            <div className="flex-1 space-y-2">
                                                                <input
                                                                    type="text"
                                                                    placeholder="Sub-Topic Title"
                                                                    className="w-full bg-transparent text-slate-700 font-semibold text-sm placeholder:text-slate-400 outline-none border-b border-transparent focus:border-emerald-400 pb-0.5"
                                                                    value={subTopic.title}
                                                                    onChange={(e) => updateSubTopic(topic.id, subTopic.id, 'title', e.target.value)}
                                                                />
                                                                <div className="grid grid-cols-2 gap-2">
                                                                    <input type="text" placeholder="Description" className="p-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-600 outline-none focus:border-emerald-400" value={subTopic.description} onChange={(e) => updateSubTopic(topic.id, subTopic.id, 'description', e.target.value)} />
                                                                    <input type="text" placeholder="Duration" className="p-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-600 outline-none focus:border-emerald-400" value={subTopic.duration} onChange={(e) => updateSubTopic(topic.id, subTopic.id, 'duration', e.target.value)} />
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-1 shrink-0">
                                                                <button onClick={() => addSubSubTopic(topic.id, subTopic.id)} className="p-1 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-colors" title="Add sub-sub-topic"><Plus size={13} /></button>
                                                                <button onClick={() => toggleSubTopic(subTopic.id)} className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                                                                    {expandedSubTopics[subTopic.id] ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                                                                </button>
                                                                <button onClick={() => deleteSubTopic(topic.id, subTopic.id)} className="p-1 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={13} /></button>
                                                            </div>
                                                        </div>
                                                        {/* Sub-Sub-Topics */}
                                                        <AnimatePresence>
                                                            {expandedSubTopics[subTopic.id] && (
                                                                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                                                                    <div className="px-3 pb-3 space-y-2 bg-white/60 border-t border-emerald-100">
                                                                        {subTopic.subTopics.length === 0 && (
                                                                            <p className="text-[11px] text-slate-400 italic text-center py-2">No nested items. Click <span className="text-emerald-600 font-semibold">+</span> to add.</p>
                                                                        )}
                                                                        {subTopic.subTopics.map((ss, ssIndex) => (
                                                                            <div key={ss.id} className="flex items-start gap-2 ml-5 pl-3 border-l-2 border-emerald-100 py-2">
                                                                                <span className="text-[10px] font-bold text-slate-400 shrink-0 mt-2">{tIndex + 1}.{sIndex + 1}.{ssIndex + 1}</span>
                                                                                <div className="flex-1 grid grid-cols-3 gap-2">
                                                                                    <input type="text" placeholder="Title" className="col-span-1 p-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-600 outline-none focus:border-emerald-400" value={ss.title} onChange={(e) => updateSubSubTopic(topic.id, subTopic.id, ss.id, 'title', e.target.value)} />
                                                                                    <input type="text" placeholder="Description" className="col-span-1 p-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-600 outline-none focus:border-emerald-400" value={ss.description} onChange={(e) => updateSubSubTopic(topic.id, subTopic.id, ss.id, 'description', e.target.value)} />
                                                                                    <input type="text" placeholder="Duration" className="col-span-1 p-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-600 outline-none focus:border-emerald-400" value={ss.duration} onChange={(e) => updateSubSubTopic(topic.id, subTopic.id, ss.id, 'duration', e.target.value)} />
                                                                                </div>
                                                                                <button onClick={() => deleteSubSubTopic(topic.id, subTopic.id, ss.id)} className="p-1 text-slate-300 hover:text-red-500 rounded-lg transition-colors shrink-0 mt-1"><Trash2 size={12} /></button>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </motion.div>
                                                            )}
                                                        </AnimatePresence>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </AnimatePresence>
                                        <button onClick={() => addSubTopic(topic.id)} className="ml-4 w-[calc(100%-1rem)] py-2 border border-dashed border-emerald-200 rounded-xl text-emerald-600 font-medium hover:border-emerald-400 hover:bg-emerald-50 transition-all flex items-center justify-center gap-1.5 text-xs">
                                            <Plus size={13} /> Add Sub-Topic
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                ))}
            </AnimatePresence>

            {syllabus.length > 0 && (
                <button onClick={addTopic} className="w-full py-3 border border-dashed border-emerald-200 rounded-2xl text-emerald-600 font-semibold hover:border-emerald-400 hover:bg-emerald-50 transition-all flex items-center justify-center gap-2 text-sm">
                    <Plus size={16} /> Add Another Topic
                </button>
            )}
        </div>
    );
};

export default SyllabusBuilder;
