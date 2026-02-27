import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Video, Settings, X, ChevronUp, AlignLeft, Plus, Layers2, Link as LinkIcon, Clock, Lock, Unlock } from 'lucide-react';
import VideoExtras from './VideoExtras';
import type { VideoItem, VideoSubPartItem, VideoSubSubPartItem } from './VideoExtras';

export type { VideoItem };

// ─── Input style shared ────────────────────────────────────────────────────────
const inp = 'bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 w-full transition-all placeholder:text-gray-400';

// ─── Sub-Sub-Part Row ──────────────────────────────────────────────────────────
const VideoSubSubPartRow: React.FC<{
    part: VideoSubSubPartItem;
    parentTopicId: any; parentVideoId: any; parentSubPartId: any;
    onUpdate: (field: string, val: any) => void;
    onDelete: () => void;
}> = ({ part, onUpdate, onDelete }) => {
    const [open, setOpen] = useState(false);
    const upd = (_: any, __: any, field: string, val: any) => onUpdate(field, val);

    return (
        <div className="ml-6 mt-2 rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm">
            <div className="flex flex-col sm:flex-row items-center gap-3 p-3 bg-gray-50/50">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-purple-100 flex-shrink-0">
                    <Video size={14} className="text-purple-600" />
                </div>

                <div className="flex-1 grid grid-cols-1 sm:grid-cols-12 gap-3 w-full">
                    <div className="sm:col-span-5 relative">
                        <span className="absolute -top-2 left-2 bg-white px-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Sub-Sub Title</span>
                        <input type="text" className={`${inp} h-10`} placeholder="e.g. Installing Node.js" value={part.title} onChange={e => onUpdate('title', e.target.value)} />
                    </div>
                    <div className="sm:col-span-5 relative">
                        <span className="absolute -top-2 left-2 bg-white px-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Video URL</span>
                        <div className="relative">
                            <LinkIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input type="text" className={`${inp} h-10 pl-8 font-mono text-xs`} placeholder="https://..." value={part.videoKey} onChange={e => onUpdate('videoKey', e.target.value)} />
                        </div>
                    </div>
                    <div className="sm:col-span-2 relative">
                        <span className="absolute -top-2 left-2 bg-white px-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Duration</span>
                        <div className="relative">
                            <Clock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input type="text" className={`${inp} h-10 pl-8 text-center`} placeholder="00:00" value={part.duration} onChange={e => onUpdate('duration', e.target.value)} />
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0 w-full sm:w-auto justify-end border-t sm:border-t-0 pt-3 sm:pt-0 mt-2 sm:mt-0 border-gray-100">
                    <button onClick={() => onUpdate('isFree', !part.isFree)} title={part.isFree ? "Free Preview" : "Locked"} className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors border ${part.isFree ? 'bg-green-50 border-green-200 text-green-700' : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100'}`}>
                        {part.isFree ? <Unlock size={14} /> : <Lock size={14} />} {part.isFree ? 'Free' : 'Locked'}
                    </button>
                    <button onClick={() => setOpen(!open)} className={`p-2 rounded-lg border transition-colors ${open ? 'bg-purple-50 border-purple-200 text-purple-700' : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'}`}>
                        <Settings size={15} />
                    </button>
                    <button onClick={onDelete} className="p-2 bg-white border border-gray-200 text-gray-400 hover:text-red-600 hover:bg-red-50 hover:border-red-200 rounded-lg transition-all">
                        <X size={15} />
                    </button>
                </div>
            </div>

            <AnimatePresence>
                {open && (
                    <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden border-t border-gray-100">
                        <div className="p-4 bg-white">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 block">Description</span>
                            <textarea className={`${inp} h-20 resize-none mb-3`} placeholder="Enter description for this sub-sub-part..." value={part.description} onChange={e => onUpdate('description', e.target.value)} />
                            <VideoExtras video={part as any} topicId="ss" videoId={part.id} updateVideo={upd} />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// ─── Sub-Part Row ──────────────────────────────────────────────────────────────
const VideoSubPartRow: React.FC<{
    subPart: VideoSubPartItem;
    parentTopicId: any; parentVideoId: any;
    onUpdate: (field: string, val: any) => void;
    onDelete: () => void;
}> = ({ subPart, parentTopicId, parentVideoId, onUpdate, onDelete }) => {
    const [open, setOpen] = useState(false);
    const upd = (_: any, __: any, field: string, val: any) => onUpdate(field, val);

    const addSubSub = () => onUpdate('subParts', [...(subPart.subParts || []), {
        id: Date.now(), title: '', videoKey: '', duration: '', description: '', isFree: false, resources: [], codeSnippets: [], quizzes: []
    }]);

    const updateSubSub = (ssId: any, field: string, val: any) =>
        onUpdate('subParts', (subPart.subParts || []).map(ss => ss.id === ssId ? { ...ss, [field]: val } : ss));

    const deleteSubSub = (ssId: any) =>
        onUpdate('subParts', (subPart.subParts || []).filter(ss => ss.id !== ssId));

    return (
        <div className="ml-4 mt-3 rounded-xl border-2 border-blue-50 bg-white overflow-hidden shadow-sm">
            <div className="flex flex-col xl:flex-row items-center gap-3 p-3 bg-blue-50/30">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-blue-100 flex-shrink-0">
                    <Video size={16} className="text-blue-600" />
                </div>

                <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-3 w-full">
                    <div className="lg:col-span-5 relative">
                        <span className="absolute -top-2 left-2 bg-white px-1 text-[10px] font-bold text-blue-400 uppercase tracking-wider">Sub-part Title</span>
                        <input type="text" className={`${inp} h-11 border-blue-100 focus:border-blue-400 focus:ring-blue-100`} placeholder="e.g. Chapter 1.1: Basics" value={subPart.title} onChange={e => onUpdate('title', e.target.value)} />
                    </div>
                    <div className="lg:col-span-5 relative">
                        <span className="absolute -top-2 left-2 bg-white px-1 text-[10px] font-bold text-blue-400 uppercase tracking-wider">Video URL</span>
                        <div className="relative">
                            <LinkIcon size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input type="text" className={`${inp} h-11 pl-9 border-blue-100 focus:border-blue-400 focus:ring-blue-100 font-mono text-sm`} placeholder="https://..." value={subPart.videoKey} onChange={e => onUpdate('videoKey', e.target.value)} />
                        </div>
                    </div>
                    <div className="lg:col-span-2 relative">
                        <span className="absolute -top-2 left-2 bg-white px-1 text-[10px] font-bold text-blue-400 uppercase tracking-wider">Duration</span>
                        <div className="relative">
                            <Clock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input type="text" className={`${inp} h-11 pl-9 border-blue-100 focus:border-blue-400 focus:ring-blue-100 text-center`} placeholder="00:00" value={subPart.duration} onChange={e => onUpdate('duration', e.target.value)} />
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2 w-full xl:w-auto justify-end flex-shrink-0 border-t xl:border-t-0 pt-3 xl:pt-0 mt-2 xl:mt-0 border-blue-100/50">
                    <button onClick={() => onUpdate('isFree', !subPart.isFree)} title={subPart.isFree ? "Free Preview" : "Locked"} className={`flex items-center w-full xl:w-auto justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-colors border ${subPart.isFree ? 'bg-green-50 border-green-200 text-green-700' : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'}`}>
                        {subPart.isFree ? <Unlock size={15} /> : <Lock size={15} />} <span className="xl:hidden 2xl:block">{subPart.isFree ? 'Free Preview' : 'Locked'}</span>
                    </button>
                    <button onClick={() => setOpen(!open)} className={`p-2.5 rounded-xl border transition-colors ${open ? 'bg-blue-100 border-blue-200 text-blue-700' : 'bg-white border-gray-200 text-gray-500 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200'}`}>
                        {open ? <ChevronUp size={16} /> : <Settings size={16} />}
                    </button>
                    <button onClick={onDelete} className="p-2.5 bg-white border border-gray-200 text-gray-400 hover:text-red-600 hover:bg-red-50 hover:border-red-200 rounded-xl transition-all">
                        <X size={16} />
                    </button>
                </div>
            </div>

            <AnimatePresence>
                {open && (
                    <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden border-t-2 border-blue-50">
                        <div className="p-4 bg-white space-y-4">
                            <div>
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 block">Sub-Part Description</span>
                                <textarea className={`${inp} h-20 resize-none`} placeholder="Detailed overview of this sub-part..." value={subPart.description} onChange={e => onUpdate('description', e.target.value)} />
                            </div>

                            <VideoExtras video={subPart as any} topicId={parentTopicId} videoId={`${parentVideoId}-${subPart.id}`} updateVideo={upd} />

                            {/* Sub-Sub-Parts Panel */}
                            <div className="p-3 bg-gray-50/50 rounded-xl border border-gray-100">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-bold text-gray-600 flex items-center gap-1.5"><Layers2 size={13} /> Deep Dive Modules ({(subPart.subParts || []).length})</span>
                                    <button onClick={addSubSub} className="text-xs font-bold text-blue-600 bg-white hover:bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200 flex items-center gap-1.5 transition-colors shadow-sm">
                                        <Plus size={13} /> Add Module
                                    </button>
                                </div>
                                <div className="space-y-2">
                                    {(subPart.subParts || []).map(ss => (
                                        <VideoSubSubPartRow key={ss.id} part={ss} parentTopicId={parentTopicId} parentVideoId={parentVideoId} parentSubPartId={subPart.id}
                                            onUpdate={(f, v) => updateSubSub(ss.id, f, v)} onDelete={() => deleteSubSub(ss.id)} />
                                    ))}
                                    {(subPart.subParts || []).length === 0 && (
                                        <div className="text-center py-4 text-xs font-medium text-gray-400 border-2 border-dashed border-gray-200 rounded-lg">
                                            No modules added. Use this for highly granular content.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// ─── Main Video Row ────────────────────────────────────────────────────────────
interface VideoRowProps {
    video: VideoItem;
    topicId: number | string;
    updateVideo: (tId: any, vId: any, field: any, val: any) => void;
    deleteVideo: (tId: any, vId: any) => void;
}

const VideoRow: React.FC<VideoRowProps> = ({ video, topicId, updateVideo, deleteVideo }) => {
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [subPartsOpen, setSubPartsOpen] = useState(false);

    const upd = (_: any, __: any, field: string, val: any) => updateVideo(topicId, video.id, field as any, val);

    const addSubPart = () => updateVideo(topicId, video.id, 'subParts', [
        ...(video.subParts || []),
        { id: Date.now(), title: '', videoKey: '', duration: '', description: '', isFree: false, resources: [], codeSnippets: [], quizzes: [], subParts: [] }
    ]);

    const updateSubPart = (spId: any, field: string, val: any) =>
        updateVideo(topicId, video.id, 'subParts', (video.subParts || []).map(sp => sp.id === spId ? { ...sp, [field]: val } : sp));

    const deleteSubPart = (spId: any) =>
        updateVideo(topicId, video.id, 'subParts', (video.subParts || []).filter(sp => sp.id !== spId));

    return (
        <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm hover:border-purple-300 hover:shadow-md transition-all">
            {/* Main Row */}
            <div className="flex flex-col xl:flex-row items-center gap-4 p-4">
                {/* Icon */}
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg, #f3e8ff, #e0e7ff)' }}>
                    <Video size={18} className="text-purple-600" />
                </div>

                {/* Inputs Grid */}
                <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 w-full">
                    <div className="lg:col-span-5 relative">
                        <span className="absolute -top-2.5 left-3 bg-white px-1.5 text-[11px] font-bold text-purple-600 uppercase tracking-wider">Lesson Title</span>
                        <input type="text" className={`${inp} h-12 text-base font-medium`} placeholder="e.g. Introduction to React Hook" value={video.title} onChange={e => updateVideo(topicId, video.id, 'title', e.target.value)} />
                    </div>
                    <div className="lg:col-span-5 relative">
                        <span className="absolute -top-2.5 left-3 bg-white px-1.5 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Video URL</span>
                        <div className="relative">
                            <LinkIcon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input type="text" className={`${inp} h-12 pl-10 font-mono text-sm border-gray-200`} placeholder="https://vimeo.com/... or AWS S3 link" value={video.videoKey} onChange={e => updateVideo(topicId, video.id, 'videoKey', e.target.value)} />
                        </div>
                    </div>
                    <div className="lg:col-span-2 relative">
                        <span className="absolute -top-2.5 left-3 bg-white px-1.5 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Duration</span>
                        <div className="relative">
                            <Clock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input type="text" className={`${inp} h-12 pl-10 text-center font-medium`} placeholder="00:00" value={video.duration} onChange={e => updateVideo(topicId, video.id, 'duration', e.target.value)} />
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 w-full xl:w-auto justify-end border-t xl:border-t-0 pt-4 xl:pt-0 mt-2 xl:mt-0 border-gray-100 flex-shrink-0">
                    <button onClick={() => updateVideo(topicId, video.id, 'isFree', !video.isFree)} title={video.isFree ? "Free Preview enabled" : "Lesson is locked"}
                        className={`flex items-center w-full xl:w-auto justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold transition-all border shadow-sm ${video.isFree ? 'bg-green-500 border-green-600 text-white hover:bg-green-600' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300'}`}>
                        {video.isFree ? <Unlock size={16} /> : <Lock size={16} />}
                        <span className="xl:hidden 2xl:block">{video.isFree ? 'Free Preview' : 'Locked'}</span>
                    </button>

                    <button onClick={() => setSubPartsOpen(!subPartsOpen)} title="Manage Sub-Parts"
                        className={`flex items-center gap-1.5 px-3 py-3 rounded-xl text-sm font-bold transition-colors border shadow-sm ${subPartsOpen ? 'bg-blue-600 border-blue-700 text-white' : 'bg-white border-gray-200 text-gray-600 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200'}`}>
                        <Layers2 size={16} />
                        {(video.subParts || []).length > 0 && <span className={`w-5 h-5 flex items-center justify-center rounded-full text-[11px] ${subPartsOpen ? 'bg-white text-blue-600' : 'bg-blue-100 text-blue-700'}`}>{(video.subParts || []).length}</span>}
                    </button>

                    <button onClick={() => setDetailsOpen(!detailsOpen)} title="Lesson Settings"
                        className={`p-3 rounded-xl border shadow-sm transition-colors ${detailsOpen ? 'bg-purple-100 border-purple-200 text-purple-700' : 'bg-white border-gray-200 text-gray-600 hover:text-purple-600 hover:bg-purple-50 hover:border-purple-200'}`}>
                        {detailsOpen ? <ChevronUp size={18} /> : <Settings size={18} />}
                    </button>

                    <button onClick={() => deleteVideo(topicId, video.id)} className="p-3 bg-white border border-gray-200 text-gray-400 hover:text-white hover:bg-red-500 hover:border-red-600 rounded-xl shadow-sm transition-all ml-1">
                        <X size={18} />
                    </button>
                </div>
            </div>

            {/* Sub-Parts Panel */}
            <AnimatePresence>
                {subPartsOpen && (
                    <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden border-t-2 border-blue-100">
                        <div className="p-4 bg-gradient-to-b from-blue-50/50 to-white space-y-3">
                            <div className="flex items-center justify-between mb-2">
                                <div>
                                    <span className="text-sm font-bold text-blue-900 flex items-center gap-2"><Layers2 size={16} /> Lesson Sub-Parts</span>
                                    <p className="text-xs text-blue-600/70 mt-0.5">Break down your lesson into smaller, digestible segments</p>
                                </div>
                                <button onClick={addSubPart} className="text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-xl shadow-sm transition-colors flex items-center gap-2">
                                    <Plus size={15} /> Add Sub-Part
                                </button>
                            </div>

                            <div className="space-y-3">
                                {(video.subParts || []).map(sp => (
                                    <VideoSubPartRow key={sp.id} subPart={sp} parentTopicId={topicId} parentVideoId={video.id}
                                        onUpdate={(f, v) => updateSubPart(sp.id, f, v)} onDelete={() => deleteSubPart(sp.id)} />
                                ))}
                                {(video.subParts || []).length === 0 && (
                                    <div className="flex flex-col items-center justify-center py-8 border-2 border-dashed border-blue-200 rounded-xl bg-blue-50/30">
                                        <Layers2 size={32} className="text-blue-200 mb-2" />
                                        <p className="text-sm font-bold text-blue-900">No sub-parts created</p>
                                        <p className="text-xs text-blue-500 mt-1 max-w-sm text-center">Use sub-parts if this video lesson covers multiple distinct topics that need their own descriptions or resources.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Details & Extras Panel */}
            <AnimatePresence>
                {detailsOpen && (
                    <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden border-t border-gray-100">
                        <div className="p-5 bg-gray-50">
                            <div className="mb-5 bg-white p-4 rounded-xl border border-gray-200">
                                <div className="flex items-center gap-2 text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
                                    <AlignLeft size={14} className="text-purple-500" /> Lesson Summary
                                </div>
                                <textarea className={`${inp} h-20 resize-none text-sm`} placeholder="Provide a brief summary of what students will learn in this lesson..." value={video.description || ''} onChange={e => updateVideo(topicId, video.id, 'description', e.target.value)} />
                            </div>
                            <VideoExtras video={video} topicId={topicId} videoId={video.id} updateVideo={upd} />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default VideoRow;
