import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { BookOpen, Users, Brain, Trophy, Star, ArrowRight, Play, CheckCircle, Target, Zap } from 'lucide-react';

const LandingPage = ({ onLoginClick }) => {
  const features = [
    {
      icon: BookOpen,
      title: "Materi Interaktif",
      description: "Belajar IPA dengan materi yang menarik dan mudah dipahami"
    },
    {
      icon: Brain,
      title: "Kuis & Challenge",
      description: "Uji kemampuan dengan kuis real-time bersama teman"
    },
    {
      icon: Users,
      title: "Diskusi Kelas",
      description: "Diskusi dan tanya jawab dengan guru dan teman sekelas"
    },
    {
      icon: Trophy,
      title: "Sistem Poin",
      description: "Dapatkan poin dan raih ranking terbaik di kelasmu"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-600 via-green-700 to-emerald-800 text-white py-20 relative overflow-hidden">
        {/* Background Decorations */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-32 h-32 bg-white rounded-full"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-white rounded-full"></div>
          <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-white rounded-full"></div>
          <div className="absolute bottom-40 right-1/3 w-20 h-20 bg-white rounded-full"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="flex items-center gap-2 text-white/90">
                <BookOpen className="h-6 w-6" />
                <span className="font-semibold">Learning Management System</span>
              </div>
              
              <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                LMS IPA
                <span className="block text-3xl lg:text-4xl font-normal opacity-90 mt-2">
                  SD AL-IRSYAD AL-ISLAMIYYAH
                </span>
              </h1>
              
              <p className="text-xl lg:text-2xl leading-relaxed opacity-90">
                Platform pembelajaran Ilmu Pengetahuan Alam yang interaktif dan menyenangkan untuk siswa sekolah dasar
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  onClick={onLoginClick}
                  size="lg" 
                  className="bg-blue-600 text-white hover:bg-blue-700 shadow-lg font-semibold px-8 py-4 text-lg"
                >
                  Masuk ke Platform
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white font-semibold px-8 py-4 text-lg"
                  onClick={() => {
                    document.getElementById('features').scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  Pelajari Lebih Lanjut
                </Button>
              </div>
              
              <div className="flex items-center gap-8 pt-4">
                <div className="text-center">
                  <div className="text-3xl font-bold">500+</div>
                  <div className="text-sm opacity-90">Siswa Aktif</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">50+</div>
                  <div className="text-sm opacity-90">Materi Pembelajaran</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">25+</div>
                  <div className="text-sm opacity-90">Guru Berpengalaman</div>
                </div>
              </div>
            </div>
            
            {/* Illustration Section */}
            <div className="relative">
              <div className="relative bg-gradient-to-br from-white/20 to-white/10 rounded-3xl shadow-2xl p-8 backdrop-blur-sm">
                {/* Main Illustration */}
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mb-4 shadow-lg">
                    <BookOpen className="h-16 w-16 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Platform Pembelajaran</h3>
                  <p className="text-white/80">Interaktif & Modern</p>
                </div>
                
                {/* Feature Icons */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3 bg-white/20 rounded-xl p-3">
                    <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                      <Play className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-medium text-sm">Video</p>
                      <p className="text-white/70 text-xs">Pembelajaran</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 bg-white/20 rounded-xl p-3">
                    <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                      <Target className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-medium text-sm">Quiz</p>
                      <p className="text-white/70 text-xs">Interaktif</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 bg-white/20 rounded-xl p-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                      <CheckCircle className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-medium text-sm">Tugas</p>
                      <p className="text-white/70 text-xs">Digital</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 bg-white/20 rounded-xl p-3">
                    <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
                      <Zap className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-medium text-sm">Real-time</p>
                      <p className="text-white/70 text-xs">Tracking</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating Stats Card */}
              <div className="absolute -bottom-6 -right-6 bg-white rounded-xl p-4 shadow-2xl">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-semibold">
                        {i}
                      </div>
                    ))}
                  </div>
                  <div className="text-sm">
                    <div className="font-semibold text-gray-900">25 Siswa Online</div>
                    <div className="text-gray-600">Sedang belajar</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Fitur Pembelajaran
              <span className="block text-green-600">yang Menyenangkan</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Dilengkapi dengan berbagai fitur modern untuk mendukung pembelajaran IPA yang efektif dan interaktif
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="shadow-lg hover:shadow-xl transition-all duration-300 border-0 hover:transform hover:scale-105">
                <CardContent className="p-8 text-center">
                  <div className="mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto">
                      <feature.icon className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Cara Kerja Platform
            </h2>
            <p className="text-xl text-gray-600">
              Tiga langkah mudah untuk memulai pembelajaran
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-2xl font-semibold mb-4">Masuk ke Platform</h3>
              <p className="text-gray-600 leading-relaxed">
                Siswa masuk menggunakan NISN, guru masuk dengan akun khusus
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-2xl font-semibold mb-4">Pilih Materi</h3>
              <p className="text-gray-600 leading-relaxed">
                Akses materi pembelajaran, video, dan kuis sesuai pertemuan
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-2xl font-semibold mb-4">Mulai Belajar</h3>
              <p className="text-gray-600 leading-relaxed">
                Belajar interaktif, kerjakan tugas, dan raih ranking terbaik
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-green-600 to-emerald-800 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-40 h-40 border-2 border-white rounded-full"></div>
          <div className="absolute bottom-10 right-10 w-32 h-32 border-2 border-white rounded-full"></div>
          <div className="absolute top-1/2 left-1/4 w-24 h-24 border-2 border-white rounded-full"></div>
        </div>
        
        <div className="max-w-4xl mx-auto text-center px-6 relative z-10">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Siap Memulai Pembelajaran?
          </h2>
          <p className="text-xl opacity-90 mb-8 leading-relaxed">
            Bergabung dengan ribuan siswa dan guru yang sudah merasakan pengalaman belajar yang menyenangkan
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={onLoginClick}
              size="lg" 
              className="bg-blue-600 text-white hover:bg-blue-700 shadow-lg font-semibold px-8 py-4 text-lg"
            >
              <Users className="mr-2 h-5 w-5" />
              Masuk Sekarang
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <BookOpen className="h-6 w-6 text-green-400" />
              <span className="font-semibold text-lg">LMS IPA SD</span>
            </div>
            <p className="text-gray-400 text-center">
              © 2025 LMS IPA SD AL-IRSYAD AL-ISLAMIYYAH. Platform pembelajaran modern untuk generasi masa depan.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;