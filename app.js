require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const expressLayouts = require("express-ejs-layouts");

const app = express();
const port = process.env.PORT || 3000;

// Gunakan expressLayouts setelah deklarasi app
app.use(expressLayouts);
app.set("layout", "layouts/layout"); // Atur layout default

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));
app.set("view engine", "ejs");

// Koneksi ke database
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Route utama (tampilkan data hewan)
app.get("/", (req, res) => {
  db.query("SELECT * FROM hewan", (err, results) => {
    if (err) throw err;
    res.render("index", { hewan: results });  // Tidak perlu body lagi
  });
});

// Form tambah data
app.get("/add", (req, res) => {
  res.render("add");
});

// Proses tambah data
app.post("/add", (req, res) => {
  const { nama, jenis, umur } = req.body;
  db.query(
    "INSERT INTO hewan (nama, jenis, umur) VALUES (?, ?, ?)",
    [nama, jenis, umur],
    (err) => {
      if (err) throw err;
      res.redirect("/");
    }
  );
});

// Form edit data
app.get("/edit/:id", (req, res) => {
  const id = req.params.id;
  db.query("SELECT * FROM hewan WHERE id = ?", [id], (err, results) => {
    if (err) throw err;
    res.render("edit", { hewan: results[0] });
  });
});

// Proses edit data
app.post("/edit/:id", (req, res) => {
  const id = req.params.id;
  const { nama, jenis, umur } = req.body;
  db.query(
    "UPDATE hewan SET nama = ?, jenis = ?, umur = ? WHERE id = ?",
    [nama, jenis, umur, id],
    (err) => {
      if (err) throw err;
      res.redirect("/");
    }
  );
});

// Hapus data
app.get("/delete/:id", (req, res) => {
  const id = req.params.id;
  db.query("DELETE FROM hewan WHERE id = ?", [id], (err) => {
    if (err) throw err;
    res.redirect("/");
  });
});

// Jalankan server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});