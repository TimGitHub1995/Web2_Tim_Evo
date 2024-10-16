import { createSignal, createResource } from "solid-js";

const AddPersonImg = (props) => {
    const [isOpen, setIsOpen] = createSignal(false);

    let baseUrlPersonImg = 'http://localhost:3000/api/imgperson';

    const uploadPersonImage = async(file) => {
        // Bilder werden als FormData übertragen und an den HTTP-Request angehängt.         
        const data = new FormData();
        data.append("image", file);
        data.append("type", file.type);
        data.append("name", file.name);
        data.append("personId", props.personId); 
        const requestOptions = {
            method: 'POST',
            body: data
        };
        // Abfrage starten. 
        let response = await fetch(baseUrlPersonImg, requestOptions);
        let json = await response.json(); 
        setIsOpen(false)
        props.refetchFunction();
   }

    return (
        <div>
            <button class="btn btn-sm" onClick={() => setIsOpen(true)}>Image</button>
            <div class={isOpen() ? "modal modal-open" : "modal"}>
                <div class="modal-box">
                <p class="py-4">Bitte Daten eingeben</p>
                <form method="dialog">
                     <input onInput = { (e) => uploadPersonImage(e.target.files[0]) }  type="file" class="file-input w-full max-w-xs" />
                </form>
                <div class="modal-action">
                    <button class="btn" onClick={() => setIsOpen(false)}>Close</button>
                </div>  
            </div>
            </div> 
        </div>
    )
};

export default AddPersonImg;

