import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, ScatterChart, Scatter } from 'recharts';
import { Users, Eye, TrendingUp, Star, Filter, Search, Globe, Award, Target } from 'lucide-react';
import { influencerData, tierColors, statusColors } from '../data/influencers';
import CreatorDetailModal from './CreatorDetailModal';

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTier, setSelectedTier] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [sortBy, setSortBy] = useState('avgViewsNum');
  const [selectedCreator, setSelectedCreator] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openCreatorModal = (creator) => {
    setSelectedCreator(creator);
    setIsModalOpen(true);
  };

  const closeCreatorModal = () => {
    setIsModalOpen(false);
    setSelectedCreator(null);
  };

  // Filter and sort data
  const filteredData = useMemo(() => {
    let filtered = influencerData.filter(influencer => {
      const matchesSearch = influencer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           influencer.contentFocus.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTier = selectedTier === 'all' || influencer.tier === selectedTier;
      const matchesStatus = selectedStatus === 'all' || influencer.status === selectedStatus;
      
      return matchesSearch && matchesTier && matchesStatus;
    });

    return filtered.sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return b[sortBy] - a[sortBy];
    });
  }, [searchTerm, selectedTier, selectedStatus, sortBy]);

  // Analytics data
  const tierDistribution = useMemo(() => {
    const distribution = {};
    influencerData.forEach(influencer => {
      distribution[influencer.tier] = (distribution[influencer.tier] || 0) + 1;
    });
    return Object.entries(distribution).map(([tier, count]) => ({
      tier,
      count,
      fill: tierColors[tier]
    }));
  }, []);

  const avgMetrics = useMemo(() => {
    const total = influencerData.length;
    const avgSubs = influencerData.reduce((sum, inf) => sum + inf.subscribersNum, 0) / total;
    const avgViews = influencerData.reduce((sum, inf) => sum + inf.avgViewsNum, 0) / total;
    const avgEngagement = influencerData.reduce((sum, inf) => sum + inf.engagement, 0) / total;
    const avgBrandSafety = influencerData.reduce((sum, inf) => sum + inf.brandSafety, 0) / total;
    
    return { avgSubs, avgViews, avgEngagement, avgBrandSafety };
  }, []);

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(0) + 'K';
    return num.toString();
  };

  const getScoreColor = (score) => {
    if (score >= 9) return 'text-green-600';
    if (score >= 8) return 'text-blue-600';
    if (score >= 7) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">
              Travel Influencer Analytics Dashboard
            </h1>
            <p className="text-lg text-slate-600">
              Strategic Partnership Intelligence • Comprehensive Market Analysis
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              <Award className="w-4 h-4 mr-1" />
              Premium Research
            </Badge>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              <Target className="w-4 h-4 mr-1" />
              25+ Verified Creators
            </Badge>
          </div>
        </div>
        
        {/* Key Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Total Reach</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {formatNumber(avgMetrics.avgSubs * influencerData.length)}
                  </p>
                </div>
                <Users className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Avg Views/Video</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {formatNumber(avgMetrics.avgViews)}
                  </p>
                </div>
                <Eye className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Avg Engagement</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {avgMetrics.avgEngagement.toFixed(1)}/10
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Brand Safety</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {avgMetrics.avgBrandSafety.toFixed(1)}/10
                  </p>
                </div>
                <Star className="w-8 h-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="w-5 h-5 mr-2" />
            Advanced Filtering & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search creators or content focus..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={selectedTier} onValueChange={setSelectedTier}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by tier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tiers</SelectItem>
                <SelectItem value="Tier 1">Tier 1 (Premium)</SelectItem>
                <SelectItem value="Tier 2">Tier 2 (High Performers)</SelectItem>
                <SelectItem value="Tier 3">Tier 3 (Emerging)</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Verified">Verified</SelectItem>
                <SelectItem value="CreatorDB Top 10">CreatorDB Top 10</SelectItem>
                <SelectItem value="Reddit recommended">Reddit Recommended</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="avgViewsNum">Average Views</SelectItem>
                <SelectItem value="subscribersNum">Subscribers</SelectItem>
                <SelectItem value="engagement">Engagement Score</SelectItem>
                <SelectItem value="brandSafety">Brand Safety</SelectItem>
                <SelectItem value="name">Name (A-Z)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 bg-white/80 backdrop-blur-sm">
          <TabsTrigger value="overview">Market Overview</TabsTrigger>
          <TabsTrigger value="creators">Creator Profiles</TabsTrigger>
          <TabsTrigger value="analytics">Performance Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Tier Distribution */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Creator Tier Distribution</CardTitle>
                <CardDescription>
                  Strategic segmentation by performance metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={tierDistribution}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="count"
                      label={({ tier, count }) => `${tier}: ${count}`}
                    >
                      {tierDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Performance Comparison */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Performance Comparison</CardTitle>
                <CardDescription>
                  Average views vs subscriber count analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <ScatterChart data={influencerData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="subscribersNum" 
                      tickFormatter={formatNumber}
                      name="Subscribers"
                    />
                    <YAxis 
                      dataKey="avgViewsNum" 
                      tickFormatter={formatNumber}
                      name="Avg Views"
                    />
                    <Tooltip 
                      formatter={(value, name) => [formatNumber(value), name]}
                      labelFormatter={(value) => `${value}`}
                    />
                    <Scatter dataKey="avgViewsNum" fill="#3B82F6" />
                  </ScatterChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="creators" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredData.map((creator) => (
              <Card key={creator.id} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{creator.name}</CardTitle>
                      <CardDescription className="text-sm text-slate-600">
                        {creator.handle}
                      </CardDescription>
                    </div>
                    <Badge 
                      style={{ backgroundColor: tierColors[creator.tier] }}
                      className="text-white"
                    >
                      {creator.tier}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-medium text-slate-600">Subscribers</p>
                      <p className="text-lg font-bold">{creator.subscribers}</p>
                    </div>
                    <div>
                      <p className="font-medium text-slate-600">Avg Views</p>
                      <p className="text-lg font-bold">{creator.avgViews}</p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="font-medium text-slate-600 mb-1">Content Focus</p>
                    <p className="text-sm">{creator.contentFocus}</p>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="text-center">
                      <p className="font-medium text-slate-600">Engagement</p>
                      <p className={`font-bold ${getScoreColor(creator.engagement)}`}>
                        {creator.engagement}/10
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="font-medium text-slate-600">Brand Safety</p>
                      <p className={`font-bold ${getScoreColor(creator.brandSafety)}`}>
                        {creator.brandSafety}/10
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="font-medium text-slate-600">Audience Match</p>
                      <p className={`font-bold ${getScoreColor(creator.audienceMatch)}`}>
                        {creator.audienceMatch}/10
                      </p>
                    </div>
                  </div>
                  
                  <Badge 
                    variant="outline" 
                    style={{ 
                      borderColor: statusColors[creator.status],
                      color: statusColors[creator.status]
                    }}
                    className="w-full justify-center"
                  >
                    {creator.status}
                  </Badge>
                  
                  <Button 
                    className="w-full" 
                    variant="outline"
                    onClick={() => openCreatorModal(creator)}
                  >
                    View Full Profile
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Subscriber Distribution Analysis</CardTitle>
              <CardDescription>
                Comprehensive reach analysis across creator tiers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={filteredData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    angle={-45}
                    textAnchor="end"
                    height={100}
                  />
                  <YAxis tickFormatter={formatNumber} />
                  <Tooltip 
                    formatter={(value) => [formatNumber(value), "Subscribers"]}
                  />
                  <Bar dataKey="subscribersNum" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Creator Detail Modal */}
      <CreatorDetailModal 
        creator={selectedCreator}
        isOpen={isModalOpen}
        onClose={closeCreatorModal}
      />
    </div>
  );
};

export default Dashboard;

