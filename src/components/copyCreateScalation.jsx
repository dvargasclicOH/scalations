//Version funcional 23/03/2025
//UserAccesADmin 61a28b7f53f220a1f3a86aed
import React, { useState, useEffect, useContext } from "react";
import _ from "lodash";
import FormEscalation from "./FormEscalation";
import { KustomerContext } from "../context/KustomerContext";
import loadingGif from "../assets/loading.gif";
import "../styles.css";

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

    const userHasAccess = forms.some(form =>
        form.teamsAuthorized.some(teamId => state.teams.includes(teamId))
    );

    useEffect(() => {
        if (window.Kustomer && typeof window.Kustomer.setHeight === "function") {
            window.Kustomer.setHeight(600);
        }
    }, [state.formSelected]);

    useEffect(() => {
        if (state.conversationId && _.get(context, "conversation.custom.conversationIdStr") && _.get(context, "conversation.tags", []).includes("widget_scalations_out")) {
            fetchChatHistory(state.conversationId);
        }
    }, [state.conversationId]);

    const fetchChatHistory = async (conversationId) => {
        try {
            const response = await fetch(`https://url/v1/conversations/${conversationId}/messages`);
            const messages = await response.json();
            setState(prev => ({ ...prev, scalatedConversationMessages: messages.data }));
        } catch (error) {
            setState(prev => ({ ...prev, error: "Error al obtener mensajes" }));
        }
    };

    const handleSubmit = async (payload) => {
        setState(prev => ({ ...prev, submitting: true }));
        try {
            await fetch("https://url/v1/hooks/workflow", {
                method: "POST",
                headers: { "Authorization": "Bearer 12345", "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
            setState(prev => ({ ...prev, success: true, submitting: false }));
        } catch (error) {
            setState(prev => ({ ...prev, submitting: false, error: "Error al enviar datos" }));
        }
    };

    return (
        <div>
            <h3>Escalaciones</h3>
            {!userHasAccess ? (
                <p>🔒 No tienes acceso a este formulario</p>
            ) : state.success ? (
                <p>✅ Creado correctamente</p>
            ) : state.submitting ? (
                <img src={loadingGif} alt="Enviando..." />
            ) : state.scalatedConversationMessages.length > 0 ? (
                <div className="chat-container">
                    {state.scalatedConversationMessages.map(msg => (
                        <p key={msg.id}>{msg.attributes.preview}</p>
                    ))}
                </div>
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


