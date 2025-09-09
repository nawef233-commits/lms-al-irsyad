import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, orderBy, where } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Plus, Edit, Trash2, Users, BookOpen, FileText, BarChart, Save, X, Download, CheckCircle, Clock } from 'lucide-react';

const TeacherDashboard = () => {
  const { currentUser, createStudent } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [assignmentSubmissions, setAssignmentSubmissions] = useState([]);
  const [quizResults, setQuizResults] = useState([]);
  
  // Dialog states
  const [showSessionDialog, setShowSessionDialog] = useState(false);
  const [showStudentDialog, setShowStudentDialog] = useState(false);
  const [showContentDialog, setShowContentDialog] = useState(false);
  const [showQuizDialog, setShowQuizDialog] = useState(false);
  const [showGradingDialog, setShowGradingDialog] = useState(false);
  const [editingSession, setEditingSession] = useState(null);
  const [editingStudent, setEditingStudent] = useState(null);
  
  // Form states
  const [sessionForm, setSessionForm] = useState({ sessionNumber: '', title: '', description: '' });
  const [studentForm, setStudentForm] = useState({ name: '', email: '', password: '', grade: '', studentId: '' });
  const [contentForm, setContentForm] = useState({ title: '', content: '', type: 'material', url: '', deadline: '' });
  const [quizForm, setQuizForm] = useState({ 
    title: '', 
    content: '', 
    timeLimit: 300,
    questions: [{ question: '', options: ['', '', '', ''], correctAnswer: 0 }]
  });
  const [gradingData, setGradingData] = useState({});

  useEffect(() => {
    fetchSessions();
    fetchStudents();
    fetchAssignmentSubmissions();
    fetchQuizResults();
  }, [currentUser]);

  const fetchSessions = async () => {
    try {
      const sessionsQuery = query(collection(db, 'sessions'), orderBy('sessionNumber'));
      const snapshot = await getDocs(sessionsQuery);
      const sessionsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSessions(sessionsData);
      if (sessionsData.length > 0) setSelectedSession(sessionsData[0]);
    } catch (error) {
      console.error('Error fetching sessions:', error);
    }
  };

  const fetchStudents = async () => {
    try {
      const studentsQuery = query(collection(db, 'users'));
      const snapshot = await getDocs(studentsQuery);
      const studentsData = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(user => user.role === 'student' && user.teacherId === currentUser.uid);
      setStudents(studentsData);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
    setLoading(false);
  };

  const fetchAssignmentSubmissions = async () => {
    try {
      const submissionsQuery = query(collection(db, 'assignment_submissions'));
      const snapshot = await getDocs(submissionsQuery);
      const submissionsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAssignmentSubmissions(submissionsData);
    } catch (error) {
      console.error('Error fetching assignment submissions:', error);
    }
  };

  const fetchQuizResults = async () => {
    try {
      const resultsQuery = query(collection(db, 'quiz_results'));
      const snapshot = await getDocs(resultsQuery);
      const resultsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setQuizResults(resultsData);
    } catch (error) {
      console.error('Error fetching quiz results:', error);
    }
  };

  // Session CRUD
  const handleCreateSession = async () => {
    try {
      await addDoc(collection(db, 'sessions'), {
        ...sessionForm,
        sessionNumber: parseInt(sessionForm.sessionNumber),
        teacherId: currentUser.uid,
        createdAt: new Date(),
        materials: [], videos: [], quizzes: [], assignments: []
      });
      setSessionForm({ sessionNumber: '', title: '', description: '' });
      setShowSessionDialog(false);
      fetchSessions();
    } catch (error) {
      alert('Error creating session: ' + error.message);
    }
  };

  const handleUpdateSession = async () => {
    try {
      await updateDoc(doc(db, 'sessions', editingSession.id), {
        sessionNumber: parseInt(sessionForm.sessionNumber),
        title: sessionForm.title,
        description: sessionForm.description,
        updatedAt: new Date()
      });
      setSessionForm({ sessionNumber: '', title: '', description: '' });
      setEditingSession(null);
      setShowSessionDialog(false);
      fetchSessions();
    } catch (error) {
      alert('Error updating session: ' + error.message);
    }
  };

  const handleDeleteSession = async (sessionId) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus pertemuan ini?')) {
      try {
        await deleteDoc(doc(db, 'sessions', sessionId));
        fetchSessions();
      } catch (error) {
        alert('Error deleting session: ' + error.message);
      }
    }
  };

  // Student CRUD
  const handleCreateStudent = async () => {
    try {
      await createStudent(studentForm.email, studentForm.password, {
        name: studentForm.name, grade: studentForm.grade, studentId: studentForm.studentId
      }, currentUser.uid);
      setStudentForm({ name: '', email: '', password: '', grade: '', studentId: '' });
      setShowStudentDialog(false);
      fetchStudents();
    } catch (error) {
      alert('Error creating student: ' + error.message);
    }
  };

  const handleUpdateStudent = async () => {
    try {
      await updateDoc(doc(db, 'users', editingStudent.id), {
        name: studentForm.name, grade: studentForm.grade, studentId: studentForm.studentId, updatedAt: new Date()
      });
      setStudentForm({ name: '', email: '', password: '', grade: '', studentId: '' });
      setEditingStudent(null);
      setShowStudentDialog(false);
      fetchStudents();
    } catch (error) {
      alert('Error updating student: ' + error.message);
    }
  };

  const handleDeleteStudent = async (studentId) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus siswa ini?')) {
      try {
        await deleteDoc(doc(db, 'users', studentId));
        fetchStudents();
      } catch (error) {
        alert('Error deleting student: ' + error.message);
      }
    }
  };

  // Content CRUD
  const handleCreateContent = async () => {
    try {
      const sessionRef = doc(db, 'sessions', selectedSession.id);
      const session = sessions.find(s => s.id === selectedSession.id);
      const contentType = contentForm.type + 's';
      
      let newContent = {
        title: contentForm.title,
        content: contentForm.content,
        type: contentForm.type,
        createdAt: new Date()
      };

      if (contentForm.type === 'video') newContent.url = contentForm.url;
      if (contentForm.type === 'assignment') newContent.deadline = contentForm.deadline ? new Date(contentForm.deadline) : null;

      const updatedContent = [...(session[contentType] || []), newContent];
      await updateDoc(sessionRef, { [contentType]: updatedContent });
      
      setContentForm({ title: '', content: '', type: 'material', url: '', deadline: '' });
      setShowContentDialog(false);
      fetchSessions();
    } catch (error) {
      alert('Error adding content: ' + error.message);
    }
  };

  // Quiz CRUD
  const handleCreateQuiz = async () => {
    try {
      const sessionRef = doc(db, 'sessions', selectedSession.id);
      const session = sessions.find(s => s.id === selectedSession.id);
      
      const newQuiz = {
        title: quizForm.title,
        content: quizForm.content,
        timeLimit: parseInt(quizForm.timeLimit),
        questions: quizForm.questions.filter(q => q.question.trim() && q.options.some(opt => opt.trim())),
        createdAt: new Date()
      };

      const updatedQuizzes = [...(session.quizzes || []), newQuiz];
      await updateDoc(sessionRef, { quizzes: updatedQuizzes });
      
      setQuizForm({ 
        title: '', 
        content: '', 
        timeLimit: 300,
        questions: [{ question: '', options: ['', '', '', ''], correctAnswer: 0 }]
      });
      setShowQuizDialog(false);
      fetchSessions();
    } catch (error) {
      alert('Error adding quiz: ' + error.message);
    }
  };

  const addQuestion = () => {
    setQuizForm(prev => ({
      ...prev,
      questions: [...prev.questions, { question: '', options: ['', '', '', ''], correctAnswer: 0 }]
    }));
  };

  const updateQuestion = (index, field, value) => {
    setQuizForm(prev => ({
      ...prev,
      questions: prev.questions.map((q, i) => 
        i === index ? { ...q, [field]: value } : q
      )
    }));
  };

  const updateOption = (questionIndex, optionIndex, value) => {
    setQuizForm(prev => ({
      ...prev,
      questions: prev.questions.map((q, i) => 
        i === questionIndex 
          ? { ...q, options: q.options.map((opt, j) => j === optionIndex ? value : opt) }
          : q
      )
    }));
  };

  const removeQuestion = (index) => {
    setQuizForm(prev => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index)
    }));
  };

  const handleDeleteContent = async (contentType, index) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus konten ini?')) {
      try {
        const sessionRef = doc(db, 'sessions', selectedSession.id);
        const session = sessions.find(s => s.id === selectedSession.id);
        const contentArray = [...(session[contentType] || [])];
        contentArray.splice(index, 1);
        await updateDoc(sessionRef, { [contentType]: contentArray });
        fetchSessions();
      } catch (error) {
        alert('Error deleting content: ' + error.message);
      }
    }
  };

  // Assignment Grading
  const handleAssignmentGrading = async (studentId, assignmentIndex, grade) => {
    try {
      await addDoc(collection(db, 'assignment_grades'), {
        studentId: studentId,
        sessionId: selectedSession.id,
        assignmentIndex: assignmentIndex,
        grade: parseInt(grade),
        gradedAt: new Date(),
        gradedBy: currentUser.uid
      });
      
      alert('Nilai berhasil disimpan!');
      fetchAssignmentSubmissions();
    } catch (error) {
      alert('Error menyimpan nilai: ' + error.message);
    }
  };

  const toggleAssignmentSubmission = async (studentId, assignmentIndex) => {
    try {
      const existingSubmission = assignmentSubmissions.find(
        sub => sub.studentId === studentId && 
               sub.sessionId === selectedSession.id && 
               sub.assignmentIndex === assignmentIndex
      );

      if (existingSubmission) {
        await deleteDoc(doc(db, 'assignment_submissions', existingSubmission.id));
      } else {
        await addDoc(collection(db, 'assignment_submissions'), {
          studentId: studentId,
          sessionId: selectedSession.id,
          assignmentIndex: assignmentIndex,
          submittedAt: new Date(),
          status: 'submitted'
        });
      }
      
      fetchAssignmentSubmissions();
    } catch (error) {
      alert('Error updating submission status: ' + error.message);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-64">Loading...</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Guru - LMS IPA SD</h1>
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
                <p className="text-sm text-gray-600">Total Siswa</p>
                <p className="text-2xl font-bold">{students.length}</p>
              </div>
              <Users className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Materi Aktif</p>
                <p className="text-2xl font-bold">{sessions.reduce((total, session) => total + (session.materials?.length || 0), 0)}</p>
              </div>
              <FileText className="h-8 w-8 text-purple-500" />
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
              <BarChart className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="sessions" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="sessions">Kelola Pertemuan</TabsTrigger>
          <TabsTrigger value="students">Kelola Siswa</TabsTrigger>
          <TabsTrigger value="content">Kelola Konten</TabsTrigger>
          <TabsTrigger value="grading">Penilaian</TabsTrigger>
          <TabsTrigger value="reports">Laporan</TabsTrigger>
        </TabsList>

        {/* Sessions Tab */}
        <TabsContent value="sessions" className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Daftar Pertemuan</h2>
            <Button 
              onClick={() => {
                setSessionForm({ sessionNumber: '', title: '', description: '' });
                setEditingSession(null);
                setShowSessionDialog(true);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Tambah Pertemuan
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sessions.map((session) => (
              <Card key={session.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Pertemuan {session.sessionNumber}</span>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => {
                          setEditingSession(session);
                          setSessionForm({ 
                            sessionNumber: session.sessionNumber.toString(), 
                            title: session.title, 
                            description: session.description 
                          });
                          setShowSessionDialog(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        onClick={() => handleDeleteSession(session.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <h3 className="font-medium mb-2">{session.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{session.description}</p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">{session.materials?.length || 0} Materi</Badge>
                    <Badge variant="outline">{session.videos?.length || 0} Video</Badge>
                    <Badge variant="outline">{session.quizzes?.length || 0} Quiz</Badge>
                    <Badge variant="outline">{session.assignments?.length || 0} Tugas</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Students Tab */}
        <TabsContent value="students" className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Daftar Siswa</h2>
            <Button 
              onClick={() => {
                setStudentForm({ name: '', email: '', password: '', grade: '', studentId: '' });
                setEditingStudent(null);
                setShowStudentDialog(true);
              }}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Tambah Siswa
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {students.map((student) => (
              <Card key={student.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-medium">{student.name?.charAt(0) || student.email.charAt(0)}</span>
                      </div>
                      <div>
                        <h3 className="font-medium">{student.name}</h3>
                        <p className="text-sm text-gray-600">{student.email}</p>
                        <p className="text-xs text-gray-500">Kelas: {student.grade} | NIS: {student.studentId}</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => {
                          setEditingStudent(student);
                          setStudentForm({ 
                            name: student.name, 
                            email: student.email, 
                            password: '', 
                            grade: student.grade, 
                            studentId: student.studentId 
                          });
                          setShowStudentDialog(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        onClick={() => handleDeleteStudent(student.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Content Tab */}
        <TabsContent value="content" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Pilih Pertemuan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {sessions.map((session) => (
                    <div 
                      key={session.id} 
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedSession?.id === session.id ? 'bg-blue-100 border-blue-300' : 'bg-gray-50 hover:bg-gray-100'
                      }`} 
                      onClick={() => setSelectedSession(session)}
                    >
                      <h3 className="font-medium">Pertemuan {session.sessionNumber}</h3>
                      <p className="text-sm text-gray-600">{session.title}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {selectedSession && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Konten Pertemuan {selectedSession.sessionNumber}</span>
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        onClick={() => {
                          setContentForm({ title: '', content: '', type: 'material', url: '', deadline: '' });
                          setShowContentDialog(true);
                        }}
                        className="bg-purple-600 hover:bg-purple-700 text-white"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Tambah Konten
                      </Button>
                      <Button 
                        size="sm" 
                        onClick={() => {
                          setQuizForm({ 
                            title: '', 
                            content: '', 
                            timeLimit: 300,
                            questions: [{ question: '', options: ['', '', '', ''], correctAnswer: 0 }]
                          });
                          setShowQuizDialog(true);
                        }}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Buat Quiz
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {['materials', 'videos', 'quizzes', 'assignments'].map(type => (
                      <div key={type}>
                        <h4 className="font-medium mb-2 capitalize">{type} ({selectedSession[type]?.length || 0})</h4>
                        {selectedSession[type]?.map((item, index) => (
                          <div key={index} className="p-2 bg-gray-50 rounded mb-2 flex justify-between">
                            <div>
                              <p className="font-medium">{item.title}</p>
                              <p className="text-sm text-gray-600">{item.content}</p>
                              {type === 'quizzes' && (
                                <p className="text-xs text-blue-600">{item.questions?.length || 0} soal</p>
                              )}
                            </div>
                            <Button variant="destructive" size="sm" onClick={() => handleDeleteContent(type, index)}>
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                        {(!selectedSession[type] || selectedSession[type].length === 0) && (
                          <p className="text-gray-500 text-sm italic">Belum ada {type}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Grading Tab */}
        <TabsContent value="grading" className="mt-6">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Penilaian Siswa</h2>
              <div className="flex items-center space-x-2">
                <Label>Pilih Pertemuan:</Label>
                <select 
                  className="px-3 py-2 border rounded-md"
                  value={selectedSession?.id || ''}
                  onChange={(e) => {
                    const session = sessions.find(s => s.id === e.target.value);
                    setSelectedSession(session);
                  }}
                >
                  <option value="">Pilih Pertemuan</option>
                  {sessions.map(session => (
                    <option key={session.id} value={session.id}>
                      Pertemuan {session.sessionNumber} - {session.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {selectedSession && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Assignment Grading */}
                {selectedSession.assignments?.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Penilaian Tugas</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {selectedSession.assignments.map((assignment, assignmentIndex) => (
                        <div key={assignmentIndex} className="mb-6 p-4 border rounded-lg">
                          <h4 className="font-medium mb-3">{assignment.title}</h4>
                          <div className="space-y-2">
                            {students.map(student => {
                              const isSubmitted = assignmentSubmissions.some(
                                sub => sub.studentId === student.id && 
                                       sub.sessionId === selectedSession.id && 
                                       sub.assignmentIndex === assignmentIndex
                              );
                              
                              return (
                                <div key={student.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                  <div className="flex items-center space-x-3">
                                    <button
                                      onClick={() => toggleAssignmentSubmission(student.id, assignmentIndex)}
                                      className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                                        isSubmitted ? 'bg-green-500 border-green-500' : 'border-gray-300'
                                      }`}
                                    >
                                      {isSubmitted && <CheckCircle className="w-3 h-3 text-white" />}
                                    </button>
                                    <span className="text-sm">{student.name}</span>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Input
                                      type="number"
                                      placeholder="Nilai"
                                      className="w-20 h-8"
                                      min="0"
                                      max="100"
                                      onChange={(e) => {
                                        setGradingData(prev => ({
                                          ...prev,
                                          [`${student.id}_${assignmentIndex}`]: e.target.value
                                        }));
                                      }}
                                    />
                                    <Button
                                      size="sm"
                                      onClick={() => {
                                        const grade = gradingData[`${student.id}_${assignmentIndex}`];
                                        if (grade) {
                                          handleAssignmentGrading(student.id, assignmentIndex, grade);
                                        }
                                      }}
                                    >
                                      Simpan
                                    </Button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}

                {/* Quiz Results */}
                <Card>
                  <CardHeader>
                    <CardTitle>Hasil Quiz</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedSession.quizzes?.length > 0 ? (
                      selectedSession.quizzes.map((quiz, quizIndex) => (
                        <div key={quizIndex} className="mb-6 p-4 border rounded-lg">
                          <h4 className="font-medium mb-3">{quiz.title}</h4>
                          <div className="space-y-2">
                            {students.map(student => {
                              const quizResult = quizResults.find(
                                result => result.studentId === student.id && 
                                         result.sessionId === selectedSession.id
                              );
                              
                              return (
                                <div key={student.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                  <span className="text-sm">{student.name}</span>
                                  <div className="flex items-center space-x-2">
                                    {quizResult ? (
                                      <Badge variant={quizResult.score >= 70 ? 'default' : 'destructive'}>
                                        {quizResult.score}%
                                      </Badge>
                                    ) : (
                                      <Badge variant="outline">Belum mengerjakan</Badge>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-center">Belum ada quiz untuk pertemuan ini</p>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Laporan dan Analitik</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <Button className="h-20 flex flex-col items-center justify-center" onClick={() => alert('Fitur export PDF akan segera tersedia!')}>
                  <Download className="h-6 w-6 mb-2" />
                  Export Laporan PDF
                </Button>
                <Button className="h-20 flex flex-col items-center justify-center" onClick={() => alert('Fitur export Excel akan segera tersedia!')}>
                  <Download className="h-6 w-6 mb-2" />
                  Export Laporan Excel
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-4">Ringkasan Aktivitas</h3>
                  <div className="space-y-2">
                    <p>Total Pertemuan: {sessions.length}</p>
                    <p>Total Siswa: {students.length}</p>
                    <p>Total Materi: {sessions.reduce((total, session) => total + (session.materials?.length || 0), 0)}</p>
                    <p>Total Quiz: {sessions.reduce((total, session) => total + (session.quizzes?.length || 0), 0)}</p>
                    <p>Total Tugas: {sessions.reduce((total, session) => total + (session.assignments?.length || 0), 0)}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-4">Statistik Nilai</h3>
                  <div className="space-y-2">
                    <p>Quiz Dikerjakan: {quizResults.length}</p>
                    <p>Tugas Dikumpulkan: {assignmentSubmissions.length}</p>
                    <p>Rata-rata Nilai Quiz: {
                      quizResults.length > 0 
                        ? Math.round(quizResults.reduce((sum, result) => sum + result.score, 0) / quizResults.length)
                        : 0
                    }%</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Session Dialog */}
      {showSessionDialog && (
        <Dialog open={showSessionDialog} onOpenChange={setShowSessionDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingSession ? 'Edit Pertemuan' : 'Tambah Pertemuan Baru'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Nomor Pertemuan</Label>
                <Input 
                  type="number" 
                  value={sessionForm.sessionNumber} 
                  onChange={(e) => setSessionForm({...sessionForm, sessionNumber: e.target.value})} 
                />
              </div>
              <div>
                <Label>Judul Pertemuan</Label>
                <Input 
                  value={sessionForm.title} 
                  onChange={(e) => setSessionForm({...sessionForm, title: e.target.value})} 
                />
              </div>
              <div>
                <Label>Deskripsi</Label>
                <Textarea 
                  value={sessionForm.description} 
                  onChange={(e) => setSessionForm({...sessionForm, description: e.target.value})} 
                />
              </div>
              <div className="flex space-x-2">
                <Button 
                  onClick={editingSession ? handleUpdateSession : handleCreateSession} 
                  className="flex-1"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {editingSession ? 'Update' : 'Buat'} Pertemuan
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => { 
                    setShowSessionDialog(false); 
                    setEditingSession(null); 
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Student Dialog */}
      {showStudentDialog && (
        <Dialog open={showStudentDialog} onOpenChange={setShowStudentDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingStudent ? 'Edit Siswa' : 'Tambah Siswa Baru'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Nama Lengkap</Label>
                <Input 
                  value={studentForm.name} 
                  onChange={(e) => setStudentForm({...studentForm, name: e.target.value})} 
                />
              </div>
              <div>
                <Label>Email</Label>
                <Input 
                  type="email" 
                  value={studentForm.email} 
                  onChange={(e) => setStudentForm({...studentForm, email: e.target.value})} 
                  disabled={!!editingStudent} 
                />
              </div>
              {!editingStudent && (
                <div>
                  <Label>Password</Label>
                  <Input 
                    type="password" 
                    value={studentForm.password} 
                    onChange={(e) => setStudentForm({...studentForm, password: e.target.value})} 
                  />
                </div>
              )}
              <div>
                <Label>Kelas</Label>
                <Input 
                  value={studentForm.grade} 
                  onChange={(e) => setStudentForm({...studentForm, grade: e.target.value})} 
                />
              </div>
              <div>
                <Label>NIS</Label>
                <Input 
                  value={studentForm.studentId} 
                  onChange={(e) => setStudentForm({...studentForm, studentId: e.target.value})} 
                />
              </div>
              <div className="flex space-x-2">
                <Button 
                  onClick={editingStudent ? handleUpdateStudent : handleCreateStudent} 
                  className="flex-1"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {editingStudent ? 'Update' : 'Tambah'} Siswa
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => { 
                    setShowStudentDialog(false); 
                    setEditingStudent(null); 
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Content Dialog */}
      {showContentDialog && (
        <Dialog open={showContentDialog} onOpenChange={setShowContentDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tambah Konten Baru</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Jenis Konten</Label>
                <select 
                  className="w-full px-3 py-2 border rounded-md" 
                  value={contentForm.type} 
                  onChange={(e) => setContentForm({...contentForm, type: e.target.value})}
                >
                  <option value="material">Materi</option>
                  <option value="video">Video</option>
                  <option value="assignment">Tugas</option>
                </select>
              </div>
              <div>
                <Label>Judul</Label>
                <Input 
                  value={contentForm.title} 
                  onChange={(e) => setContentForm({...contentForm, title: e.target.value})} 
                />
              </div>
              <div>
                <Label>Konten/Deskripsi</Label>
                <Textarea 
                  value={contentForm.content} 
                  onChange={(e) => setContentForm({...contentForm, content: e.target.value})} 
                />
              </div>
              {contentForm.type === 'video' && (
                <div>
                  <Label>URL Video</Label>
                  <Input 
                    value={contentForm.url} 
                    onChange={(e) => setContentForm({...contentForm, url: e.target.value})} 
                    placeholder="https://youtube.com/watch?v=..." 
                  />
                </div>
              )}
              {contentForm.type === 'assignment' && (
                <div>
                  <Label>Deadline</Label>
                  <Input 
                    type="date" 
                    value={contentForm.deadline} 
                    onChange={(e) => setContentForm({...contentForm, deadline: e.target.value})} 
                  />
                </div>
              )}
              <Button onClick={handleCreateContent} className="w-full">
                <Save className="h-4 w-4 mr-2" />
                Tambah Konten
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Quiz Dialog */}
      {showQuizDialog && (
        <Dialog open={showQuizDialog} onOpenChange={setShowQuizDialog}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Buat Quiz Baru</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Judul Quiz</Label>
                <Input 
                  value={quizForm.title} 
                  onChange={(e) => setQuizForm({...quizForm, title: e.target.value})} 
                />
              </div>
              <div>
                <Label>Deskripsi</Label>
                <Textarea 
                  value={quizForm.content} 
                  onChange={(e) => setQuizForm({...quizForm, content: e.target.value})} 
                />
              </div>
              <div>
                <Label>Batas Waktu (detik)</Label>
                <Input 
                  type="number"
                  value={quizForm.timeLimit} 
                  onChange={(e) => setQuizForm({...quizForm, timeLimit: e.target.value})} 
                />
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-4">
                  <Label>Soal-soal</Label>
                  <Button type="button" onClick={addQuestion} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Tambah Soal
                  </Button>
                </div>
                
                {quizForm.questions.map((question, qIndex) => (
                  <div key={qIndex} className="border rounded-lg p-4 mb-4">
                    <div className="flex justify-between items-start mb-3">
                      <Label>Soal {qIndex + 1}</Label>
                      {quizForm.questions.length > 1 && (
                        <Button 
                          type="button" 
                          variant="destructive" 
                          size="sm"
                          onClick={() => removeQuestion(qIndex)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    
                    <Textarea
                      placeholder="Masukkan pertanyaan..."
                      value={question.question}
                      onChange={(e) => updateQuestion(qIndex, 'question', e.target.value)}
                      className="mb-3"
                    />
                    
                    <Label className="block mb-2">Pilihan Jawaban</Label>
                    {question.options.map((option, oIndex) => (
                      <div key={oIndex} className="flex items-center space-x-2 mb-2">
                        <input
                          type="radio"
                          name={`correct_${qIndex}`}
                          checked={question.correctAnswer === oIndex}
                          onChange={() => updateQuestion(qIndex, 'correctAnswer', oIndex)}
                          className="w-4 h-4"
                        />
                        <Input
                          placeholder={`Pilihan ${String.fromCharCode(65 + oIndex)}`}
                          value={option}
                          onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                          className="flex-1"
                        />
                      </div>
                    ))}
                  </div>
                ))}
              </div>
              
              <div className="flex space-x-2">
                <Button onClick={handleCreateQuiz} className="flex-1">
                  <Save className="h-4 w-4 mr-2" />
                  Buat Quiz
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowQuizDialog(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default TeacherDashboard;