import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "./Pages/Dashboard";
import Gallery from "./Pages/Gallery";
import NotFound from "./Pages/NotFound";

function App() {
  const { isLoading, isAuthenticated, loginWithRedirect } = useAuth0();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      loginWithRedirect();
    }
  }, [isLoading, isAuthenticated, loginWithRedirect]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={isAuthenticated && <Dashboard />} />
        <Route path="/gallery" element={isAuthenticated && <Gallery />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
