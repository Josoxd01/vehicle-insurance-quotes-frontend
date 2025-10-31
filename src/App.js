import React, { useState } from "react";
import Topbar from "./components/Topbar";
import Clients from "./pages/clients";
import Quotes from "./pages/quotes";

export default function App() {
  const [current, setCurrent] = useState("quotes");

  return (
    <div>
      <Topbar current={current} setCurrent={setCurrent} />
      {current === "quotes" && <Quotes />}
      {current === "clients" && <Clients />}
    </div>
  );
}
