import React, { useState } from "react";
import { LuCircleAlert, LuListCollapse, LuSparkles } from "react-icons/lu";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { MdOutlinePushPin } from "react-icons/md";

const QuestionList = ({ questions, onExplain, onPin, onNote, pinnedIds }) => {
  const [openIdx, setOpenIdx] = useState(null);

  if (!questions || questions.length === 0) {
    return (
      <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-purple-400/30">
        <div className="text-center text-amber-50/70 text-lg">
          <LuSparkles className="mx-auto mb-4 text-3xl text-purple-400" />
          No questions available yet.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-purple-400/30 hover:border-purple-400/50 transition-all duration-300">
      <div className="text-2xl font-extrabold text-amber-50 mb-8 tracking-tight flex items-center">
        <LuSparkles className="mr-3 text-purple-400" />
        Interview Q & A
        <div className="ml-auto text-sm font-normal text-purple-400 bg-purple-400/20 px-3 py-1 rounded-full">
          {questions.length} Question{questions.length !== 1 ? 's' : ''}
        </div>
      </div>
      <div className="space-y-4">
        {questions.map((q, idx) => {
          const isPinned = pinnedIds?.includes(q._id);
          const isOpen = openIdx === idx;
          return (
            <div
              key={q._id || idx}
              className={`rounded-xl px-6 py-5 shadow-lg border transition-all duration-300 group hover:scale-[1.02] ${
                isOpen 
                  ? "bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-400/50 shadow-purple-500/20" 
                  : "bg-white/10 border-white/20 hover:bg-white/15 hover:border-white/30"
              }`}
            >
              <div className="flex items-center">
                <div className="text-lg font-bold text-purple-400 mr-6 bg-purple-400/20 rounded-full w-8 h-8 flex items-center justify-center">
                  Q
                </div>
                <div className="flex-1 text-lg text-amber-50 font-semibold">
                  {q.question}
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    className={`p-2 rounded-full transition-all duration-200 ${
                      isPinned 
                        ? "bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30" 
                        : "hover:bg-purple-500/20 text-amber-50/60 hover:text-purple-400"
                    }`}
                    title={isPinned ? "Unpin" : "Pin"}
                    onClick={() => onPin(q)}
                  >
                    <MdOutlinePushPin size={18} />
                  </button>
                  <button
                    className="p-2 rounded-full hover:bg-purple-500/20 text-amber-50/60 hover:text-purple-400 transition-all duration-200"
                    title="Add Note"
                    onClick={() => onNote(q)}
                  >
                    <LuListCollapse size={18} />
                  </button>
                  <button
                    className="p-2 rounded-full hover:bg-purple-500/20 text-amber-50/60 hover:text-purple-400 transition-all duration-200"
                    title={isOpen ? "Hide Explanation" : "Show Explanation"}
                    onClick={() => setOpenIdx(isOpen ? null : idx)}
                  >
                    {isOpen ? <FiChevronUp size={18} /> : <FiChevronDown size={18} />}
                  </button>
                </div>
              </div>
              {/* Explanation below the question, but inside the same card */}
              {isOpen && (
                <div className="mt-4 ml-14 p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-400/30 rounded-xl text-amber-50 shadow-inner backdrop-blur-sm animate-fade-in">
                  <div className="font-bold mb-2 text-purple-400 flex items-center">
                    <LuSparkles className="mr-2" />
                    Explanation:
                  </div>
                  <div className="leading-relaxed">
                    {q.answer || (
                      <span className="italic text-amber-50/60 flex items-center">
                        <LuSparkles className="mr-2 text-purple-400/60" />
                        No explanation available yet. Click "Generate Explanation" to get AI-powered insights.
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default QuestionList;
