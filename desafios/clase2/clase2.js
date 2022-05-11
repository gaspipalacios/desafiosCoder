class Usuario{

    constructor(name, lastName, libros, mascotas){
        this.name = name,
        this.lastName = lastName,
        this.libros = libros, //Array de objetos
        this.mascotas = mascotas //Array
    }

    getFullName(){
        return `Nombre completo: ${this.name} ${this.lastName}`
    }

    addMascota(mascota){
        this.mascotas.push(mascota)

        return this.mascotas
    }

    countMascotas(){
        return `El usuario tiene: ${this.mascotas.length} mascotas`
    }

    addBook(title, author){
        let book = {title: title, author: author}
        this.libros.push(book)

        return this.libros
    }

    getBookNames(){
        let bookNames = []
        this.libros.forEach(element => {
            bookNames = [...bookNames, element.title]
        })

        return bookNames
    }
}

let usuario1 = new Usuario("Gaspar", "Palacios Torre", [{title: "El hombre en busca de sentido", author: "Viktor Frankl"}], ["Fati", "Lulú"])

console.log(usuario1.getFullName())
console.log(usuario1.addMascota("Josefina"))
console.log(usuario1.countMascotas())
console.log(usuario1.addBook("El cuerpo habla", "Joe Navarro"))
console.log(usuario1.getBookNames())
