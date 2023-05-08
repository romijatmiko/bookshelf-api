const express = require("express");
//aku pake express, sama uuid pake buat idnya
const { v4: uuidv4 } = require("uuid");
const app = express();
const PORT = 9000;

app.use(express.json());

// ngimport si route
const booksRoutes = require("./route");

// Panggil route /books dari ./route
app.use("/books", booksRoutes);

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
