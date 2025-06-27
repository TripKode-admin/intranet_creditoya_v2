---
title: "Stack Tecnológico"
section: "arquitectura"
order: 2
level: 1
---

# Stack Tecnológico
El backend representa la columna vertebral de nuestro sistema de gestión de préstamos, diseñado meticulosamente para garantizar que la plataforma pueda crecer junto con las necesidades del negocio, mantener la información segura y procesar solicitudes de manera eficiente. Cada componente ha sido seleccionado estratégicamente para trabajar en armonía con los demás, creando un ecosistema tecnológico robusto y confiable.

## El Cerebro del Sistema: NestJS con TypeScript
En el corazón de nuestra aplicación se encuentra NestJS, un marco de trabajo moderno que actúa como el director de orquesta de todo el sistema. Piense en NestJS como el cerebro que coordina todas las operaciones, desde recibir una solicitud de préstamo hasta procesar documentos y generar respuestas. Lo que hace especial a NestJS es su uso de TypeScript, un lenguaje que añade una capa de seguridad adicional al código al verificar que todos los datos fluyan correctamente entre los diferentes componentes del sistema.

La arquitectura modular de NestJS funciona como los departamentos de una empresa bien organizada. Cada módulo se especializa en una función específica: existe un módulo dedicado exclusivamente a la autenticación de usuarios, otro para el manejo de préstamos, y otro para la gestión de documentos. Esta separación permite que el equipo de desarrollo pueda trabajar en diferentes aspectos del sistema sin interferir entre sí, y si surge un problema en una área, puede ser aislado y resuelto sin afectar el funcionamiento de las demás partes.

El sistema de inyección de dependencias que implementa NestJS actúa como un mayordomo inteligente que se encarga de que cada parte del sistema tenga acceso a los recursos que necesita, cuando los necesita. Esto significa que si el módulo de préstamos requiere acceso a la base de datos, el sistema automáticamente le proporciona esa conexión sin que los desarrolladores tengan que configurar manualmente cada interacción.
Los decoradores y metadatos funcionan como etiquetas inteligentes que le dicen al sistema cómo debe comportarse cada parte del código. Cuando un desarrollador marca una función con @Controller(), el sistema entiende que esa función debe manejar solicitudes web. Cuando se usa @Post(), el sistema sabe que debe procesar información enviada por formularios. Esta aproximación declarativa hace que el código sea más legible y mantenible.

## El Traductor Universal: Prisma ORM
Prisma actúa como un traductor universal entre nuestro sistema y la base de datos. Imagine que necesita comunicarse con alguien que habla un idioma completamente diferente; Prisma es ese intérprete experto que toma sus instrucciones en un lenguaje que entiende y las convierte al idioma que comprende la base de datos.

El esquema centralizado de Prisma funciona como un plano arquitectónico que define exactamente cómo debe estructurarse la información en el sistema. Este archivo maestro describe todos los tipos de datos que maneja la aplicación: desde la información básica de los usuarios hasta los detalles complejos de las solicitudes de préstamo. Por ejemplo, cuando definimos un modelo de Usuario, especificamos que debe tener un identificador único, un email que no se repita en el sistema, una contraseña segura, un rol específico, y la capacidad de asociarse con múltiples documentos.

Las migraciones de Prisma funcionan como un sistema de control de versiones para la base de datos. Cada vez que se necesita modificar la estructura de los datos, Prisma genera instrucciones precisas para realizar estos cambios de manera segura, asegurando que la información existente no se pierda y que todos los cambios se apliquen de manera consistente.

La consulta segura que proporciona Prisma es comparable a tener un guardián que verifica cada solicitud antes de permitir el acceso a la información. Esto previene ataques maliciosos y garantiza que solo se pueda acceder a los datos de la manera apropiada, con métodos como findUnique() para buscar información específica o create() para generar nuevos registros.

## El Almacén de Información: MongoDB
MongoDB sirve como el gran almacén de información del sistema, pero a diferencia de los archivadores tradicionales con cajones rígidos, MongoDB funciona como un sistema de almacenamiento flexible que puede adaptarse a diferentes tipos de información. Esta flexibilidad es crucial en un sistema de préstamos donde cada solicitud puede requerir diferentes tipos de documentos y información adicional que varía según el tipo de préstamo o las circunstancias específicas del solicitante.

La capacidad de escalabilidad de MongoDB es como tener un almacén que puede expandirse automáticamente cuando se necesita más espacio. A medida que el volumen de solicitudes de préstamo crece, MongoDB puede distribuir la información a través de múltiples servidores, asegurando que el sistema mantenga su velocidad de respuesta sin importar cuántos usuarios estén accediendo simultáneamente.

