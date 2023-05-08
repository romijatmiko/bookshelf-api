//uuid buat id si buku, random
const { v4: uuidv4 } = require("uuid");

//array buat tampung si bukunya
const books = [];

const routes = [
	// 1. post buku tanpa id
	{
		method: "POST",
		path: "/books",
		handler: (request, h) => {
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
			} = request.payload;

			//kalo nama bukunya gaada, statusnya bakal 400 dan tampil message dibawah
			if (!name) {
				return h
					.response({
						status: "fail",
						message: "Gagal menambahkan buku. Mohon isi nama buku",
					})
					.code(400);
			}

			//ini kalo readPagenya lebih besar dari pagecount, gabakal bisa nambah
			if (readPage > pageCount) {
				return h
					.response({
						status: "fail",
						message:
							"Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount",
					})
					.code(400);
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

			return (
				h
					//responsenya
					.response({
						status: "success",
						message: "Buku berhasil ditambahkan",
						data: { bookId: id },
					})
					.code(201)
			);
		},
	},
	{
		// 2. ini adalah get semua buku
		method: "GET",
		path: "/books",
		handler: (request, h) => {
			const { name, reading, finished } = request.query;
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

			//responsenya
			return h
				.response({
					status: "success",
					data: { books: formattedBooks },
				})
				.code(200);
		},
	},
	{
		// 3. ini get semua buku pake si uuid bukunye
		method: "GET",
		path: "/books/{bookId}",
		handler: (request, h) => {
			const { bookId } = request.params;

			const book = books.find((book) => book.id === bookId);

			//kalo idnya gaada, muncul response ini
			if (!book) {
				return h
					.response({
						status: "fail",
						message: "Buku tidak ditemukan",
					})
					.code(404);
			}
			//kalo ini ada idnya, tampil datanya
			return h
				.response({
					status: "success",
					data: { book },
				})
				.code(200);
		},
	},
	{
		// update buku pake si uuid buku
		method: "PUT",
		path: "/books/{bookId}",
		handler: (request, h) => {
			const { bookId } = request.params;
			const {
				name,
				year,
				author,
				summary,
				publisher,
				pageCount,
				readPage,
				reading,
			} = request.payload;

			if (!name) {
				return h
					.response({
						status: "fail",
						message: "Gagal memperbarui buku. Mohon isi nama buku",
					})
					.code(400);
			}

			//kalo rpagenya> pagecout gabakal bisa update, muncul response message dibawah
			if (readPage > pageCount) {
				return h
					.response({
						status: "fail",
						message:
							"Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount",
					})
					.code(400);
			}

			const bookIndex = books.findIndex((book) => book.id === bookId);

			//kalo idnya gaada/gasama, bakal gabisa update dan muncul response dibawah
			if (bookIndex === -1) {
				return h
					.response({
						status: "fail",
						message: "Gagal memperbarui buku. Id tidak ditemukan",
					})
					.code(404);
			}

			//ini kalo kondisi diatas udah terlewati
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

			//keupdate bukunya
			return h
				.response({
					status: "success",
					message: "Buku berhasil diperbarui",
				})
				.code(200);
		},
	},
	{
		// ini hapus buku pake uuid buku
		method: "DELETE",
		path: "/books/{bookId}",
		handler: (request, h) => {
			const { bookId } = request.params;

			const bookIndex = books.findIndex((book) => book.id === bookId);

			if (bookIndex === -1) {
				return h
					.response({
						status: "fail",
						message: "Buku gagal dihapus. Id tidak ditemukan",
					})
					.code(404);
			}

			books.splice(bookIndex, 1);

			return h
				.response({
					status: "success",
					message: "Buku berhasil dihapus",
				})
				.code(200);
		},
	},
];

module.exports = routes;
