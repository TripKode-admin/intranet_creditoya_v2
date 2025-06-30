---
title: "Préstamos y Créditos"
section: "modulos"
order: 2
level: 1
---

# Préstamos y Créditos

## Introducción

El sistema de préstamos y créditos representa el corazón de nuestra plataforma financiera, diseñado para automatizar y optimizar cada etapa del proceso crediticio. Desde la perspectiva del usuario, es un camino claro y transparente para obtener financiamiento, mientras que técnicamente constituye un ecosistema robusto que garantiza eficiencia, seguridad y cumplimiento legal en cada transacción.

El proceso completo funciona como una línea de producción inteligente: cada solicitud pasa por estaciones específicas donde se valida, analiza y procesa automáticamente, con intervención humana solo cuando es necesario. Esta automatización no solo acelera los tiempos de respuesta, sino que también reduce errores y asegura consistencia en las decisiones crediticias.

## Creación y Seguimiento de Solicitudes

### La Experiencia del Solicitante

Cuando una persona decide solicitar un préstamo, el proceso comienza con una interfaz intuitiva que la guía paso a paso. No se trata simplemente de llenar un formulario, sino de una conversación digital estructurada donde el sistema solicita información gradualmente, explicando por qué cada dato es necesario y cómo se utilizará.

El solicitante proporciona información personal básica, detalles sobre su situación laboral actual, información financiera incluyendo el monto deseado y el plazo preferido, y finalmente carga los documentos de respaldo como volantes de pago, carta laboral y copia de su documento de identidad. Durante este proceso, el sistema valida en tiempo real que la información sea correcta y los documentos tengan el formato adecuado.

Una vez completada la solicitud, la persona recibe inmediatamente un correo de confirmación con un número de referencia único y un enlace para hacer seguimiento en tiempo real. Puede ver exactamente en qué etapa se encuentra su solicitud, qué falta por completar, y recibe notificaciones automáticas cada vez que hay un cambio o se requiere alguna acción de su parte.

### Arquitectura Técnica de Solicitudes

El proceso de creación utiliza el modelo `PreLoanApplication` que maneja el almacenamiento temporal durante la construcción de la solicitud. Este enfoque permite que los usuarios guarden progreso parcial y regresen posteriormente para completar el proceso. El sistema genera tokens JWT temporales específicos para cada sesión de solicitud, vinculando de forma segura los datos al usuario autenticado.

La validación previa implementa múltiples capas de verificación: validación de formato para documentos (PDF, JPG, PNG con límites de tamaño configurables), verificación de integridad de datos mediante expresiones regulares y validación cruzada de información personal. Los documentos se procesan y almacenan en servicios cloud (Google Cloud Storage o Cloudinary) con URLs firmadas para acceso seguro.

El sistema de seguimiento utiliza una máquina de estados que transición entre: `Pendiente`, `En Revisión`, `Aprobada`, `Rechazada` y `Ajuste Pendiente`. Cada transición se registra en la colección `EventLoanApplication` con timestamp, usuario responsable y contexto adicional para auditoría completa. Las notificaciones se manejan mediante Resend con plantillas dinámicas basadas en el estado actual y datos específicos del usuario.

## Validación Automática de Documentos

### Procesamiento Inteligente para el Usuario

La validación de documentos es completamente transparente para el usuario. Una vez que carga sus documentos, el sistema trabaja en segundo plano para verificar automáticamente que la información coincida con lo declarado en la solicitud. Es como tener un asistente experto que revisa cada detalle meticulosamente pero en cuestión de minutos en lugar de días.

Si el sistema detecta alguna inconsistencia o falta información, no simplemente rechaza los documentos, sino que proporciona feedback específico y constructivo. Por ejemplo, si un volante de pago está incompleto, indica exactamente qué información falta y proporciona ejemplos de documentos válidos. El usuario tiene entonces la oportunidad de corregir y reenviar documentos con orientación clara sobre qué necesita mejorar.

