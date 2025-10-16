import { useState } from 'react';
import { Search, BookOpen, Filter, Star } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  searchKnowledge,
  getByCategory,
  getHighPriority,
  KNOWLEDGE_CATEGORIES,
  type QAPair
} from '@/data/enhancedKnowledge';
import { COMPLETE_KNOWLEDGE_BASE } from '@/data/completeKnowledgeBase';

export const KnowledgeBrowser = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [results, setResults] = useState<QAPair[]>([]);
  const [showHighPriority, setShowHighPriority] = useState(false);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      const matches = searchKnowledge(searchQuery, 20);
      setResults(matches);
      setSelectedCategory(null);
      setShowHighPriority(false);
    }
  };

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
    const categoryResults = getByCategory(categoryId);
    setResults(categoryResults.slice(0, 50)); // Show first 50
    setSearchQuery('');
    setShowHighPriority(false);
  };

  const handleShowHighPriority = () => {
    setShowHighPriority(true);
    setResults(getHighPriority(50));
    setSelectedCategory(null);
    setSearchQuery('');
  };

  const totalQuestions = COMPLETE_KNOWLEDGE_BASE.length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="glass-panel-strong p-6 rounded-2xl border-border/50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                AI Knowledge Base
              </h1>
              <p className="text-muted-foreground">
                {totalQuestions.toLocaleString()}+ Questions & Answers
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleShowHighPriority}
            className="glass-panel border-primary/50"
          >
            <Star className="w-4 h-4 mr-2" />
            High Priority
          </Button>
        </div>

        {/* Search Bar */}
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Ask anything... (e.g., 'What is safe CO2 level?')"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="pl-10 glass-panel border-border/50"
            />
          </div>
          <Button onClick={handleSearch} className="bg-primary/20 hover:bg-primary/30">
            Search
          </Button>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {KNOWLEDGE_CATEGORIES.map((category) => (
          <Card
            key={category.id}
            className={`glass-panel p-4 cursor-pointer transition-all duration-300 hover:scale-105 ${
              selectedCategory === category.id ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => handleCategoryClick(category.id)}
          >
            <div className="text-center">
              <div className="text-3xl mb-2">{category.icon}</div>
              <h3 className="font-bold text-sm mb-1">{category.name}</h3>
              <p className="text-xs text-muted-foreground line-clamp-2">
                {category.description}
              </p>
              <Badge variant="outline" className="mt-2 text-xs">
                {getByCategory(category.id).length} Q&A
              </Badge>
            </div>
          </Card>
        ))}
      </div>

      {/* Results */}
      {results.length > 0 && (
        <div className="glass-panel-strong p-6 rounded-2xl border-border/50">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Filter className="w-5 h-5" />
              {showHighPriority
                ? 'High Priority Questions'
                : selectedCategory
                ? `${KNOWLEDGE_CATEGORIES.find((c) => c.id === selectedCategory)?.name} Questions`
                : 'Search Results'}
            </h2>
            <Badge variant="secondary">{results.length} results</Badge>
          </div>

          <ScrollArea className="h-[600px] pr-4">
            <div className="space-y-4">
              {results.map((qa) => {
                const category = KNOWLEDGE_CATEGORIES.find((c) => c.id === qa.category);
                return (
                  <Card key={qa.id} className="glass-panel p-4 border-border/50">
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">{category?.icon || '💡'}</div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-bold text-primary">{qa.question}</h3>
                          <div className="flex gap-1">
                            {Array.from({ length: qa.priority }).map((_, i) => (
                              <Star key={i} className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-foreground/80 mb-3">{qa.answer}</p>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="outline" className="text-xs">
                            {category?.name}
                          </Badge>
                          {qa.subcategory && (
                            <Badge variant="secondary" className="text-xs">
                              {qa.subcategory}
                            </Badge>
                          )}
                          {qa.keywords.slice(0, 3).map((keyword, i) => (
                            <Badge key={i} variant="outline" className="text-xs opacity-60">
                              {keyword}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </ScrollArea>
        </div>
      )}

      {/* Empty State */}
      {results.length === 0 && !selectedCategory && !searchQuery && (
        <div className="glass-panel-strong p-12 rounded-2xl border-border/50 text-center">
          <BookOpen className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-xl font-bold mb-2">Explore the Knowledge Base</h3>
          <p className="text-muted-foreground mb-6">
            Search for questions or browse by category to access {totalQuestions.toLocaleString()}+ answers
          </p>
          <div className="flex gap-2 justify-center flex-wrap">
            <Badge variant="outline">Air Quality</Badge>
            <Badge variant="outline">Safety</Badge>
            <Badge variant="outline">Smart Devices</Badge>
            <Badge variant="outline">Health</Badge>
            <Badge variant="outline">Energy</Badge>
          </div>
        </div>
      )}

      {/* No Results */}
      {results.length === 0 && (searchQuery || selectedCategory) && (
        <div className="glass-panel-strong p-12 rounded-2xl border-border/50 text-center">
          <Search className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-xl font-bold mb-2">No Results Found</h3>
          <p className="text-muted-foreground">
            Try a different search term or browse categories above
          </p>
        </div>
      )}
    </div>
  );
};
