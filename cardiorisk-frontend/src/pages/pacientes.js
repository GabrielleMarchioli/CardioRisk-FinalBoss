import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Pacientes() {
  // Estados para cadastro
  const [nome, setNome] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [cpf, setCpf] = useState("");
  const [sexo, setSexo] = useState("");
  // Estados para edição
  const [editando, setEditando] = useState(false);
  const [pacienteEditado, setPacienteEditado] = useState(null);
  const [editNome, setEditNome] = useState("");
  const [editDataNascimento, setEditDataNascimento] = useState("");
  const [editCpf, setEditCpf] = useState("");
  const [editSexo, setEditSexo] = useState("");
  // Estados gerais
  const [pacientes, setPacientes] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Carregar pacientes e verificar token
  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError("Você precisa estar logado.");
        setTimeout(() => navigate("/login"), 2000);
        return;
      }

      try {
        const verifyResponse = await fetch("http://localhost:5000/api/medicos/verify", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });
        if (!verifyResponse.ok) {
          throw new Error("Token inválido.");
        }

        const pacientesResponse = await fetch("http://localhost:5000/api/pacientes", {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });
        const pacientesData = await pacientesResponse.json();
        if (pacientesResponse.ok) {
          setPacientes(pacientesData);
        } else {
          setError(pacientesData.message || "Erro ao carregar pacientes");
        }
        setLoading(false);
      } catch (err) {
        setError("Sessão expirada. Faça login novamente.");
        localStorage.removeItem('token');
        setTimeout(() => navigate("/login"), 2000);
      }
    };

    verifyToken();
  }, [navigate]);

  // Formatar CPF (máscara XXX.XXX.XXX-XX)
  const formatarCpf = (value) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length <= 11) {
      return cleaned
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    }
    return value;
  };

  // Manipular mudança no CPF (cadastro)
  const handleCpfChange = (e) => {
    const formatted = formatarCpf(e.target.value);
    setCpf(formatted);
  };

  // Manipular mudança no CPF (edição)
  const handleEditCpfChange = (e) => {
    const formatted = formatarCpf(e.target.value);
    setEditCpf(formatted);
  };

  // Formatar data para input type="date" (YYYY-MM-DD)
  const formatarDataParaInput = (data) => {
    const date = new Date(data);
    const ano = date.getFullYear();
    const mes = String(date.getMonth() + 1).padStart(2, '0');
    const dia = String(date.getDate()).padStart(2, '0');
    return `${ano}-${mes}-${dia}`;
  };

  // Formatar data para exibição (DD/MM/YYYY)
  const formatarDataNascimento = (data) => {
    const date = new Date(data);
    const dia = String(date.getDate()).padStart(2, '0');
    const mes = String(date.getMonth() + 1).padStart(2, '0');
    const ano = date.getFullYear();
    return `${dia}/${mes}/${ano}`;
  };

  // Cadastrar paciente
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const token = localStorage.getItem('token');
    const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
    if (!cpfRegex.test(cpf)) {
      setError("CPF inválido. Use o formato XXX.XXX.XXX-XX.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/pacientes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          nome,
          dataNascimento,
          cpf,
          sexo,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setPacientes([...pacientes, data]);
        setNome("");
        setDataNascimento("");
        setCpf("");
        setSexo("");
      } else {
        setError(data.message || "Erro ao cadastrar paciente");
      }
    } catch (err) {
      setError("Erro ao conectar ao servidor");
    }
  };

  // Iniciar edição de paciente
  const handleEditar = (paciente) => {
    setEditando(true);
    setPacienteEditado(paciente);
    setEditNome(paciente.nome);
    setEditDataNascimento(formatarDataParaInput(paciente.dataNascimento));
    setEditCpf(paciente.cpf);
    setEditSexo(paciente.sexo);
  };

  // Cancelar edição
  const handleCancelarEdicao = () => {
    setEditando(false);
    setPacienteEditado(null);
    setEditNome("");
    setEditDataNascimento("");
    setEditCpf("");
    setEditSexo("");
  };

  // Salvar alterações do paciente
  const handleSalvarEdicao = async (e) => {
    e.preventDefault();
    setError("");

    const token = localStorage.getItem('token');
    const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
    if (!cpfRegex.test(editCpf)) {
      setError("CPF inválido. Use o formato XXX.XXX.XXX-XX.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/pacientes/${pacienteEditado._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          nome: editNome,
          dataNascimento: editDataNascimento,
          cpf: editCpf,
          sexo: editSexo,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setPacientes(pacientes.map(p => (p._id === pacienteEditado._id ? data : p)));
        handleCancelarEdicao();
      } else {
        setError(data.message || "Erro ao salvar alterações");
      }
    } catch (err) {
      setError("Erro ao conectar ao servidor");
    }
  };

  // Função de logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-600 text-xl">Carregando...</p>
      </div>
    );
  }

  if (error && !editando) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-red-100 text-red-700 p-4 rounded-md">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-md p-4 flex justify-between items-center">
        <div className="flex items-center">
          <svg
            className="w-8 h-8 text-green-500 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
          <h1 className="text-2xl font-semibold text-gray-800">CardioRisk</h1>
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition duration-200"
        >
          Sair
        </button>
      </header>

      {/* Conteúdo Principal */}
      <div className="p-8">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">
              {editando ? "Editar Paciente" : "Cadastrar Paciente"}
            </h1>
            <button
              onClick={() => navigate("/dashboard")}
              className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition duration-200"
            >
              Voltar ao Dashboard
            </button>
          </div>

          {/* Formulário de Cadastro ou Edição */}
          {editando ? (
            <form onSubmit={handleSalvarEdicao} className="space-y-4">
              <div>
                <label htmlFor="editNome" className="block text-sm font-medium text-gray-700">
                  Nome
                </label>
                <input
                  id="editNome"
                  type="text"
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  value={editNome}
                  onChange={(e) => setEditNome(e.target.value)}
                  placeholder="Ex: João Silva"
                  required
                />
              </div>
              <div>
                <label htmlFor="editDataNascimento" className="block text-sm font-medium text-gray-700">
                  Data de Nascimento
                </label>
                <input
                  id="editDataNascimento"
                  type="date"
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  value={editDataNascimento}
                  onChange={(e) => setEditDataNascimento(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="editCpf" className="block text-sm font-medium text-gray-700">
                  CPF
                </label>
                <input
                  id="editCpf"
                  type="text"
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  value={editCpf}
                  onChange={handleEditCpfChange}
                  placeholder="Ex: 123.456.789-00"
                  maxLength={14}
                  required
                />
              </div>
              <div>
                <label htmlFor="editSexo" className="block text-sm font-medium text-gray-700">
                  Sexo
                </label>
                <select
                  id="editSexo"
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  value={editSexo}
                  onChange={(e) => setEditSexo(e.target.value)}
                  required
                >
                  <option value="">Selecione</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Feminino">Feminino</option>
                </select>
              </div>
              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="flex-1 bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition duration-200"
                >
                  Salvar Alterações
                </button>
                <button
                  type="button"
                  onClick={handleCancelarEdicao}
                  className="flex-1 bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition duration-200"
                >
                  Cancelar
                </button>
              </div>
              {error && (
                <div className="mt-4 bg-red-100 text-red-700 p-4 rounded-md">
                  {error}
                </div>
              )}
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="nome" className="block text-sm font-medium text-gray-700">
                  Nome
                </label>
                <input
                  id="nome"
                  type="text"
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Ex: João Silva"
                  required
                />
              </div>
              <div>
                <label htmlFor="dataNascimento" className="block text-sm font-medium text-gray-700">
                  Data de Nascimento
                </label>
                <input
                  id="dataNascimento"
                  type="date"
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  value={dataNascimento}
                  onChange={(e) => setDataNascimento(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="cpf" className="block text-sm font-medium text-gray-700">
                  CPF
                </label>
                <input
                  id="cpf"
                  type="text"
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  value={cpf}
                  onChange={handleCpfChange}
                  placeholder="Ex: 123.456.789-00"
                  maxLength={14}
                  required
                />
              </div>
              <div>
                <label htmlFor="sexo" className="block text-sm font-medium text-gray-700">
                  Sexo
                </label>
                <select
                  id="sexo"
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  value={sexo}
                  onChange={(e) => setSexo(e.target.value)}
                  required
                >
                  <option value="">Selecione</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Feminino">Feminino</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition duration-200"
              >
                Cadastrar Paciente
              </button>
              {error && (
                <div className="mt-4 bg-red-100 text-red-700 p-4 rounded-md">
                  {error}
                </div>
              )}
            </form>
          )}

          {/* Tabela de Pacientes */}
          <div className="mt-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Pacientes Cadastrados</h2>
            {pacientes.length === 0 ? (
              <p className="text-gray-600">Nenhum paciente cadastrado.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-3 text-gray-700 font-semibold border-b">Nome</th>
                      <th className="p-3 text-gray-700 font-semibold border-b">CPF</th>
                      <th className="p-3 text-gray-700 font-semibold border-b">Data de Nascimento</th>
                      <th className="p-3 text-gray-700 font-semibold border-b">Idade</th>
                      <th className="p-3 text-gray-700 font-semibold border-b">Sexo</th>
                      <th className="p-3 text-gray-700 font-semibold border-b">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pacientes.map((paciente) => (
                      <tr key={paciente._id} className="hover:bg-gray-50">
                        <td className="p-3 border-b text-gray-600">{paciente.nome}</td>
                        <td className="p-3 border-b text-gray-600">{paciente.cpf}</td>
                        <td className="p-3 border-b text-gray-600">{formatarDataNascimento(paciente.dataNascimento)}</td>
                        <td className="p-3 border-b text-gray-600">{paciente.idade}</td>
                        <td className="p-3 border-b text-gray-600">{paciente.sexo}</td>
                        <td className="p-3 border-b">
                          <button
                            onClick={() => handleEditar(paciente)}
                            className="bg-green-500 text-white py-1 px-3 rounded-md hover:bg-green-600 transition duration-200"
                          >
                            Editar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}