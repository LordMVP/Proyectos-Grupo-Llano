import React, { useState } from 'react'
import { Carousel } from 'react-bootstrap'

export default function SlideFotos({ fotosList }) {
  const [index, setIndex] = useState(0);

  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <Carousel activeIndex={index} onSelect={handleSelect}>
        {fotosList?.length > 0 &&
          fotosList.map((t, i) => (
            <Carousel.Item key={i}>
              <img
                className="d-block w-100"
                src={t.url}
                alt={`slide number ${t.id}`}
              />
              <Carousel.Caption>
                <p>{t.name + " - " +t.id}</p>
              </Carousel.Caption>
            </Carousel.Item>
          ))}
      </Carousel>

      {/* Pie de página: índice actual + total */}
      {fotosList?.length > 0 && (
        <div style={{ marginTop: '10px', fontSize: '16px', color: '#555' }}>
          {index + 1} de {fotosList.length} imágenes
        </div>
      )}
    </div>
  );
}