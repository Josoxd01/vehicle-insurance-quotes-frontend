import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Clients() {
  const [clients, setClients] = useState([]);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    id: null,
    name: "",
    email: "",
    identification: "",
  });

  const loadClients = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/clients");
      setClients(res.data.data || res.data);
    } catch {
      setError("Error al cargar los clientes.");
    }
  };

  useEffect(() => {
    loadClients();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (form.id) {
        await axios.put(`http://127.0.0.1:8000/api/clients/${form.id}`, form);
      } else {
        await axios.post("http://127.0.0.1:8000/api/clients", form);
      }

      setForm({ id: null, name: "", email: "", identification: "" });
      loadClients();
    } catch (err) {
      if (err.response && err.response.status === 422) {
        setError("Por favor verifique los campos.");
      } else {
        setError("Ocurrió un error inesperado.");
      }
    }
  };

  const handleEdit = (client) => setForm(client);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/clients/${id}`);
      loadClients();
    } catch {
      setError("No se pudo eliminar el cliente.");
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h2 style={{ color: "#2C3E50" }}>Gestión de Clientes</h2>

      {error && (
        <div
          style={{
            background: "#FDEDEC",
            color: "#C0392B",
            padding: "10px",
            borderRadius: "6px",
            marginBottom: "15px",
          }}
        >
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "20px",
          background: "#F9F9F9",
          padding: "15px",
          borderRadius: "8px",
        }}
      >
        <input
          placeholder="Nombre"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          style={{
            flex: 1,
            padding: "8px",
            borderRadius: "4px",
            border: "1px solid #CCC",
          }}
        />
        <input
          placeholder="Correo"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          style={{
            flex: 1,
            padding: "8px",
            borderRadius: "4px",
            border: "1px solid #CCC",
          }}
        />
        <input
          placeholder="Cédula"
          value={form.identification}
          onChange={(e) =>
            setForm({ ...form, identification: e.target.value })
          }
          style={{
            flex: 1,
            padding: "8px",
            borderRadius: "4px",
            border: "1px solid #CCC",
          }}
        />
        <button
          type="submit"
          style={{
            background: "#1ABC9C",
            color: "white",
            border: "none",
            padding: "8px 15px",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          {form.id ? "Actualizar" : "Registrar"}
        </button>
        {form.id && (
          <button
            type="button"
            onClick={() =>
              setForm({ id: null, name: "", email: "", identification: "" })
            }
            style={{
              background: "#E74C3C",
              color: "white",
              border: "none",
              padding: "8px 15px",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Cancelar
          </button>
        )}
      </form>

      <table
        style={{
          width: "100%",
          borderSpacing: 0,
          background: "white",
          borderRadius: "8px",
          overflow: "hidden",
          boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
          textAlign: "left",
        }}
      >
        <thead>
          <tr style={{ backgroundColor: "#2C3E50", color: "white" }}>
            <th style={{ padding: "12px 16px", width: "30%" }}>Nombre</th>
            <th style={{ padding: "12px 16px", width: "30%" }}>Correo</th>
            <th style={{ padding: "12px 16px", width: "20%" }}>Cédula</th>
            <th style={{ padding: "12px 16px", width: "20%" }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((c, index) => (
            <tr
              key={c.id}
              style={{
                backgroundColor: index % 2 === 0 ? "#F9F9F9" : "#FFFFFF",
                borderBottom: "1px solid #E0E0E0",
              }}
            >
              <td style={{ padding: "10px 16px" }}>{c.name}</td>
              <td style={{ padding: "10px 16px" }}>{c.email}</td>
              <td style={{ padding: "10px 16px" }}>{c.identification}</td>
              <td style={{ padding: "10px 16px" }}>
                <button
                  onClick={() => handleEdit(c)}
                  style={{
                    marginRight: "8px",
                    background: "#F1C40F",
                    border: "none",
                    padding: "6px 12px",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(c.id)}
                  style={{
                    background: "#E74C3C",
                    border: "none",
                    padding: "6px 12px",
                    borderRadius: "4px",
                    cursor: "pointer",
                    color: "white",
                    fontWeight: "bold",
                  }}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
