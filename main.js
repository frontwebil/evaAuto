import { goods } from "./const/goods";

let cart = [];
let addToCartButtons;
const modalTahnkYou = document.getElementById('modalTahnkYou');
const countCart = document.getElementById("count-cart");
const openCart = document.getElementById("openCart");
const closeCart = document.getElementById("closeMenu");
const cartMenu = document.getElementById("cartMenu");
const emptyCart = document.getElementById("emptyCart");
const filledCart = document.getElementById("filledCart");
const TOKEN = "7648303468:AAHmTWnHcsfw3rtHvpGvMFykV-3Ukryyofo";
const CHAT_ID = "-1002326050281";
const URI_API = `https://api.telegram.org/bot${TOKEN}/sendMessage`;
const screenWidth = window.screen.width;

function createGoodInCart() {
  filledCart.innerHTML = "";
  cart.forEach((el) => {
    filledCart.innerHTML += `
      <div class="good-flex">
        <img src="${el.currentGood.img}" alt="" class="filledCart-img">
        <div class="good-flex-controls">
          <h2 class="fs-s w600">${el.currentGood.title}</h2>
          <div class="good-flex-controlPanel">
            <button class="fs-m w500 decrease" data-id="${el.id}">-</button>
            <p class="good-counter">${el.count}</p>
            <button class="fs-m w500 increase" data-id="${el.id}">+</button>
          </div>
        </div>
      </div>`;
  });

  const sum = cart.reduce(
    (sum, el) => sum + el.currentGood.price * el.count,
    0
  );

  filledCart.innerHTML += `
              <form id="modalFormCart" class="modalForm" style="padding-top: 12px;
    border-top: 1px solid rgba(9, 65, 202, 0.2);">

              <div class="form-group-row">
                <div class="form-group">
                  <label for="name" class="fs-s w700">Ім'я</label>
                  <input 
                      type="text" 
                      id="nameCart" 
                      name="nameCart" 
                      placeholder="Введіть ваше ім'я"
                      required
                  >
              </div>
  
              <div class="form-group">
                  <label for="phone" class="fs-s w700">Телефон</label>
                  <input 
                      type="tel" 
                      id="phoneCart" 
                      name="phoneCart" 
                      placeholder="+380"
                      value="+380"
                      pattern="\+380[0-9]{9}"
                      required
                  >
              </div>
              </div>
              <div class="form-group">
                  <label for="request" class="fs-s w700">Марка та рік машини</label>
                  <input 
                      type="text" 
                      id="markCart" 
                      name="markCart" 
                      placeholder="Марка та рік машини"
                      required
                  >
              </div>
                                <div class="filledCart-price">
          <p class="fs-s w600">До сплати</p>
          <p class="fs-s w700" style="color: rgba(9, 65, 202, 1);">${cart.reduce(
            (sum, el) => sum + el.currentGood.price * el.count,
            0
          )} грн</p>
        </div>
        <button type='submit' class="placeOrder">
          Оформити
        </button>
          </form> 

  `;
  filledCart.innerHTML += `

`;

  addCartEventListeners();
}

function addCartEventListeners() {
  document.querySelectorAll(".increase").forEach((button) => {
    button.addEventListener("click", (e) => {
      const id = parseInt(e.target.dataset.id);
      updateItemCount(id, 1);
    });
  });

  document.querySelectorAll(".decrease").forEach((button) => {
    button.addEventListener("click", (e) => {
      const id = parseInt(e.target.dataset.id);
      updateItemCount(id, -1);
    });
  });

  const phoneInput = document.getElementById("phoneCart");
  phoneInput.value = "+380";
  function isNumeric(char) {
    return /^\d$/.test(char);
  }
  phoneInput.addEventListener("input", function (e) {
    let value = e.target.value;
    if (!value.startsWith("+380")) {
      value = "+380";
    }
    let numbers = value.slice(4).replace(/\D/g, "");
    numbers = numbers.slice(0, 9);
    e.target.value = "+380" + numbers;
  });

  document
    .getElementById("modalFormCart")
    .addEventListener("submit", function (event) {
      event.preventDefault();
      console.log(Array.isArray(cart)); // має вивести true
      const inputContents = [
        `<b>Замовлення</b>`,
        `Ім'я: ${this.nameCart.value}`,
        `Номер телефону: ${this.phoneCart.value}`,
        `Марка та рік авто: ${this.markCart.value}`,
        `<b>Товари:</b>`,
        ...(Array.isArray(cart)
          ? cart.map(
              (el, i) =>
                `${i + 1}.${el.currentGood.title}, Кількість: ${el.count}`
            )
          : []),
        `<b>Сума до сплати: ${
          cart && Array.isArray(cart)
            ? cart.reduce((sum, el) => sum + el.currentGood.price * el.count, 0)
            : 0
        } грн</b>`,
      ];
      let message = inputContents.join("\n");

      fetch(URI_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          parse_mode: "html",
          text: message,
        }),
      })
        .then((res) => {
          showToast("Заявка на косультацію відправлена📢");
          modalTahnkYou.classList.add('active')
          this.nameCart.value = "";
          this.phoneCart.value = "+380";
          this.markCart.value = "";
          cartMenu.classList.remove("active");
          cart = [];
          updateCartUI();
        })
        .catch((error) => {
          console.log(error);
        });
    });
}