La indexación inteligente de MongoDB funciona como un sistema de catálogo muy sofisticado que permite encontrar información específica rápidamente. Cuando un empleado busca todas las solicitudes de préstamo de un cliente particular, el índice dirige la búsqueda directamente a la información relevante sin tener que revisar todos los registros del sistema.

## Los Guardianes de Archivos: Google Cloud Storage y Cloudinary
El sistema utiliza dos servicios especializados en la nube para manejar todos los documentos y archivos, cada uno optimizado para diferentes propósitos, como tener dos tipos de cajas fuertes con diferentes características de seguridad.

Google Cloud Storage actúa como la bóveda principal donde se almacenan los documentos más críticos y los respaldos del sistema. Este servicio garantiza que la información esté protegida con múltiples copias distribuidas geográficamente, asegurando que incluso en caso de desastres naturales o fallas técnicas, los datos permanezcan seguros y accesibles. Los respaldos mensuales de la base de datos se comprimen y almacenan aquí, funcionando como una póliza de seguro que garantiza la recuperación completa del sistema en caso de emergencias.

Cloudinary, por otro lado, se especializa en el manejo de imágenes y documentos multimedia. Cuando un cliente sube una foto de su cédula o una selfie, Cloudinary no solo almacena estos documentos de manera segura, sino que también puede procesarlos automáticamente: generar versiones en miniatura para visualización rápida, optimizar el tamaño para mejorar la velocidad de carga, o aplicar transformaciones específicas según las necesidades del sistema.

Las URLs firmadas que genera Cloudinary funcionan como pases temporales de acceso que permiten a usuarios autorizados ver documentos específicos durante un tiempo limitado, después del cual el enlace expira automáticamente, proporcionando una capa adicional de seguridad.

## El Sistema de Seguridad: Autenticación JWT
La seguridad del sistema se basa en JSON Web Tokens (JWT), que funcionan como credenciales digitales sofisticadas. Imagine estos tokens como tarjetas de identificación especiales que no solo confirman quién es la persona, sino que también especifican exactamente qué puede hacer en el sistema y durante cuánto tiempo es válido su acceso.

El sistema implementa diferentes estrategias de autenticación adaptadas a distintos tipos de usuarios. La estrategia local verifica las credenciales tradicionales de email y contraseña, mientras que la estrategia JWT valida los tokens en cada solicitud. Esta doble verificación asegura que solo usuarios legítimos puedan acceder al sistema y que mantengan los permisos apropiados durante toda su sesión.

El hashing de contraseñas mediante bcryptjs es comparable a tener un sistema de encriptación militar que transforma las contraseñas en códigos únicos que son virtualmente imposibles de descifrar, incluso si alguien obtuviera acceso no autorizado a la base de datos.

Los refresh tokens funcionan como un sistema de renovación automática que permite a los usuarios mantener su sesión activa sin tener que introducir repetidamente sus credenciales, mejorando la experiencia de usuario mientras mantiene altos estándares de seguridad.

## Control de Acceso Inteligente
El sistema de control de roles actúa como un portero inteligente que conoce exactamente qué puede hacer cada persona en el sistema. Los guardias personalizados verifican automáticamente los permisos en cada solicitud, asegurando que un cliente solo pueda ver sus propios préstamos, mientras que un empleado puede acceder a la información necesaria para procesar solicitudes, y un administrador tiene acceso completo para gestionar el sistema.

Los decoradores de roles simplifican la gestión de permisos al nivel más granular, permitiendo que cada función específica del sistema tenga controles de acceso apropiados sin complejidad adicional para los desarrolladores.

## Integración y Flujo de Trabajo Cohesivo
Todos estos componentes trabajan juntos en un flujo perfectamente coordinado. Cuando un cliente envía una solicitud de préstamo, el sistema JWT verifica su identidad y permisos, Prisma interactúa con MongoDB para almacenar o recuperar la información necesaria, mientras que Cloudinary y Google Cloud Storage se encargan de todos los documentos asociados. Cada acción queda registrada en el sistema de auditoría, creando un rastro completo que garantiza la trazabilidad y el cumplimiento de las regulaciones financieras.

Esta arquitectura integrada asegura que el sistema no solo funcione de manera eficiente en el presente, sino que esté preparado para adaptarse a futuras necesidades, ya sea expandiendo funcionalidades, migrando a nuevas tecnologías, o escalando para manejar un mayor volumen de operaciones. La robustez, escalabilidad y seguridad están integradas en cada nivel del sistema, proporcionando una base sólida para el crecimiento sostenible del negocio.