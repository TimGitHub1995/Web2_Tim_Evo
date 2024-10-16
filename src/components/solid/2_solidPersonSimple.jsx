import { createSignal, createResource } from "solid-js";
import NewPersonModal from "@solid/3_solidNewPersonModal"
import EditPersonModal from "@solid/4_solidEditPersonModal"


export default function SolidPersonTableServer(props) {
  // Astro bietet die Möglichkeit, direkt einen Endpoint über die Datei personsimple.ts bereit 
  // zu stellen. Dieser wird dann über diese URL erreicht.
  let baseUrl = 'http://localhost:3000/api/persondb'
  const [filterString, setFilterString] = createSignal("");

  // Ressourcen sind für asynchrone Ereignisse konzipiert. 
  // Solid kann so eine Anfrage an den Server stellen und wenn dieser geantwortet hat, 
  // automatisch die Komponente rendern ohne die Komponente anzuhalten und zu blockieren. 
  // "Hole mir die Daten, wenn du sie hast, melde dich und render neu."
  const fetchPersonsRessource = async() => {
    console.log("refetch");
    // fetch führt einen GET-call aus. Das Objekt (zweiter Parameter) 
    // enthält Infos zur Abfrage. Hier können auch Headers und Body eingefügt werden.
    // Zur Demo kann hier ein Header eingefügt werden. 
    let data = await fetch(baseUrl, {method: 'GET' /*, headers: {test: "test"}}*/});
    // Vom Server kommt ein JSON-String an. data.json() wandelt diesen 
    // String in ein Javascript-Objekt um. 
    let json = await data.json(); 
    // Ausgabe des Objekts, das vom Server kam. 
    console.log("data fetched", json)
    // Wenn die Funktion ein Objekt zurück gibt, wird die Komponente 
    // automatisch neu gerendert. 
    return json.personObject.persons;
  }

   // Wird folgender Ausdruck als "const [persons, refetch]" geschrieben, heißt die Funktion immer refetch
   // Es it aber auch möglich, der refetch-Methode einen eigenen Namen zu geben. Wenn es nämlich zwei 
   // Get-Calls gäbe, wäre dies ungünstig, da man diese nicht unterscheiden könnte. 
   const [persons, { refetch: refetchPerson }] = createResource(fetchPersonsRessource); 

   const deletePerson = async(id) => {
    console.log("delete ", id)
        let data = await fetch(baseUrl, { 
            method: 'DELETE', 
            headers: { 'Content-Type': 'application/json', 'id': id }
        });
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
           <h1 class="text-3xl my-5 font-bold">Personen</h1>
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
                    <tr class="px-6 py-3">
                        <th>Prename</th>
                        <th>Surname</th>
                        <th>Age</th>
                        <th>City</th>
                        <th>Löschen</th>
                    </tr>
                </thead>
                <tbody>    
                    { persons() && persons().filter( (person) => person.prename.toLowerCase().indexOf(filterString().toLowerCase()) >= 0 || person.surname.toLowerCase().indexOf(filterString().toLowerCase()) >= 0).map( (person) => 
                        <tr> 
                            <th scope="row" class=" py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
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
                            <button onClick = {() => deletePerson(person.id)} class="btn btn-error btn-sm">
                                Löschen
                            </button>
                            </td>
                            <td class=" py-4">
                                <EditPersonModal id={person.id} prename={person.prename} surname={person.surname} age={person.age} city={person.city} refetchFunction={ refetchPerson }/> 
                            </td>
                        </tr> )
                    }
                </tbody>
           </table>
        
    </div>
    )  
}
