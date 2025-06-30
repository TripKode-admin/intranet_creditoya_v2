---
title: "Almacenamiento"
section: "modulos"
order: 4
level: 1
---

# Almacenamiento y Gestión de Documentos

## Introducción

El sistema de almacenamiento constituye la columna vertebral tecnológica que protege y organiza toda la documentación digital de nuestra plataforma. Para los usuarios, representa un proceso transparente donde pueden cargar documentos con confianza, sabiendo que estarán seguros y accesibles cuando los necesiten. Técnicamente, es un ecosistema sofisticado que combina validación rigurosa, procesamiento inteligente, almacenamiento seguro y acceso controlado.

Este módulo no es simplemente un depósito de archivos, sino un sistema inteligente que analiza, optimiza y protege cada documento que ingresa. Funciona como un bibliotecario digital experto que no solo guarda documentos, sino que también los organiza, los protege contra acceso no autorizado, y los mantiene en condiciones óptimas para su recuperación futura.

## Carga Segura de Documentos

### La Experiencia del Usuario

Cuando un usuario necesita cargar un documento, ya sea un volante de pago, una carta laboral, o una fotografía personal, el proceso está diseñado para ser simple pero seguro. El sistema guía al usuario sobre qué tipos de archivos son aceptables y cuáles son los límites de tamaño, evitando frustraciones por intentar cargar archivos incompatibles.

Durante la carga, el usuario recibe feedback en tiempo real sobre el progreso de la subida. Si hay algún problema con el archivo, como un formato incorrecto o un tamaño excesivo, el sistema proporciona mensajes claros explicando el problema y sugiriendo cómo corregirlo. No se trata de rechazar documentos arbitrariamente, sino de asegurar que la información llegue en la mejor calidad posible.

Una vez completada la carga, el usuario recibe confirmación inmediata de que su documento está seguro y disponible. Puede acceder a sus documentos en cualquier momento a través de su portal personal, donde están organizados por categorías y fechas para facilitar su localización.

### Arquitectura Técnica de Carga

La implementación utiliza `FileInterceptor` de NestJS con configuraciones avanzadas de Multer para manejo de archivos multipart. El sistema define filtros personalizados que validan tipos MIME específicos: `application/pdf` para documentos y `image/jpeg`, `image/jpg`, `image/png` para imágenes, con límites de tamaño de 10MB para PDFs y 5MB para imágenes.

La validación implementa múltiples capas de seguridad: verificación de tipo MIME, análisis de headers de archivo para detectar inconsistencias, validación de tamaño tanto a nivel de Multer como de aplicación, y verificación de integridad mediante checksums. Los filtros personalizados lanzan excepciones `HttpException` con códigos de estado específicos cuando se detectan violaciones.

El control de acceso utiliza guardias de autenticación que verifican tokens JWT y aseguran que los usuarios solo puedan cargar documentos a sus propias cuentas. Se implementa verificación de propiedad de recursos mediante consultas a la base de datos que validan la relación entre el usuario autenticado y el recurso objetivo, lanzando `ForbiddenException` en caso de intentos de acceso no autorizado.

El proceso de almacenamiento utiliza patrones de almacenamiento temporal en memoria con `Express.Multer.File`, seguido de transferencia asíncrona a servicios cloud. Cada archivo recibe un identificador único (UUID) que se incorpora al nombre del archivo para garantizar unicidad y facilitar trazabilidad. El sistema implementa reintentos automáticos con backoff exponencial para manejar fallos temporales de red o servicios externos.

## Procesamiento Inteligente de Imágenes

### Optimización Automática para el Usuario

El procesamiento de imágenes ocurre completamente en segundo plano, pero sus beneficios son inmediatamente visibles para el usuario. Cuando alguien carga una fotografía, ya sea un selfie para verificación de identidad o una imagen de documento, el sistema automáticamente la optimiza para asegurar la mejor calidad posible en el menor tamaño de archivo.

Esta optimización significa que las imágenes se cargan más rápido, ocupan menos espacio de almacenamiento, y se visualizan con mayor claridad en diferentes dispositivos. El usuario no necesita preocuparse por el tamaño o formato de sus fotografías; el sistema se encarga de hacer todos los ajustes necesarios mientras preserva la información importante.

