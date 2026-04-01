export default function StoryBar({ tags }) {
  return (
    <div className="w-full overflow-x-auto pb-4 hide-scrollbar">
      <div className="flex gap-3 px-4 md:px-0">
        <button className="flex-shrink-0 px-5 py-2 rounded-full bg-white/10 text-white font-medium border border-white/10 hover:bg-white/20 transition-colors whitespace-nowrap">
          For You
        </button>
        {tags.map((tag) => (
          <button 
            key={tag}
            className="flex-shrink-0 px-5 py-2 rounded-full bg-card text-gray-400 font-medium border border-white/5 hover:bg-white/5 hover:text-white transition-colors whitespace-nowrap"
          >
            #{tag}
          </button>
        ))}
      </div>
    </div>
  );
}
