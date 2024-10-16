import { Component, createSignal, Show, onMount } from "solid-js";

// Wichtig: Diese Komponenten läuft im Frontend: Heißt, beim Aufruf der 
// Seite Solid wird diese JS Datei umgewandelt und an den Browser geschickt. 
// Alles was hier passiert, passiert im Browser und damit auf dem 
// Gerät des Nutzers. Alles, was hier an UI Logik gemacht wird, braucht auf dem 
// Server keine Rechenpower mehr. Dazu muss die Komponente mit client:load aufgerufen 
// werden --> hier in solid.astro. Zur Visualisierung des dynamischen Bereichs wurde
// ein Border eingefügt. 
export default function SolidUiElement(props) {
    // States speicherm Zustände in Form von Variablen. 
    // diese Variablen können durch Aufruf der ersten Funktion ausgelesen werden 
    // Beispiel noClicks() liefert den gespeicherten Integer des Zustandes. 
    // setNoClicks wird zum Setzen benötigt. 
    // Wann immer ein State gesetzt wird, wird die Komponenten neu gerendert. 
    // Mit anderen Worten: Wird der State geändert, wird jeder Teil der Seite 
    // upgedated, der die geänderte Variable enthält. 
    const [noClicks, setNoClicks] = createSignal(0);

    // um den text im Editfeld zu speichern, wird wieder ein State definiert. 
    // Der Parameter in createSignal ist der default Wert, der beim erstmaligen 
    // Aufruf der Komponente gesetzt wird. 
    const [prename, setPrename] = createSignal("Lea");
    const [surname, setSurname] = createSignal("");

    // Der Zustand der Checkbox wird in dem Signal checked gespeichert. 
    const [checked, setChecked] = createSignal(true);

    let prenameChanged = (e) => {
        let editFieldText = e.target.value; 
        console.log("editFieldText: ", editFieldText)
        setPrename(editFieldText)
    }

    let surnameChanged = (e) => {
        let editFieldText = e.target.value; 
        setSurname(editFieldText)
    }


    return (
        <div className="border border-indigo-800 p-10 ">
            <h1 class="text-4xl">Solid</h1>
            <p class="text-lg">Diese Komponente läuft im Browser.</p>
            <div class="join">
                <button class="btn join-item btn-secondary" onClick={ () => { setNoClicks( noClicks() - 1)}}>
                    Down 
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25 12 21m0 0-3.75-3.75M12 21V3" />
                    </svg>
                </button>
                <button class="btn join-item btn-primary" onClick={ () => { setNoClicks( noClicks() + 1)}}>
                    Up 
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 6.75 12 3m0 0 3.75 3.75M12 3v18" />
                    </svg>
                </button>
            </div>
            {/*
            function switchCssClaa {
                if (noClicks() < 0) {
                    return "text-xl text-red-800" 
                } else { 
                   return "text-xl text-green-800"
                } 
            }
            */}
            <p className={ noClicks() < 0 ? "text-xl text-red-800" : "text-xl text-green-800"}>
                Number of Clicks: <b>{ noClicks() }</b>
            </p>
            <div class="divider"></div> 
            <label class="input input-bordered flex items-center gap-2">
                <input type="text" class="grow" placeholder="Vorname..." value={ prename() } onInput = { prenameChanged }/>
            </label>
            <label class="input input-bordered flex items-center gap-2 my-2">
                <input type="text" class="grow" placeholder="Nachname..." value={ surname() } onInput = { surnameChanged } />
            </label>
            <p className={surname() === "Maier" ? "py-10 text-2xl text-red-800" : "py-5"} > 
                Entered Name: { prename().toUpperCase() + " " + surname().toUpperCase()}
            </p>
            <p className="py-5">
                Ist es Lena? { prename() === 'Lena' ? "ja" : "nein"}
            </p>
            <div class="divider"></div> 
            <div class="flex items-center mb-4">
                <input id="default-checkbox" type="checkbox" checked={ checked() } onChange={(e) => {setChecked(e.currentTarget.checked)}} class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"></input>
                <label for="default-checkbox" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Bitte auswählen</label>
            </div>

            <p>
                Aktiviert: { checked() ? "Ja" : "Nein" }
            </p>
        </div>
    )  
}
