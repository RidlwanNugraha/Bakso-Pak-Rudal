// Data menu
const NOMOR_WA = "628882378361";
const menu = [
  { kategori: "Bakso", nama: "Bakso Urat", foto: "foto/bakso-urat.jpg", emoji: "🍜", deskripsi: "Tiga bakso urat kenyal dengan serat daging yang terasa di setiap gigitan.", harga: 10000 },
  { kategori: "Bakso", nama: "Bakso Telur", foto: "foto/bakso-telur.jpg", emoji: "🍜", deskripsi: "Satu bakso besar berisi telur puyuh utuh dan dua bakso halus.", harga: 15000 },
  { kategori: "Bakso", nama: "Bakso Beranak", foto: "foto/bakso-beranak.jpg", emoji: "🍜", deskripsi: "Bakso jumbo isi lima bakso kecil, cocok untuk yang lapar berat.", harga: 18000 },
  { kategori: "Bakso", nama: "Bakso Komplit", foto: "foto/bakso-komplit.jpg", emoji: "🍜", deskripsi: "Bakso halus, urat, tahu, pangsit goreng, dan tetelan sapi.", harga: 25000 },
  { kategori: "Minuman", nama: "Es Teh Manis", foto: "foto/es-teh-manis.jpg", emoji: "🧋", deskripsi: "Teh seduh dingin dengan gula pas, pasangan klasik bakso.", harga: 4000 },
  { kategori: "Minuman", nama: "Teh Hangat", foto: "foto/teh-hangat.jpg", emoji: "🍵", deskripsi: "Teh tawar atau manis hangat untuk menemani kuah panas.", harga: 3000 },
  { kategori: "Minuman", nama: "Es Jeruk", foto: "foto/es-jeruk.jpg", emoji: "🍊", deskripsi: "Jeruk peras segar dengan es batu, menyegarkan setelah pedas.", harga: 5000 },
  { kategori: "Minuman", nama: "Es Campur", foto: "foto/es-campur.jpg", emoji: "🍧", deskripsi: "Kelapa muda, alpukat, cincau, dan sirup dengan susu.", harga: 10000 },
  { kategori: "Minuman", nama: "Air Mineral", foto: "foto/air-mineral.jpg", emoji: "💧", deskripsi: "Botol 600 ml, dingin atau suhu ruang.", harga: 2000 },
];
const jumlah = menu.map(() => 0);

const rupiah = (n) => "Rp " + n.toLocaleString("id-ID");
const list = document.getElementById("menu-list");
const totalEl = document.getElementById("total");
const orderBtn = document.getElementById("order-btn");

// Pakai foto dari foto.js; kalau tidak ada, pakai file di folder foto
const sumberFoto = (path) => (typeof FOTO !== "undefined" && FOTO[path]) || path;

// Tampilkan kartu menu
let kategoriSebelumnya = "";
menu.forEach((item, i) => {
  if (item.kategori !== kategoriSebelumnya) {
    const judul = document.createElement("h3");
    judul.className = "kategori";
    judul.textContent = item.kategori;
    list.appendChild(judul);
    kategoriSebelumnya = item.kategori;
  }
  const kartu = document.createElement("div");
  kartu.className = "item";
  kartu.innerHTML = `
    <div class="foto" data-emoji="${item.emoji}">
      <img src="${sumberFoto(item.foto)}" alt="${item.nama}" loading="lazy">
    </div>
    <h3>${item.nama}</h3>
    <p>${item.deskripsi}</p>
    <span class="price">${rupiah(item.harga)}</span>
    <div class="qty">
      <button type="button" aria-label="Kurangi ${item.nama}" data-i="${i}" data-aksi="-1">−</button>
      <output id="qty-${i}" aria-live="polite">0</output>
      <button type="button" aria-label="Tambah ${item.nama}" data-i="${i}" data-aksi="1">+</button>
    </div>`;
  // Kalau file foto belum ada, tampilkan gambar pengganti
  const img = kartu.querySelector("img");
  img.addEventListener("error", () => {
    img.remove();
    kartu.querySelector(".foto").classList.add("kosong");
  });
  list.appendChild(kartu);
});

// Ubah jumlah pesanan
list.addEventListener("click", (e) => {
  const btn = e.target.closest("button[data-i]");
  if (!btn) return;
  const i = Number(btn.dataset.i);
  jumlah[i] = Math.max(0, jumlah[i] + Number(btn.dataset.aksi));
  document.getElementById("qty-" + i).textContent = jumlah[i];
  hitungTotal();
});

function hitungTotal() {
  const total = menu.reduce((sum, m, i) => sum + m.harga * jumlah[i], 0);
  totalEl.textContent = rupiah(total);
  orderBtn.disabled = total === 0;
}

// Kirim pesanan ke WhatsApp
orderBtn.addEventListener("click", () => {
  const baris = menu
    .map((m, i) => (jumlah[i] ? `- ${m.nama} x${jumlah[i]} = ${rupiah(m.harga * jumlah[i])}` : null))
    .filter(Boolean);
  const total = menu.reduce((sum, m, i) => sum + m.harga * jumlah[i], 0);
  const pesan = `Halo Bakso Pak Rudal, saya mau pesan:\n${baris.join("\n")}\nTotal: ${rupiah(total)}`;
  const a = document.createElement("a");
  a.href = `https://wa.me/${NOMOR_WA}?text=${encodeURIComponent(pesan)}`;
  a.target = "_blank";
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
});

// Scroll halus untuk link anchor
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener("click", (e) => {
    const target = document.querySelector(a.getAttribute("href"));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: "smooth" });
  });
});