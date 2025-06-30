---
title: "Modelo Entidad-Relación"
section: "base de datos"
order: 1
level: 1
---

# Modelo Entidad-Relación

El modelo entidad-relación representa la estructura lógica de cómo se organiza y conecta la información dentro del sistema de gestión de préstamos. Para comprenderlo mejor, imagine un mapa que muestra no solo las ubicaciones importantes, sino también todos los caminos y conexiones entre ellas. Este modelo es precisamente eso: un mapa detallado de la información y sus interrelaciones.

## Concepto Fundamental

En términos simples, una entidad representa un concepto o "cosa" importante para el negocio, como un cliente, un préstamo o un documento. Las relaciones, por otro lado, describen cómo estas entidades se conectan entre sí. Por ejemplo, un cliente "solicita" un préstamo, o un préstamo "requiere" ciertos documentos. Estas conexiones no son arbitrarias, sino que reflejan las reglas y procesos reales del negocio financiero.

Para el personal técnico, el modelo implementa un esquema relacional que garantiza la integridad referencial através de claves foráneas y restricciones bien definidas. Cada entidad se mapea a una colección en MongoDB, manteniendo la flexibilidad del modelo de documentos mientras preserva la estructura relacional lógica.

## Entidades Principales del Sistema

### Usuarios (User)
La entidad Usuario constituye el punto de entrada al sistema y representa a todas las personas que interactúan con la plataforma. Cada usuario tiene una identidad única definida por su correo electrónico, información personal completa y un rol específico que determina sus capacidades dentro del sistema.

Un usuario puede ser un cliente que solicita préstamos, un empleado que procesa solicitudes, o un administrador que supervisa todo el sistema. Esta flexibilidad permite que el mismo sistema maneje diferentes tipos de usuarios con diferentes niveles de acceso y funcionalidades. La información personal incluye datos de contacto múltiples, dirección de residencia, y detalles demográficos que son esenciales para la evaluación crediticia.

El sistema mantiene un registro completo de cada usuario, incluyendo cuándo se registró, cuándo fue su última actualización, y si actualmente tiene restricciones de acceso. Esta trazabilidad es fundamental para auditorías y para mantener la seguridad del sistema.

### Solicitudes de Préstamo (LoanApplication)
Esta entidad representa el corazón del sistema de negocio. Cada solicitud de préstamo es un registro completo que documenta todo el proceso desde la solicitud inicial hasta el desembolso final. La solicitud incluye no solo el monto solicitado, sino también información contextual como la razón del préstamo, datos adicionales del solicitante, y el estado actual del proceso.

Una caratterística importante es la capacidad de manejar modificaciones durante el proceso de evaluación. Si el monto original debe ajustarse, el sistema registra tanto el nuevo monto como la razón del cambio, manteniendo así un historial completo de todas las decisiones tomadas. Similarly, si una solicitud es rechazada, se documenta específicamente la razón del rechazo.

La solicitud también incluye referencias a todos los documentos de respaldo necesarios, datos bancarios para el desembolso, y confirmación de que el cliente ha aceptado los términos y condiciones. Esta información integral permite que el sistema maneje todo el ciclo de vida del préstamo de manera automatizada y trazable.

### Documentos (Document)
Los documentos representan todos los archivos que los usuarios suben al sistema como parte de sus solicitudes o para verificar su identidad. Cada documento tiene un tipo específico, como cédula de identidad, certificado laboral, o comprobante de ingresos, y está asociado con un usuario particular.

El sistema mantiene referencias seguras a cada documento, incluyendo su ubicación en el almacenamiento en la nube y un identificador único que permite recuperarlo cuando sea necesario. Esta aproximación garantiza que los documentos estén seguros y accesibles, pero también permite una gestión eficiente del espacio de almacenamiento.

### Respaldos (Backup)
Esta entidad documenta todos los respaldos automáticos del sistema, creando un registro detallado de cuándo se realizaron, qué incluyeron, y dónde se almacenaron. Cada respaldo incluye una verificación de integridad que confirma que los datos se copiaron correctamente y pueden ser restaurados si es necesario.

La información de respaldos no solo es importante para la recuperación en caso de desastres, sino también para auditorías y para demostrar que la organización mantiene prácticas adecuadas de protección de datos.

