import React, { useState } from "react";
import "./FormEscalation.css";  // Asegúrate de tener los estilos adecuados

const formFieldTemplates = {
    Operaciones: [
        { label: "Id de la ruta", type: "text", stateKey: "idRuta" },
        { label: "Id Guía", type: "text", stateKey: "idGuia" }
    ],
    Supply: [
        { label: "Id Producto", type: "text", stateKey: "idProducto" },
        { label: "Cantidad", type: "number", stateKey: "cantidad" }
    ],
    Financiero: [
        { label: "Monto adeudado", type: "number", stateKey: "montoAdeudado" },
        { label: "Fecha de corte", type: "date", stateKey: "fechaCorte" }
    ],
    Customer: [
        { label: "Email Cliente", type: "email", stateKey: "emailCliente" },
        { label: "Teléfono", type: "tel", stateKey: "telefonoCliente" }
    ]
};

const FormEscalation = ({ formType, setField, attachments, onSubmit }) => {
    const [formData, setFormData] = useState({});

    const handleFileChange = (e) => {
        setField("attachments", [...attachments, ...e.target.files]);
    };

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setField(field, value);
    };

    if (!formType || !formFieldTemplates[formType]) {
        return <p></p>;
    }

    return (
        <div className="form-escalation">
            <h3>{formType}</h3>
            <div>
                <div>
                    <form onSubmit={(e) => onSubmit(e, formData)}>
                        <div>
                            {formFieldTemplates[formType].map(({ label, type, stateKey }) => (
                                <div key={stateKey}>
                                    <label>{label}</label>
                                    <input
                                        type={type}
                                        value={formData[stateKey] || ""}
                                        onChange={e => handleChange(stateKey, e.target.value)}
                                        required
                                    />
                                </div>
                            ))}
                        </div>
                        <footer>
                            <label>Adjuntar archivo:</label>
                            <input type="file" multiple onChange={handleFileChange} />

                            {attachments.length > 0 && (
                                <ul className="upload-list">
                                    {attachments.map((file, index) => (
                                        <li className="upload-item" key={index}>
                                            <span>{file.name}</span>
                                            <span
                                                className="upload-remove"
                                                onClick={() =>
                                                    setField("attachments", attachments.filter((_, i) => i !== index))
                                                }
                                            >
                                                ❌
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                            <button type="submit">Enviar</button>
                        </footer>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default FormEscalation;