function updateItemCount(id, amount) {
  const item = cart.find((el) => el.id === id);
  if (!item) return;

  item.count += amount;

  // Видалити товар, якщо його кількість стає 0 або менше
  if (item.count <= 0) {
    cart.splice(cart.indexOf(item), 1);
  }

  let allGoods = cart.reduce((sum, el) => sum + el.count, 0);
  countCart.innerHTML = `(${allGoods})`;

  updateCartUI();
}

function updateCartUI() {
  if (cart.length === 0) {
    emptyCart.classList.add("active");
    filledCart.classList.remove("active");
  } else {
    emptyCart.classList.remove("active");
    filledCart.classList.add("active");
    createGoodInCart();
  }
}

openCart.addEventListener("click", () => {
  cartMenu.classList.toggle("active");
});

closeCart.addEventListener("click", () => {
  cartMenu.classList.remove("active");
});

function showToast(message) {
  const toastMessage = document.getElementById("toast-message");
  toastMessage.textContent = message;
  toastMessage.classList.add("show");

  setTimeout(() => {
    toastMessage.classList.remove("show");
  }, 2000); // 2 секунди
}

function addToCart(index) {
  const currentGood = goods.find((_, i) => i === index);
  if (!currentGood) return; // Захист від помилки, якщо товар не знайдено

  const existingItem = cart.find((el) => el.id === index);

  if (existingItem) {
    existingItem.count++; // Якщо товар вже є, збільшуємо його кількість
  } else {
    cart.push({
      id: index,
      count: 1,
      currentGood,
    });
  }

  let allGoods = 0;

  cart.forEach((el) => {
    allGoods = allGoods + el.count;
  });

  countCart.innerHTML = `(${allGoods})`;
  console.log(cart);

  updateCartUI();
  // Показати спливаюче повідомлення
  showToast("Товар додано до кошику 💎");
}

let SLIDES_PER_PAGE = 3;
if (screenWidth <= 1150) {
  SLIDES_PER_PAGE = 2;
}
if (screenWidth <= 850) {
  SLIDES_PER_PAGE = 1;
}

let currentSlideIndex = 0;

function initGoodsSlider() {
  const slidesContainer = document.querySelector(".goods-slides");
  const buttonPrev = document.querySelector(".controls-goods-prev");
  const buttonNext = document.querySelector(".controls-goods-next");
  const indicators = document.querySelector(".indicators-goods");

  function createGoodCard(good, index) {
    return `
      <div class="good-card">
        <img src="${good.img}" alt="" class="good-card-image">
        <h2 class="fs-m w600" style="color: rgba(9, 65, 202, 1);">${
          good.title
        }</h2>
        <div class="flex-good-info">
          ${good.info
            .map((info) => `<p class="fs-sm w400">${info}</p>`)
            .join("")}
        </div>
        <div class="good-card-controls">
          <div class="good-card-price">${good.price} грн</div>
          <div class="good-card-addToCard" data-good-index="${index}">у кошик</div>
        </div>
      </div>
    `;
  }

  function attachAddToCartEvents() {
    addToCartButtons = document.querySelectorAll(".good-card-addToCard");
    addToCartButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const index = parseInt(button.dataset.goodIndex, 10);
        addToCart(index);
      });
    });
  }

  function updateSlides() {
    const totalSlides = Math.ceil(goods.length / SLIDES_PER_PAGE);
    const currentSlide = document.querySelector(".goods-slide.active");

    const newSlide = document.createElement("div");
    newSlide.className = "goods-slide";

    const startIdx = currentSlideIndex * SLIDES_PER_PAGE;
    const endIdx = Math.min(startIdx + SLIDES_PER_PAGE, goods.length);
    newSlide.innerHTML = goods
      .slice(startIdx, endIdx)
      .map((good, index) => createGoodCard(good, startIdx + index))
      .join("");

    if (currentSlide) {
      currentSlide.style.opacity = "0";
      currentSlide.style.visibility = "hidden";
      setTimeout(() => {
        currentSlide.remove();
        slidesContainer.appendChild(newSlide);
        void newSlide.offsetWidth;
        newSlide.classList.add("active");
        attachAddToCartEvents();
      }, 200);
    } else {
      slidesContainer.appendChild(newSlide);
      setTimeout(() => {
        newSlide.classList.add("active");
        attachAddToCartEvents();
      }, 0);
    }
    updatePagination(totalSlides);
  }

  function updatePagination(totalSlides) {
    indicators.innerHTML = "";
    for (let i = 0; i < totalSlides; i++) {
      const button = document.createElement("div");
      button.className = `indicator-goods${
        i === currentSlideIndex ? " active" : ""
      }`;
      button.dataset.goods = i;
      button.textContent = i + 1;
      button.addEventListener("click", () => {
        currentSlideIndex = i;
        updateSlides();
      });
      indicators.appendChild(button);
    }
  }

  function nextSlide() {
    currentSlideIndex =
      (currentSlideIndex + 1) % Math.ceil(goods.length / SLIDES_PER_PAGE);
    updateSlides();
  }

  function prevSlide() {
    const totalSlides = Math.ceil(goods.length / SLIDES_PER_PAGE);
    currentSlideIndex = (currentSlideIndex - 1 + totalSlides) % totalSlides;
    updateSlides();
  }

  let startX;
let swiping = false; // прапорець, щоб відстежувати стан свайпу

slidesContainer.addEventListener("touchstart", (event) => {
  startX = event.touches[0].clientX;
  swiping = false; // скидаємо прапорець на початку жесту
});

slidesContainer.addEventListener("touchmove", (event) => {
  if (swiping) return; // якщо свайп вже оброблено, ігноруємо подальші події

  const endX = event.touches[0].clientX;
  const diff = endX - startX;
  
  if (Math.abs(diff) > 50) {
    if (diff < 0) {
      nextSlide(); // свайп вліво
    } else {
      prevSlide(); // свайп вправо
    }
    swiping = true; // позначаємо, що свайп оброблено
  }
});

slidesContainer.addEventListener("touchend", () => {
  swiping = false; // скидаємо прапорець після завершення жесту
});

  buttonNext.addEventListener("click", nextSlide);
  buttonPrev.addEventListener("click", prevSlide);

  updateSlides();
}

document.addEventListener("DOMContentLoaded", initGoodsSlider);

updateCartUI();

// Gallery
let SLIDES_PER_PAGE_GALLERY = 4;
if (screenWidth < 1100) {
  SLIDES_PER_PAGE_GALLERY = 3;
}
if (screenWidth < 740) {
  SLIDES_PER_PAGE_GALLERY = 2;
}
if (screenWidth < 600) {
  SLIDES_PER_PAGE_GALLERY = 1;
}

let currentSlide = 0;

// Масив з зображеннями
const images = [
  "/gallery/img-1-gallery.jpg",
  "/gallery/img-2-gallery.jpg",
  "/gallery/img-3-gallery.jpg",
  "/gallery/img-4-gallery.jpg",
  "/gallery/img-5-gallery.jpg",
  "/gallery/img-6-gallery.jpg",
  "/gallery/img-7-gallery.jpg",
  "/gallery/img-8-gallery.jpg",
  "/gallery/img-9-gallery.jpg",
  "/gallery/img-10-gallery.jpg",
  "/gallery/img-11-gallery.jpg",
  "/gallery/img-12-gallery.jpg",
];

// Створюємо модальне вікно
function createModal() {
  const modal = document.createElement("div");
  modal.className = "gallery-modal";
  modal.innerHTML = `
    <div class="modal-content">
      <img src="" alt="Full screen image" class="modal-image">
      <button class="modal-close">&times;</button>
      <button class="modal-prev">&lt;</button>
      <button class="modal-next">&gt;</button>
    </div>
  `;

  // Додаємо обробник кліку на фон
  modal.addEventListener("click", (e) => {
    // Якщо клік був саме по фону (modal), а не по його вмісту
    if (e.target === modal) {
      modal.classList.remove("active");
      document.body.style.overflow = "auto";
    }
  });

  document.body.appendChild(modal);
  return modal;
}

function init() {
  const slidesContainer = document.querySelector(".gallery-slides");
  const nextButton = document.querySelector(".controls-gallery-prev");
  const prevButton = document.querySelector(".controls-gallery-next");
  const indicators = document.querySelector(".indicators-gallery");

  let touchStartX = 0;
  let touchEndX = 0;

  function handleTouchStart(e) {
    touchStartX = e.touches[0].clientX;
  }

  function handleTouchEnd(e) {
    touchEndX = e.changedTouches[0].clientX;
    handleSwipe();
  }

  function prevSlide() {
    const totalSlides = Math.ceil(images.length / SLIDES_PER_PAGE_GALLERY);
    if (currentSlide > 0) {
      currentSlide--;
    } else {
      currentSlide = totalSlides - 1;
    }
    updateSlides();
  }

  function nextSlide() {
    const totalSlides = Math.ceil(images.length / SLIDES_PER_PAGE_GALLERY);
    if (currentSlide < totalSlides - 1) {
      currentSlide++;
    } else {
      currentSlide = 0;
    }
    updateSlides();
  }

  slidesContainer.addEventListener("touchstart", handleTouchStart);
  slidesContainer.addEventListener("touchend", handleTouchEnd);

  prevButton.addEventListener("click", prevSlide);
  nextButton.addEventListener("click", nextSlide);

  updateSlides();

  function handleSwipe() {
    const swipeThreshold = 50; // Мінімальна дистанція для реєстрації свайпа

    if (touchStartX - touchEndX > swipeThreshold) {
      // Свайп вліво → наступний слайд
      nextSlide();
    } else if (touchEndX - touchStartX > swipeThreshold) {
      // Свайп вправо → попередній слайд
      prevSlide();
    }
  }

  const modal = createModal();
  const modalImage = modal.querySelector(".modal-image");
  let currentModalIndex = 0;

  // Обробники подій для модального вікна
  modal.querySelector(".modal-close").addEventListener("click", () => {
    modal.classList.remove("active");
    document.body.style.overflow = "auto";
  });

  modal.querySelector(".modal-prev").addEventListener("click", () => {
    currentModalIndex = (currentModalIndex - 1 + images.length) % images.length;
    modalImage.src = images[currentModalIndex];
  });

  modal.querySelector(".modal-next").addEventListener("click", () => {
    currentModalIndex = (currentModalIndex + 1) % images.length;
    modalImage.src = images[currentModalIndex];
  });

  // Закриття по клавіші Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("active")) {
      modal.classList.remove("active");
      document.body.style.overflow = "auto";
    }
  });

  function updateSlides() {
    const totalSlides = Math.ceil(images.length / SLIDES_PER_PAGE_GALLERY);
    let slideContent = document.querySelector(".gallery-slide");

    if (!slideContent) {
      slideContent = document.createElement("div");
      slideContent.className = "gallery-slide";
      slidesContainer.appendChild(slideContent);
    }

    slideContent.style.opacity = "0";
    slideContent.classList.remove("active");

    setTimeout(() => {
      slideContent.innerHTML = "";

      const startIdx = currentSlide * SLIDES_PER_PAGE_GALLERY;
      const endIdx = Math.min(
        startIdx + SLIDES_PER_PAGE_GALLERY,
        images.length
      );

      for (let i = startIdx; i < endIdx; i++) {
        const imageSrc = images[i];
        const block = document.createElement("div");
        block.className = "gallery-slide-block";

        block.innerHTML = `
          <div class="gallery-image-wrapper">
            <img src="${imageSrc}" alt="Gallery image" class="gallery-image" />
          </div>
        `;

        // Додаємо обробник кліку для відкриття модального вікна
        const img = block.querySelector(".gallery-image");
        img.addEventListener("click", () => {
          currentModalIndex = i;
          modalImage.src = imageSrc;
          modal.classList.add("active");
          document.body.style.overflow = "";
        });

        slideContent.appendChild(block);
      }

      requestAnimationFrame(() => {
        slideContent.style.opacity = "1";
        slideContent.classList.add("active");
      });

      updatePagination(totalSlides);
    }, 250);
  }

  function updatePagination(totalSlides) {
    indicators.innerHTML = "";

    if (totalSlides <= 5) {
      for (let i = 0; i < totalSlides; i++) {
        addPageButton(i, totalSlides);
      }
    } else {
      if (currentSlide > 2) {
        addPageButton(0, totalSlides);
        indicators.appendChild(createEllipsis());
      }

      for (
        let i = Math.max(0, currentSlide - 1);
        i <= Math.min(totalSlides - 1, currentSlide + 1);
        i++
      ) {
        addPageButton(i, totalSlides);
      }

      if (currentSlide < totalSlides - 3) {
        indicators.appendChild(createEllipsis());
        addPageButton(totalSlides - 1, totalSlides);
      }
    }
  }

  function addPageButton(pageNum, totalSlides) {
    const button = document.createElement("button");
    button.textContent = pageNum + 1;
    button.className = pageNum === currentSlide ? "active" : "";
    button.addEventListener("click", () => {
      currentSlide = pageNum;
      updateSlides();
    });
    indicators.appendChild(button);
  }

  function createEllipsis() {
    const span = document.createElement("span");
    span.textContent = "...";
    span.className = "pagination-ellipsis";
    return span;
  }

  prevButton.addEventListener("click", () => {
    const totalSlides = Math.ceil(images.length / SLIDES_PER_PAGE_GALLERY);
    if (currentSlide > 0) {
      currentSlide--;
      updateSlides();
    } else if (currentSlide === 0) {
      currentSlide = totalSlides - 1;
      updateSlides();
    }
  });

  nextButton.addEventListener("click", () => {
    const totalSlides = Math.ceil(images.length / SLIDES_PER_PAGE_GALLERY);
    if (currentSlide < totalSlides - 1) {
      currentSlide++;
      updateSlides();
    } else if (currentSlide === totalSlides - 1) {
      currentSlide = 0;
      updateSlides();
    }
  });

  updateSlides();
}

document.addEventListener("DOMContentLoaded", init);

// Testimonials
const reviews = [
  "/testimonials/1.png",
  "/testimonials/2.png",
  "/testimonials/3.png",
  "/testimonials/4.png",
  "/testimonials/5.png",
  "/testimonials/6.png",
  "/testimonials/7.png",
  "/testimonials/8.png",
  "/testimonials/9.png",
  "/testimonials/10.png",
  "/testimonials/11.png",
  "/testimonials/12.png",
];

let SLIDES_PER_PAGE_TESTIMONIAL = 3;
if (screenWidth < 1100) {
  SLIDES_PER_PAGE_TESTIMONIAL = 2;
}
if (screenWidth < 700) {
  SLIDES_PER_PAGE_TESTIMONIAL = 1;
}

let currentSlideTestimonial = 0;

// Create modal once when the script loads
const modal = document.createElement("div");
modal.className = "modal";
modal.innerHTML = `
  <div class="modal-content">
    <span class="close-modal">&times;</span>
    <img class="modal-image" src="" alt="Enlarged testimonial">
  </div>
`;
document.body.appendChild(modal);

// Add modal styles once
const style = document.createElement("style");
document.head.appendChild(style);

// Set up modal event handlers once
const closeModal = modal.querySelector(".close-modal");
const modalImg = modal.querySelector(".modal-image");

closeModal.onclick = () => {
  modal.style.display = "none";
};

window.onclick = (event) => {
  if (event.target === modal) {
    modal.style.display = "none";
  }
};

function initTestinonial() {
  const prevButton = document.querySelector(".controls-testimonials-prev");
  const nextButton = document.querySelector(".controls-testimonials-next");
  const indicators = document.querySelector(".indicators-testimonials");
  const slideContent = document.querySelector(".testimonial-slide");

  // Swipe handling variables
  let touchStartX = 0;
  let touchEndX = 0;
  const minSwipeDistance = 50; // Минимальное расстояние для свайпа

  // Add touch event listeners
  slideContent.addEventListener(
    "touchstart",
    (e) => {
      touchStartX = e.touches[0].clientX;
    },
    false
  );

  slideContent.addEventListener(
    "touchmove",
    (e) => {
      e.preventDefault(); // Предотвращаем прокрутку страницы при свайпе
    },
    false
  );

  slideContent.addEventListener(
    "touchend",
    (e) => {
      touchEndX = e.changedTouches[0].clientX;
      handleSwipe();
    },
    false
  );

  function handleSwipe() {
    const swipeDistance = touchEndX - touchStartX;
    const totalSlides = Math.ceil(reviews.length / SLIDES_PER_PAGE_TESTIMONIAL);

    if (Math.abs(swipeDistance) >= minSwipeDistance) {
      if (swipeDistance > 0 && currentSlideTestimonial > 0) {
        // Свайп вправо - предыдущий слайд
        currentSlideTestimonial--;
        updateSlides();
      } else if (
        swipeDistance < 0 &&
        currentSlideTestimonial < totalSlides - 1
      ) {
        // Свайп влево - следующий слайд
        currentSlideTestimonial++;
        updateSlides();
      }
    }
  }

  function updateSlides() {
    const totalSlides = Math.ceil(reviews.length / SLIDES_PER_PAGE_TESTIMONIAL);

    slideContent.style.opacity = "0";

    setTimeout(() => {
      slideContent.innerHTML = "";

      const startIdx = currentSlideTestimonial * SLIDES_PER_PAGE_TESTIMONIAL;
      const endIdx = Math.min(
        startIdx + SLIDES_PER_PAGE_TESTIMONIAL,
        reviews.length
      );

      for (let i = startIdx; i < endIdx; i++) {
        const review = reviews[i];
        const block = document.createElement("div");
        block.className = "testimonial-slide-block";

        block.innerHTML = `
          <img src="${review}" alt="" class="testimonial-image">
        `;

        // Add click handler for the image
        const img = block.querySelector("img");
        img.style.cursor = "pointer";
        img.onclick = () => {
          modal.style.display = "block";
          modalImg.src = review;
        };

        slideContent.appendChild(block);
      }

      requestAnimationFrame(() => {
        slideContent.style.opacity = "1";
      });

      updatePagination(totalSlides);
    }, 250);
  }

  function updatePagination(totalSlides) {
    indicators.innerHTML = "";

    if (totalSlides <= 5) {
      for (let i = 0; i < totalSlides; i++) {
        addPageButton(i, totalSlides);
      }
    } else {
      if (currentSlideTestimonial > 2) {
        addPageButton(0, totalSlides);
        indicators.appendChild(createEllipsis());
      }

      for (
        let i = Math.max(0, currentSlideTestimonial - 1);
        i <= Math.min(totalSlides - 1, currentSlideTestimonial + 1);
        i++
      ) {
        addPageButton(i, totalSlides);
      }

      if (currentSlideTestimonial < totalSlides - 3) {
        indicators.appendChild(createEllipsis());
        addPageButton(totalSlides - 1, totalSlides);
      }
    }
  }

  function addPageButton(pageNum, totalSlides) {
    const button = document.createElement("button");
    button.textContent = pageNum + 1;
    button.className = pageNum === currentSlideTestimonial ? "active" : "";
    button.addEventListener("click", () => {
      currentSlideTestimonial = pageNum;
      updateSlides();
    });
    indicators.appendChild(button);
  }

  function createEllipsis() {
    const span = document.createElement("span");
    span.textContent = "...";
    span.className = "pagination-ellipsis";
    return span;
  }

  prevButton.addEventListener("click", () => {
    if (currentSlideTestimonial > 0) {
      currentSlideTestimonial--;
      updateSlides();
    }
  });

  nextButton.addEventListener("click", () => {
    const totalSlides = Math.ceil(reviews.length / SLIDES_PER_PAGE_TESTIMONIAL);
    if (currentSlideTestimonial < totalSlides - 1) {
      currentSlideTestimonial++;
      updateSlides();
    }
  });

  updateSlides();
}

document.addEventListener("DOMContentLoaded", initTestinonial);

