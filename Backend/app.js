import express from "express"

const app = express()
const port = 3000
app.use(express.json())

let users = [
    {
        id : 1,
        nama : "terry",
        BukuPinjaman : []
    },
]

let books = [
     {
        id : 1,
        buku : "perjuanga",
        stok : 1
    },
]

// BOOK
app.get('/book' , (req,res) => {
    res.json({data : books}) 
})

// TAMBAH BUKU
app.post('/book/tambah' , (req,res) => {
    const {buku} = req.body
    const {stok} = req.body

    books.push({
        id : books.length + 1,
        buku,
        stok
    })

    res.status(201).json({
        msg : "buku sudah di tambahkan",
        data : books.at(-1)
    })
})

// DELETE BUKU
app.delete('/book/:id/delete' , (req,res) => {
    const bookId = parseInt (req.params.id)
    const iBook = books.findIndex(b => b.id === bookId)

    books.splice(iBook, 1)

    res.status(200).json({
        msg : `buku sudah terhapus sisah buku ${books.length}`
    })
})

// EDIT BUKU
app.put("/book/:id/edit" , (req,res) => {
    const bookId = parseInt(req.params.id)
    const {buku} = req.body
    const {stok} = req.body
    const iBook = books.findIndex(b => b.id == bookId)

    books[iBook] = {
        id : parseInt(iBook + 1),
        buku,
        stok
    }

    res.status(200).json({
        msg : `id : ${iBook} update`
    })
})

// =======================================================================================================

// USER
app.get('/user' , (req,res) => {
    res.json({data : users}) 
})

// TAMBAH USER
app.post('/user/tambah', (req,res) => {
    const {nama} = req.body

    users.push({
        id : users.length + 1,
        nama,
        BukuPinjaman : []
    })

    res.status(201).json({
        msg : `${nama} sudah di tambahkan`

    })
})

// DELETE USER
app.delete('/user/:id/delete', (req,res) => {
    const userId = parseInt(req.params.id)
    const iUser = users.findIndex(u => u.id == userId)

    users.splice(iUser,1)

    res.status(200).json({
        msg : "user berhasil di hapus"
    })
})

// USER PINJAM BUKU
app.put('/user/:id/pinjam', (req,res) => {
    const userId = parseInt(req.params.id)
    const {bukuNama} = req.body
    const iUser = users.findIndex(u => u.id == userId)
    const iBook = books.findIndex(b => b.buku.toLowerCase() == bukuNama.toLowerCase())
    const user = users[iUser]
    const book = books[iBook]

    if(!book){
        return res.status(404).json({
            msg : "tidak ada buku yang di pinjam "
        })  
    }

    if(!user){
        return res.status(404).json({
            msg : `tidak ada user`
        })  
    }

    if(book.stok <= 0){
        books.splice(iBook, 1)
    }

    book.stok -= 1
    users[iUser].BukuPinjaman.push({
        buku : book.buku
    })


    res.status(200).json({
        msg : "Buku berhasil di pinjam",
        sisahBuku : `ada ${books.length}`,
        BukuPinjaman : [
            book
        ]
    })
})

// USER BALIKIN BUKU
app.put('/user/:id/balikin', (req,res) => {
    const userId = parseInt(req.params.id)
    const {bukuNama} = req.body 
    const iUser = users.findIndex(u => u.id == userId)
    const iBook = books.findIndex(b => b.buku.toLowerCase() == bukuNama.toLowerCase())
    const user = users[iUser]
    const book = books[iBook]

    if(!book){
        return res.status(404).json({
            msg : `tidak ada buku yang namanya ${bukuNama}`
        })  
    }

    if(!user){
        return res.status(404).json({
            msg : `tidak ada user`
        })  
    }

    if(users[iUser].BukuPinjaman.length <= 0 ){
        return res.status(404).json({
            msg : "buku tidak ada"
        })  
    }

    
    book.stok += 1
    users[iUser].BukuPinjaman.splice(iBook, 1)

    res.status(200).json({
        msg : "buku berhasil di balikin",
        sisahBuku : `ada ${books.length}`,
        BalikinBuku : [
            book
        ]
    })
})

app.listen(port, () => {
    console.log(`server running di http://localhost:${port}`)
})