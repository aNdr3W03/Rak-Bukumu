const currentYear = new Date().getFullYear();

const books = [];
const RENDER_EVENT = 'render-book';
const STORAGE_KEY  = 'BOOKS_APPS';

document.addEventListener(RENDER_EVENT, function() {
    showBook(books);
});

document.addEventListener('DOMContentLoaded', function() {
    const submitForm = document.getElementById('inputBook');
    submitForm.addEventListener('submit', function(event) {
        event.preventDefault();
        addBook();

        submitForm.reset();
    });

    if (isStorageExist()) {
        loadDataFromStorage();
    }
});

function checkBookStatus() {
    const isCheckCompleted = document.getElementById('inputBookIsComplete');

    if (isCheckCompleted.checked) return true;
    else return false;
}

function generateId() {
    return +new Date();
}

function generateBookObject(id, title, author, year, isCompleted) {
    return {
        id,
        title,
        author,
        year,
        isCompleted,
    }
}

function findBookIndex(bookId) {
    for (const index in books) {
        if (books[index].id === bookId) {
            return index;
        }
    }

    return -1;
}

function addBook() {
    const bookTitle   = document.getElementById('inputBookTitle').value;
    const bookAuthor  = document.getElementById('inputBookAuthor').value;
    const bookYear    = document.getElementById('inputBookYear').value;
    const isCompleted = checkBookStatus();

    const generatedID = generateId();
    const bookObject  = generateBookObject(generatedID, bookTitle, bookAuthor, bookYear, isCompleted);

    books.unshift(bookObject);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();

    swal('Yay!', 'Buku kamu sudah berhasil ditambahkan ke rak buku', 'success');
}

function showBook(books = []) {
    const incompleteBookshelfList = document.getElementById('incompleteBookshelfList');
    const completeBookshelfList   = document.getElementById('completeBookshelfList');

    incompleteBookshelfList.innerHTML = '';
    completeBookshelfList.innerHTML   = '';

    for (const book of books) {
        if (!book.isCompleted) {
            let item = `
                <article class="book_item">
                    <h3>${book.title}</h3>
                    <p>Penulis: ${book.author}</p>
                    <p>Tahun: ${book.year}</p>
                    
                    <div class="action">
                        <button class="green" onclick="switchBook(${book.id})"><i class="fa fa-circle-check fa-lg" title="Selesai"></i></button>
                        <button class="orange" onclick="editBook(${book.id})" title="Edit Buku"><i class="fa fa-pencil fa-lg" title="Edit Buku"></i></button>
                        <button class="red" onclick="removeBook(${book.id})"><i class="fa fa-trash fa-lg" title="Hapus Buku"></i></button>
                    </div>
                </article>
            `;

            incompleteBookshelfList.innerHTML += item;
        }
        else {
            let item = `
                <article class="book_item">
                    <h3>${book.title}</h3>
                    <p>Penulis: ${book.author}</p>
                    <p>Tahun: ${book.year}</p>
                    
                    <div class="action">
                        <button class="green" onclick="switchBook(${book.id})"><i class="fa fa-rotate fa-lg" title="Baca Ulang"></i></button>
                        <button class="orange" onclick="editBook(${book.id})"><i class="fa fa-pencil fa-lg" title="Edit Buku"></i></button>
                        <button class="red" onclick="removeBook(${book.id})"><i class="fa fa-trash fa-lg" title="Hapus Buku"></i></button>
                    </div>
                </article>
            `;
            
            completeBookshelfList.innerHTML += item;
        }
    }
}

