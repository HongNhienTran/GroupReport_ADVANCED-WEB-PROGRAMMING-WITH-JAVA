import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from '../common/ProductCard';

const DISCOUNTS = [13, 15, 17, 15, 12, 18, 14, 20];

function FlashSaleSection({ products = [] }) {
  const [secondsLeft, setSecondsLeft] = useState(3 * 3600 + 28 * 60 + 21);
  const [startIndex, setStartIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = String(Math.floor(secondsLeft / 3600)).padStart(2, '0');
  const minutes = String(Math.floor((secondsLeft % 3600) / 60)).padStart(2, '0');
  const seconds = String(secondsLeft % 60).padStart(2, '0');

  const visibleCount = 4;
  const maxStart = Math.max(0, products.length - visibleCount);
  const visibleProducts = products.slice(startIndex, startIndex + visibleCount);

  return (
    <section id="flash-sale" className="flash-sale-section">
      <div className="container">
        <div className="flash-sale-banner">
          <div className="flash-sale-left">
            <div>
              <div className="flash-sale-kicker">ƯU ĐÃI GIỜ VÀNG</div>
              <h2 className="flash-sale-heading">FLASH SALE</h2>
            </div>
            <div className="flash-sale-badge">UP TO 40% OFF</div>
          </div>

          <div className="flash-sale-timer-wrap">
            <div className="timer-label">
              KẾT THÚC TRONG
              <span>Số lượng có hạn</span>
            </div>
            <div className="timer-boxes">
              <div className="timer-unit">
                <div className="timer-box">{hours}</div>
                <small>GIỜ</small>
              </div>
              <span className="timer-colon">:</span>
              <div className="timer-unit">
                <div className="timer-box">{minutes}</div>
                <small>PHÚT</small>
              </div>
              <span className="timer-colon">:</span>
              <div className="timer-unit">
                <div className="timer-box seconds">{seconds}</div>
                <small>GIÂY</small>
              </div>
            </div>
          </div>
        </div>

        <div className="carousel-shell">
          {products.length > visibleCount && (
            <>
              <button
                type="button"
                className="carousel-arrow prev"
                onClick={() => setStartIndex((prev) => Math.max(0, prev - 1))}
                disabled={startIndex === 0}
                aria-label="Sản phẩm trước"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                className="carousel-arrow next"
                onClick={() => setStartIndex((prev) => Math.min(maxStart, prev + 1))}
                disabled={startIndex >= maxStart}
                aria-label="Sản phẩm tiếp theo"
              >
                <ChevronRight size={18} />
              </button>
            </>
          )}

          <div className="product-grid-4">
            {visibleProducts.map((product, idx) => (
              <ProductCard
                key={product.id}
                product={product}
                badgeLabel="FLASH SALE"
                discountPercent={DISCOUNTS[(startIndex + idx) % DISCOUNTS.length]}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default FlashSaleSection;
