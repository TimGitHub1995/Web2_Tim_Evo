import type { APIRoute } from 'astro';

let persons = [
    { id: "cd2089ff-1549-4cb2-9481-d6af69e74fe0", prename: "Lea", surname: "Huber", age: 23, city: "Weingarten"},
    { id: "ffe8a4c7-cef2-4e71-bae1-9b1b30f9d8ce", prename: "Leon", surname: "Müller", age: 27 , city: "Ravensburg"},
    { id: "c9e8d65d-eefd-4e8b-856b-7baa19e977b7", prename: "Rita", surname: "Kowalski", age: 63 , city: "Mochenwangen"},
    { id: "00f91baf-0441-4d68-aab6-4ab7fd6e0101", prename: "Alina", surname: "Schuster", age: 20 , city: "Blitzenreute"},
    { id: "5993bc6d-5ba5-481e-b1a2-de8d890e2a8b", prename: "Rudolf", surname: "Sauter", age: 87 , city: "Berg"},
    { id: "581b523b-7f90-4c52-b782-273c292f06c5", prename: "Miriam", surname: "Kocher", age: 42, city: "Bad Saulgau"},
    { id: "fbda7d40-54f4-4bf4-bee9-dab5d09f12d5", prename: "Liesl", surname: "Hinterhuber", age: 87, city: "Wangen"},
    { id: "dd970ea8-91ee-4c91-99fd-274d853869d9", prename: "Fritz", surname: "Amann", age: 55 , city: "Bergatreute"},
    { id: "79dfa606-11bf-4c2b-9aad-66446368bdc1", prename: "Lina", surname: "Boni", age: 18 , city: "Hinzistobel"},
    { id: "e91cd723-e760-4323-a87f-0c13184e2fa4", prename: "Kirsten", surname: "Krizcik", age: 29, city: "Ravensburg"},
    { id: "db4f000f-ab18-459c-b7b6-97145cb9c930", prename: "Kirsten", surname: "Müller", age: 30, city: "Weingarten"}
]

export const GET: APIRoute = ({ params, request }) => {
  // Ausgabe von Headers
  // console.log(request.headers)
  return new Response(JSON.stringify({
      personObject: {
        persons: persons, 
        success: "ok",
        errorMessage: ""
      }
  }))
}

export const POST: APIRoute = async({ params, request }) => {
  // Umwandeln des JSON Strings im Body in ein JS Object. 
  let person = await request.json();
  
  if ( person.hasOwnProperty("prename")
    && person.hasOwnProperty("surname")
    && person.hasOwnProperty("age")
    && person.hasOwnProperty("city")) {
      // Person speichern. 
      return new Response(JSON.stringify({
            success: "ok",
            message: "person added"
          })
        )
  } else {
    // console.log(person)
    return new Response(
      JSON.stringify({   
          success: "error",
          message: "attributes missing"
      }),{
        // Fehler-Fall gibt Status 400 zurück. 
        status : 400
      })
  }
}

