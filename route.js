//uuid buat id si buku, random
const { v4: uuidv4 } = require("uuid");
//aku pake express kak
const express = require("express");

//router dari express
const router = express.Router();

//array buat tampung si bukunya
let books = [];

// 1. post buku tanpa id
router.post("/", (req, res) => {
	//deklarasi variable
	const {
		name,
		year,
		author,
		summary,
		publisher,
		pageCount,
		readPage,
		reading,
	} = req.body;

	//kalo nama bukunya gaada, statusnya bakal 400 dan tampil message dibawah
	if (!name) {
		return res.status(400).json({
			status: "fail",
			message: "Gagal menambahkan buku. Mohon isi nama buku",
		});
	}

	//ini kalo readPagenya lebih besar dari pagecount, wkwk
	if (readPage > pageCount) {
		return res.status(400).json({
			status: "fail",
			message:
				"Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount",
		});
	}

	const id = uuidv4();
	const finished = pageCount === readPage;
	const insertedAt = new Date().toISOString();
	const updatedAt = insertedAt;

	const newBook = {
		id,
		name,
		year,
		author,
		summary,
		publisher,
		pageCount,
		readPage,
		finished,
		reading,
		insertedAt,
		updatedAt,
	};

	//push kakkk
	books.push(newBook);

	return res.status(201).json({
		status: "success",
		message: "Buku berhasil ditambahkan",
		data: { bookId: id },
	});
});

// 2. ini adalah get semua buku
router.get("/", (req, res) => {
	const { name, reading, finished } = req.query;

	//filter
	let filteredBooks = [...books];

	//ini kalo nama bukunya sama, akan tampil
	if (name) {
		const query = name.toLowerCase();
		filteredBooks = filteredBooks.filter((book) =>
			book.name.toLowerCase().includes(query)
		);
	}

	//ini kalo ada buku yg readingnya == 1, tampil detailnya
	if (reading) {
		const query = reading === "1" ? true : false;
		filteredBooks = filteredBooks.filter((book) => book.reading === query);
	}

	//ini kalo ada buku yg finished, alias si finishednya==1, tampil semua detail buku yg finish,
	if (finished) {
		const query = finished === "1" ? true : false;
		filteredBooks = filteredBooks.filter((book) => book.finished === query);
	}

	const formattedBooks = filteredBooks.map(({ id, name, publisher }) => ({
		id,
		name,
		publisher,
	}));

	return res
		.status(200)
		.json({ status: "success", data: { books: formattedBooks } });
});

// 3. ini get semua buku pake si uuid bukunye
router.get("/:bookId", (req, res) => {
	const { bookId } = req.params;

	const book = books.find((book) => book.id === bookId);

	if (!book) {
		return res
			.status(404)
			.json({ status: "fail", message: "Buku tidak ditemukan" });
	}

	return res.status(200).json({ status: "success", data: { book } });
});

// update buku pake si uuid buku
router.put("/:bookId", (req, res) => {
	const { bookId } = req.params;
	const {
		name,
		year,
		author,
		summary,
		publisher,
		pageCount,
		readPage,
		reading,
	} = req.body;

	if (!name) {
		return res.status(400).json({
			status: "fail",
			message: "Gagal memperbarui buku. Mohon isi nama buku",
		});
	}

	if (readPage > pageCount) {
		return res.status(400).json({
			status: "fail",
			message:
				"Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount",
		});
	}

	const bookIndex = books.findIndex((book) => book.id === bookId);

	if (bookIndex === -1) {
		return res.status(404).json({
			status: "fail",
			message: "Gagal memperbarui buku. Id tidak ditemukan",
		});
	}

	const updatedAt = new Date().toISOString();
	const finished = pageCount === readPage;

	books[bookIndex] = {
		...books[bookIndex],
		name,
		year,
		author,
		summary,
		publisher,
		pageCount,
		readPage,
		reading,
		finished,
		updatedAt,
	};

	return res
		.status(200)
		.json({ status: "success", message: "Buku berhasil diperbarui" });
});

// ini hapus buku pake uuid buku
router.delete("/:bookId", (req, res) => {
	const { bookId } = req.params;

	const bookIndex = books.findIndex((book) => book.id === bookId);

	if (bookIndex === -1) {
		return res.status(404).json({
			status: "fail",
			message: "Buku gagal dihapus. Id tidak ditemukan",
		});
	}

	books.splice(bookIndex, 1);

	return res
		.status(200)
		.json({ status: "success", message: "Buku berhasil dihapus" });
});

module.exports = router;
