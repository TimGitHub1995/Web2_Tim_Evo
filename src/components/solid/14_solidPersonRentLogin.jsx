import { createSignal, createResource } from "solid-js";
import NewPersonModal from "@solid/3_solidNewPersonModal"
import EditPersonModal from "@solid/4_solidEditPersonModal"
import AddPersonImageModal from "@solid/18_solidAddPersonImg"


export default function SolidPersonRent() {
  // Astro bietet die Möglichkeit, direkt einen Endpoint über die Datei personsimple.ts bereit 
  // zu stellen. Dieser wird dann über diese URL erreicht.
  let baseUrl = 'http://localhost:3000/apisec/persondb';
  // URL der Bilder: Diese sind im public Verzeichnis 
  let imgUrl = 'http://localhost:3000/images/persons/'


  const [filterString, setFilterString] = createSignal("");

  const fetchPersonsRessource = async() => {
    // der login benötig einen Token. Dieser wird aus dem Localstorage des Browsers geladen und im Header 
    // an den Header angehängt. Dies ist so in JWT vorgesehen und die übliche Vorgehesnweise. 
    // Diese beiden Änderungen "sind sozusagen" der Login. Durch Mitschicken des Tokens kann der 
    // Server eindeutig sagen, wer die Nachricht geschickt hat, da im Token der Username enthalten ist. 
    let token =  localStorage.getItem("token"); 
    let data = await fetch(baseUrl, {method: 'GET', 
        headers: {authorization: "Bearer " + token }});
    let json = await data.json(); 
    console.log("data fetched", json)
    return json.personObject.persons;
  }

   const [persons, { refetch: refetchPerson }] = createResource(fetchPersonsRessource); 

   const deletePerson = async(id) => {
        let token =  localStorage.getItem("token"); 
        let data = await fetch(baseUrl, { 
            method: 'DELETE', 
            headers: { 'Content-Type': 'application/json', 'id': id, authorization: "Bearer " + token } 
        });
        if (data.status === 200) {
            let json = await data.json(); 
            console.log(json);
            refetchPerson();
        } else {
            alert("Fehler: " + data.statusText);
        }
   } 

   let adminChanged = async (person, admin) => {
    console.log(person)
    let token =  localStorage.getItem("token"); 
    const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', authorization: "Bearer " + token },
        body: JSON.stringify({ id: person.id, prename: person.prename, surname: person.surname, city: person.city, age: person.age, img: person.img, admin: admin })
    };
    let data = await fetch(baseUrl, requestOptions);
    if (data.status === 200) {
        let json = await data.json(); 
        console.log(json);
        refetchPerson();
    } else {
        alert("Fehler: " + data.statusText);
    }
  }

   return (
    <div>
           <h1 class="text-3xl my-5 font-bold">Users</h1>
           <div>
            <input onInput = { (e) => setFilterString(e.target.value) } 
                   type="text" 
                   id="filter" 
                   class="input input-bordered w-full " placeholder="Filter..." required></input>
           </div>
           <div>
             <NewPersonModal refetchFunction={ refetchPerson } /> 
           </div>
           <table class="table table-zebra w-full">
                <thead>
                    <tr class="px-6 py-3 text-lg">
                        <th>Username</th>
                        <th>Prename</th>
                        <th>Surname</th>
                        <th>Age</th>
                        <th>City</th>
                        <th>Image</th>                        
                        <th>Update Image</th>
                        <th>Adminrechte</th>
                        <th>Delete</th>
                        <th>Edit</th>
                    </tr>
                </thead>
                <tbody>    
                    { persons() && persons().filter( (person) => person.prename.toLowerCase().indexOf(filterString().toLowerCase()) >= 0 || person.surname.toLowerCase().indexOf(filterString().toLowerCase()) >= 0).map( (person) => 
                        <tr> 
                            <th scope="row" class="py-4 font-bold">
                                { person.username }
                            </th>
                            <th scope="row" class="py-4">
                                { person.prename }
                            </th>
                            <td class=" py-4">
                                { person.surname }
                            </td>
                            <td class=" py-4">
                                { person.age }
                            </td>
                            <td class=" py-4">
                                { person.city }
                            </td>
                            <td class=" py-4">
                            <div class="w-20 rounded">
                                    { person.img !== "" ? <img src={  imgUrl + person.img } alt="Persons" /> : "" }
                                </div>
                            </td>             
                            <td class=" py-4">
                                <AddPersonImageModal personId={ person.id } refetchFunction={ refetchPerson }/>                             
                            </td>                 
                            <td class=" py-4">
                                <input type="checkbox" checked={ person.admin === 1} class="checkbox" onChange={ (e) => adminChanged(person, e.target.checked ? 1 : 0) }/>
                            </td>           
                            <td class=" py-4">
                            <button onClick = {() => deletePerson(person.id)} class="btn btn-error btn-sm">
                                Löschen
                            </button>
                            </td>
                            <td class=" py-4">
                                <EditPersonModal id={person.id} prename={person.prename} surname={person.surname} age={person.age} city={person.city} admin={ person.admin } refetchFunction={ refetchPerson }/> 
                            </td>
                        </tr> )
                    }
                </tbody>
           </table>
        
    </div>
    )  
}