### Documentos Generados (GeneratedDocuments)
El sistema no solo almacena documentos subidos por los usuarios, sino que también genera automáticamente documentos legales como contratos de préstamo, pagarés, y autorizaciones. Esta entidad rastrea todos estos documentos generados, vinculándolos con las solicitudes de préstamo correspondientes y manteniendo referencias para acceso futuro.

### Eventos de Solicitud (EventLoanApplication)
Esta entidad registra cada evento significativo que ocurre durante el procesamiento de una solicitud de préstamo. Desde la recepción inicial hasta la aprobación o rechazo, cada paso queda documentado con marca de tiempo y detalles específicos.

Esta información es valiosa para varios propósitos: permite a los clientes rastrear el progreso de sus solicitudes, ayuda a los empleados a entender el historial de cada caso, y proporciona datos para análisis de procesos y mejora continua.

### Restablecimiento de Contraseñas (PasswordReset)
La gestión segura de contraseñas requiere un mecanismo robusto para permitir que los usuarios restablezcan sus credenciales de acceso. Esta entidad maneja solicitudes de restablecimiento de contraseña de manera segura, generando tokens únicos con tiempo de expiración y registrando cuando son utilizados.

## Relaciones y Conexiones

Las relaciones entre entidades reflejan los procesos reales del negocio. Un usuario puede tener múltiples solicitudes de préstamo a lo largo del tiempo, y cada solicitud puede tener múltiples documentos asociados. Estas relaciones uno-a-muchos permiten flexibilidad mientras mantienen la organización lógica.

Las relaciones también incluyen restricciones que garantizan la integridad de los datos. Por ejemplo, no puede existir una solicitud de préstamo sin un usuario asociado, y no puede haber un documento sin una referencia válida a su propietario. Estas restricciones previenen inconsistencias y errores en los datos.

## Optimización y Rendimiento

El modelo incluye índices estratégicamente ubicados para optimizar las consultas más frecuentes. Los índices en campos como el identificador de usuario, fechas de creación, y estados de solicitud permiten que el sistema responda rápidamente a las consultas más comunes, incluso cuando la base de datos contiene miles o millones de registros.

Para operaciones complejas que involucran múltiples entidades, el modelo está diseñado para minimizar el número de consultas necesarias, utilizando técnicas como la carga de datos relacionados en una sola operación cuando es apropiado.

## Diagrama del Modelo Entidad-Relación

El siguiente diagrama ilustra visualmente la estructura completa del modelo de datos, mostrando todas las entidades, sus atributos principales y las relaciones entre ellas:

![Diagrama Modelo Entidad-Relación](https://res.cloudinary.com/dvquomppa/image/upload/v1751244017/documentacion%20ilustraciones/Editor___Mermaid_Chart-2025-06-30-003839_nnoeuu.png)

Este diagrama proporciona una vista completa y profesional de cómo las diferentes entidades se relacionan entre sí, facilitando tanto la comprensión del modelo para nuevos desarrolladores como la planificación de consultas y operaciones complejas.

### Descripción de Relaciones Clave

**Relaciones principales del modelo:**
- **User → LoanApplication** (1:N): Un usuario puede tener múltiples solicitudes de préstamo a lo largo del tiempo
- **User → Document** (1:N): Un usuario puede subir múltiples documentos para verificación y respaldo
- **User → PasswordReset** (1:N): Un usuario puede solicitar múltiples restablecimientos de contraseña por seguridad
- **User → PreLoanApplication** (1:N): Un usuario puede tener múltiples pre-solicitudes antes de formalizar
- **User → EventUserUX** (1:N): Un usuario puede generar múltiples eventos de experiencia durante su interacción
- **LoanApplication → GeneratedDocuments** (1:N): Una solicitud puede generar múltiples documentos automáticos como contratos y pagarés
- **LoanApplication → EventLoanApplication** (1:N): Una solicitud puede tener múltiples eventos registrados durante su procesamiento

**Entidades de soporte:**
- **Backup**: Mantiene el historial de respaldos del sistema de forma independiente, garantizando la recuperación de datos

## Conclusión

Este diseño del modelo entidad-relación proporciona una base sólida para todas las operaciones del sistema, garantizando que la información esté organizada lógicamente, sea fácil de consultar y mantener, y cumpla con todos los requisitos de seguridad y auditoría necesarios para un sistema financiero.