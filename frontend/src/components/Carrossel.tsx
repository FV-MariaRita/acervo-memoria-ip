import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Mousewheel, Keyboard } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import '../index.css'; 

interface CarrosselProps {
  path_fotos: string[];
}

const Carrossel = ({ path_fotos }: CarrosselProps) => {
  return (
    <Swiper
      cssMode={true}
      navigation={true}
      pagination={{ clickable: true }}
      mousewheel={true}
      keyboard={true}
      modules={[Navigation, Pagination, Mousewheel, Keyboard]}
      style={{
        '--swiper-navigation-color': '#b8923f', 
        '--swiper-pagination-color': '#b8923f', 
        '--swiper-pagination-bullet-inactive-color': '#ffffff', 
        '--swiper-pagination-bullet-inactive-opacity': '0.5',
      } as React.CSSProperties}

      className="mySwiper rounded-2xl overflow-hidden shadow-lg"
    >
      {path_fotos.map((foto, index) => (
        <SwiperSlide key={index}>
          <img 
            src={foto} 
            alt={`Foto ${index + 1}`}
            className="w-full max-h-[40vh] aspect-[16/9] object-cover rounded-2xl"
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default Carrossel;