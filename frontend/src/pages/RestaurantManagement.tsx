import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RestaurantManagement: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const restaurants = [
    { id: '1', name: 'Cơm Tấm Ba Ghiền', address: '84 Đặng Văn Ngữ, P.10, Phú Nhuận', icon: 'restaurant', bg: 'bg-primary-fixed', text: 'text-primary-container' },
    { id: '2', name: 'Mì Gói Cô Giang', address: '140 Cô Giang, Quận 1', icon: 'ramen_dining', bg: 'bg-tertiary-fixed', text: 'text-tertiary' },
    { id: '3', name: 'Cà Phê Sáng', address: '22 Lý Tự Trọng, Quận 1', icon: 'coffee', bg: 'bg-secondary-fixed', text: 'text-secondary' },
    { id: '4', name: 'Phở Hòa Pasteur', address: '260C Pasteur, Quận 3', icon: 'storefront', bg: 'bg-primary-fixed', text: 'text-primary-container' },
  ];

  const filteredRestaurants = restaurants.filter(r => 
    r.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-background text-on-background font-body-md min-h-screen">
      {/* Top AppBar */}
      <header className="fixed top-0 w-full z-50 items-center px-margin-mobile h-16 bg-surface grid grid-cols-3">
        <button 
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-primary-container/10 transition-colors active:scale-95 duration-200"
          onClick={() => navigate(-1)}
        >
          <span className="material-symbols-outlined text-primary">arrow_back</span>
        </button>
        <h1 className="text-headline-md font-headline-md tracking-tight text-center col-start-2 text-[#ff7a00]">
          Quán ăn
        </h1>
      </header>

      <main className="pt-20 pb-base px-margin-mobile max-w-md mx-auto">
        {/* Search Section */}
        <section className="px-0 sticky bg-surface z-40 pt-1 pb-2 top-12">
          <div className="relative">
            <span className="material-symbols-outlined absolute top-1/2 -translate-y-1/2 text-on-surface-variant right-4">search</span>
            <input 
              className="w-full h-12 pr-12 rounded-xl border-none bg-surface-container-low text-body-md font-body-md focus:ring-2 focus:ring-primary transition-all placeholder:text-outline pl-4" 
              placeholder="Tìm kiếm tên quán ăn..." 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </section>

        {/* Quick Add Section */}
        <section className="pb-4">
          <div className="flex gap-2 items-start">
            <div className="flex-1 space-y-2">
              <input className="w-full h-12 px-4 rounded-xl border-none bg-surface-container-low text-body-md font-body-md focus:ring-2 focus:ring-primary transition-all placeholder:text-outline" placeholder="Tên quán" type="text" />
              <input className="w-full h-12 px-4 rounded-xl border-none bg-surface-container-low text-body-md font-body-md focus:ring-2 focus:ring-primary transition-all placeholder:text-outline" placeholder="Địa chỉ" type="text" />
            </div>
            <button className="w-12 h-[104px] bg-primary-container text-on-primary rounded-xl flex items-center justify-center active:scale-95 transition-transform">
              <span className="material-symbols-outlined text-2xl">add</span>
            </button>
          </div>
        </section>

        {/* List Header */}
        <section className="flex justify-between items-end mb-4">
          <h2 className="font-label-md text-label-md text-on-surface-variant">Tất cả quán ăn ({filteredRestaurants.length})</h2>
          <button className="text-primary font-label-sm text-label-sm flex items-center gap-1">
            Sắp xếp
            <span className="material-symbols-outlined text-sm">unfold_more</span>
          </button>
        </section>

        {/* Restaurant List (Deck Layout) */}
        <div className="space-y-4">
          {filteredRestaurants.map((r) => (
            <article key={r.id} className="bg-surface-container-lowest p-md rounded-xl card-shadow flex items-center gap-4 transition-all hover:scale-[1.01]">
              <div className={`w-14 h-14 ${r.bg} rounded-xl flex items-center justify-center ${r.text}`}>
                <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>{r.icon}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-headline-md text-[18px] leading-tight text-on-surface truncate">{r.name}</h3>
                <p className="font-label-sm text-label-sm text-on-surface-variant mt-1 flex items-start gap-1">
                  <span className="material-symbols-outlined text-xs mt-0.5">location_on</span>
                  {r.address}
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <button className="p-2 text-on-surface-variant hover:text-primary transition-colors">
                  <span className="material-symbols-outlined">edit</span>
                </button>
                <button className="p-2 text-on-surface-variant hover:text-error transition-colors">
                  <span className="material-symbols-outlined">delete</span>
                </button>
              </div>
            </article>
          ))}
        </div>

        {/* Empty state placeholder for UX */}
        {filteredRestaurants.length === 0 && (
          <div className="flex flex-col items-center justify-center py-xl text-center opacity-40">
            <span className="material-symbols-outlined text-6xl mb-4">search_off</span>
            <p className="font-headline-md text-headline-md">Không tìm thấy quán</p>
            <p className="font-body-md text-body-md">Hãy thử tìm với tên khác nhé!</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default RestaurantManagement;
