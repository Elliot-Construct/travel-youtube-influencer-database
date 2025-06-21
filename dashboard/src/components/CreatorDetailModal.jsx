import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Users, Eye, TrendingUp, Star, Globe, Calendar, Play, ExternalLink } from 'lucide-react';
import { tierColors, statusColors } from '../data/influencers';

const CreatorDetailModal = ({ creator, isOpen, onClose }) => {
  if (!creator) return null;

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

  const getScoreBg = (score) => {
    if (score >= 9) return 'bg-green-50 border-green-200';
    if (score >= 8) return 'bg-blue-50 border-blue-200';
    if (score >= 7) return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
  };

  // Mock engagement data for visualization
  const engagementData = [
    { month: 'Jan', engagement: creator.engagement - 0.5 },
    { month: 'Feb', engagement: creator.engagement - 0.2 },
    { month: 'Mar', engagement: creator.engagement + 0.1 },
    { month: 'Apr', engagement: creator.engagement - 0.3 },
    { month: 'May', engagement: creator.engagement + 0.2 },
    { month: 'Jun', engagement: creator.engagement }
  ];

  const viewsData = creator.recentVideos.map((video, index) => ({
    video: `Video ${index + 1}`,
    views: parseInt(video.views.replace(/[KM]/g, '')) * (video.views.includes('M') ? 1000000 : video.views.includes('K') ? 1000 : 1),
    title: video.title.substring(0, 20) + '...'
  }));

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-2xl font-bold">{creator.name}</DialogTitle>
              <DialogDescription className="text-lg text-slate-600">
                {creator.handle} • {creator.contentFocus}
              </DialogDescription>
            </div>
            <Badge 
              style={{ backgroundColor: tierColors[creator.tier] }}
              className="text-white text-sm px-3 py-1"
            >
              {creator.tier}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="text-center">
              <CardContent className="p-4">
                <Users className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                <p className="text-2xl font-bold">{creator.subscribers}</p>
                <p className="text-sm text-slate-600">Subscribers</p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="p-4">
                <Eye className="w-6 h-6 mx-auto mb-2 text-green-600" />
                <p className="text-2xl font-bold">{creator.avgViews}</p>
                <p className="text-sm text-slate-600">Avg Views</p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="p-4">
                <TrendingUp className="w-6 h-6 mx-auto mb-2 text-purple-600" />
                <p className="text-2xl font-bold">{creator.engagement}/10</p>
                <p className="text-sm text-slate-600">Engagement</p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="p-4">
                <Star className="w-6 h-6 mx-auto mb-2 text-yellow-600" />
                <p className="text-2xl font-bold">{creator.brandSafety}/10</p>
                <p className="text-sm text-slate-600">Brand Safety</p>
              </CardContent>
            </Card>
          </div>

          {/* Performance Scores */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Analysis</CardTitle>
              <CardDescription>Comprehensive scoring across key metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className={`p-4 rounded-lg border-2 ${getScoreBg(creator.engagement)}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Engagement Score</span>
                    <span className={`text-2xl font-bold ${getScoreColor(creator.engagement)}`}>
                      {creator.engagement}/10
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-current h-2 rounded-full" 
                      style={{ width: `${creator.engagement * 10}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className={`p-4 rounded-lg border-2 ${getScoreBg(creator.brandSafety)}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Brand Safety</span>
                    <span className={`text-2xl font-bold ${getScoreColor(creator.brandSafety)}`}>
                      {creator.brandSafety}/10
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-current h-2 rounded-full" 
                      style={{ width: `${creator.brandSafety * 10}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className={`p-4 rounded-lg border-2 ${getScoreBg(creator.audienceMatch)}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Audience Match</span>
                    <span className={`text-2xl font-bold ${getScoreColor(creator.audienceMatch)}`}>
                      {creator.audienceMatch}/10
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-current h-2 rounded-full" 
                      style={{ width: `${creator.audienceMatch * 10}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Engagement Trend</CardTitle>
                <CardDescription>6-month engagement performance</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={engagementData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis domain={[0, 10]} />
                    <Tooltip />
                    <Line type="monotone" dataKey="engagement" stroke="#3B82F6" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Video Performance</CardTitle>
                <CardDescription>Latest video view counts</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={viewsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="video" />
                    <YAxis tickFormatter={formatNumber} />
                    <Tooltip formatter={(value) => [formatNumber(value), "Views"]} />
                    <Bar dataKey="views" fill="#10B981" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Recent Videos */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Content</CardTitle>
              <CardDescription>Latest video uploads and performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {creator.recentVideos.map((video, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Play className="w-5 h-5 text-slate-600" />
                      <div>
                        <p className="font-medium">{video.title}</p>
                        <p className="text-sm text-slate-600">{video.timeAgo}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">{video.views} views</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Contact & Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Globe className="w-4 h-4 text-slate-600" />
                    <span className="text-sm">{creator.contact}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-slate-600" />
                    <span className="text-sm">Location: {creator.location}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Verification Status</CardTitle>
              </CardHeader>
              <CardContent>
                <Badge 
                  variant="outline" 
                  style={{ 
                    borderColor: statusColors[creator.status],
                    color: statusColors[creator.status]
                  }}
                  className="w-full justify-center py-2"
                >
                  {creator.status}
                </Badge>
                <p className="text-sm text-slate-600 mt-2">{creator.notes}</p>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4 border-t">
            <Button className="flex-1" size="lg">
              <ExternalLink className="w-4 h-4 mr-2" />
              Visit Channel
            </Button>
            <Button variant="outline" className="flex-1" size="lg">
              Export Report
            </Button>
            <Button variant="outline" className="flex-1" size="lg">
              Add to Campaign
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreatorDetailModal;

