import { createSignal, createResource } from "solid-js";
import NewItemModal from "@solid/8_solidNewItemModal"
//import EditPersonModal from "@solid/4_solidEditPersonModal"
import AddItemImgModal from "@solid/20_solidAddItemImg"


export default function SolidItemRent(props) {
  let baseUrl = 'http://localhost:3000/apisec/itemdb';
  // URL der Bilder: Diese sind im public Verzeichnis 
  let imgUrl = 'http://localhost:3000/images/items/'


  const [filterString, setFilterString] = createSignal("");

  const fetchItemRessource = async() => {
    let token =  localStorage.getItem("token"); 
    let data = await fetch(baseUrl, {method: 'GET'}, headers: {authorization: "Bearer " + token }});
    let json = await data.json(); 
    return json.items;
  }

  const [items, { refetch: refetchItem }] = createResource(fetchItemRessource); 

  let availableChanged = async (item, available) => {
    let token =  localStorage.getItem("token"); 
    const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', authorization: "Bearer " + token } },
        body: JSON.stringify({ id: item.id, name: item.name, category: item.category, isAvailable: available })
    };
    let data = await fetch(baseUrl, requestOptions);
    if (data.status === 200) {
        let json = await data.json(); 
        console.log(json);
        refetchItem();
    } else {
        alert("Fehler: " + data.statusText);
    }
  }


  const deleteItem = async(id) => {
        let token =  localStorage.getItem("token"); 
        let data = await fetch(baseUrl, { 
            method: 'DELETE', 
            headers: { 'Content-Type': 'application/json', 'id': id, authorization: "Bearer " + token }
        });
        if (data.status === 200) {
            let json = await data.json(); 
            refetchItem();
        } else {
            alert("Fehler: " + data.statusText);
        }
   } 

   return (
    <div>
           <h1 class="text-3xl my-5 font-bold">Items</h1>
           <div>
            <input onInput = { (e) => setFilterString(e.target.value) } 
                   type="text" 
                   id="filter" 
                   class="input input-bordered w-full " placeholder="Filter..." required></input>
           </div>
           <div>
             <NewItemModal refetchFunction={ refetchItem } /> 
           </div>
           <table class="table table-zebra w-full">
                <thead>
                    <tr class="px-6 py-3 text-lg">
                        <th>Category</th>
                        <th>Name</th>
                        <th>Available</th>
                        <th>Image</th>
                        <th>Update Image</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody>    
                    { items() && items().filter( (item) => item.name.toLowerCase().indexOf(filterString().toLowerCase()) >= 0 || item.category.toLowerCase().indexOf(filterString().toLowerCase()) >= 0).map( (item) => 
                        <tr> 
                            <th scope="row" class=" py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                { item.category }
                            </th>
                            <td class=" py-4">
                                { item.name }
                            </td>
                            <td class=" py-4">
                                <input type="checkbox" checked={item.isAvailable === 1} class="checkbox" onChange={ (e) => availableChanged(item, e.target.checked ? 1 : 0) }/>
                            </td>
                            <td class=" py-4">
                            <div class="w-20 rounded">
                                    { item.imgItem !== "" ? <img src={  imgUrl + item.imgItem } alt="Items" /> : "" }
                                </div>
                            </td>             
                            <td class=" py-4">
                                <AddItemImgModal itemId={ item.id } refetchFunction={ refetchItem }/>                              
                            </td>                            
                            <td class=" py-4">
                            <button onClick = {() => deleteItem(item.id)} class="btn btn-error btn-sm">
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
