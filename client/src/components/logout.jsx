import Cookies from "js-cookie";

const logout = () => {
    Cookies.remove("token");
    window.location.href = "/auth";
}

export default logout