import { createSignal, onMount } from "solid-js";
import SolidPersonRent from "@solid/14_solidPersonRentLogin"
import ItemRent from "@solid/7_solidItemRent"
import SolidRent from "@solid/16_solidRentLogin"
import SolidRentAll from "@solid/10_solidRent"

const SettingsComponent = () => <div>Settings Content</div>;

const SolidApp = () => {
  const [selectedComponent, setSelectedComponent] = createSignal("rents");
  const [user, setUser] = createSignal(null)

  onMount(() => {
    let userFromLocalStorage = JSON.parse(localStorage.getItem("user"));   
    console.log("User", userFromLocalStorage);
    setUser(userFromLocalStorage); 
  });

  const renderComponent = () => {
    switch (selectedComponent()) {
      case "users":
        return <SolidPersonRent />; 
      case "items":
        return <ItemRent />;
      case "rents":
        return <SolidRent />;
      case "allRents":
        return <SolidRentAll />;
      case "settings":
        return <SettingsComponent />;
      default:
        return <ItemsComponent />;
    } 
  };

  let logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.open( "/login","_self");
  }

  return (
    <div>
       { user() !== null ?
       <div>
       <div class="navbar bg-base-100">
        <div class="navbar-center">
            <ul class="text-xl menu menu-horizontal p-0">
                  {user().admin == 1 && 
                    <li>
                      <a href="#" class = {selectedComponent() === "users" ? "flex items-center underline" : "flex items-center" } onClick={() => setSelectedComponent("users")}>
                        User
                      </a> 
                    </li>
                  }
                
                {user().admin == 1 && 
                <li><a href="#" class = {selectedComponent() === "items" ? "flex items-center underline" : "flex items-center" } onClick={() => setSelectedComponent("items")}>
                    Items
                </a>
                </li> } 
                <li>
                  <a href="#" class = {selectedComponent() === "rents" ? "flex items-center underline" : "flex items-center" } onClick={() => setSelectedComponent("rents")}>
                    Rents
                  </a>
                </li>
                {user().admin == 1 && 
                    <li>
                      <a href="#" class = {selectedComponent() === "allRents" ? "flex items-center underline" : "flex items-center" } onClick={() => setSelectedComponent("allRents")}>
                        All Rents
                      </a> 
                    </li>
                  }
                <li>
                  <a href="#" class = {selectedComponent() === "settings" ? "flex items-center underline" : "flex items-center" } onClick={() => setSelectedComponent("settings")}>
                    Settings
                  </a>
                </li>
              </ul>
          </div>
          <div class="navbar-end">
          <ul class="text-xl menu menu-horizontal p-0">
              <li>
                  <a href="#" class = "flex items-center" onClick={ logout }>
                    Logout
                  </a>
                </li>
            </ul>
          </div>
      </div>
      <div class="bg-white p-8 rounded w-full  mt-4">
        { renderComponent() }
      </div>
    </div>
    : 
    <div class="flex text-xl justify-center" >
      <p class="p-50">Please log in.</p>
    </div> }
    </div>
  );
};

export default SolidApp;
