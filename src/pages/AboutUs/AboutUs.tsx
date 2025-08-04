import React from "react";
import AboutImg from "../../assets/imgs/aboutus_img.jpg";
import AboutImg2 from "../../assets/imgs/aboutus2_img.jpg";

const AboutUs = () => {
  return (
    <section className="p-20 relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Img */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${AboutImg})`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-midnight-950/90 via-midnight-900/80 to-royal-950/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-midnight-950 via-transparent to-transparent" />
      </div>
      {/* Content our story */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 text-center">
        <div className="fade-in-up">
          <h1 className="text-5xl md:text-7xl font-display font-bold pb-3 mb-5 text-gradient leading-tight">
            OUR STORY
          </h1>
          <div className="grid lg:grid-cols-2 gap-16 items-center mb-10">
            <div className="">
              {/* Content - Right */}
              <p className="text-lg text-left md:text-xl mb-4 text-lavender-200 font-body max-w-3xl mx-auto">
                Khởi đầu từ một niềm tin đơn giản – mỗi chuyến đi đều xứng đáng
                với những trải nghiệm tốt nhất,{" "}
                <span className="text-gradient font-display font-bold">
                  Infinity Stay
                </span>{" "}
                ra đời như một nơi dừng chân lý tưởng cho những ai yêu thích sự
                tinh tế và thoải mái.
              </p>
              <p className="text-lg text-left md:text-xl mb-4 text-lavender-200 font-body max-w-3xl mx-auto">
                Cái tên{" "}
                <span className="text-gradient font-display font-bold">
                  “Infinity”
                </span>{" "}
                tượng trưng cho sự vô hạn – vô hạn trong cảm xúc, tiện nghi và
                sự tận tâm. Tại đây, chúng tôi không chỉ cung cấp chỗ ở, mà là
                tạo nên một hành trình đáng nhớ cho từng vị khách.
              </p>
              <p className="text-lg text-left md:text-xl mb-4 text-lavender-200 font-body max-w-3xl mx-auto">
                Dù là kỳ nghỉ ngắn ngày hay chuyến công tác dài hạn, Infinity
                Stay luôn cam kết đem lại sự hài lòng tuyệt đối từ khoảnh khắc
                bạn bước vào đến lúc rời đi.
              </p>
            </div>
            <div className="relative">
              <div className="relative overflow-hidden rounded-2xl shadow-luxury">
                <img
                  src={AboutImg2}
                  alt="Infinity Stay"
                  className="w-full h-96 object-cover transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-midnight-900/60 to-transparent"></div>
              </div>

              {/* Floating Card */}
              <div className="absolute -bottom-6 -right-6 bg-gradient-card p-6 rounded-xl shadow-royal backdrop-blur-sm border border-royal-500/20">
                <div className="text-center">
                  <div className="text-3xl font-bold text-infinity-400 font-display">
                    10K+
                  </div>
                  <div className="text-sm text-lavender-200 font-body">
                    Khách hài lòng
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
