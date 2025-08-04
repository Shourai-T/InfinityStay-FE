import React from 'react';
import { Home, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-luxury flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <div className="card-luxury rounded-2xl p-12 max-w-md mx-auto">
          <div className="text-8xl font-display font-bold text-gradient mb-6">404</div>
          <h1 className="text-3xl font-heading font-bold text-soft-white mb-4">
            Trang không tồn tại
          </h1>
          <p className="text-lavender-300 font-body mb-8">
            Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center justify-center px-6 py-3 border border-royal-500/30 rounded-xl hover:bg-royal-500/5 transition-colors duration-300 text-lavender-300 font-body"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Quay lại
            </button>
            <button
              onClick={() => navigate('/')}
              className="flex items-center justify-center px-6 py-3 btn-primary rounded-xl font-body"
            >
              <Home className="h-5 w-5 mr-2" />
              Về trang chủ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}