//Version funcional 23/03/2025
//UserAccesADmin 61a28b7f53f220a1f3a86aed
import React, { useState, useEffect, useContext } from "react";
import _ from "lodash";
import FormEscalation from "./FormEscalation";
import { KustomerContext } from "../context/KustomerContext";
import loadingGif from "../assets/loading.gif";
import "../styles/styles.css";

const forms = [
    { form: "Operaciones", teamsAuthorized: ["61a28b7f53f220a1f3a86aed", "team2"] },
    { form: "Supply", teamsAuthorized: ["61a28b7f53f220a1f3a86aed", "team4"] },
    { form: "Financiero", teamsAuthorized: ["61a28b7f53f220a1f3a86aed"] }
];

const CreateScalation = () => {
    const { context } = useContext(KustomerContext);
    const [state, setState] = useState({
        conversationId: _.get(context, "conversation.id", ""),
        agentEmail: _.get(context, "currentUser.email", ""),
        teams: _.get(context, "currentUser.teams", []).map(team => team.id),
        formSelected: "",
        attachments: [],
        submitting: false,
        success: false,
        error: null,
        scalatedConversationMessages: [],
        scalatedConversation: null
    });

    useEffect(() => {
        if (context) {
            console.log("📌 Actualizando equipos del usuario con el contexto recibido.");
            setState(prev => ({
                ...prev,
                teams: _.get(context, "currentUser.teams", []).map(team => team.id) || []
            }));
        }
    }, [context]);
    if (!context) {
        console.log("⏳ Esperando contexto de Kustomer...");
        return <p>Cargando contexto...</p>;
    }

    // Extraer equipos del usuario
    const userTeams = context?.currentUser?.teams?.map(team => team.id) || [];
    console.log("👤 Equipos del usuario:", userTeams);
    const userHasAccess = forms.some(form => {
        const access = form.teamsAuthorized.some(teamId => userTeams.includes(teamId));
        //console.log(`🔍 Revisando accesos a "${form.form}"`);
        //console.log("📌 Equipos autorizados para este formulario:", form.teamsAuthorized);
        //console.log("🛠️ Equipos del usuario:", userTeams);
        //console.log(`✅ ¿Tiene acceso a este formulario?:`, access);
        return access;
    });
    
    const handleSubmit = async (e, payload) => {
        e.preventDefault();
        console.log("🚀 Enviando datos...");
        console.log("📩 Payload enviado:", JSON.stringify(payload, null, 2));  // ✅ Imprime datos en consola

        setState(prev => ({ ...prev, submitting: true, success: false })); 
        
        try {
            console.log("🌍 Enviando solicitud a la API...");
            const response = await fetch("https://api.kustomerapp.com/v1/hooks/form/6185671c5c8df47cc3f6917b/e4c190e3ba517f4358856262c687e567752a0163131e9a2f9d8198da845d180f", {
                method: "POST",
                headers: { "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxZDhhZGFiMTQ0OWJmYWIyNmJlZjAxMyIsInVzZXIiOiI2MWQ4YWRhYTliOTQ4NGY3ODA3NGU5ZTEiLCJvcmciOiI2MTg1NjcxYzVjOGRmNDdjYzNmNjkxN2IiLCJvcmdOYW1lIjoibG9neXN0byIsInVzZXJUeXBlIjoibWFjaGluZSIsInBvZCI6InByb2QxIiwicm9sZXMiOlsib3JnLnBlcm1pc3Npb24uY29udmVyc2F0aW9uLnJlYWQiLCJvcmcucGVybWlzc2lvbi5tZXNzYWdlLnJlYWQiXSwiYXVkIjoidXJuOmNvbnN1bWVyIiwiaXNzIjoidXJuOmFwaSIsInN1YiI6IjYxZDhhZGFhOWI5NDg0Zjc4MDc0ZTllMSJ9.xNtaaqrdqPZKKuAmKTKAQFxH4f1LaXDwPmHqsCK3ZHk", "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            console.log("🔍 Respuesta del servidor:", response);

            if (!response.ok) {
                throw new Error(`❌ Error en la respuesta: ${response.statusText} (${response.status})`);
            }

            const data = await response.json();
            console.log("✅ Datos recibidos:", data);

            setState(prev => ({ ...prev, submitting: false, success: true }));
        } catch (error) {
            console.error("❌ Error al enviar los datos:", error);
            setState(prev => ({ ...prev, submitting: false, error: true }));
        }
    };

    const availableForms = forms.filter(form =>
        form.teamsAuthorized.some(teamId => userTeams.includes(teamId))
    ); console.log("📋 Formularios disponibles para este usuario:", availableForms);

    return (
        <div>
            <h3>Escalaciones</h3>
            {!userHasAccess ? (
                <p>🔒 No tienes acceso a este formulario</p>
            ) : state.success ? (
                <p>✅ Creado correctamente</p>
            ) : state.submitting ? (
                <img src={loadingGif} alt="Enviando..." />
            ) : (
                <>
                    <label>Selecciona un formulario:</label>
                    <select value={state.formSelected} onChange={e => setState({ ...state, formSelected: e.target.value })}>
                        <option value="">-- Selecciona --</option>
                        {forms.filter(form => form.teamsAuthorized.some(teamId => state.teams.includes(teamId)))
                            .map(form => <option key={form.form} value={form.form}>{form.form}</option>)}
                    </select>
                    <FormEscalation 
                        formType={state.formSelected} 
                        setField={(field, value) => setState(prev => ({ ...prev, [field]: value }))} 
                        attachments={state.attachments} 
                        onSubmit={handleSubmit}
                    />
                </>
            )}
            {state.error && <p>Error: {state.error}</p>}
        </div>
    );
};

export default CreateScalation;