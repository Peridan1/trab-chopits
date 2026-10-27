import { Rotas } from "./routes";
import { StoreProvider } from "./context/StoreContext";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./styles/chopits-theme.css";

function App() {
    return (
        <StoreProvider>
            <Rotas />
        </StoreProvider>
    );
}

export default App;