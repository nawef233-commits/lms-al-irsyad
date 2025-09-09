import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Clock, CheckCircle, XCircle, Trophy } from 'lucide-react';

const QuizInterface = ({ quiz, onComplete, onCancel }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(quiz.timeLimit || 300);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (timeLeft > 0 && !showResults) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      handleSubmit();
    }
  }, [timeLeft, showResults]);

  const handleAnswerSelect = (questionIndex, selectedOption) => {
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: selectedOption
    }));
  };

  const handleSubmit = () => {
    let correctAnswers = 0;
    const totalQuestions = quiz.questions?.length || 0;

    quiz.questions?.forEach((question, index) => {
      if (answers[index] === question.correctAnswer) {
        correctAnswers++;
      }
    });

    const finalScore = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
    setScore(finalScore);
    setShowResults(true);
  };

  const handleFinish = () => {
    onComplete(score, answers);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!quiz.questions || quiz.questions.length === 0) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-500">Quiz ini belum memiliki soal.</p>
            <Button onClick={onCancel} className="mt-4">Kembali</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (showResults) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <Trophy className="h-6 w-6 text-yellow-500" />
              Hasil Quiz
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="mb-6">
              <div className="text-4xl font-bold mb-2 text-blue-600">{score}%</div>
              <p className="text-gray-600">
                Anda menjawab benar {quiz.questions?.filter((q, i) => answers[i] === q.correctAnswer).length || 0} dari {quiz.questions?.length || 0} soal
              </p>
            </div>

            <div className="space-y-4 mb-6">
              {quiz.questions?.map((question, index) => (
                <div key={index} className="text-left border rounded-lg p-4">
                  <div className="flex items-start gap-2 mb-2">
                    {answers[index] === question.correctAnswer ? (
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <p className="font-medium">{question.question}</p>
                      <p className="text-sm text-gray-600 mt-1">
                        Jawaban Anda: {question.options?.[answers[index]] || 'Tidak dijawab'}
                      </p>
                      <p className="text-sm text-green-600">
                        Jawaban Benar: {question.options?.[question.correctAnswer]}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Button onClick={handleFinish} className="bg-blue-600 hover:bg-blue-700">
              Selesai
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const question = quiz.questions[currentQuestion];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{quiz.title}</h1>
          <p className="text-gray-600">Soal {currentQuestion + 1} dari {quiz.questions.length}</p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {formatTime(timeLeft)}
          </Badge>
          <Button variant="outline" onClick={onCancel}>
            Batal
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {question.question}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {question.options?.map((option, index) => (
              <div
                key={index}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  answers[currentQuestion] === index
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleAnswerSelect(currentQuestion, index)}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full border-2 ${
                    answers[currentQuestion] === index
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-gray-300'
                  }`}>
                    {answers[currentQuestion] === index && (
                      <div className="w-full h-full rounded-full bg-white scale-50"></div>
                    )}
                  </div>
                  <span className="font-medium text-gray-700">
                    {String.fromCharCode(65 + index)}. {option}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between mt-6">
            <Button
              variant="outline"
              onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
              disabled={currentQuestion === 0}
            >
              Sebelumnya
            </Button>

            {currentQuestion === quiz.questions.length - 1 ? (
              <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700">
                Selesai Quiz
              </Button>
            ) : (
              <Button
                onClick={() => setCurrentQuestion(Math.min(quiz.questions.length - 1, currentQuestion + 1))}
                disabled={currentQuestion === quiz.questions.length - 1}
              >
                Selanjutnya
              </Button>
            )}
          </div>
          {/* Progress bar */}
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-500 mb-1">
              <span>Progress</span>
              <span>{Math.round(((currentQuestion + 1) / quiz.questions.length) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuizInterface;