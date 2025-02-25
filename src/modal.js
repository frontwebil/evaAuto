const TOKEN = "7648303468:AAHmTWnHcsfw3rtHvpGvMFykV-3Ukryyofo";
const CHAT_ID = "-1002326050281";
const URI_API = `https://api.telegram.org/bot${TOKEN}/sendMessage`;

const modalConsultating = document.getElementById("modalConsultating");
const modalConsultatingContainer = document.querySelector(
  ".modalConsultating-container"
);
const modalTahnkYou = document.getElementById('modalTahnkYou');
const openModalConsultatingButtons = document.querySelectorAll(
  ".openModalConsultating"
);
const closeOpenModalConsultating = document.getElementById(
  "closeModalConsultating"
);

function closeModal(modalElement) {
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
  closeModal(modalConsultating);
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

function showToast(message) {
  const toastMessage = document.getElementById("toast-message");
  toastMessage.textContent = message;
  toastMessage.classList.add("show");

  setTimeout(() => {
    toastMessage.classList.remove("show");
  }, 2000); // 2 секунди
}

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

// fetch(URI_API, {
//   method: "POST",
//   headers: {
//     "Content-Type": "application/json",
//   },
//   body: JSON.stringify({
//     chat_id: CHAT_ID,
//     parse_mode: "html",
//     text: "Test",
//   }),
// })