Para el usuario, esto se traduce en una experiencia más fluida donde las imágenes aparecen nítidas y se cargan rápidamente, sin importar si las tomó con un teléfono de alta gama o un dispositivo más básico. El sistema nivela el campo de juego tecnológico para todos los usuarios.

### Motor de Procesamiento con Sharp

La implementación de procesamiento utiliza la librería Sharp, reconocida por su rendimiento y calidad en manipulación de imágenes. El proceso incluye redimensionamiento inteligente que mantiene proporciones originales mientras optimiza dimensiones: ancho máximo de 800px con `fit: 'inside'` y `withoutEnlargement: true` para evitar degradación de imágenes pequeñas.

La compresión se ajusta dinámicamente según el tipo de imagen: JPEG con calidad del 95% para mantener detalles fotográficos importantes, y PNG con calidad del 100% para preservar transparencias y elementos gráficos. El algoritmo de compresión analiza el contenido de la imagen para aplicar la estrategia de optimización más efectiva.

El procesamiento incluye conversión de formatos para estandarización, normalización de metadatos para eliminar información sensible (como geolocalización), y conversión a base64 cuando es necesario para integración con APIs. Todo el procesamiento ocurre en memoria utilizando buffers eficientes que minimizan el uso de recursos del servidor.

El manejo de errores implementa validación de integridad de archivos, detección de imágenes corruptas o vacías, y logging detallado para análisis de issues. Se lanzan excepciones `BadRequestException` con mensajes específicos cuando se detectan problemas, permitiendo al usuario tomar acciones correctivas.

## Almacenamiento Distribuido y Seguro

### Acceso Confiable para el Usuario

Desde la perspectiva del usuario, sus documentos están siempre disponibles cuando los necesita, independientemente de dónde se encuentre o qué dispositivo esté usando. El sistema mantiene múltiples copias de cada archivo en diferentes ubicaciones geográficas, asegurando que incluso si ocurre un problema técnico en un centro de datos, los documentos permanezcan accesibles.

La seguridad es completamente transparente para el usuario, pero absolutamente crítica en el diseño del sistema. Los documentos están protegidos tanto durante la transmisión como en el almacenamiento, utilizando los mismos estándares de seguridad empleados por instituciones bancarias y gubernamentales.

Cuando un usuario solicita acceder a un documento, el sistema genera automáticamente un enlace seguro y temporal que le permite ver o descargar el archivo. Este enlace expira después de un tiempo determinado por razones de seguridad, pero el usuario puede solicitar un nuevo enlace en cualquier momento.

### Infraestructura de Almacenamiento Cloud

La arquitectura utiliza una estrategia híbrida de almacenamiento que optimiza costos y rendimiento: Google Cloud Storage para documentos críticos como contratos y reportes (carpetas `reports-images`, `docs`), y Cloudinary para contenido visual como avatares e imágenes (carpetas `avatars_users`, `images_with_cc`).

