import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CalcularRisco() {
  const [pacienteQuery, setPacienteQuery] = useState("");
  const [pacientes, setPacientes] = useState([]);
  const [selectedPaciente, setSelectedPaciente] = useState(null);
  const [nome, setNome] = useState("");
  const [idade, setIdade] = useState("");
  const [sexo, setSexo] = useState("");
  const [colesterolTotal, setColesterolTotal] = useState("");
  const [hdl, setHdl] = useState("");
  const [pressaoSistolica, setPressaoSistolica] = useState("");
  const [tratamentoHipertensao, setTratamentoHipertensao] = useState("Não");
  const [tabagismo, setTabagismo] = useState("Não");
  const [diabetes, setDiabetes] = useState("Não");
  const [risco, setRisco] = useState(null);
  const [historicoRiscos, setHistoricoRiscos] = useState([]);
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
        const verifyResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/medicos/verify`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });
        if (!verifyResponse.ok) {
          throw new Error("Token inválido.");
        }

        const pacientesResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/pacientes`, {
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

  // Buscar histórico de riscos ao selecionar paciente
  useEffect(() => {
    if (selectedPaciente) {
      const fetchHistorico = async () => {
        const token = localStorage.getItem('token');
        try {
          const response = await fetch(`${process.env.REACT_APP_API_URL}/api/riscos/paciente/${selectedPaciente._id}`, {
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
            },
          });
          const data = await response.json();
          if (response.ok) {
            setHistoricoRiscos(data);
          } else {
            setError(data.message || "Erro ao carregar histórico");
          }
        } catch (err) {
          setError("Erro ao conectar ao servidor");
        }
      };
      fetchHistorico();
    } else {
      setHistoricoRiscos([]);
    }
  }, [selectedPaciente]);

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

  // Manipular mudança no CPF
  const handleCpfChange = (e) => {
    const formatted = formatarCpf(e.target.value);
    setPacienteQuery(formatted);
    setSelectedPaciente(null);
    setNome("");
    setIdade("");
    setSexo("");
  };

  // Selecionar paciente pelo CPF
  const handleSelectPaciente = (paciente) => {
    setSelectedPaciente(paciente);
    setPacienteQuery(paciente.cpf);
    setNome(paciente.nome);
    setIdade(paciente.idade.toString());
    setSexo(paciente.sexo);
  };

  // Filtrar pacientes pelo CPF
  const filteredPacientes = pacientes.filter((paciente) =>
    paciente.cpf.toLowerCase().includes(pacienteQuery.toLowerCase())
  );

  // Calcular risco
  const calcularRisco = () => {
    let pontos = 0;

    if (idade >= 20 && idade <= 34) pontos += sexo === "Masculino" ? -9 : -7;
    else if (idade >= 35 && idade <= 39) pontos += sexo === "Masculino" ? -4 : -3;
    else if (idade >= 40 && idade <= 44) pontos += sexo === "Masculino" ? 0 : 0;
    else if (idade >= 45 && idade <= 49) pontos += sexo === "Masculino" ? 3 : 3;
    else if (idade >= 50 && idade <= 54) pontos += sexo === "Masculino" ? 6 : 6;
    else if (idade >= 55 && idade <= 59) pontos += sexo === "Masculino" ? 8 : 8;
    else if (idade >= 60 && idade <= 64) pontos += sexo === "Masculino" ? 10 : 10;
    else if (idade >= 65 && idade <= 69) pontos += sexo === "Masculino" ? 11 : 12;
    else if (idade >= 70 && idade <= 74) pontos += sexo === "Masculino" ? 12 : 14;
    else if (idade >= 75 && idade <= 79) pontos += sexo === "Masculino" ? 13 : 16;

    if (colesterolTotal < 160) pontos += 0;
    else if (colesterolTotal >= 160 && colesterolTotal <= 199) pontos += sexo === "Masculino" ? 4 : 4;
    else if (colesterolTotal >= 200 && colesterolTotal <= 239) pontos += sexo === "Masculino" ? 7 : 8;
    else if (colesterolTotal >= 240 && colesterolTotal <= 279) pontos += sexo === "Masculino" ? 9 : 11;
    else if (colesterolTotal >= 280) pontos += sexo === "Masculino" ? 11 : 13;

    if (hdl >= 60) pontos += -1;
    else if (hdl >= 50 && hdl <= 59) pontos += 0;
    else if (hdl >= 40 && hdl <= 49) pontos += 1;
    else if (hdl < 40) pontos += 2;

    if (pressaoSistolica < 120) pontos += 0;
    else if (pressaoSistolica >= 120 && pressaoSistolica <= 129) pontos += sexo === "Masculino" ? 0 : 1;
    else if (pressaoSistolica >= 130 && pressaoSistolica <= 139) pontos += sexo === "Masculino" ? 1 : 2;
    else if (pressaoSistolica >= 140 && pressaoSistolica <= 159) pontos += sexo === "Masculino" ? 1 : 3;
    else if (pressaoSistolica >= 160) pontos += sexo === "Masculino" ? 2 : 4;

    if (tratamentoHipertensao === "Sim") pontos += sexo === "Masculino" ? 1 : 2;
    if (tabagismo === "Sim") pontos += sexo === "Masculino" ? 8 : 9;
    if (diabetes === "Sim") pontos += sexo === "Masculino" ? 2 : 2;

    let riscoPercentual;
    if (sexo === "Masculino") {
      if (pontos < 0) riscoPercentual = "<1%";
      else if (pontos <= 4) riscoPercentual = "1%";
      else if (pontos <= 6) riscoPercentual = "2%";
      else if (pontos <= 8) riscoPercentual = "4%";
      else if (pontos <= 10) riscoPercentual = "6%";
      else if (pontos <= 12) riscoPercentual = "10%";
      else if (pontos <= 14) riscoPercentual = "16%";
      else if (pontos <= 16) riscoPercentual = "25%";
      else riscoPercentual = ">30%";
    } else {
      if (pontos < 9) riscoPercentual = "<1%";
      else if (pontos <= 12) riscoPercentual = "1%";
      else if (pontos <= 14) riscoPercentual = "2%";
      else if (pontos <= 16) riscoPercentual = "4%";
      else if (pontos <= 18) riscoPercentual = "6%";
      else if (pontos <= 20) riscoPercentual = "11%";
      else if (pontos <= 22) riscoPercentual = "17%";
      else if (pontos <= 24) riscoPercentual = "27%";
      else riscoPercentual = ">30%";
    }

    return riscoPercentual;
  };

  // Submeter cálculo
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setRisco(null);

    if (!selectedPaciente) {
      setError("Selecione um paciente pelo CPF.");
      return;
    }
    if (idade < 18 || idade > 79) {
      setError("Idade deve estar entre 18 e 79 anos.");
      return;
    }

    const token = localStorage.getItem('token');
    try {
      const riscoCalculado = calcularRisco();
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/riscos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          pacienteId: selectedPaciente._id,
          idade: parseInt(idade),
          sexo,
          colesterolTotal,
          hdl,
          pressaoSistolica,
          tratamentoHipertensao: tratamentoHipertensao === "Sim",
          tabagismo: tabagismo === "Sim",
          diabetes: diabetes === "Sim",
          risco: riscoCalculado,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setRisco(riscoCalculado);
        // Atualizar histórico após novo cálculo
        const historicoResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/riscos/paciente/${selectedPaciente._id}`, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });
        const historicoData = await historicoResponse.json();
        if (historicoResponse.ok) {
          setHistoricoRiscos(historicoData);
        }
        setPacienteQuery("");
        setSelectedPaciente(null);
        setNome("");
        setIdade("");
        setSexo("");
        setColesterolTotal("");
        setHdl("");
        setPressaoSistolica("");
        setTratamentoHipertensao("Não");
        setTabagismo("Não");
        setDiabetes("Não");
      } else {
        setError(data.message || "Erro ao salvar cálculo");
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

  if (error) {
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
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-green-700">Calcular Risco Cardiovascular</h1>
              <button
                onClick={() => navigate("/dashboard")}
                className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition duration-200"
              >
                Voltar ao Dashboard
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* CPF do Paciente */}
                <div className="relative">
                  <label htmlFor="paciente" className="block text-sm font-medium text-gray-700">
                    CPF do Paciente
                  </label>
                  <input
                    id="paciente"
                    type="text"
                    className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 focus:outline-none transition duration-200"
                    value={pacienteQuery}
                    onChange={handleCpfChange}
                    placeholder="Digite o CPF (Ex: 123.456.789-00)"
                    maxLength={14}
                    required
                  />
                  {pacienteQuery && filteredPacientes.length > 0 && !selectedPaciente && (
                    <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-40 overflow-y-auto shadow-sm">
                      {filteredPacientes.map((paciente) => (
                        <li
                          key={paciente._id}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-700"
                          onClick={() => handleSelectPaciente(paciente)}
                        >
                          {paciente.cpf} - {paciente.nome}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Nome */}
                <div>
                  <label htmlFor="nome" className="block text-sm font-medium text-gray-700">
                    Nome
                  </label>
                  <input
                    id="nome"
                    type="text"
                    className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600"
                    value={nome}
                    readOnly
                  />
                </div>

                {/* Idade */}
                <div>
                  <label htmlFor="idade" className="block text-sm font-medium text-gray-700">
                    Idade (18-79 anos)
                  </label>
                  <input
                    id="idade"
                    type="number"
                    className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 focus:outline-none transition duration-200"
                    value={idade}
                    onChange={(e) => setIdade(e.target.value)}
                    placeholder="Ex: 45"
                    required
                  />
                </div>

                {/* Sexo */}
                <div>
                  <label htmlFor="sexo" className="block text-sm font-medium text-gray-700">
                    Sexo
                  </label>
                  <select
                    id="sexo"
                    className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 focus:outline-none transition duration-200 disabled:bg-gray-100 disabled:text-gray-500"
                    value={sexo}
                    onChange={(e) => setSexo(e.target.value)}
                    required
                    disabled={!!selectedPaciente}
                  >
                    <option value="">Selecione</option>
                    <option value="Masculino">Masculino</option>
                    <option value="Feminino">Feminino</option>
                  </select>
                </div>

                {/* Colesterol Total */}
                <div>
                  <label htmlFor="colesterolTotal" className="block text-sm font-medium text-gray-700">
                    Colesterol Total (mg/dL)
                  </label>
                  <input
                    id="colesterolTotal"
                    type="number"
                    className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 focus:outline-none transition duration-200"
                    value={colesterolTotal}
                    onChange={(e) => setColesterolTotal(e.target.value)}
                    placeholder="Ex: 200"
                    required
                  />
                </div>

                {/* HDL */}
                <div>
                  <label htmlFor="hdl" className="block text-sm font-medium text-gray-700">
                    HDL (mg/dL)
                  </label>
                  <input
                    id="hdl"
                    type="number"
                    className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 focus:outline-none transition duration-200"
                    value={hdl}
                    onChange={(e) => setHdl(e.target.value)}
                    placeholder="Ex: 50"
                    required
                  />
                </div>

                {/* Pressão Sistólica */}
                <div>
                  <label htmlFor="pressaoSistolica" className="block text-sm font-medium text-gray-700">
                    Pressão Arterial Sistólica (mmHg)
                  </label>
                  <input
                    id="pressaoSistolica"
                    type="number"
                    className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 focus:outline-none transition duration-200"
                    value={pressaoSistolica}
                    onChange={(e) => setPressaoSistolica(e.target.value)}
                    placeholder="Ex: 130"
                    required
                  />
                </div>
              </div>

              {/* Botões Sim/Não */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Tratamento Hipertensao */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Em tratamento para hipertensão
                  </label>
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      className={`flex-1 py-2 px-4 rounded-md border transition duration-200 ${
                        tratamentoHipertensao === "Sim"
                          ? "bg-green-500 text-white border-green-500"
                          : "bg-white text-green-500 border-green-500 hover:bg-green-50"
                      }`}
                      onClick={() => setTratamentoHipertensao("Sim")}
                    >
                      Sim
                    </button>
                    <button
                      type="button"
                      className={`flex-1 py-2 px-4 rounded-md border transition duration-200 ${
                        tratamentoHipertensao === "Não"
                          ? "bg-red-500 text-white border-red-500"
                          : "bg-white text-red-500 border-red-500 hover:bg-red-50"
                      }`}
                      onClick={() => setTratamentoHipertensao("Não")}
                    >
                      Não
                    </button>
                  </div>
                </div>

                {/* Tabagista */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tabagista
                  </label>
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      className={`flex-1 py-2 px-4 rounded-md border transition duration-200 ${
                        tabagismo === "Sim"
                          ? "bg-green-500 text-white border-green-500"
                          : "bg-white text-green-500 border-green-500 hover:bg-green-50"
                      }`}
                      onClick={() => setTabagismo("Sim")}
                    >
                      Sim
                    </button>
                    <button
                      type="button"
                      className={`flex-1 py-2 px-4 rounded-md border transition duration-200 ${
                        tabagismo === "Não"
                          ? "bg-red-500 text-white border-red-500"
                          : "bg-white text-red-500 border-red-500 hover:bg-red-50"
                      }`}
                      onClick={() => setTabagismo("Não")}
                    >
                      Não
                    </button>
                  </div>
                </div>

                {/* Diabetes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Diabetes
                  </label>
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      className={`flex-1 py-2 px-4 rounded-md border transition duration-200 ${
                        diabetes === "Sim"
                          ? "bg-green-500 text-white border-green-500"
                          : "bg-white text-green-500 border-green-500 hover:bg-green-50"
                      }`}
                      onClick={() => setDiabetes("Sim")}
                    >
                      Sim
                    </button>
                    <button
                      type="button"
                      className={`flex-1 py-2 px-4 rounded-md border transition duration-200 ${
                        diabetes === "Não"
                          ? "bg-red-500 text-white border-red-500"
                          : "bg-white text-red-500 border-red-500 hover:bg-red-50"
                      }`}
                      onClick={() => setDiabetes("Não")}
                    >
                      Não
                    </button>
                  </div>
                </div>
              </div>

              {/* Botão Calcular */}
              <button
                type="submit"
                className="w-full bg-green-500 text-white py-3 px-4 rounded-md hover:bg-green-600 transition duration-200 font-semibold"
              >
                Calcular Risco
              </button>
            </form>
          </div>

          {/* Resultado */}
          {risco && (
            <div className="bg-green-50 rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Resultado do Cálculo</h2>
              <p className="text-gray-600">
                Risco cardiovascular em 10 anos:{" "}
                <span className="text-green-700 font-bold">{risco}</span>
              </p>
            </div>
          )}

          {/* Histórico */}
          {selectedPaciente && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Histórico de Cálculos de Risco</h2>
              {historicoRiscos.length === 0 ? (
                <p className="text-gray-600">Nenhum cálculo de risco anterior para este paciente.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="p-3 text-sm font-semibold text-gray-700 border-b">Data</th>
                        <th className="p-3 text-sm font-semibold text-gray-700 border-b">Idade</th>
                        <th className="p-3 text-sm font-semibold text-gray-700 border-b">Risco</th>
                        <th className="p-3 text-sm font-semibold text-gray-700 border-b">Colesterol Total</th>
                        <th className="p-3 text-sm font-semibold text-gray-700 border-b">HDL</th>
                        <th className="p-3 text-sm font-semibold text-gray-700 border-b">Pressão Sistólica</th>
                        <th className="p-3 text-sm font-semibold text-gray-700 border-b">Hipertensão Tratada</th>
                        <th className="p-3 text-sm font-semibold text-gray-700 border-b">Tabagista</th>
                        <th className="p-3 text-sm font-semibold text-gray-700 border-b">Diabetes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {historicoRiscos.map((risco, index) => (
                        <tr key={risco._id} className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-gray-100`}>
                          <td className="p-3 text-gray-600 border-b">{new Date(risco.createdAt).toLocaleDateString()}</td>
                          <td className="p-3 text-gray-600 border-b">{risco.idade}</td>
                          <td className="p-3 text-gray-600 border-b">{risco.risco}</td>
                          <td className="p-3 text-gray-600 border-b">{risco.colesterolTotal} mg/dL</td>
                          <td className="p-3 text-gray-600 border-b">{risco.hdl} mg/dL</td>
                          <td className="p-3 text-gray-600 border-b">{risco.pressaoSistolica} mmHg</td>
                          <td className="p-3 text-gray-600 border-b">{risco.tratamentoHipertensao ? "Sim" : "Não"}</td>
                          <td className="p-3 text-gray-600 border-b">{risco.tabagismo ? "Sim" : "Não"}</td>
                          <td className="p-3 text-gray-600 border-b">{risco.diabetes ? "Sim" : "Não"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}