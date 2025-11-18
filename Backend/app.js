import express from "express"

const app = express()
const port = 3000
app.use(express.json())

let users = [
    {
        id: 1,
        name: "terry",
        role: "student"
    }
]

let books = [
    {
        book_id : 1,
        buku_name : "perjuanga",
        ISBN : "234242",
        using : []
    },
    {
        book_id : 2,
        buku_name : "asdafags",
        ISBN : "234242",
        using : []
    },
    {
        book_id : 3,
        buku_name : "tasda",
        ISBN : "234242",
        using : []
    },
]

// LIHAT SEMUA BOOK
app.get('/getAllBook' ,(req,res) => {
    res.json({data : books}) 
})

// LIHAT BUKU PAKE ID
app.get('/getBookBy/:id', (req,res) => {
    const bookId = parseInt(req.params.id)
    const iBook = books.findIndex(b => b.book_id === bookId)
    
    res.json({data : books[iBook]})
})

// USER LOGIN
app.post("/user/login", (req,res) => {
    const {name} = req.body
    const {role} = req.body

    users.push({
        id : users.length + 1,
        name,
        role
    })

    res.status(200).json({
        msg : `user berhasil login`,
        users : users.at(-1)
    })
})

// SWITCH BUAT USER MILIH ADMIN ATAU STUDENT
app.put("/userSwitchRole/:id", (req,res) => {
    const userId = parseInt(req.params.id)
    const {role} = req.body
    const iUser = users.findIndex(u => u.id === userId)

    users[iUser].role = role

    res.status(200).json({
        msg : `user berhasil menjadi ${role}`
    })
})

// TAMBAH BUKU, ROLE HARUS ADMIN
app.post('/createBook', (req,res) => {
    const role = users.map(r => r.role)
    const {buku_name} = req.body
    const {ISBN} = req.body

    if (role.toString() === "admin"){
        books.push({
            book_id : books.length + 1,
            buku_name,
            ISBN,
            using : []
        })
    
        res.status(201).json({
            msg : "buku sudah di tambahkan",
            data : books.at(-1)
        })
    }else{
        return res.status(404).json({
            smg : "role anda bukan admin"
        })
    }
})

// EDIT BUKU, ROLE HARUS ADMIN
app.put("/updateBook/:id" , (req,res) => {
    const bookId = parseInt(req.params.id)
    const role = users.map(r => r.role)
    const {buku_name} = req.body
    const {ISBN} = req.body
    const iBook = books.findIndex(b => b.book_id == bookId)

    if(role.toString() === "admin"){
        books[iBook] = {
            id : parseInt(iBook + 1),
            buku_name,
            ISBN,
            using : []
        }
    
        res.status(200).json({
            msg : `id : buku di update`,
            book : books[iBook]
        })
    }else{
        return res.status(404).json({
            smg : "role anda bukan admin"
        })
    }
})

// DELETE BUKU, ROLE ADMIN
app.delete('/deleteBook/:id' , (req,res) => {
    const bookId = req.params.id
    const role = users.map(r => r.role)
    const iBook = books.findIndex(b => b.book_id === bookId)

    if(role.toString() === "admin") {
        books.splice(iBook , 1)

        res.status(200).json({
            msg : `buku sudah terhapus sisah buku ${books.length}`
        })
    }else{
        return res.status(404).json({
            smg : "role anda bukan admin"
        })
    }
})

// BORROW BUKU, ROLE HARUS STUDENT
app.put('/borrowBook/:id', (req,res) => {
    const {buku_name} = req.body
    const role = users.map(r => r.role)
    const userId = parseInt(req.params.id)
    const iBook = books.findIndex(b => b.buku_name === buku_name)
    const iUser = users.findIndex(u => u.id == userId)
    const user = users[iUser]

    if(role.toString() === "student"){
        books[iBook].using.push({
            user : user.name
        })
    
        res.status(200).json({
            msg : "Buku berhasil di pinjam",
            user
        })
    }else{
        return res.status(404).json({
            smg : "role anda bukan student"
        })
    }
})

// USER
app.get('/user' , (req,res) => {
    res.json({data : users}) 
})

app.listen(port, () => {
    console.log(`server running di http://localhost:${port}`)
})