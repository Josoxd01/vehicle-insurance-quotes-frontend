import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaSearch, FaPlus } from "react-icons/fa";

export default function Quotes() {
  const [quotes, setQuotes] = useState([]);
  const [clients, setClients] = useState([]);
  const [error, setError] = useState("");
  const [viewMode, setViewMode] = useState("create");

  const [currentPage, setCurrentPage] = useState(1);
  const [quotesPerPage] = useState(5);

  const [filterState, setFilterState] = useState("");
  const [filterClient, setFilterClient] = useState("");
  const [startYear, setStartYear] = useState("");
  const [endYear, setEndYear] = useState("");

  const [form, setForm] = useState({
    id: null,
    client_id: "",
    brand: "",
    model: "",
    year: "",
    premium: "",
    status: "pending",
  });

  useEffect(() => {
    loadQuotes();
    loadClients();
  }, []);

  const loadQuotes = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/quotes");
      setQuotes(res.data.data || res.data);
    } catch {
      setError("Error al cargar las cotizaciones.");
    }
  };

  const loadClients = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/clients");
      setClients(res.data.data || res.data);
    } catch {
      setError("Error al cargar los clientes.");
    }
  };

  const applyFilters = async () => {
    try {
      const params = {
        status: filterState,
        client: filterClient,
        start_date: startYear,
        end_date: endYear,
      };
      const res = await axios.get("http://127.0.0.1:8000/api/quotes", { params });
      setQuotes(res.data.data || res.data);
      setCurrentPage(1);
    } catch {
      setError("Error al aplicar filtros.");
    }
  };

  const handleConsultPremium = async () => {
    setError("");
    if (!form.brand || !form.model || !form.year) {
      setError("Por favor ingresa marca, modelo y año para consultar la prima.");
      return;
    }

    try {
      const res = await axios.post(
        "https://68fe50c97c700772bb13737d.mockapi.io/api/test/quotes",
        {
          nombre: form.model,
          marca: form.brand,
          año: form.year,
        }
      );
      setForm({ ...form, premium: res.data.price });
    } catch {
      setError("Error al consultar la prima.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (form.id) {
        await axios.put(`http://127.0.0.1:8000/api/quotes/${form.id}`, form);
      } else {
        await axios.post("http://127.0.0.1:8000/api/quotes", form);
      }

      setForm({
        id: null,
        client_id: "",
        brand: "",
        model: "",
        year: "",
        premium: "",
        status: "pending",
      });
      loadQuotes();
    } catch (err) {
      if (err.response && err.response.status === 422) {
        setError("Por favor completa todos los campos correctamente.");
      } else {
        setError("Error al guardar la cotización.");
      }
    }
  };

  const handleFileUpload = async (e, quoteId) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post(
        `http://127.0.0.1:8000/api/quotes/${quoteId}/documents`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      alert("Documento subido correctamente");
    } catch (err) {
      alert("Error al subir documento");
    }
  };

  const handleEdit = (q) => {
    setForm({
      id: q.id,
      client_id: q.client_id || "",
      brand: q.brand || "",
      model: q.model || "",
      year: q.year || "",
      premium: q.premium || "",
      status: q.status || "pending",
    });
    setViewMode("create");
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/quotes/${id}`);
      loadQuotes();
    } catch {
      setError("No se pudo eliminar la cotización.");
    }
  };

  const translateStatus = (status) => {
    switch (status) {
      case "pending":
        return "Pendiente";
      case "review":
        return "En Revisión";
      case "approved":
        return "Aprobado";
      case "rejected":
        return "Rechazado";
      case "closed":
        return "Cerrado";
      default:
        return status || "-";
    }
  };

  const indexOfLast = currentPage * quotesPerPage;
  const indexOfFirst = indexOfLast - quotesPerPage;
  const currentQuotes = quotes.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(quotes.length / quotesPerPage);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h2
        style={{
          color: "#2C3E50",
          display: "flex",
          alignItems: "center",
          gap: "15px",
        }}
      >
        Gestión de Cotizaciones
        <FaSearch
          title="Filtrar o buscar cotizaciones"
          onClick={() => setViewMode("filters")}
          style={{
            cursor: "pointer",
            color: viewMode === "filters" ? "#1ABC9C" : "#2C3E50",
            fontSize: "20px",
          }}
        />
        <FaPlus
          title="Agregar nueva cotización"
          onClick={() => {
            setViewMode("create");
            setFilterState("");
            setFilterClient("");
            setStartYear("");
            setEndYear("");
            loadQuotes();
          }}
          style={{
            cursor: "pointer",
            color: viewMode === "create" ? "#1ABC9C" : "#2C3E50",
            fontSize: "20px",
          }}
        />
      </h2>

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
      {viewMode === "create" ? (
        <form
          onSubmit={handleSubmit}
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr 0.6fr 0.8fr auto",
            gap: "10px",
            marginBottom: "20px",
            background: "#F9F9F9",
            padding: "15px",
            borderRadius: "8px",
            alignItems: "center",
          }}
        >
          {form.id ? (
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              style={{
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid #CCC",
              }}
            >
              <option value="pending">Pendiente</option>
              <option value="review">En Revisión</option>
              <option value="approved">Aprobado</option>
              <option value="rejected">Rechazado</option>
              <option value="closed">Cerrado</option>
            </select>
          ) : (
            <select
              value={form.client_id}
              onChange={(e) => setForm({ ...form, client_id: e.target.value })}
              style={{
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid #CCC",
              }}
            >
              <option value="">Selecciona cliente</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.identification})
                </option>
              ))}
            </select>
          )}

          <input
            placeholder="Marca"
            value={form.brand}
            onChange={(e) => setForm({ ...form, brand: e.target.value })}
            style={{
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #CCC",
            }}
          />

          <input
            placeholder="Modelo"
            value={form.model}
            onChange={(e) => setForm({ ...form, model: e.target.value })}
            style={{
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #CCC",
            }}
          />

          <input
            type="number"
            placeholder="Año"
            value={form.year}
            onChange={(e) => setForm({ ...form, year: e.target.value })}
            style={{
              width: "90%",
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #CCC",
            }}
          />

          <input
            placeholder="Prima"
            type="number"
            value={form.premium}
            onChange={(e) => setForm({ ...form, premium: e.target.value })}
            style={{
              width: "90%",
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #CCC",
            }}
          />

          <div style={{ display: "flex", gap: "5px", justifyContent: "flex-end" }}>
            <button
              type="button"
              onClick={handleConsultPremium}
              style={{
                background: "#3498DB",
                color: "white",
                border: "none",
                padding: "8px 10px",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Consultar Prima
            </button>

            <button
              type="submit"
              style={{
                background: "#1ABC9C",
                color: "white",
                border: "none",
                padding: "8px 10px",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              {form.id ? "Actualizar" : "Guardar"}
            </button>

            {form.id && (
              <button
                type="button"
                onClick={() =>
                  setForm({
                    id: null,
                    client_id: "",
                    brand: "",
                    model: "",
                    year: "",
                    premium: "",
                    status: "pending",
                  })
                }
                style={{
                  background: "#E74C3C",
                  color: "white",
                  border: "none",
                  padding: "8px 10px",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      ) : (
        <div
          style={{
            display: "flex",
            gap: "10px",
            marginBottom: "20px",
            background: "#F9F9F9",
            padding: "15px",
            borderRadius: "8px",
            alignItems: "center",
          }}
        >
          <select
            value={filterState}
            onChange={(e) => setFilterState(e.target.value)}
            style={{
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #CCC",
            }}
          >
            <option value="">Todos los estados</option>
            <option value="pending">Pendiente</option>
            <option value="review">En Revisión</option>
            <option value="approved">Aprobado</option>
            <option value="rejected">Rechazado</option>
            <option value="closed">Cerrado</option>
          </select>

          <select
            value={filterClient}
            onChange={(e) => setFilterClient(e.target.value)}
            style={{
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #CCC",
            }}
          >
            <option value="">Todos los clientes</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.identification})
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Año desde"
            value={startYear}
            onChange={(e) => setStartYear(e.target.value)}
            style={{
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #CCC",
              width: "130px",
            }}
          />

          <input
            type="number"
            placeholder="Año hasta"
            value={endYear}
            onChange={(e) => setEndYear(e.target.value)}
            style={{
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #CCC",
              width: "130px",
            }}
          />

          <button
            onClick={applyFilters}
            style={{
              background: "#3498DB",
              color: "white",
              border: "none",
              padding: "8px 15px",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Buscar
          </button>
        </div>
      )}

      {/* Tabla */}
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
            <th style={{ padding: "12px 16px" }}>Cliente</th>
            <th style={{ padding: "12px 16px" }}>Marca</th>
            <th style={{ padding: "12px 16px" }}>Modelo</th>
            <th style={{ padding: "12px 16px" }}>Año</th>
            <th style={{ padding: "12px 16px" }}>Prima</th>
            <th style={{ padding: "12px 16px" }}>Estado</th>
            <th style={{ padding: "12px 16px" }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {currentQuotes.map((q, index) => (
            <tr
              key={q.id}
              style={{
                backgroundColor: index % 2 === 0 ? "#F9F9F9" : "#FFFFFF",
                borderBottom: "1px solid #E0E0E0",
              }}
            >
              <td style={{ padding: "10px 16px" }}>
                {q.client?.name || q.client_name}
              </td>
              <td style={{ padding: "10px 16px" }}>{q.brand}</td>
              <td style={{ padding: "10px 16px" }}>{q.model}</td>
              <td style={{ padding: "10px 16px" }}>{q.year}</td>
              <td style={{ padding: "10px 16px" }}>
                {q.premium ? `$${q.premium}` : "-"}
              </td>
              <td style={{ padding: "10px 16px" }}>{translateStatus(q.status)}</td>
              <td style={{ padding: "10px 16px" }}>
                <button
                  onClick={() => handleEdit(q)}
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
                  onClick={() => handleDelete(q.id)}
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
                <input
                  type="file"
                  onChange={(e) => handleFileUpload(e, q.id)}
                  accept=".pdf,.jpg"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Paginación */}
      <div style={{ display: "flex", justifyContent: "center", marginTop: "15px" }}>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            style={{
              margin: "0 5px",
              background: currentPage === i + 1 ? "#1ABC9C" : "#ECF0F1",
              color: currentPage === i + 1 ? "white" : "black",
              border: "none",
              padding: "6px 10px",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
