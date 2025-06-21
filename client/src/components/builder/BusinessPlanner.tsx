import { useState } from 'react';
import { ArrowLeft, Save, Target, TrendingUp, Calendar, DollarSign, Users, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';

interface BusinessPlannerProps {
  projectId: number;
  onBack: () => void;
}

interface Goal {
  id: string;
  title: string;
  description: string;
  targetDate: string;
  progress: number;
  category: 'revenue' | 'users' | 'features' | 'marketing';
}

interface Milestone {
  id: string;
  title: string;
  date: string;
  completed: boolean;
}

export function BusinessPlanner({ projectId, onBack }: BusinessPlannerProps) {
  const [goals, setGoals] = useState<Goal[]>([
    {
      id: '1',
      title: '10K Monthly Users',
      description: 'Reach 10,000 monthly active users',
      targetDate: '2024-12-31',
      progress: 35,
      category: 'users'
    },
    {
      id: '2',
      title: '$50K Monthly Revenue',
      description: 'Generate $50,000 in monthly recurring revenue',
      targetDate: '2024-06-30',
      progress: 20,
      category: 'revenue'
    }
  ]);

  const [milestones, setMilestones] = useState<Milestone[]>([
    { id: '1', title: 'Launch MVP', date: '2024-03-15', completed: true },
    { id: '2', title: 'First 100 users', date: '2024-04-01', completed: true },
    { id: '3', title: 'Payment integration', date: '2024-04-15', completed: false },
    { id: '4', title: 'Mobile app release', date: '2024-05-01', completed: false }
  ]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'revenue': return DollarSign;
      case 'users': return Users;
      case 'features': return Lightbulb;
      case 'marketing': return TrendingUp;
      default: return Target;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'revenue': return 'text-green-600';
      case 'users': return 'text-blue-600';
      case 'features': return 'text-purple-600';
      case 'marketing': return 'text-orange-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="h-screen flex flex-col bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Hub
            </Button>
            <div>
              <h1 className="text-lg font-semibold text-slate-900 dark:text-white">
                Business Planner
              </h1>
              <p className="text-sm text-slate-500">Project ID: {projectId}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button size="sm" className="bg-green-600 hover:bg-green-700">
              <Save className="w-4 h-4 mr-2" />
              Save Plan
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 p-6">
        <Tabs defaultValue="overview" className="h-full">
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="goals">Goals</TabsTrigger>
            <TabsTrigger value="roadmap">Roadmap</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Users className="w-5 h-5 text-blue-600" />
                    <div>
                      <div className="text-2xl font-bold">3,457</div>
                      <div className="text-sm text-slate-500">Active Users</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-5 h-5 text-green-600" />
                    <div>
                      <div className="text-2xl font-bold">$12,340</div>
                      <div className="text-sm text-slate-500">Monthly Revenue</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5 text-orange-600" />
                    <div>
                      <div className="text-2xl font-bold">+24%</div>
                      <div className="text-sm text-slate-500">Growth Rate</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Target className="w-5 h-5 text-purple-600" />
                    <div>
                      <div className="text-2xl font-bold">73%</div>
                      <div className="text-sm text-slate-500">Goals Complete</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Goals Progress */}
            <Card>
              <CardHeader>
                <CardTitle>Goals Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {goals.slice(0, 3).map((goal) => {
                  const Icon = getCategoryIcon(goal.category);
                  return (
                    <div key={goal.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Icon className={`w-4 h-4 ${getCategoryColor(goal.category)}`} />
                          <span className="font-medium">{goal.title}</span>
                        </div>
                        <span className="text-sm text-slate-500">{goal.progress}%</span>
                      </div>
                      <Progress value={goal.progress} className="h-2" />
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Upcoming Milestones */}
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Milestones</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {milestones.filter(m => !m.completed).slice(0, 3).map((milestone) => (
                    <div key={milestone.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                      <Calendar className="w-4 h-4 text-slate-500" />
                      <div className="flex-1">
                        <div className="font-medium">{milestone.title}</div>
                        <div className="text-sm text-slate-500">{milestone.date}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="goals" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Business Goals</h2>
              <Button>
                <Target className="w-4 h-4 mr-2" />
                Add Goal
              </Button>
            </div>

            <div className="grid gap-4">
              {goals.map((goal) => {
                const Icon = getCategoryIcon(goal.category);
                return (
                  <Card key={goal.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <Icon className={`w-5 h-5 mt-1 ${getCategoryColor(goal.category)}`} />
                          <div className="flex-1">
                            <h3 className="font-semibold">{goal.title}</h3>
                            <p className="text-slate-600 dark:text-slate-400 mt-1">{goal.description}</p>
                            <div className="mt-3 space-y-2">
                              <div className="flex items-center justify-between text-sm">
                                <span>Progress</span>
                                <span>{goal.progress}%</span>
                              </div>
                              <Progress value={goal.progress} className="h-2" />
                            </div>
                            <div className="text-sm text-slate-500 mt-2">
                              Target: {new Date(goal.targetDate).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="roadmap" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Project Roadmap</h2>
              <Button>
                <Calendar className="w-4 h-4 mr-2" />
                Add Milestone
              </Button>
            </div>

            <div className="space-y-4">
              {milestones.map((milestone, index) => (
                <div key={milestone.id} className="flex items-center space-x-4">
                  <div className={`w-4 h-4 rounded-full ${
                    milestone.completed ? 'bg-green-500' : 'bg-slate-300'
                  }`} />
                  <Card className="flex-1">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className={`font-medium ${
                            milestone.completed ? 'line-through text-slate-500' : ''
                          }`}>
                            {milestone.title}
                          </h3>
                          <p className="text-sm text-slate-500">{milestone.date}</p>
                        </div>
                        <div className={`px-2 py-1 rounded text-xs ${
                          milestone.completed 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {milestone.completed ? 'Completed' : 'Pending'}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <h2 className="text-xl font-semibold">Business Analytics</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Growth Trajectory</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-48 bg-slate-100 dark:bg-slate-800 rounded flex items-center justify-center">
                    <span className="text-slate-500">Growth chart placeholder</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Revenue Forecast</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-48 bg-slate-100 dark:bg-slate-800 rounded flex items-center justify-center">
                    <span className="text-slate-500">Revenue chart placeholder</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}