document.addEventListener("alpine:init", () => {
  Alpine.data("products", () => ({
    items: [
      { id: 1, name: "Ethiopia", img: "1.jpg", price: 30000 },
      { id: 2, name: "Mazevo", img: "2.jpg", price: 40000 },
      { id: 3, name: "Original", img: "3.jpg", price: 25000 },
      { id: 4, name: "Aceh Gayo", img: "4.jpg", price: 70000 },
      { id: 5, name: "Excelso", img: "5.jpg", price: 50000 },
    ],
  }));

  Alpine.store("cart", {
    items: [],
    total: 0,
    quantity: 0,
    add(newItem) {
      // cek apakah barangnya sama
      const cartItem = this.items.find((item) => item.id === newItem.id);

      // jika belum ada / cart kosong
      if (!cartItem) {
        this.items.push({ ...newItem, quantity: 1, total: newItem.price });
        this.quantity++;
        this.total += newItem.price;
      } else {
        // cek barang yang ada di cart
        this.items = this.items.map((item) => {
          // jika beda, input barangnya
          if (item.id !== newItem.id) {
            return item;
          } else {
            // jika barangnya sudah ada, tambahkan...
            item.quantity++;
            item.total = item.price * item.quantity;
            this.quantity++;
            this.total += item.price;
            return item;
          }
        });
      }
    },

    // fungsi minus/remove barang di cart
    remove(id) {
      // ambil item berdasarkan id
      const cartItem = this.items.find((item) => item.id === id);

      // jika item lebih dari 1
      if (cartItem.quantity > 1) {
        // telusuri itemnya
        this.items = this.items.map((item) => {
          // jika bukan barang yang di klik
          if (item.id !== id) {
            return item;
          } else {
            item.quantity--;
            item.total = item.price * item.quantity;
            this.quantity--;
            this.total -= item.price;
            return item;
          }
        });
      } else if (cartItem.quantity === 1) {
        // jika barang sisa 1
        this.items = this.items.filter((item) => item.id !== id);
        this.quantity--;
        this.total -= cartItem.price;
      }
    },
  });
});

// Form Validation
const checkoutButton = document.querySelector(".checkout-button");
checkoutButton.disabled = true;

const form = document.querySelector("#checkoutForm");

form.addEventListener("keyup", function () {
  for (let i = 0; i < form.elements.length; i++) {
    if (form.elements[i].value.length !== 0) {
      checkoutButton.classList.remove("disabled");
      checkoutButton.classList.add("disabled");
    } else {
      return false;
    }
  }
  checkoutButton.disabled = false;
  checkoutButton.classList.remove("disabled");
});

// kirim data ketika tombol checkout diklik
checkoutButton.addEventListener("click", function (e) {
  e.preventDefault();
  const formData = new FormData(form);
  const data = new URLSearchParams(formData);
  const objData = Object.fromEntries(data);
  const message = formatMessage(objData);
  window.open('http://wa.me/6282180553668?text=' + encodeURIComponent(message));
});

// format pesan whatsapp
const formatMessage = (obj) => {
  return `Data Customer
    Nama: ${obj.name}
    Email: ${obj.email}
    No HP: ${obj.phone}
  Data Pesanan
    ${JSON.parse(obj.items).map(
      (item) => `${item.name} (${item.quantity} = ${rupiah(item.total)}) \n`
    )}
  TOTAL: ${rupiah(obj.total)}
  Terima kasih.`;
};

// konversi ke Rupiah
const rupiah = (number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(number);
};
