import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

// Registrar os componentes do Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [medicoNome, setMedicoNome] = useState("");
  const [consultasHoje, setConsultasHoje] = useState(0);
  const [consultasPorHora, setConsultasPorHora] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  // Função pra buscar consultas
  const fetchConsultas = async (token) => {
    try {
      // Buscar total de consultas do dia
      const todayResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/consultas/today`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      if (!todayResponse.ok) {
        throw new Error("Erro ao buscar consultas do dia");
      }
      const todayData = await todayResponse.json();
      console.log("Consultas hoje recebidas:", todayData);
      setConsultasHoje(todayData.count || 0);

      // Buscar consultas por hora
      const hourlyResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/consultas/hourly`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      if (!hourlyResponse.ok) {
        throw new Error("Erro ao buscar consultas por hora");
      }
      const hourlyData = await hourlyResponse.json();
      console.log("Consultas por hora recebidas:", hourlyData);
      setConsultasPorHora(hourlyData || []);
    } catch (err) {
      console.error("Erro ao buscar consultas:", err.message);
      setConsultasHoje(0);
      setConsultasPorHora([]);
    }
  };

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError("Você precisa estar logado.");
        setTimeout(() => navigate("/login"), 2000);
        return;
      }

      try {
        // Verificar token e pegar nome do médico
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/medicos/verify`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error("Token inválido.");
        }
        const data = await response.json();
        setMedicoNome(data.nome || "Médico");

        // Buscar consultas iniciais
        await fetchConsultas(token);
        setLoading(false);
      } catch (err) {
        setError("Sessão expirada. Faça login novamente.");
        localStorage.removeItem('token');
        setTimeout(() => navigate("/login"), 2000);
      }
    };

    verifyToken();
  }, [navigate]);

  // Efeito pra recarregar consultas quando houver um sinal
  useEffect(() => {
    if (location.state?.refreshConsultas) {
      const token = localStorage.getItem('token');
      if (token) {
        fetchConsultas(token);
      }
      // Limpar o estado pra evitar recarregamentos desnecessários
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, navigate]);

  // Dados do gráfico de barras
  const chartData = {
    labels: Array.from({ length: 24 }, (_, i) => `${i}h`), // 0h a 23h
    datasets: [
      {
        label: "Consultas por Hora",
        data: Array.from({ length: 24 }, (_, i) => {
          const hora = consultasPorHora.find(h => h.hora === i);
          return hora ? hora.count : 0;
        }),
        backgroundColor: "rgba(34, 197, 94, 0.6)", // Verde claro
        borderColor: "rgba(34, 197, 94, 1)",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false, // Permite que o gráfico se ajuste à altura do container
    plugins: {
      legend: {
        position: "top",
        labels: {
          font: {
            size: 16, // Aumenta o tamanho da fonte da legenda
          },
        },
      },
      title: {
        display: true,
        text: "Consultas por Hora do Dia",
        font: {
          size: 20, // Aumenta o tamanho da fonte do título
        },
        padding: {
          top: 10,
          bottom: 20,
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Hora do Dia",
          font: {
            size: 14, // Aumenta o tamanho da fonte do título do eixo X
          },
        },
        ticks: {
          font: {
            size: 12, // Aumenta o tamanho dos rótulos do eixo X
          },
        },
      },
      y: {
        title: {
          display: true,
          text: "Número de Consultas",
          font: {
            size: 14, // Aumenta o tamanho da fonte do título do eixo Y
          },
        },
        min: 0,
        max: 20,
        ticks: {
          stepSize: 2,
          font: {
            size: 12, // Aumenta o tamanho dos rótulos do eixo Y
          },
        },
      },
    },
    layout: {
      padding: {
        left: 10,
        right: 10,
        top: 0,
        bottom: 10, // Reduz o padding pra ocupar mais espaço
      },
    },
  };

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
        <h2 className="text-3xl font-bold text-green-700 mb-2">
          Bem-vindo, {medicoNome}
        </h2>
        <p className="text-gray-600 mb-6">
          Você realizou {consultasHoje} consulta{consultasHoje !== 1 ? "s" : ""} hoje.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Gráfico de Consultas por Hora */}
          <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md h-[524px]">
            <Bar data={chartData} options={chartOptions} />
          </div>

          {/* Coluna à direita */}
          <div className="flex flex-col gap-6">
            {/* Estatísticas do Dia (simplificado) */}
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Estatísticas do Dia
              </h3>
              <p className="text-gray-600">
                <span className="text-2xl font-bold text-green-500">{consultasHoje}</span> consulta{consultasHoje !== 1 ? "s" : ""} realizada{consultasHoje !== 1 ? "s" : ""}.
              </p>
            </div>

            {/* Container: Importância do Gráfico */}
            <div className="bg-white p-6 rounded-lg shadow-md h-[400px] flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Por que o Gráfico é Importante?
                </h3>
                <p className="text-gray-600 mb-4">
                  O gráfico de consultas por hora ajuda você a identificar os períodos de maior demanda no seu dia. Isso permite ajustar sua agenda, planejar melhor os atendimentos e garantir que você tenha tempo suficiente para cada paciente, especialmente em horários de pico.
                </p>
                <p className="text-gray-600">
                  Acompanhar o número de consultas por dia e por hora também é essencial para avaliar sua produtividade e o impacto do seu trabalho na saúde dos pacientes. Ele te dá uma visão clara de como seu tempo é distribuído, ajudando a melhorar a gestão da sua rotina e a qualidade do atendimento.
                </p>
              </div>
            </div>
          </div>

          {/* Explicação do Cálculo de Risco */}
          <div className="lg:col-span-3 bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Como é Feito o Cálculo de Risco Cardiovascular?
            </h3>
            <p className="text-gray-600">
              O cálculo de risco cardiovascular é baseado em modelos como o SCORE (Systematic Coronary Risk Evaluation). Ele considera fatores como idade, sexo, níveis de colesterol, pressão arterial, tabagismo e histórico de diabetes. Esses dados são combinados em uma fórmula que estima a probabilidade de um evento cardiovascular (como infarto ou AVC) nos próximos 10 anos. No CardioRisk, ajustamos os parâmetros para refletir as condições dos pacientes e fornecemos uma classificação em baixo, moderado ou alto risco.
            </p>
          </div>

          {/* Botões de Ação */}
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => navigate("/calcular-risco")}
              className="bg-green-500 text-white py-4 px-6 rounded-lg shadow-md hover:bg-green-600 transition duration-200 flex items-center justify-center"
            >
              <span className="text-lg">Calcular Risco Cardiovascular</span>
            </button>
            <button
              onClick={() => navigate("/pacientes")}
              className="bg-green-500 text-white py-4 px-6 rounded-lg shadow-md hover:bg-green-600 transition duration-200 flex items-center justify-center"
            >
              <span className="text-lg">Gerenciar Pacientes</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}