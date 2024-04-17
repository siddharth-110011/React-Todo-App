export class AuthService {
  constructor(authContextData) {
    this.authContextData = authContextData;
  }

  async login(user) {
    const { setIsAuthenticated } = this.authContextData;

    const response = await fetch("http://localhost:3001/users/login", {
      method: "POST",
      body: JSON.stringify({ user }),
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      }
    });

    // console.log(response);

    const data = await response.json();

    if (data.message === "user_logged_in") {
      console.log("User logged in");
      setIsAuthenticated(true);
      localStorage.setItem("user", JSON.stringify(data));
      localStorage.setItem("isLoggedIn", true);
    }
    return data;
  }

  async logout() {
    // console.log(this.authContextData);

    const { setIsAuthenticated } = this.authContextData;

    const response = await fetch(
      "http://localhost:3001/users/logout",
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        }
      }
    );

    const data = await response.json();
    console.log(data);

    if(data.logoutStatus) {
        console.log("Logout done!");
        setIsAuthenticated(false);
        localStorage.removeItem("user");
        localStorage.removeItem("isLoggedIn");
    }
  }

  async validateSessionToken() {
    console.log("Inside validateSessionToken()");
    const response = await fetch(
      "http://localhost:3001/users/validateSessionToken",
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        }
      }
    );

    const data = await response.json();
    console.log(data);

    if (!data.error) {
      console.log("Session maintained");

      return true;
    }
    else {
      localStorage.removeItem("user");
      localStorage.removeItem("isLoggedIn");
      
      return false;
    }
  }
}
