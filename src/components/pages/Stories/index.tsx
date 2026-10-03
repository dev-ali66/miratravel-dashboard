import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, BookOpen } from "lucide-react";
import MiraLoader from "@/components/shared/MiraLoader";
import { useGetStories } from "@/hooks/story/useGetStories";
import { Button } from "@/components/ui/button";

export default function StoriesPage() {
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const category = ""; // Will be implemented later

  const { data: response, isLoading, isError } = useGetStories({ category, slug: search }); // Using existing params for now, API should be updated later
  
  // Safely extract stories array
  const stories = Array.isArray(response?.data) ? response.data : 
                  Array.isArray(response) ? response : [];

  const filteredStories = stories.filter((story: any) => {
    if (type && story.type !== type && story.templateType !== type) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!story.title?.toLowerCase().includes(q) && !story.slug?.toLowerCase().includes(q)) {
        return false;
      }
    }
    return true;
  });

  return (
    <div className="flex h-full w-full flex-col bg-background/50">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-6 border-b border-border/60">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10">
            <BookOpen className="h-6 w-6 text-accent" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Stories</h1>
            <p className="text-sm text-muted-foreground">Manage your travel stories and guidance.</p>
          </div>
        </div>

        <Link to="/stories/new">
          <Button className="gap-2 bg-accent hover:bg-accent/90 text-white shadow-lg hover:shadow-accent/25 transition-all">
            <Plus className="h-4 w-4" />
            New Story
          </Button>
        </Link>
      </div>

      <div className="p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by title or slug..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-background border border-input rounded-md pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
            />
          </div>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="bg-background border border-input rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
          >
            <option value="">All Types</option>
            <option value="short_story">Short Story</option>
            <option value="long_story">Long Story</option>
            <option value="guidance">Guidance</option>
          </select>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12"><MiraLoader /></div>
        ) : isError ? (
          <div className="text-center text-red-500 py-12">Failed to load stories</div>
        ) : filteredStories.length === 0 ? (
          <div className="text-center text-muted-foreground py-12 bg-card rounded-xl border border-border/50">
            No stories found. Create a new one to get started!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredStories.map((story: any) => (
              <div key={story.id} className="group relative bg-card rounded-xl border border-border/60 overflow-hidden hover:border-accent/50 transition-all hover:shadow-xl hover:shadow-accent/5">
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-accent/10 text-accent">
                      {story.type === "short_story" ? "Short Story" : story.type === "long_story" ? "Long Story" : "Guidance"}
                    </span>
                    <span className={`inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                      story.status === 'PUBLISHED' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'
                    }`}>
                      {story.status || "DRAFT"}
                    </span>
                  </div>
                  <h3 className="font-semibold text-lg text-foreground mb-1 line-clamp-1">{story.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4 font-mono">{story.slug}</p>
                  
                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-border/40">
                    <Link to={`/stories/${story.slug}`} className="text-sm font-medium text-accent hover:text-accent/80 transition-colors">
                      Edit Story →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
