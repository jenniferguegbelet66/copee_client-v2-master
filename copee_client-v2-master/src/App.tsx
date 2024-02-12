import "./App.css";
import Signin, { action as signinAction } from "./layouts/signin/index.tsx";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

function App() {
  return (
    <div className="app">
      <Router>
        <Routes>
          <Route path="signin" element={<Signin />} action={signinAction} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
