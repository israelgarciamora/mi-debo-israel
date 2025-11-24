"use client";

import { useEffect, useState } from "react";

import { ArrowRight, Bot, MessagesSquare, ShieldCheck, Sparkles } from "lucide-react";
import { AgentPanel } from "@/components/agent-panel";
import { Chat } from "@/components/Chat";
import type { Agent, AgentEvent, GuardrailCheck, Message } from "@/lib/types";
import { callChatAPI } from "@/lib/api";

const features = [
  {
    title: "Orquestación inteligente",
    description:
      "Coordina agentes especializados para cada necesidad: cambios de asiento, estado de vuelo o cancelaciones.",
    icon: Sparkles,
  },
  {
    title: "Experiencia segura",
    description:
      "Guardrails para mantener la conversación enfocada, segura y alineada con la experiencia de viaje.",
    icon: ShieldCheck,
  },
  {
    title: "Listo para la acción",
    description:
      "Interfaz lista para demo con contexto en tiempo real y trazabilidad completa de cada interacción.",
    icon: MessagesSquare,
  },
];

const steps = [
  {
    title: "Empieza la conversación",
    text: "Envía un mensaje y el sistema detecta automáticamente la intención del viajero.",
  },
  {
    title: "Ruta al agente correcto",
    text: "El orquestador selecciona el agente ideal y comparte el contexto necesario.",
  },
  {
    title: "Resuelve con confianza",
    text: "Recibe respuestas claras, con historial y acciones documentadas en la vista lateral.",
  },
];

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [events, setEvents] = useState<AgentEvent[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [currentAgent, setCurrentAgent] = useState<string>("");
  const [guardrails, setGuardrails] = useState<GuardrailCheck[]>([]);
  const [context, setContext] = useState<Record<string, any>>({});
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const data = await callChatAPI("", conversationId ?? "");
      setConversationId(data.conversation_id);
      setCurrentAgent(data.current_agent);
      setContext(data.context);
      const initialEvents = (data.events || []).map((e: any) => ({
        ...e,
        timestamp: e.timestamp ?? Date.now(),
      }));
      setEvents(initialEvents);
      setAgents(data.agents || []);
      setGuardrails(data.guardrails || []);
      if (Array.isArray(data.messages)) {
        setMessages(
          data.messages.map((m: any) => ({
            id: Date.now().toString() + Math.random().toString(),
            content: m.content,
            role: "assistant",
            agent: m.agent,
            timestamp: new Date(),
          }))
        );
      }
    })();
  }, []);

  const handleSendMessage = async (content: string) => {
    const userMsg: Message = {
      id: Date.now().toString(),
      content,
      role: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    const data = await callChatAPI(content, conversationId ?? "");

    if (!conversationId) setConversationId(data.conversation_id);
    setCurrentAgent(data.current_agent);
    setContext(data.context);
    if (data.events) {
      const stamped = data.events.map((e: any) => ({
        ...e,
        timestamp: e.timestamp ?? Date.now(),
      }));
      setEvents((prev) => [...prev, ...stamped]);
    }
    if (data.agents) setAgents(data.agents);
    if (data.guardrails) setGuardrails(data.guardrails);

    if (data.messages) {
      const responses: Message[] = data.messages.map((m: any) => ({
        id: Date.now().toString() + Math.random().toString(),
        content: m.content,
        role: "assistant",
        agent: m.agent,
        timestamp: new Date(),
      }));
      setMessages((prev) => [...prev, ...responses]);
    }

    setIsLoading(false);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 text-slate-900">
      <div className="mx-auto max-w-6xl px-6 py-10 space-y-10">
        <header className="flex items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white shadow-lg">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Demo OpenAI Agents</p>
              <h1 className="text-lg font-semibold text-slate-900">Mi Debo Airlines</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="#flujo"
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-white"
            >
              Ver cómo funciona
            </a>
            <a
              href="#demo"
              className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-slate-800"
            >
              Probar la demo
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </header>

        <section className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-500 shadow-sm ring-1 ring-slate-200">
              Nueva experiencia de atención
            </span>
            <h2 className="text-4xl font-bold leading-tight text-slate-900 sm:text-5xl">
              Atención al cliente aérea con agentes coordinados y listos para ayudar.
            </h2>
            <p className="max-w-2xl text-lg text-slate-600">
              Explora cómo un orquestador inteligente delega cada solicitud en el agente correcto. Cambios de asiento,
              estado de vuelo, cancelaciones y más en una interfaz única y transparente.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="#demo"
                className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-slate-800"
              >
                Iniciar conversación
                <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="https://github.com/openai/openai-agents-python/tree/main/examples/customer_service"
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-white"
                target="_blank"
                rel="noreferrer"
              >
                Ver guía de agentes
              </a>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur">
                <p className="text-sm font-semibold text-slate-500">Contexto vivo</p>
                <p className="mt-1 text-base text-slate-700">
                  Historial de mensajes, eventos y guardrails visibles en un panel lateral para mantener el control.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur">
                <p className="text-sm font-semibold text-slate-500">Listo para iterar</p>
                <p className="mt-1 text-base text-slate-700">
                  Cambia prompts, herramientas o flujos de negocio y vuelve a probar sin salir de la demo.
                </p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-4 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 blur-3xl opacity-30" />
            <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-5 py-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <Bot className="h-4 w-4" />
                  Vista previa del chat
                </div>
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                  Online
                </span>
              </div>
              <div className="space-y-4 p-6">
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Agente: Triage</p>
                  <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
                    Hola, soy tu asistente de viaje. ¿Quieres cambiar tu asiento, revisar el estado del vuelo o cancelar tu
                    reserva?
                  </div>
                </div>
                <div className="flex justify-end">
                  <div className="max-w-[70%] rounded-2xl bg-slate-900 px-4 py-3 text-sm text-white shadow-lg">
                    Necesito cambiar mi asiento al pasillo, por favor.
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Agente: Seat Booking</p>
                  <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
                    ¡Listo! Encontré un asiento de pasillo disponible. ¿Te sirve el 23C o prefieres otro número?
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white/80 px-6 py-6 shadow-sm backdrop-blur">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-500">¿Cómo ver la demo en tu máquina?</p>
              <p className="text-base text-slate-700">
                Sigue estos pasos rápidos para levantar el front y el backend y explorar la experiencia completa.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 shadow-inner">
              <ol className="list-decimal space-y-1 pl-4">
                <li>Instala dependencias: <code className="rounded bg-white px-1">npm install</code></li>
                <li>
                  Arranca la demo: <code className="rounded bg-white px-1">npm run dev</code>
                </li>
                <li>Abre el navegador en <code className="rounded bg-white px-1">http://localhost:3000</code>.</li>
              </ol>
            </div>
          </div>
        </section>

        <section id="demo" className="space-y-4 rounded-3xl border border-slate-200 bg-white/70 px-6 py-8 shadow-sm backdrop-blur">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-1">
              <p className="text-sm font-semibold text-slate-500">Diseñado para probar rápido</p>
              <h3 className="text-2xl font-bold text-slate-900">Prueba el chat en vivo</h3>
              <p className="text-base text-slate-600">
                La interfaz ya incluye panel de agentes, guardrails, contexto y chat. Envía un mensaje y observa cómo se
                orquesta la conversación.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm text-slate-600 sm:w-[320px]">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="flex items-start gap-2 rounded-2xl border border-slate-200 bg-slate-50/80 p-3 shadow-sm"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white shadow-md">
                    <feature.icon className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900">{feature.title}</h4>
                    <p className="text-xs text-slate-600">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4 lg:flex-row">
            <div className="flex-1 min-h-[520px] lg:max-w-[48%]">
              <AgentPanel
                agents={agents}
                currentAgent={currentAgent}
                events={events}
                guardrails={guardrails}
                context={context}
              />
            </div>
            <div className="flex-1 min-h-[520px]">
              <Chat messages={messages} onSendMessage={handleSendMessage} isLoading={isLoading} />
            </div>
          </div>
        </section>

        <section id="flujo" className="rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-6 py-10 text-white shadow-xl">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-xl space-y-3">
              <p className="text-sm font-semibold uppercase tracking-wide text-emerald-200">Flujo del orquestador</p>
              <h3 className="text-3xl font-bold leading-tight">De la intención a la resolución sin fricción.</h3>
              <p className="text-base text-slate-200">
                Cada interacción queda registrada y se comparte con el siguiente agente para evitar repetición y mantener la
                precisión. Perfecto para prototipar nuevas experiencias de servicio.
              </p>
            </div>
            <div className="rounded-full bg-white/10 px-5 py-2 text-sm font-semibold text-emerald-100 ring-1 ring-white/20">
              Orquestado por OpenAI Agents
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {steps.map((step, index) => (
              <div
                key={step.title}
                className="relative overflow-hidden rounded-2xl bg-white/5 p-5 ring-1 ring-white/10"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent" />
                <div className="relative flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-400/20 text-lg font-bold text-white ring-1 ring-white/30">
                    {index + 1}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-emerald-100">Paso {index + 1}</p>
                    <h4 className="text-lg font-semibold text-white">{step.title}</h4>
                  </div>
                </div>
                <p className="relative mt-3 text-sm text-slate-200">{step.text}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
