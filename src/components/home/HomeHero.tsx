import React from "react";
import HomeImg from "../../assets/imgs/home_img.jpg";
import { Calendar, ChevronDownIcon, Users } from "lucide-react";

interface HomeHeroProps {
  searchDates: {
    checkIn: string;
    checkOut: string;
    guests: number;
  };
  setSearchDates: (dates: {
    checkIn: string;
    checkOut: string;
    guests: number;
  }) => void;
  onSearch: () => void;
}

export const HomeHero: React.FC<HomeHeroProps> = ({
  searchDates,
  setSearchDates,
  onSearch,
}) => {
  React.useEffect(() => {
    if (!searchDates.checkIn) {
      const today = new Date().toISOString().split("T")[0];
      setSearchDates({
        ...searchDates,
        checkIn: today,
      });
    }
  }, []);
  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${HomeImg})`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-midnight-950/90 via-midnight-900/80 to-royal-950/70" />
          <div className="absolute inset-0 bg-gradient-to-t from-midnight-950 via-transparent to-transparent" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
          <div className="fade-in-up">
            <h1 className="text-5xl md:text-7xl font-display font-bold pb-3 mb-5 text-gradient leading-tight">
              Infinity Stay
            </h1>
            <p className="text-xl md:text-2xl mb-4 text-lavender-200 font-body max-w-3xl mx-auto">
              Where comfort meets infinity
            </p>
            <p className="text-lg md:text-xl mb-12 text-lavender-300 font-body max-w-2xl mx-auto opacity-90">
              Trải nghiệm sự sang trọng và tiện nghi tại trung tâm thành phố với
              dịch vụ đẳng cấp quốc tế
            </p>

            {/* Search Form */}
            <div className="glass-effect rounded-3xl shadow-luxury p-8 max-w-5xl mx-auto border-gradient">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-heading font-medium text-lavender-300">
                    Ngày nhận phòng
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={searchDates.checkIn}
                      onChange={(e) =>
                        setSearchDates({
                          ...searchDates,
                          checkIn: e.target.value,
                        })
                      }
                      className="form-input w-full pl-12 pr-4 py-4 rounded-xl font-body"
                      min={new Date().toISOString().split("T")[0]}
                    />
                    <Calendar className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-royal-400 pointer-events-none" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-heading font-medium text-lavender-300">
                    Ngày trả phòng
                  </label>
                  <div className="relative">
                    {/* <Calendar className="absolute left-4 top-4 h-5 w-5 text-royal-400" /> */}
                    <input
                      type="date"
                      value={searchDates.checkOut}
                      onChange={(e) =>
                        setSearchDates({
                          ...searchDates,
                          checkOut: e.target.value,
                        })
                      }
                      className="form-input w-full pl-12 pr-4 py-4 rounded-xl font-body"
                      min={
                        searchDates.checkIn ||
                        new Date().toISOString().split("T")[0]
                      }
                    />
                    <Calendar className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-royal-400 pointer-events-none" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-heading font-medium text-lavender-300">
                    Số khách
                  </label>
                  <div className="relative">
                    <Users className="absolute left-4 top-4 h-5 w-5 text-royal-400" />
                    <select
                      value={searchDates.guests}
                      onChange={(e) =>
                        setSearchDates({
                          ...searchDates,
                          guests: parseInt(e.target.value),
                        })
                      }
                      className="form-input w-full pl-12 pr-4 py-4 rounded-xl font-body appearance-none"
                    >
                      {[1, 2, 3, 4, 5, 6].map((num) => (
                        <option
                          key={num}
                          value={num}
                          className="bg-midnight-800"
                        >
                          {num} khách
                        </option>
                      ))}
                    </select>
                    <ChevronDownIcon className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-royal-400 pointer-events-none" />
                  </div>
                </div>

                <div className="flex items-end">
                  <button
                    onClick={onSearch}
                    className="btn-primary w-full py-4 px-6 rounded-xl font-heading font-semibold text-lg"
                  >
                    Tìm phòng
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
