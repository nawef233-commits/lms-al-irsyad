import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where, orderBy, doc, updateDoc, addDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { BookOpen, Video, FileText, Trophy, Clock, CheckCircle } from 'lucide-react';
import QuizInterface from './QuizInterface';

const StudentDashboard = () => {
  const { currentUser } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showQuiz, setShowQuiz] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);

  useEffect(() => {
    fetchSessions();
  }, [currentUser]);

  const fetchSessions = async () => {
    try {
      const sessionsQuery = query(collection(db, 'sessions'), orderBy('sessionNumber'));
      const snapshot = await getDocs(sessionsQuery);
      const sessionsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setSessions(sessionsData);
      if (sessionsData.length > 0) {
        setSelectedSession(sessionsData[0]);
      }
    } catch (error) {
      console.error('Error fetching sessions:', error);
    }
    setLoading(false);
  };

  const handleVideoClick = (videoUrl) => {
    if (videoUrl) {
      window.open(videoUrl, '_blank');
    }
  };

  const handleQuizStart = (quiz) => {
    setSelectedQuiz(quiz);
    setShowQuiz(true);
  };

  const handleQuizComplete = async (score, answers) => {
    try {
      await addDoc(collection(db, 'quiz_results'), {
        studentId: currentUser.uid,
        sessionId: selectedSession.id,
        quizId: selectedQuiz.id || 'quiz_' + Date.now(),
        score: score,
        answers: answers,
        completedAt: new Date()
      });
      
      setShowQuiz(false);
      setSelectedQuiz(null);
      alert(`Quiz selesai! Nilai Anda: ${score}%`);
    } catch (error) {
      console.error('Error saving quiz result:', error);
      alert('Error menyimpan hasil quiz');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  if (showQuiz && selectedQuiz) {
    return (
      <QuizInterface
        quiz={selectedQuiz}
        onComplete={handleQuizComplete}
        onCancel={() => setShowQuiz(false)}
      />
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Siswa - LMS IPA SD</h1>
        <p className="text-gray-600">Selamat datang, {currentUser.name || currentUser.email}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Pertemuan</p>
                <p className="text-2xl font-bold">{sessions.length}</p>
              </div>
              <BookOpen className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Materi Tersedia</p>
                <p className="text-2xl font-bold">{sessions.reduce((total, session) => total + (session.materials?.length || 0), 0)}</p>
              </div>
              <FileText className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Video Pembelajaran</p>
                <p className="text-2xl font-bold">{sessions.reduce((total, session) => total + (session.videos?.length || 0), 0)}</p>
              </div>
              <Video className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Quiz Tersedia</p>
                <p className="text-2xl font-bold">{sessions.reduce((total, session) => total + (session.quizzes?.length || 0), 0)}</p>
              </div>
              <Trophy className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Session List */}
        <Card>
          <CardHeader>
            <CardTitle>Daftar Pertemuan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {sessions.map((session) => (
                <div
                  key={session.id}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedSession?.id === session.id
                      ? 'bg-blue-100 border-blue-300'
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                  onClick={() => setSelectedSession(session)}
                >
                  <h3 className="font-medium">Pertemuan {session.sessionNumber}</h3>
                  <p className="text-sm text-gray-600">{session.title}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    <Badge variant="outline" className="text-xs">
                      {session.materials?.length || 0} Materi
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {session.videos?.length || 0} Video
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {session.quizzes?.length || 0} Quiz
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {session.assignments?.length || 0} Tugas
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Content Display */}
        {selectedSession && (
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Pertemuan {selectedSession.sessionNumber}: {selectedSession.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="materials" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="materials">Materi</TabsTrigger>
                    <TabsTrigger value="videos">Video</TabsTrigger>
                    <TabsTrigger value="quizzes">Quiz</TabsTrigger>
                    <TabsTrigger value="assignments">Tugas</TabsTrigger>
                  </TabsList>

                  <TabsContent value="materials" className="mt-4">
                    <div className="space-y-4">
                      {selectedSession.materials?.length > 0 ? (
                        selectedSession.materials.map((material, index) => (
                          <Card key={index}>
                            <CardContent className="p-4">
                              <h4 className="font-medium mb-2">{material.title}</h4>
                              <p className="text-gray-600 text-sm">{material.content}</p>
                            </CardContent>
                          </Card>
                        ))
                      ) : (
                        <p className="text-gray-500 text-center py-8">Belum ada materi untuk pertemuan ini</p>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="videos" className="mt-4">
                    <div className="space-y-4">
                      {selectedSession.videos?.length > 0 ? (
                        selectedSession.videos.map((video, index) => (
                          <Card key={index}>
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h4 className="font-medium mb-2">{video.title}</h4>
                                  <p className="text-gray-600 text-sm mb-3">{video.content}</p>
                                  {video.url && (
                                    <Button 
                                      onClick={() => handleVideoClick(video.url)}
                                      className="bg-red-600 hover:bg-red-700 text-white"
                                    >
                                      <Video className="h-4 w-4 mr-2" />
                                      Tonton Video
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))
                      ) : (
                        <p className="text-gray-500 text-center py-8">Belum ada video untuk pertemuan ini</p>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="quizzes" className="mt-4">
                    <div className="space-y-4">
                      {selectedSession.quizzes?.length > 0 ? (
                        selectedSession.quizzes.map((quiz, index) => (
                          <Card key={index}>
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h4 className="font-medium mb-2">{quiz.title}</h4>
                                  <p className="text-gray-600 text-sm mb-3">{quiz.content}</p>
                                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                                    <span className="flex items-center gap-1">
                                      <FileText className="h-4 w-4" />
                                      {quiz.questions?.length || 0} Soal
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <Clock className="h-4 w-4" />
                                      {quiz.timeLimit || 300} detik
                                    </span>
                                  </div>
                                  <Button 
                                    onClick={() => handleQuizStart(quiz)}
                                    className="bg-green-600 hover:bg-green-700 text-white"
                                  >
                                    <Trophy className="h-4 w-4 mr-2" />
                                    Mulai Quiz
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))
                      ) : (
                        <p className="text-gray-500 text-center py-8">Belum ada quiz untuk pertemuan ini</p>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="assignments" className="mt-4">
                    <div className="space-y-4">
                      {selectedSession.assignments?.length > 0 ? (
                        selectedSession.assignments.map((assignment, index) => (
                          <Card key={index}>
                            <CardContent className="p-4">
                              <h4 className="font-medium mb-2">{assignment.title}</h4>
                              <p className="text-gray-600 text-sm mb-3">{assignment.content}</p>
                              {assignment.deadline && (
                                <div className="flex items-center gap-2 text-sm text-orange-600 mb-3">
                                  <Clock className="h-4 w-4" />
                                  Deadline: {new Date(assignment.deadline.seconds * 1000).toLocaleDateString('id-ID')}
                                </div>
                              )}
                              <div className="bg-blue-50 p-3 rounded-lg">
                                <p className="text-sm text-blue-800">
                                  <CheckCircle className="h-4 w-4 inline mr-1" />
                                  Silakan kerjakan tugas ini sesuai dengan instruksi yang diberikan.
                                </p>
                              </div>
                            </CardContent>
                          </Card>
                        ))
                      ) : (
                        <p className="text-gray-500 text-center py-8">Belum ada tugas untuk pertemuan ini</p>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;