function searchBook() {
    const searchBook = document.getElementById('searchBookTitle').value.toLowerCase();
    
    const incompleteBookshelfList = document.getElementById('incompleteBookshelfList');
    const completeBookshelfList   = document.getElementById('completeBookshelfList');

    incompleteBookshelfList.innerHTML = '';
    completeBookshelfList.innerHTML   = '';

    if (searchBook == '') {
        document.dispatchEvent(new Event(RENDER_EVENT));
        return;
    }

    for (const book of books) {
        if (book.title.toLowerCase().includes(searchBook)  ||
            book.author.toLowerCase().includes(searchBook) ||
            book.year.includes(searchBook)) {
            if (!book.isCompleted) {
                let item = `
                    <article class="book_item">
                        <h3>${book.title}</h3>
                        <p>Penulis: ${book.author}</p>
                        <p>Tahun: ${book.year}</p>
                        
                        <div class="action">
                            <button class="green" onclick="switchBook(${book.id})"><i class="fa fa-circle-check fa-lg" title="Selesai"></i></button>
                            <button class="orange" onclick="editBook(${book.id})"><i class="fa fa-pencil fa-lg" title="Edit Buku"></i></button>
                            <button class="red" onclick="removeBook(${book.id})"><i class="fa fa-trash fa-lg" title="Hapus Buku"></i></button>
                        </div>
                    </article>
                `;
    
                incompleteBookshelfList.innerHTML += item;
            }
            else {
                let item = `
                    <article class="book_item">
                        <h3>${book.title}</h3>
                        <p>Penulis: ${book.author}</p>
                        <p>Tahun: ${book.year}</p>
                        
                        <div class="action">
                            <button class="green" onclick="switchBook(${book.id})"><i class="fa fa-rotate fa-lg" title="Baca Ulang"></i></button>
                            <button class="orange" onclick="editBook(${book.id})"><i class="fa fa-pencil fa-lg" title="Edit Buku"></i></button>
                            <button class="red" onclick="removeBook(${book.id})"><i class="fa fa-trash fa-lg" title="Hapus Buku"></i></button>
                        </div>
                    </article>
                `;
                
                completeBookshelfList.innerHTML += item;
            }
        }
    }
}

const searchInput = document.getElementById('searchBookTitle');
const searchForm  = document.getElementById('searchBook');

searchInput.addEventListener('keyup', function(event) {
    event.preventDefault();
    searchBook();
});

searchForm.addEventListener('submit', function(event) {
    event.preventDefault();
    searchBook();
});

function removeBook(bookId) {
    const bookTarget = findBookIndex(bookId);

    swal({
        title: 'Hapus Buku?',
        text: 'Apakah kamu yakin ingin menghapus buku ini?',
        icon: 'warning',
        buttons: ['Batal', 'Hapus'],
        dangerMode: true,
    }).then((confirm) => {
        if (bookTarget === -1) return;
        
        if (confirm) {
            swal('Berhasil', `Buku "${books[bookTarget].title}" sudah dihapus dari rak`, 'success');

            books.splice(bookTarget, 1);
            document.dispatchEvent(new Event(RENDER_EVENT));
            saveData();
        }
    });
}

function switchBook(bookId) {
    const bookTarget = findBookIndex(bookId);

    if (bookTarget === null) return;

    for (const i in books) {
        if (i === bookTarget) {
            if (books[i].isCompleted === true) {
                books[i].isCompleted = false;
                swal('Berhasil', `Buku "${books[bookTarget].title}" pindah ke rak belum selesai dibaca`, 'success');
            }
            else {
                books[i].isCompleted = true;
                swal('Berhasil', `Buku "${books[bookTarget].title}" sudah selesai dibaca`, 'success');
            }
        }
    }

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function editBook(bookId) {
    const editSection = document.querySelector('.edit_section');
    const editBook    = document.getElementById('editBook');

    const editTitle   = document.getElementById('inputEditTitle');
    const editAuthor  = document.getElementById('inputEditAuthor');
    const editYear    = document.getElementById('inputEditYear');

    const cancelEdit  = document.getElementById('bookEditCancel');
    const submitEdit  = document.getElementById('bookEditSubmit');

    const bookTarget = findBookIndex(bookId);

    editSection.style.display = 'flex';

    editTitle.setAttribute('value',  books[bookTarget].title);
    editAuthor.setAttribute('value', books[bookTarget].author);
    editYear.setAttribute('value',   books[bookTarget].year);

    submitEdit.addEventListener('click', function() {
        books[bookTarget].title  = editTitle.value;
        books[bookTarget].author = editAuthor.value;
        books[bookTarget].year   = editYear.value;
        
        document.dispatchEvent(new Event(RENDER_EVENT));
        saveData();
        editBook.reset();
        editSection.style.display = 'none';
        
        swal('Berhasil', 'Buku sudah diperbaharui', 'success');
    });

    cancelEdit.addEventListener('click', function(event) {
        event.preventDefault();
        editBook.reset();
        editSection.style.display = 'none';
        
        swal('Buku tidak jadi diedit');
    });
}

function isStorageExist() {
    if (typeof (Storage) === undefined) {
        swal('Oh Tidak!', 'Browser kamu tidak mendukung Web Storage. Coba untuk menggunakan browser lain', 'info');
        return false;
    }
    return true;
}

function saveData() {
    if (isStorageExist()) {
        const parsed = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(RENDER_EVENT));
    }
}

function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);

    if (data !== null) {
        for (const book of data) {
            books.unshift(book);
        }
    }

    document.dispatchEvent(new Event(RENDER_EVENT));
    return books;
}
