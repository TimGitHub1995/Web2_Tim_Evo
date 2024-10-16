import { createSignal, createResource } from "solid-js";

const NewPersonModal = (props) => {
    const [prename, setPrename] = createSignal("");
    const [username, setUsername] = createSignal("");
    const [password, setPassword] = createSignal("");
    const [surname, setSurname] = createSignal("");
    const [age, setAge] = createSignal("");
    const [city, setCity] = createSignal("");
    const [isOpen, setIsOpen] = createSignal(false);

    let baseUrl = 'http://localhost:3000/apisec/persondb';

    const postPerson = async() => {
        let token =  localStorage.getItem("token"); 
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', authorization: "Bearer " + token },
            body: JSON.stringify({ prename: prename(), surname: surname(), age: age(), city: city(), username: username(), password: password(), admin: 0 })
        };
        let data = await fetch(baseUrl, requestOptions);
        if (data.status === 200) {
            let json = await data.json(); 
            console.log(json);
            props.refetchFunction();
        } else {
            alert("Fehler: " + data.statusText);
        }
    }

    let savePerson = () =>  {
        setIsOpen(false);
        postPerson();
    }


    return (
        <div>
            <button class="btn my-5" onClick={() => setIsOpen(true)}>Add new Person</button>
            <div class={isOpen() ? "modal modal-open" : "modal"}> 
                <div class="modal-box">
                <h3 class="font-bold text-lg">Add new user.</h3>
                <p class="py-4">Enter valid data. Text fields must have at least 2 characters</p>
                <form method="dialog">
                    <label class="input input-bordered flex items-center gap-2">
                        <input type="text" class="grow" placeholder="Username..." value={ username() } onInput = { (e) => setUsername(e.target.value)  }/>
                    </label>
                    <label class="input input-bordered flex items-center gap-2 my-2">
                        <input type="password" class="grow" placeholder="Password..." value={ password() } onInput = { (e) => setPassword(e.target.value)  }/>
                    </label>
                    <label class="input input-bordered flex items-center gap-2 my-2">
                        <input type="text" class="grow" placeholder="Prename..." value={ prename() } onInput = {  (e) => setPrename(e.target.value) }/>
                    </label>
                    <label class="input input-bordered flex items-center gap-2 my-2">
                        <input type="text" class="grow" placeholder="Surname..." value={ surname() } onInput = { (e) => setSurname(e.target.value)  } />
                    </label>
                    <label class="input input-bordered flex items-center gap-2 my-2">
                        <input type="number" class="grow" placeholder="Age..." value={ age() } onInput =  { (e) => setAge(e.target.value)  } />
                    </label>
                    <label class="input input-bordered flex items-center gap-2 my-2">
                        <input type="text" class="grow" placeholder="City..." value={ city() } onInput = {  (e) => setCity(e.target.value)  } />
                    </label>
                </form>
                <div class="modal-action">
                    <button class="btn" onClick={() => setIsOpen(false)}>Close</button>
                    <button class={ username().length >= 2 && password().length > 4 && prename().length >= 2 && surname().length >= 2 ? "btn btn-success": "btn btn-disabled" } onClick={() => savePerson()}>Save</button> 
                </div>  
            </div>
            </div> 
        </div>
    )
};

export default NewPersonModal;

