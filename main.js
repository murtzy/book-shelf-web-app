window.addEventListener("DOMContentLoaded", () => {
  /* 
  Fungsi ini akan menunggu hingga seluruh konten halaman dimuat sepenuhnya sebelum menjalankan kode di dalamnya. Ini berguna agar manipulasi DOM yang dilakukan setelahnya tidak terjadi sebelum elemen-elemen yang dibutuhkan tersedia.
  */
  const bookForm = document.getElementById("bookForm");
  const judulInput = document.getElementById("bookFormTitle");
  const penulisInput = document.getElementById("bookFormAuthor");
  const terbitInput = document.getElementById("bookFormYear");
  const isCompleted = document.getElementById("bookFormIsComplete");
  const bookFormSubmit = document.getElementById("bookFormSubmit");
  const span = bookFormSubmit.querySelector("span");
  const incompleteBookSect = document.getElementById("incompleteBookSect");
  const completeBookSect = document.getElementById("completeBookSect");
  const incompleteBookList = document.querySelector("[data-testid = 'incompleteBookList']");
  const completeBookList = document.querySelector("[data-testid = 'completeBookList']");

  // ? kondisi ketika "Selesai dibaca" checked or unchecked
  isCompleted.addEventListener("change", () => {
    /* 
      Fungsi ini memantau perubahan pada checkbox isCompleted. Jika checkbox dicentang (isCompleted.checked), teks pada tombol submit (span.innerText) akan berubah menjadi "Selesai Dibaca". Jika tidak dicentang, teks berubah menjadi "Belum Selesai Dibaca". Fungsi ini membantu memberikan umpan balik visual kepada pengguna.
      */
    if (isCompleted.checked) {
      span.innerText = "Selesai Dibaca";
    } else {
      span.innerText = "Belum Selesai Dibaca";
    }
  });

  // todo : Web Storage
  const saveData = () => {
    /*
      Fungsi ini bertanggung jawab untuk menyimpan data buku ke dalam localStorage. Cara kerjanya:
      - Mengambil buku-buku yang sudah ada di localStorage.
      - Menyusun data baru (judul, penulis, tahun, status selesai dibaca).
      - Menyimpan buku yang baru dimasukkan ke dalam array, lalu menyimpannya kembali ke localStorage dalam bentuk string menggunakan JSON.stringify.
      */
    const books = JSON.parse(localStorage.getItem("book")) || [];

    const bookId = new Date().getTime();
    const bookTitle = judulInput.value;
    const bookAuthor = penulisInput.value;
    const bookYear = Number(terbitInput.value);
    const bookIsCompleted = isCompleted.checked;

    books.push({
      id: bookId,
      title: bookTitle,
      author: bookAuthor,
      year: bookYear,
      isComplete: bookIsCompleted,
    });

    const stringify = JSON.stringify(books);
    localStorage.setItem("book", stringify);
  };

  // todo : load data dari localStorage
  const loadData = () => {
    /*
      Fungsi ini digunakan untuk memuat data buku dari localStorage saat halaman pertama kali dibuka. Buku yang ada di localStorage akan dipanggil menggunakan JSON.parse dan ditampilkan ke dalam halaman dengan bantuan fungsi addToDom.
      */
    const booksData = JSON.parse(localStorage.getItem("book"));

    if (booksData) {
      booksData.forEach((bookPerItem) => {
        addToDom(
          bookPerItem.title,
          bookPerItem.author,
          bookPerItem.year,
          bookPerItem.id,
          bookPerItem.isComplete
        );
      });
    }
  };

  // todo : update localStorage
  const updateLocalStorage = () => {
    /*
        Ketika function ini dipanggil, fungsi ini akan memperbarui data buku yang ada di localStorage dengan data terbaru dari DOM. Langkah-langkahnya:
        - Mengambil semua elemen buku yang ada di DOM menggunakan querySelectorAll.
        - Membuat array kosong untuk menampung data buku.
        - Melakukan iterasi pada setiap elemen buku untuk mengambil id, judul, penulis, tahun, dan status selesai dibaca.
        - Menyusun data buku ke dalam array.
        - Menyimpan array buku ke dalam localStorage dalam bentuk string menggunakan JSON.stringify.
    */

    const bookItems = document.querySelectorAll("[data-bookid]");
    // Mengambil semua elemen buku yang ada di DOM dengan menggunakan querySelectorAll dan atribut data-bookid.
    const books = [];
    // Membuat array kosong bernama books untuk menyimpan data buku.

    bookItems.forEach((item) => {
      // Melakukan iterasi pada setiap elemen buku yang ditemukan.
      const id = item.getAttribute("data-bookid");
      // Mengambil atribut data-bookid dari elemen buku dan menyimpannya dalam variabel id.
      const title = item.querySelector(
        "[data-testid='bookItemTitle']"
      ).innerText; // title = "judul buku"
      // Mengambil teks judul buku dari elemen dengan data-testid 'bookItemTitle' dan menyimpannya dalam variabel title.

      const author = item
        .querySelector("[data-testid='bookItemAuthor']")
        .innerText.replace("Penulis : ", ""); // 
      //  Mengambil teks penulis buku dari elemen dengan data-testid 'bookItemAuthor', menghapus kata "Penulis : ", dan menyimpannya dalam variabel author.

      const year = item
        .querySelector("[data-testid='bookItemYear']")
        .innerText.replace("Tahun : ", "");
      // Mengambil teks tahun terbit buku dari elemen dengan data-testid 'bookItemYear', menghapus kata "Tahun : ", dan menyimpannya dalam variabel year.

      const isComplete = item.parentElement.getAttribute("data-testid") === "completeBookList";
      // Mengecek apakah buku tersebut berada di dalam elemen dengan id 'completeBookList' untuk menentukan status isComplete.

      books.push({
        // Menambahkan objek buku yang berisi id, title, author, year, dan isComplete ke dalam array books.
        id: parseInt(id),
        title: title,
        author: author,
        year: Number(year),
        isComplete: isComplete,
      });
    });

    localStorage.setItem("book", JSON.stringify(books));
    //  Menyimpan array books ke dalam localStorage dengan menggunakan JSON.stringify untuk mengubahnya menjadi string.
  };

  // todo : tampilkan data
  const addToDom = (judul, penulis, tahunTerbit, id, sudahSelesai) => {
    /* 
      Fungsi ini bertugas menambahkan buku ke dalam tampilan halaman (DOM). Beberapa langkah yang dilakukan:
      - Membuat elemen HTML secara dinamis (div, h3, p, dan button) untuk setiap buku yang ditambahkan.
      - Jika buku sudah selesai dibaca (sudahSelesai == true), buku akan ditampilkan di bagian "Selesai Dibaca" (completeBookSect), jika tidak, buku ditampilkan di bagian "Belum Selesai Dibaca" (incompleteBookSect)
      - Menambahkan tombol "Selesai diBaca", "Hapus Buku", dan "Edit Buku", beserta event listener untuk setiap tombol tersebut.
      */
    // todo: Incomplete Book List
    // ? buat container list buku
    const bookItemIncomp = document.createElement("div");
    bookItemIncomp.setAttribute("data-bookid", id);
    bookItemIncomp.setAttribute("data-testid", "bookItem");
    bookItemIncomp.classList.add("incompleteBook");

    // todo : complete book list
    // ? jika selesai di baca tecentang
    const bookItemComp = document.createElement("div");
    bookItemComp.setAttribute("data-bookid", id);
    bookItemComp.setAttribute("data-testid", "bookItem");
    bookItemComp.classList.add("completeBook");

    // ? buat isi dari list buku
    const judulBuku = document.createElement("h3");
    judulBuku.classList.add("title");
    judulBuku.innerText = judul;
    judulBuku.setAttribute("data-testid", "bookItemTitle");

    const authorBuku = document.createElement("p");
    authorBuku.classList.add("author");
    authorBuku.setAttribute("data-testid", "bookItemAuthor");
    authorBuku.innerText = `Penulis : ${penulis}`;

    const terbitBuku = document.createElement("p");
    terbitBuku.classList.add("year");
    terbitBuku.setAttribute("data-testid", "bookItemYear");
    terbitBuku.innerText = `Tahun : ${Number(tahunTerbit)}`;

    // ? bagian tombol
    const containerBtn = document.createElement("div");
    containerBtn.classList.add("buttonContainer");

    const isCompleteBtn = document.createElement("button");
    isCompleteBtn.setAttribute("data-testid", "bookItemIsCompleteButton");
    isCompleteBtn.innerText = "Selesai diBaca";

    const delBtn = document.createElement("button");
    delBtn.setAttribute("data-testid", "bookItemDeleteButton");
    delBtn.innerText = "Hapus Buku";

    const editBtn = document.createElement("button");
    editBtn.setAttribute("data-testid", "bookItemEditButton");
    editBtn.innerText = "Edit Buku";

    containerBtn.append(isCompleteBtn, delBtn, editBtn);

    if (sudahSelesai) {
      bookItemComp.append(judulBuku, authorBuku, terbitBuku, containerBtn);
      completeBookList.appendChild(bookItemComp);
      isCompleteBtn.innerText = "Belum Dibaca";
    } else {
      bookItemIncomp.append(judulBuku, authorBuku, terbitBuku,containerBtn);
      incompleteBookList.appendChild(bookItemIncomp);
    }

    // todo : belum dibaca ke selesai dibaca
    isCompleteBtn.addEventListener("click", (e) => {
      const not2already = e.target.parentElement.parentElement;
      console.log(not2already)

      if (e.target.innerText == "Selesai diBaca") {
        incompleteBookList.removeChild(not2already);
        completeBookList.appendChild(not2already);

        not2already.classList.replace("incompleteBook", "completeBook");
        isCompleteBtn.innerText = "Belum Dibaca";
      } else if (e.target.innerText == "Belum Dibaca") {
        completeBookList.removeChild(not2already);
        incompleteBookList.appendChild(not2already);

        not2already.classList.replace("completeBook", "incompleteBook");
        isCompleteBtn.innerText = "Selesai diBaca";
      }
      updateLocalStorage();
    });

    // todo : menghapus buku
    delBtn.addEventListener("click", (e) => {
      const delBook = e.target.parentElement.parentElement;
      console.log(delBook)
      if (delBook.className === "incompleteBook") {
        incompleteBookList.removeChild(delBook);
      } else if (delBook.className == "completeBook") {
        completeBookList.removeChild(delBook);
      }
      updateLocalStorage();
    });

    // todo : edit buku
    editBtn.addEventListener("click", (e) => {
      /* 
          Fungsi ini memungkinkan pengguna mengedit informasi buku yang ada. Cara kerjanya:
    
          - Mengaktifkan mode edit untuk judul, penulis, dan tahun terbit dengan mengubah properti contenteditable.
          - Mengubah teks tombol dari "Edit Buku" menjadi "Simpan Perubahan".
          - Stlh perubahan disimpan, fungsi akan memperbarui informasi buku di localStorage.
          */
      if (e.target.innerText == "Edit Buku") {
        judulBuku.setAttribute("contenteditable", "true");
        authorBuku.setAttribute("contenteditable", "true");
        terbitBuku.setAttribute("contenteditable", "true");
        e.target.innerText = "Simpan Perubahan";
        judulBuku.style.color = "red";
        authorBuku.style.color = "red";
        terbitBuku.style.color = "red";
      } else {
        judulBuku.removeAttribute("contenteditable");
        authorBuku.removeAttribute("contenteditable");
        terbitBuku.removeAttribute("contenteditable");
        e.target.innerText = "Edit Buku";
        judulBuku.style.color = "black";
        authorBuku.style.color = "black";
        terbitBuku.style.color = "black";
        updateLocalStorage();
      }
    });
  };

  // todo : yg trjd ketika user men-submit form
  bookForm.addEventListener("submit", (e) => {
    /* 
      Fungsi ini dipanggil saat form untuk menambah buku baru disubmit. Langkah-langkahnya:
  
      - Mencegah reload halaman dengan e.preventDefault().
      - Mengambil nilai dari form input (judul, penulis, tahun, dan status selesai dibaca).
      - Memanggil fungsi addToDom untuk menambahkan buku baru ke DOM.
      - Menyimpan buku ke localStorage dengan memanggil saveData().
      */

    e.preventDefault();

    const judul = judulInput.value;
    const penulis = penulisInput.value;
    const tahunTerbit = Number(terbitInput.value)

    addToDom(
      judul,
      penulis,
      tahunTerbit,
      new Date().getTime(),
      isCompleted.checked
    );
    saveData();
  });

  // Load data saat halaman pertama kali dibuka
  loadData();
});
