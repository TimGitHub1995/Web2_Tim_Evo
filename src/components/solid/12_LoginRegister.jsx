import { createSignal } from "solid-js";
import { createStore } from "solid-js/store";
import axios from "axios";

const Login = () => {
  const [username, setUsername] = createSignal("");
  const [password, setPassword] = createSignal("");
  const [error, setError] = createSignal("");

  const handleLogin = async () => {
    try {
      const response = await axios.post("http://localhost:3000/apisec/login", {
        username: username(),
        password: password(),
      });
      console.log("response", response.data);
      if (response.data.success === "ok") {
        console.log("ok logged in");
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        window.location.href = "/app";
        // window.open("/app", "_self")
      } else {
        setError("Invalid credentials");
      }
    } catch (err) {
      setError("An error occurred");
    }
  };

  return (
    <div class="flex justify-center">
      <div class="bg-white p-8 rounded shadow-md w-96">
        <h2 class="text-2xl font-bold mb-4">Login</h2>
        <input type="text" placeholder="Username" value={username()} onInput={(e) => setUsername(e.target.value)} class="input input-bordered w-full mb-4"/>
        <input type="password" placeholder="Password"  value={password()} onInput={(e) => setPassword(e.target.value)} class="input input-bordered w-full mb-4"/>
        <button onClick={handleLogin} class="btn btn-primary w-full mb-4">Login</button>
        {error() && (
          <div class="modal">
            <div class="modal-box">
              <h3 class="font-bold text-lg">Error</h3>
              <p>{error()}</p>
              <div class="modal-action">
                <button class="btn" onClick={() => setError("")}>Close</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const Register = () => {
  const [prename, setPrename] = createSignal("");
  const [surname, setSurname] = createSignal("");
  const [username, setUsername] = createSignal("");
  const [password, setPassword] = createSignal("");
  const [error, setError] = createSignal("");

  const validateInputs = () => {
    if (prename().length < 2 || surname().length < 2) {
      return "Prename and surname must have at least 2 letters";
    }
    if (username().length < 5) {
      return "Username must have at least 5 letters";
    }
    if (password().length < 8 || !/\d/.test(password())) {
      return "Password must be at least 8 letters and contain at least one digit";
    }
    return "";
  };

  const register = async () => {
    let validationError = ""
    if (prename().length < 2 || surname().length < 2) {
        setError("Prename and surname must have at least 2 letters"); 
        return; 
    }
    if (username().length < 5) {
        setError("Username must have at least 5 letters");
        return;
    }
    if (password().length < 8 || !/\d/.test(password())) {
        setError("Password must be at least 8 letters and contain at least one digit"); 
        return;
    }

    try {
      const response = await axios.post("http://localhost:3000/apisec/register", {
        username: username(), 
        password: password(), 
        prename: prename(), 
        surname: surname()
      });
      if (response.data.success === "ok") {
        localStorage.setItem("token", response.token);
        localStorage.setItem("user", JSON.stringify(response.user));
        window.location.href = "/app";
      } else {
        setError("Invalid username");
      }
    } catch (err) {
      setError("An error occurred");
    }
  };

  return (
    <div class="flex justify-center">
      <div class="bg-white p-8 rounded shadow-md w-96">
        <h2 class="text-2xl font-bold mb-4">Register</h2>
        <input type="text" placeholder="Prename" value={prename()} onInput={(e) => setPrename(e.target.value)} class="input input-bordered w-full mb-4"/>
        <input type="text" placeholder="Surname" value={surname()} onInput={(e) => setSurname(e.target.value)} class="input input-bordered w-full mb-4"/>
        <input type="text" placeholder="Username" value={username()} onInput={(e) => setUsername(e.target.value)} class="input input-bordered w-full mb-4"/>
        <input type="password" placeholder="Password" value={password()} onInput={(e) => setPassword(e.target.value)} class="input input-bordered w-full mb-4"/>
        <button onClick={register} class="btn btn-primary w-full mb-4">Register</button>
        {error() !== "" && (
          <div class="modal modal-open">
            <div class="modal-box">
              <h3 class="font-bold text-lg">Error</h3>
              <p>{error()}</p>
              <div class="modal-action">
                <button class="btn"onClick={() => setError("")}>Close</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const LoginRegister = () => {
    const [selectedMenu, setSelectedMenu] = createSignal("login");
  
    return (
        <div class="flex justify-center min-h-screen">
        <div class="bg-white p-8 rounded w-96">
          <div class="navbar mb-4 bg-base-100 rounded-lg shadow">
            <div class="flex-1">
              <a class="btn btn-ghost normal-case text-xl">My App</a>
            </div>
            <div class="flex-none">
              <ul class="menu menu-horizontal p-0">
                <li>
                  <a href="#" onClick={() => setSelectedMenu("login")}>
                    Login
                  </a>
                </li>
                <li>
                  <a href="#" onClick={() => setSelectedMenu("register")}>
                    Register
                  </a>
                </li>
              </ul>
            </div>
          </div>
          {selectedMenu() === "login" ? <Login /> : <Register />}
        </div>
      </div>
    );
  };

export default LoginRegister;
