import React from "react";

export default function Topbar({ current, setCurrent }) {
  return (
    <div style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: "#2C3E50",
      padding: "10px 20px",
      color: "white"
    }}>
      <div>
        <button
          onClick={() => setCurrent("quotes")}
          style={{
            marginRight: "10px",
            backgroundColor: current === "quotes" ? "#1ABC9C" : "transparent",
            color: "white",
            border: "none",
            padding: "8px 15px",
            cursor: "pointer",
            borderRadius: "4px"
          }}
        >
          Cotizaciones
        </button>
        <button
          onClick={() => setCurrent("clients")}
          style={{
            backgroundColor: current === "clients" ? "#1ABC9C" : "transparent",
            color: "white",
            border: "none",
            padding: "8px 15px",
            cursor: "pointer",
            borderRadius: "4px"
          }}
        >
          Clientes
        </button>
      </div>
      <div style={{ fontWeight: "bold", fontSize: "16px" }}>
        Vehicle Insurance Quotes
      </div>
    </div>
  );
}
