/*
 * Componente Policies: pagina de politicas de la verduleria
 * Muestra tres tarjetas (Privacidad, Devolucion, Terminos)
 * Al hacer clic en cada una se abre un modal con contenido detallado
 */
import { useState } from 'react';

// Icono SVG: escudo (privacidad)
const ShieldIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2l7 3v7c0 4.5-3.5 8.5-7 9-3.5-.5-7-4.5-7-9V5l7-3z" />
    <path d="M9 12l2 2 4-4" />
  </svg>
);

// Icono SVG: flecha de retorno (devolucion)
const ReturnIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 12a9 9 0 1 0 9-9" />
    <path d="M3 3v5h5" />
    <path d="M10 14l-2-2 2-2" />
  </svg>
);

// Icono SVG: documento con texto (terminos)
const DocumentIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="9" y1="13" x2="15" y2="13" />
    <line x1="9" y1="17" x2="13" y2="17" />
  </svg>
);

// Contenido detallado de cada politica (simulado)
const POLICY_DATA = {
  privacidad: {
    title: 'Política de Privacidad',
    content: `En Verdulería Colón nos tomamos muy en serio la protección de tus datos personales.

Recopilación de datos: Solo solicitamos la información necesaria para procesar tus pedidos: nombre, dirección de entrega, teléfono y correo electrónico.

Uso de la información: Tus datos se utilizan exclusivamente para gestionar tus compras, coordinar entregas y mantenerte informado sobre el estado de tus pedidos.

Protección de datos: Implementamos medidas de seguridad técnicas y organizativas para proteger tu información contra accesos no autorizados, pérdida o alteración.

Compartir información: No vendemos ni compartimos tu información personal con terceros, excepto cuando sea necesario para completar tu pedido (ej: datos de entrega con nuestro repartidor).

Tus derechos: Podés solicitar en cualquier momento la modificación, eliminación o exportación de tus datos personales escribiéndonos a contacto@verduleriacolon.com.

Vigencia: Esta política se actualiza periódicamente. Te notificaremos si hay cambios significativos.`,
  },
  devolucion: {
    title: 'Política de Devolución',
    content: `En Verdulería Colón garantizamos la frescura y calidad de todos nuestros productos.

Garantía de calidad: Si un producto no cumple con tus expectativas de frescura, contactanos dentro de las 24 horas posteriores a la entrega.

Plazo de devolución: Tenés hasta 48 horas desde la recepción para solicitar un cambio o reembolso.

Productos elegibles: Aplica para frutas, verduras y lácteos que presenten signos evidentes de deterioro al momento de la entrega.

Proceso de devolución: Envianos una foto del producto en cuestión a nuestro WhatsApp junto con tu número de pedido. Te responderemos en menos de 2 horas.

Métodos de reembolso: Podés elegir entre un reemplazo del producto en tu próxima entrega, un crédito en tu cuenta o un reembolso directo al medio de pago original.

Excepciones: No aceptamos devoluciones de bebidas abiertas ni productos consumidos parcialmente.`,
  },
  terminos: {
    title: 'Términos y Condiciones',
    content: `Bienvenido a Verdulería Colón. Al usar nuestro sitio y realizar pedidos aceptás los siguientes términos.

Pedidos: Al realizar un pedido te comprometés a proporcionar información veraz y completa. Nos reservamos el derecho de cancelar pedidos si detectamos inconsistencias.

Precios: Todos los precios están expresados en pesos argentinos (ARS) e incluyen IVA. Los precios pueden variar sin previo aviso, pero el precio confirmado en tu pedido es el que se respeta.

Pagos: Aceptamos transferencia bancaria, Mercado Pago y efectivo contra entrega. El pedido se procesa una vez confirmado el pago.

Entregas: Realizamos entregas de lunes a sábado de 9:00 a 20:00. El horario estimado se confirma al momento del pedido. El incumplimiento del horario por parte del cliente puede resultar en una reprogramación.

Cancelaciones: Podés cancelar tu pedido sin costo hasta 2 horas antes de la entrega programada.

Responsabilidad: No nos hacemos responsables por daños causados por un mal almacenamiento de los productos después de la entrega.

Modificaciones: Estos términos pueden actualizarse. El uso continuado del sitio implica la aceptación de los cambios.`,
  },
};

const Policies = () => {
  // Estado del modal: null o id de la politica activa
  const [activeModal, setActiveModal] = useState(null);

  // Cierra el modal
  const closeModal = () => setActiveModal(null);

  // Datos de cada tarjeta
  const cards = [
    {
      id: 'privacidad',
      icon: <ShieldIcon />,
      title: 'Política de Privacidad',
      desc: 'Cómo recopilamos, usamos y protegemos tu información personal.',
    },
    {
      id: 'devolucion',
      icon: <ReturnIcon />,
      title: 'Política de Devolución',
      desc: 'Garantía de calidad, plazos y métodos de reembolso para productos frescos.',
    },
    {
      id: 'terminos',
      icon: <DocumentIcon />,
      title: 'Términos y Condiciones',
      desc: 'Condiciones generales de uso, pedidos, pagos y entregas.',
    },
  ];

  return (
    <section className="policies">
      {/* Encabezado */}
      <div className="policies-header">
        <h1 className="policies-title">Políticas</h1>
        <p className="policies-subtitle">Transparencia y confianza en cada compra</p>
      </div>

      {/* Grid de tarjetas */}
      <div className="policies-grid">
        {cards.map((card) => (
          <button
            key={card.id}
            className="policy-card"
            onClick={() => setActiveModal(card.id)}
          >
            <div className="policy-card-icon">{card.icon}</div>
            <h3 className="policy-card-title">{card.title}</h3>
            <p className="policy-card-desc">{card.desc}</p>
            <span className="policy-card-cta">Leer más</span>
          </button>
        ))}
      </div>

      {/* Modal con contenido detallado */}
      {activeModal && (
        <div className="policy-modal-overlay" onClick={closeModal}>
          <div
            className="policy-modal"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Boton cerrar */}
            <button className="policy-modal-close" onClick={closeModal}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            <h2 className="policy-modal-title">
              {POLICY_DATA[activeModal].title}
            </h2>

            <div className="policy-modal-body">
              {POLICY_DATA[activeModal].content.split('\n\n').map((paragraph, i) => (
                <p key={i} className="policy-modal-paragraph">{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Policies;