Este proceso de validación bidireccional asegura que el usuario no se sienta perdido o frustrado, sino acompañado durante todo el proceso. El sistema incluso sugiere alternativas cuando un documento específico no está disponible, manteniendo el proceso en movimiento hacia la aprobación.

### Implementación de Validación Técnica

La validación automática integra tecnologías de reconocimiento óptico de caracteres (OCR) y análisis estructural de documentos. El sistema procesa documentos PDF e imágenes extrayendo texto y datos estructurados, luego ejecuta algoritmos de coincidencia para verificar coherencia entre documentos cargados y datos de solicitud.

Para volantes de pago, el sistema valida períodos temporales (verificando que cubran los últimos 3 meses mínimo), extrae y compara nombres, números de documento y montos de ingresos. Las cartas laborales se procesan para verificar datos de empresa, cargo, fecha de vinculación y firmas o sellos institucionales.

La integración con servicios externos utiliza APIs de terceros para validación de empresas y verificación de autenticidad de documentos. Esto incluye consultas a bases de datos empresariales, verificación de NIT y validación de firmas digitales cuando están disponibles. El sistema de manejo de errores implementa reintentos automáticos, logging detallado y notificaciones específicas al usuario con instrucciones de corrección.

Los documentos rechazados activan un flujo de re-subida con plazo configurable (7 días por defecto), durante el cual el usuario puede corregir y reenviar documentos manteniendo el resto de la solicitud intacta.

## Generación Dinámica de Contratos

### Contratos Personalizados para Cada Cliente

La generación de contratos representa uno de los aspectos más sofisticados del sistema desde la perspectiva del usuario. En lugar de recibir un documento genérico, cada cliente obtiene un contrato completamente personalizado que refleja sus circunstancias específicas, el monto aprobado, las condiciones negociadas y toda la información legal requerida.

El proceso es completamente automático: una vez aprobada la solicitud, el sistema genera inmediatamente un contrato en formato PDF profesional que incluye no solo los términos específicos del préstamo, sino también todas las cláusulas legales requeridas por la normativa local. El cliente recibe este contrato por correo electrónico junto con instrucciones claras sobre cómo revisarlo y firmarlo digitalmente.

La firma digital no requiere software especial ni procesos complicados. El cliente simplemente hace clic en un enlace seguro, revisa el contrato en línea, y puede firmarlo electrónicamente con validez legal completa. Una vez firmado, tanto el cliente como la institución reciben copias digitales del contrato ejecutado.

### Motor de Generación de Contratos

La generación de contratos utiliza el servicio `PdfService` que procesa plantillas legales predefinidas mediante la librería jspdf. Las plantillas incluyen cláusulas obligatorias según normativa local (como Ley 1581 de 2012 en Colombia para manejo de datos personales) y se actualizan dinámicamente según cambios regulatorios.

El proceso de personalización utiliza un motor de templates que reemplaza variables específicas con datos del cliente y términos del préstamo. Esto incluye información personal (nombres, documento, dirección), términos financieros (monto, tasa de interés corriente y moratoria, plazo), cronograma de pagos generado automáticamente, y cláusulas personalizadas según el tipo de crédito.

La generación de PDF implementa configuraciones avanzadas de jspdf incluyendo fuentes personalizadas, formato profesional con headers y footers, numeración de páginas, y marca de agua de seguridad. Los contratos se almacenan en servicios cloud con encriptación en tránsito y en reposo, utilizando URLs firmadas con expiración temporal para acceso seguro.

El sistema de firma digital integra tokens JWT específicos para cada contrato, garantizando que solo el usuario autorizado pueda firmar su documento. Una vez firmado, el contrato se marca como `Firmado` en la base de datos y se registra el timestamp de ejecución para validez legal.

## Evaluación y Decisión de Créditos

### Decisiones Transparentes y Justas

El proceso de evaluación creditic