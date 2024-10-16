import { createSignal, createResource } from "solid-js";
import NewRentModal from "@solid/11_solidNewRentModal"
import EditPersonModal from "@solid/4_solidEditPersonModal"
import AddPersonImageModal from "@solid/6_solidAddPersonImg"
import dayjs from "dayjs"


export default function SolidPersonRent(props) {
  let baseUrlPerson = 'http://localhost:3000/api/persondb';
  let baseUrlItem = 'http://localhost:3000/api/persondb';
  let baseUrlRent = 'http://localhost:3000/api/rentdb';

  let imgUrlPerson = 'http://localhost:3000/images/persons/'
  let imgUrlItem =   'http://localhost:3000/images/items/'

  const [filterString, setFilterString] = createSignal("");

  const fetchRentRessource = async() => {
    let data = await fetch(baseUrlRent, {method: 'GET'});
    let json = await data.json(); 
    return json.rents;
  }
  const [rents, { refetch: refetchRents }] = createResource(fetchRentRessource); 


  
  const deleteRent = async(id) => {
    console.log("delete ", id)
        let data = await fetch(baseUrlRent, { 
            method: 'DELETE', 
            headers: { 'Content-Type': 'application/json', 'id': id }
        });
        if (data.status === 200) {
            let json = await data.json(); 
            refetchRents();
        } else {
            alert("Fehler: " + data.statusText);
        }
   } 
   return (
    <div>
           <h1 class="text-3xl my-5 font-bold">Rents</h1>
           <div>
            <NewRentModal refetchFunction={ refetchRents } />
           </div>
           <table class="table table-zebra w-full">
                <thead>
                    <tr class="px-6 py-3 text-lg">
                        <th>Start</th>
                        <th>End</th>
                        <th>Given Back</th>
                        <th>Prename</th>
                        <th>Surname</th>
                        <th>Image</th>
                        <th>Item</th>                        
                        <th>Category</th>
                        <th>Image</th>
                        <th>Message</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody>    
                    {  rents() && rents().map( (rent) => 
                        <tr> 
                            <td class=" py-4">
                                { dayjs(rent.startDate*1000).format("DD.MM.YYYY") }
                            </td>
                            <td class=" py-4">
                                { dayjs(rent.endDate*1000).format("DD.MM.YYYY") }
                            </td>
                            <td class=" py-4">
                                { rent.endDateBringBack }
                            </td>
                            <td class=" py-4">
                                { rent.prename }
                            </td>
                            <td class=" py-4">
                                { rent.surname }
                            </td>
                            <td class=" py-4">
                                <div class="w-20 rounded">
                                    { rent.img !== "" ? <img src={  imgUrlPerson + rent.img } alt="Persons" /> : "" }
                                </div>
                            </td>             
                            <td class=" py-4">
                                { rent.name }
                            </td>
                            <td class=" py-4">
                                { rent.category }
                            </td>
                            <td class=" py-4">
                                <div class="w-20 rounded">
                                    { rent.itemImg !== "" ? <img src={  imgUrlItem + rent.imgItem } alt="Items" /> : "" }
                                </div>
                            </td>     
                            <td class=" py-4">
                                { rent.message }
                            </td>                     
                            <td class=" py-4">
                            <button onClick = {() => deleteRent(rent.rentId)} class="btn btn-error btn-sm">
                                Löschen
                            </button>
                            </td>
                        </tr> )
                    }
                </tbody>
           </table>
        
    </div>
    )  
}
