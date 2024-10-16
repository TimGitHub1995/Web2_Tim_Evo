import { createSignal, createResource } from "solid-js";

const NewItemModal = (props) => {
    const [name, setName] = createSignal("");
    const [category, setCategory] = createSignal("");
    const [isAvailable, setIsAvailable] = createSignal(true);
    const [isOpen, setIsOpen] = createSignal(false);

    let baseUrl = 'http://localhost:3000/api/itemdb';
    let baseUrlItemImg = 'http://localhost:3000/api/imgitem';
    let categories = ["cameras", "camera lenses", "Tripods", "light"];


    const postItem = async() => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: name(), category: category(), isAvailable: isAvailable() ? 1 : 0 })
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

    let saveItem = () =>  {
        setIsOpen(false);
        postItem();
    }

    return (
        <div>
            <button class="btn my-5" onClick={() => setIsOpen(true)}>Add Item</button>
            <div class={isOpen() ? "modal modal-open" : "modal"}> 
                <div class="modal-box">
                <h3 class="font-bold text-lg">Add new item</h3>
                <p class="py-4">Length of names must be at least 2 characters. You must choose a category. </p>
                <form method="dialog mt-40">
                    <label class="input input-bordered flex items-center gap-2">
                        <input type="text" class="grow" placeholder="Name..." value={ name() } onInput = {  (e) => setName(e.target.value)  }/>
                    </label>
                    <label class="label cursor-text">
                            <input type="checkbox" checked={isAvailable()} onChange={(e) => setIsAvailable(e.target.checked)} class="checkbox" />  
                            <span class="label-text text-left">Item is available for rent</span> 
                    </label>      
                        <div class="dropdown dropdown-top">
                            <div tabindex="0" role="button" class="btn m-1">{category() === "" ? "Choose category" : category()}</div>
                            <ul tabindex="0" class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                                {categories.map((category => <li onClick={() => setCategory(category)}><a>{category}</a></li>))}
                            </ul>
                        </div>
                                 
                </form>
                <div class="modal-action">
                    <button class="btn" onClick={() => setIsOpen(false)}>Close</button>
                    <button class={ name().length >= 2 && category().length >= 2 ? "btn btn-success": "btn btn-disabled" } onClick={() => saveItem()}>Save</button> 
                </div>  
            </div>
            </div> 
        </div>
    )
};

export default NewItemModal;

