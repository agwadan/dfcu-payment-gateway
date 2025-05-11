import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TransactionsList from "./pages/TransactionsList";
import "./App.scss";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<TransactionsList />} />
      </Routes>
    </Router>
  );
}

export default App;