Google Cloud Storage proporciona durabilidad del 99.999999999% (11 9's) con redundancia multi-regional, cifrado automático en reposo con claves gestionadas por Google o proporcionadas por el cliente, y versionado de objetos para recuperación de versiones anteriores. La configuración incluye políticas de lifecycle para gestión automática de costos mediante transición a clases de almacenamiento más económicas según patrones de acceso.

Cloudinary se especializa en optimización y entrega de contenido visual, proporcionando CDN global para acceso rápido desde cualquier ubicación, transformaciones de imagen on-the-fly para diferentes tamaños y formatos, y optimización automática basada en el dispositivo y navegador del usuario.

La distribución de archivos entre servicios se basa en patrones de uso y requisitos de seguridad: documentos legales y financieros utilizan Google Cloud Storage por sus capacidades de auditoría y compliance, mientras que contenido visual utiliza Cloudinary por su optimización de entrega y transformaciones dinámicas.

## URLs Firmadas y Acceso Controlado

### Seguridad Invisible para el Usuario

El sistema de acceso a documentos está diseñado para que el usuario nunca se preocupe por la seguridad, pero siempre esté protegido. Cuando solicita ver un documento, recibe inmediatamente un enlace que funciona de manera similar a un pase temporal para entrar a un edificio: válido por un tiempo específico y solo para esa persona.

Esta aproximación significa que los documentos nunca están expuestos públicamente en internet. Incluso si alguien interceptara un enlace, tendría una ventana muy limitada para usarlo, y solo funcionaría para la persona autorizada. Una vez que el enlace expira, se vuelve completamente inútil, requiriendo una nueva autorización para acceder al documento.

Para el usuario cotidiano, esto se traduce en acceso inmediato a sus documentos sin compromometer la seguridad. Puede compartir enlaces de documentos con personas autorizadas (como asesores financieros) con la confianza de que estos enlaces no funcionarán indefinidamente.

### Implementación de URLs Firmadas

El sistema utiliza la API v4 de Google Cloud Storage para generar URLs firmadas con autenticación HMAC-SHA256. Cada URL incluye parámetros específicos: timestamp de expiración (60 minutos por defecto, configurable), acción permitida (típicamente `read`), y firma criptográfica que valida la autenticidad de la solicitud.

La generación de URLs implementa el patrón:

```typescript
const [url] = await storage.bucket(bucketName).file(fileName).getSignedUrl({
  version: 'v4',
  action: 'read',
  expires: Date.now() + (60 * 60 * 1000),
  conditions: [['content-length-range', 0, maxFileSize]]
});
```

Las URLs incluyen validación de condiciones adicionales como rangos de tamaño de contenido y headers requeridos. El sistema no almacena URLs generadas, requiriendo generación on-demand para cada solicitud de acceso, lo que elimina riesgos de exposición de URLs persistentes.

La autorización para generar URLs se basa en verificación de tokens JWT que incluyen identificación del usuario y permisos específicos. Se implementa verificación de propiedad de recursos mediante consultas que validan la relación entre el usuario solicitante y el documento objetivo, asegurando que solo usuarios autorizados puedan generar URLs de acceso.

## Auditoría y Cumplimiento Normativo

### Transparencia Total para el Usuario

El sistema mantiene un registro completo de todas las interacciones con documentos, lo que proporciona al usuario transparencia total sobre quién ha accedido a su información y cuándo. Los usuarios pueden solicitar reportes de actividad que muestran cada vez que sus documentos fueron visualizados, descargados, o modificados.

Esta auditoría también protege al usuario en caso de disputas legales o necesidades de verificación. Cada acción queda registrada con timestamp preciso, identificación del usuario que realizó la acción, y contexto de la operación. Esta información puede ser crucial para procesos legales o auditorías regulatorias.

El sistema también asegura cumplimiento con regulaciones de protección de datos, permitiendo a los usuarios ejercer sus derechos de acceso, rectificación, y eliminación de información personal según lo establecido por leyes como GDPR o normativas locales.

### Sistema de Auditoría y Compliance

La auditoría se implementa mediante eventos granulares registrados en colecciones especializadas que capturan: timestamp con precisión de milisegundos, identificación del usuario (UUID y email), tipo de operación (upload, access, delete, share), identificador del documento afectado, dirección IP de origen, user-agent del navegador, y contexto adicional específico de la operación.

El sistema registra eventos tanto exitosos como fallidos, incluyendo intentos de acceso no autorizado, fallos de validación, y errores de sistema. Esta información se almacena en formato inmutable utilizando técnicas de hashing que previenen alteración posterior de registros de auditoría.

El cumplimiento normativo se maneja mediante políticas configurables que se adaptan a diferentes jurisdicciones: GDPR para usuarios europeos, Ley 1581 de 2012 para Colombia, CCPA para California, y otras normativas específicas. El sistema implementa workflows automáticos para manejo de solicitudes de derechos de usuarios como acceso a información personal, rectificación de datos incorrectos, y eliminación de información personal.

Las políticas de retención se configuran según tipos de documento y requisitos legales: contratos financieros por 5-10 años según normativa bancaria, documentos de identidad por períodos específicos según regulaciones de KYC (Know Your Customer), e imágenes personales con políticas de eliminación automática una vez cumplido su propósito.

## Recuperación y Disponibilidad

### Acceso Garantizado para el Usuario

El usuario puede tener confianza absoluta en que sus documentos estarán disponibles cuando los necesite. El sistema está diseñado con múltiples niveles de redundancia que aseguran disponibilidad incluso durante mantenimientos programados o situaciones técnicas imprevistas. Los documentos se replican automáticamente en diferentes centros de datos geográficamente distribuidos.

En el caso poco probable de que un documento no esté temporalmente disponible, el sistema tiene mecanismos de recuperación automática que trabajan en segundo plano para restaurar el acceso. El usuario recibe notificaciones proactivas si hay algún problema temporal con sus documentos, junto con estimaciones de tiempo de resolución.

El sistema también mantiene versiones históricas de documentos importantes, lo que significa que si un archivo se corrompe o se modifica accidentalmente, puede recuperarse a una versión anterior. Esta funcionalidad es especialmente importante para contratos y documentos legales donde la integridad histórica es crucial.

### Arquitectura de Alta Disponibilidad

La implementación utiliza estrategias de replicación multi-región que aseguran disponibilidad del 99.95% o superior. Google Cloud Storage proporciona replicación automática entre zonas de disponibilidad con failover transparente, mientras que Cloudinary implementa CDN global con edge locations que mantienen copias locales de contenido frecuentemente accedido.

El sistema de monitoreo implementa health checks continuos que verifican disponibilidad de servicios externos, latencia de respuesta, y integridad de datos. Se configuran alertas automáticas que notifican a equipos técnicos cuando métricas exceden umbrales predefinidos, permitiendo respuesta proactiva a problemas potenciales.

La recuperación de desastres incluye backups automatizados con diferentes frecuencias según criticidad de datos: backups diarios para documentos activos, backups semanales para documentos archivados, y snapshots instantáneos antes de operaciones críticas. Los backups se almacenan en regiones geográficas diferentes para protección contra desastres naturales o fallos regionales.

Los procedimientos de recuperación incluyen testing regular de procesos de restore, validación de integridad de backups, y documentación detallada de procedimientos de emergencia. Se mantienen métricas de Recovery Time Objective (RTO) y Recovery Point Objective (RPO) que aseguran tiempos de recuperación mínimos en caso de fallos.

## Integración con Procesos de Negocio

### Flujo Seamless para el Usuario

El sistema de almacenamiento no opera en aislamiento, sino que está completamente integrado con todos los procesos de negocio de la plataforma. Cuando un usuario carga un documento como parte de una solicitud de préstamo, ese documento automáticamente se asocia con su aplicación y se hace disponible para los procesos de validación y aprobación.

Esta integración significa que el usuario no necesita realizar múltiples cargas del mismo documento para diferentes procesos. Una vez que un documento está en el sistema, puede reutilizarse para futuras solicitudes cuando sea apropiado, siempre respetando las políticas de privacidad y consentimiento del usuario.

El sistema también facilita colaboración controlada: cuando un asesor financiero necesita revisar documentos de un cliente, puede acceder a ellos directamente a través de la plataforma sin que el cliente tenga que reenviar archivos por correo electrónico o otros medios menos seguros.

### Arquitectura de Integración

La integración utiliza patrones de event-driven architecture donde la carga de documentos genera eventos que activan workflows relacionados. Por ejemplo, cuando se carga una carta laboral, se activa automáticamente el proceso de validación de empleo que puede incluir verificación con bases de datos externas o notificación a equipos de revisión.

Los documentos se asocian mediante relaciones en base de datos que mantienen trazabilidad completa: relación con usuario propietario, asociación con solicitudes específicas, vinculación con procesos de negocio activos, y referencias a versiones históricas. Esta estructura permite queries eficientes y mantenimiento de integridad referencial.

El sistema de notificaciones se integra con el almacenamiento para enviar confirmaciones automáticas de carga exitosa, alertas de documentos pendientes de revisión, y recordatorios de documentos próximos a vencer. Las notificaciones incluyen enlaces directos a documentos utilizando el sistema de URLs firmadas para acceso seguro.

## Conclusión

El sistema de almacenamiento y gestión de documentos representa mucho más que un simple repositorio de archivos. Es un ecosistema inteligente que combina seguridad de nivel empresarial, procesamiento automático avanzado, y una experiencia de usuario fluida e intuitiva.

Para el usuario final, proporciona la tranquilidad de saber que sus documentos más importantes están protegidos por tecnología de vanguardia, accesibles cuando los necesita, y procesados de manera que siempre se vean y funcionen de la mejor manera posible. Para los equipos técnicos, ofrece una arquitectura escalable, auditable y mantenible que puede evolucionar con las necesidades del negocio.

La combinación de múltiples servicios cloud especializados, procesamiento inteligente, y controles de seguridad granulares asegura que el sistema pueda manejar desde las necesidades más básicas de almacenamiento hasta los requisitos más complejos de compliance y auditoría, manteniendo siempre el enfoque en la experiencia del usuario y la integridad de los datos.