const moreGoods = [
  {
    img:'/moreGoods/1.png',
    title:'Органайзери еко-шкіра'
  },
  {
    img:'/moreGoods/2.png',
    title:'Накидки'
  },
  {
    img:'/moreGoods/3.png',
    title:'Органайзери для телефону'
  },
  {
    img:'/moreGoods/4.png',
    title:'Подушки'
  },
  {
    img:'/moreGoods/5.png',
    title:'Органайзери EVA - матеріал'
  },
];

let SLIDES_PER_PAGE_PERSONAL = 3;
if (screenWidth <= 1000) {
  SLIDES_PER_PAGE_PERSONAL = 2;
}
if (screenWidth <= 650  ) {
  SLIDES_PER_PAGE_PERSONAL = 1;
}

let currentSlideIndexPersonal = 0;

function initMoreGoods() {
  const slidesContainer = document.querySelector(".moreGoods-slides");
  const buttonPrevPersonal = document.querySelector(".controls-moreGoods-prev");
  const buttonNextPersonal = document.querySelector(".controls-moreGoods-next");
  const indicatorsPersonal = document.querySelector(".indicators-moreGoods");

  function createPersonalBlock(goods) {
    return `
        <div class="moreGoods-block">
      <div class="moreGoods-block-img-wrapper">
        <img src="${goods.img}" />
      </div>
      <div class="moreGoods-block-title fs-ml w600">${goods.title}</div>
      <a href="https://www.instagram.com/evaauto.ua/" class="link-to-inst">
        <p class="white fs-xsm w700">
          Дізнатись ціну
        </p>
        <img src="icons/chevron-right.svg" alt="">
      </a>
    </div>
    `;
  }

  function updateSlides() {
    const totalSlides = Math.ceil(moreGoods.length / SLIDES_PER_PAGE_PERSONAL);
    const currentSlide = document.querySelector(".moreGoods-slide.active");

    // Create new slide
    const newSlide = document.createElement("div");
    newSlide.className = "moreGoods-slide";

    const startIdx = currentSlideIndexPersonal * SLIDES_PER_PAGE_PERSONAL;
    const endIdx = Math.min(
      startIdx + SLIDES_PER_PAGE_PERSONAL,
      moreGoods.length
    );

    const slideContent = moreGoods
      .slice(startIdx, endIdx)
      .map((person) => createPersonalBlock(person))
      .join("");

    newSlide.innerHTML = slideContent;

    // Add new slide to container
    const slidesContainer = document.querySelector(".moreGoods-slides");

    if (currentSlide) {
      // Fade out current slide
      currentSlide.style.opacity = "0";
      currentSlide.style.visibility = "hidden";

      // Wait for fade out animation
      setTimeout(() => {
        currentSlide.remove();
        slidesContainer.appendChild(newSlide);

        // Trigger reflow
        void newSlide.offsetWidth;

        // Add active class to trigger fade in
        newSlide.classList.add("active");
      }, 200);
    } else {
      slidesContainer.appendChild(newSlide);
      setTimeout(() => {
        newSlide.classList.add("active");
      }, 0);
    }

    updatePagination(totalSlides);
  }

  function updatePagination(totalSlides) {
    indicatorsPersonal.innerHTML = "";

    if (totalSlides <= 5) {
      for (let i = 0; i < totalSlides; i++) {
        addPageButton(i);
      }
    } else {
      if (currentSlideIndexPersonal > 2) {
        addPageButton(0);
        addEllipsis();
      }

      for (
        let i = Math.max(0, currentSlideIndexPersonal - 1);
        i <= Math.min(totalSlides - 1, currentSlideIndexPersonal + 1);
        i++
      ) {
        addPageButton(i);
      }

      if (currentSlideIndexPersonal < totalSlides - 3) {
        addEllipsis();
        addPageButton(totalSlides - 1);
      }
    }
  }

  function addPageButton(pageNum) {
    const button = document.createElement("div");
    button.className = `indicator-moreGoods${
      pageNum === currentSlideIndexPersonal ? " active" : ""
    }`;
    button.dataset.moreGoods = pageNum;
    button.textContent = pageNum + 1;
    indicatorsPersonal.appendChild(button);
  }

  function addEllipsis() {
    const span = document.createElement("span");
    span.textContent = "...";
    span.className = "pagination-ellipsis";
    indicatorsPersonal.appendChild(span);
  }

  function nextSlide() {
    const totalSlides = Math.ceil(moreGoods.length / SLIDES_PER_PAGE_PERSONAL);
    if (currentSlideIndexPersonal < totalSlides - 1) {
      currentSlideIndexPersonal++;
      updateSlides();
    }
  }

  function prevSlide() {
    if (currentSlideIndexPersonal > 0) {
      currentSlideIndexPersonal--;
      updateSlides();
    }
  }

  // Touch events
  let startX, endX;

  function handleTouchStart(event) {
    startX = event.touches[0].clientX;
  }

  function handleTouchMove(event) {
    endX = event.touches[0].clientX;
  }

  function handleTouchEnd() {
    if (!endX) return;

    const deltaX = endX - startX;
    if (Math.abs(deltaX) > 50) {
      if (deltaX < 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
  }

  // Event Listeners
  buttonNextPersonal.addEventListener("click", nextSlide);
  buttonPrevPersonal.addEventListener("click", prevSlide);

  indicatorsPersonal.addEventListener("click", (event) => {
    const clickedIndicator = event.target;
    if (clickedIndicator.classList.contains("indicator-moreGoods")) {
      currentSlideIndexPersonal = parseInt(
        clickedIndicator.dataset.moreGoods,
        10
      );
      updateSlides();
    }
  });

  slidesContainer.addEventListener("touchstart", handleTouchStart);
  slidesContainer.addEventListener("touchmove", handleTouchMove);
  slidesContainer.addEventListener("touchend", handleTouchEnd);

  // Initial render
  updateSlides();
}

document.addEventListener("DOMContentLoaded", initMoreGoods);


// MODAL


const modalConsultating = document.getElementById("modalConsultating");
const modalConsultatingContainer = document.querySelector(
  ".modalConsultating-container"
);
const openModalConsultatingButtons = document.querySelectorAll(
  ".openModalConsultating"
);
const closeOpenModalConsultating = document.getElementById(
  "closeModalConsultating"
);

function closeModalCons(modalElement) {
  modalElement.classList.add("closing");
  modalElement.classList.remove("active");

  setTimeout(() => {
    modalElement.classList.remove("closing");
  }, 300); // Час повинен відповідати тривалості анімації в CSS
}

openModalConsultatingButtons.forEach((el) => {
  el.addEventListener("click", () => {
    modalConsultating.classList.toggle("active");
  });
});

closeOpenModalConsultating.addEventListener("click", () => {
  closeModalCons(modalConsultating);
});

const phoneInput = document.getElementById("phone");
phoneInput.value = "+380";
function isNumeric(char) {
  return /^\d$/.test(char);
}
phoneInput.addEventListener("input", function (e) {
  let value = e.target.value;
  if (!value.startsWith("+380")) {
    value = "+380";
  }
  let numbers = value.slice(4).replace(/\D/g, "");
  numbers = numbers.slice(0, 9);
  e.target.value = "+380" + numbers;
});


document
  .getElementById("modalForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    const inputContents = [
      `<b>Заявка на консультацію</b>`,
      `Ім'я: ${this.name.value}`,
      `Номер телефону: ${this.phone.value}`,
      `Марка та рік авто: ${this.request.value}`,
    ];
    let message = inputContents.join("\n");

    fetch(URI_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        parse_mode: "html",
        text: message,
      }),
    })
      .then((res) => {
        modalConsultating.classList.remove('active')
        modalTahnkYou.classList.add('active')
        showToast("Заявка на косультацію відправлена📢");
        this.name.value = "";
        this.phone.value = "+380";
        this.request.value = "";
      })
      .catch((error) => {
        console.log(error);
      });
  });

  document.addEventListener("DOMContentLoaded", function () {
    const burger = document.querySelector(".custom-burger");
    const menu = document.querySelector(".sliding-menu");
    const links = document.querySelectorAll(".sliding-menu-link");
  
    links.forEach((el) => {
      el.addEventListener("click", () => {
        burger.classList.toggle("active");
        menu.classList.toggle("active");
  
        document.body.style.overflow = menu.classList.contains("active")
          ? "hidden"
          : "";
      });
    });
  
    burger.addEventListener("click", function () {
      burger.classList.toggle("active");
      menu.classList.toggle("active");
  
      document.body.style.overflow = menu.classList.contains("active")
        ? "hidden"
        : "";
    });
  });
