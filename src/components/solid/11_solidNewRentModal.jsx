import { createSignal, createResource } from "solid-js";
import dayjs from "dayjs"; 

const NewRentModal = (props) => {
    const [name, setName] = createSignal("");
    const [category, setCategory] = createSignal("");
    const [person, setPerson] = createSignal({prename: "", surname: ""});
    const [item, setItem] = createSignal("");
    const [startDate, setStartDate] = createSignal("");
    const [endDate, setEndDate] = createSignal("");
    const [message, setMessage] = createSignal("");
    const [isAvailable, setIsAvailable] = createSignal(true);
    const [isOpen, setIsOpen] = createSignal(false);

    let baseUrlRent = 'http://localhost:3000/api/rentdb';
    let baseUrlPerson = 'http://localhost:3000/api/persondb';
    let baseUrlItem = 'http://localhost:3000/api/itemdb';

    let categories = ["cameras", "camera lenses", "Tripods", "light"];

    const fetchPersonsRessource = async() => {
        let data = await fetch(baseUrlPerson, {method: 'GET'});
        let json = await data.json(); 
        console.log(json.personObject.persons)
        return json.personObject.persons;
    }
    const [persons, { refetch: refetchPerson }] = createResource(fetchPersonsRessource); 
    console.log("persons", persons);

    const fetchItemRessource = async() => {
        let data = await fetch(baseUrlItem, {method: 'GET'});
        let json = await data.json(); 
        return json.items;
    }
    const [items, { refetch: refetchItem }] = createResource(fetchItemRessource); 

    const saveRent = async() => {
        setIsOpen(false);
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ itemId: item().id, personId: person().id, startDate: dayjs(startDate()).hour(0).minute(0).unix(), endDate: dayjs(endDate()).hour(23).minute(59).unix(), message: message()})
        };
        let data = await fetch(baseUrlRent, requestOptions);
        if (data.status === 200) {
            let json = await data.json(); 
            console.log(json);
            props.refetchFunction();
        } else {
            alert("Fehler: " + data.statusText);
        }
    }

    return (
        <div>
            <button class="btn my-5" onClick={() => setIsOpen(true)}>Add Item</button>
            <div class={isOpen() ? "modal modal-open" : "modal"}> 
                <div class="modal-box">
                <h3 class="font-bold text-lg">Add new rent</h3>
                <p class="py-4">Choose Start and End Date. You might add a message. Choose person and item.</p>
                <form method="dialog mt-40">
                    <label class="input input-bordered flex items-center gap-2">
                        <input type="date" class="grow" placeholder="Start Date..." value={ name() } onInput = {  (e) => setStartDate(e.target.value)  }/>
                    </label>
                    <label class="input input-bordered flex items-center gap-2 my-5">
                        <input type="date" class="grow" placeholder="End Date..." value={ name() } onInput = {  (e) => setEndDate(e.target.value)  }/>
                    </label>
                    <label class="input input-bordered flex items-center gap-2">
                        <input type="text" class="grow" placeholder="Message..." value={ message() } onInput = {  (e) => setMessage(e.target.value)  }/>
                    </label>  
                    <div class="dropdown dropdown-top py-5">
                        <div tabindex="0" role="button" class="btn m-1">{person().prename === "" ? "Choose person" : person().prename + " " + person().surname}</div>
                            <ul tabindex="0" class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                            { persons() && persons().map((person => <li onClick={() => setPerson(person)}><a>{person.prename + " " + person.surname}</a></li>)) }
                            </ul> 
                    </div>
                    <div class="dropdown dropdown-top">
                        <div tabindex="0" role="button" class="btn m-1">{item() === "" ? "Choose item" : item().name + " | " + item().category}</div>
                        <ul tabindex="0" class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                            { items() && items().map((item => <li onClick={() => setItem(item)}><a>{item.name + " | " + item.category}</a></li>)) }
                        </ul>
                    </div>                                 
                </form>
                <div class="modal-action">
                    <button class="btn" onClick={() => setIsOpen(false)}>Close</button>
                    <button class={ person() && item() ? "btn btn-success": "btn btn-disabled" } onClick={() => saveRent()}>Save</button> 
                </div>  
            </div>
            </div> 
        </div>
    )
};

export default NewRentModal;

