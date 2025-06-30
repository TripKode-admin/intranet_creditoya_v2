---
title: "Autenticación y Usuarios"
section: "modulos"
order: 1
level: 1
---

# Autenticación y Gestión de Usuarios

## Introducción

La autenticación y gestión de usuarios es el sistema que permite a las personas crear cuentas, iniciar sesión de forma segura y gestionar su información personal en nuestra plataforma. Este proceso está diseñado tanto para garantizar la seguridad de los datos como para ofrecer una experiencia fluida a los usuarios.

En términos simples, es como el sistema de seguridad de un edificio: cada persona necesita una tarjeta de acceso única (su cuenta), debe identificarse correctamente (login) y solo puede acceder a las áreas para las que tiene permisos. La diferencia es que todo esto ocurre de forma digital y automática.

## Registro de Nuevos Usuarios

### El Proceso desde la Perspectiva del Usuario

Cuando una persona decide registrarse en nuestra plataforma, el proceso es intuitivo y seguro. Primero, completa un formulario con su información personal básica: nombres, apellidos, correo electrónico, número de documento, dirección y teléfono. También debe crear una contraseña que cumpla ciertos requisitos de seguridad para proteger su cuenta.

Una vez enviada esta información, el sistema trabaja en segundo plano para verificar que todos los datos sean correctos y que el correo electrónico no esté ya registrado por otra persona. Es similar a cuando solicitas una cuenta bancaria: el banco verifica tu identidad y se asegura de que no tengas ya una cuenta con los mismos datos.

Después de esta verificación inicial, el usuario recibe un correo electrónico con un enlace especial. Al hacer clic en este enlace, confirma que es el verdadero propietario del correo electrónico y activa completamente su cuenta. Este paso adicional de verificación es crucial para evitar que alguien use un correo que no le pertenece.

### Aspectos Técnicos del Registro

Desde el punto de vista técnico, el proceso de registro implementa múltiples capas de seguridad y validación. El sistema utiliza el modelo de datos `User` en la base de datos MongoDB, gestionado a través de Prisma ORM, que incluye campos como `email` (con restricción única), `password` (encriptada), información personal y campos de control como `isActive` e `isBan`.

La validación de unicidad del correo se realiza mediante consultas optimizadas en la colección User. La contraseña se procesa usando bcrypt con un factor de costo configurado para generar hashes seguros, garantizando que incluso si la base de datos fuera comprometida, las contraseñas originales permanecerían protegidas.

El token de verificación por correo es un JWT temporal con payload específico que incluye el ID del usuario, email y tipo de usuario. Este token se integra con el servicio Resend para el envío de correos, proporcionando un enlace único con parámetros de verificación que, al ser procesado, actualiza el campo `isActive` a verdadero mediante una transacción atómica en la base de datos.

## Inicio de Sesión (Login)

### Experiencia del Usuario

El proceso de login está diseñado para ser rápido y seguro. El usuario simplemente ingresa su correo electrónico y contraseña en el formulario de acceso. Si las credenciales son correctas y la cuenta está activa, accede inmediatamente a su panel personal o dashboard.

Durante este proceso, el sistema verifica no solo que la combinación de correo y contraseña sea correcta, sino también que la cuenta no esté bloqueada o suspendida. Es como presentar tu cédula en una oficina: no basta con que el documento sea tuyo, también debe estar vigente y no estar reportado.

Una vez autenticado, el usuario mantiene su sesión activa durante 24 horas sin necesidad de volver a ingresar sus credenciales. Esto significa que puede cerrar y abrir el navegador, o incluso apagar su computador, y al regresar seguirá conectado, siempre que no hayan pasado 24 horas o no haya cerrado sesión manualmente.

### Implementación Técnica del Login

El sistema de autenticación utiliza Passport.js con estrategia local personalizada (`LocalClientAuthGuard`) que procesa las credenciales en el endpoint `POST /auth/login/client`. La validación incluye comparación del hash de contraseña usando bcrypt y verificación del estado de la cuenta a través de los campos `isActive` e `isBan`.

Tras la autenticación exitosa, se genera un JWT con duración de 24 horas, firmado con una clave secreta almacenada en variables de entorno. El payload del token incluye identificadores únicos (`sub`), email y tipo de usuario (`client`). Este token se almacena en una cookie HTTP-only con configuraciones de seguridad: `secure: true` para HTTPS, `maxAge` de 86400000 milisegundos y `path: "/"` para accesibilidad global.

La implementación de cookies HTTP-only previene ataques XSS al mantener el token inaccesible desde JavaScript del lado del cliente, mientras que las configuraciones de seguridad garantizan transmisión segura en producción.

## Recuperación de Contraseña

### Proceso para el Usuario

Cuando un usuario olvida su contraseña, puede recuperar el acceso a su cuenta de manera segura. El proceso comienza cuando ingresa su correo electrónico en la página de "Olvidé mi contraseña". Si el correo está registrado en el sistema, recibe un mensaje de confirmación indicando que se ha enviado un enlace de recuperación a su correo.

Este enlace tiene una validez limitada de una hora por razones de seguridad. Cuando el usuario hace clic en el enlace dentro de este tiempo límite, es dirigido a una página donde puede establecer una nueva contraseña. Una vez que confirma la nueva contraseña, puede usarla inmediatamente para acceder a su cuenta.

El sistema también envía un correo de confirmación una vez que la contraseña ha sido cambiada exitosamente, lo que permite al usuario saber que el proceso se completó y también sirve como alerta en caso de que alguien más haya intentado cambiar su contraseña sin autorización.

### Arquitectura Técnica de Recuperación

La funcionalidad de recuperación utiliza la colección `PasswordReset` que almacena tokens únicos (UUID) vinculados al usuario específico. Cada registro incluye `userId`, `token` único, `expiresAt` con timestamp de expiración y relación con el modelo User. El endpoint `POST /auth/forgot-password` valida la existencia del email y genera el token con expiración de una hora.

El token UUID se integra en un enlace personalizado enviado mediante Resend, proporcionando un mecanismo de recuperación seguro que no expone información sensible en la URL. La validación del token incluye verificación de existencia en la base de datos y comparación de timestamp para asegurar que no haya expirado.

Durante el restablecimiento, la nueva contraseña se procesa con el mismo algoritmo bcrypt utilizado en el registro, y el registro en `PasswordReset` se elimina para prevenir reutilización. Esta implementación garantiza que cada enlace de recuperación sea de un solo uso y tenga una ventana temporal limitada.

## Gestión de Sesiones y Seguridad

### Control de Acceso para Usuarios

El sistema implementa diferentes niveles de acceso según el tipo de usuario. Los clientes regulares pueden acceder únicamente a sus propios documentos, información de préstamos y configuración de perfil. No pueden ver información de otros usuarios ni acceder a funciones administrativas.

Los empleados tienen acceso a herramientas internas para gestionar préstamos, generar contratos y procesar documentos de clientes. Los administradores, por su parte, tienen acceso completo al sistema, incluyendo la gestión de usuarios, generación de estadísticas y configuración del sistema.

Este control de acceso funciona automáticamente: cuando un usuario inicia sesión, el sistema identifica su rol y solo muestra las opciones y páginas para las que tiene permisos. Es como tener diferentes tipos de llaves que abren diferentes puertas en un edificio.

### Implementación de Seguridad y Roles

La gestión de sesiones se basa en tokens JWT con estructura de payload que incluye `sub` (ID único), `email` y `type` de usuario. El sistema implementa guardias de autenticación específicos: `ClientAuthGuard` para usuarios regulares y `IntranetAuthGuard` para empleados y administradores, cada uno validando el tipo de token correspondiente.

Los roles se definen jerárquicamente con `admin` teniendo acceso total, `employee` limitado a funcionalidades internas, y `client` restringido a recursos propios. Esta estructura se implementa mediante decoradores de roles y middleware que interceptan solicitudes para verificar permisos antes de procesar la lógica de negocio.

El logout se maneja mediante el endpoint `POST /auth/logout/client` que invalida la cookie estableciendo `maxAge: 0`, forzando reautenticación en solicitudes subsecuentes. El sistema no mantiene blacklist de tokens activos, confiando en la expiración natural para mantener la arquitectura sin estado.

## Medidas de Seguridad Adicionales

### Protección del Usuario

El sistema incluye múltiples capas de protección para salvaguardar las cuentas de usuario. Se implementa protección contra intentos de acceso malintencionados limitando el número de intentos de login desde una misma dirección IP. Si alguien intenta acceder repetidamente con credenciales incorrectas, el sistema temporalmente bloquea esos intentos.

Las cuentas pueden ser suspendidas automáticamente si se detecta actividad sospechosa, y todos los eventos importantes (como cambios de contraseña o intentos de acceso fallidos) se registran para auditoría futura. Esta información ayuda a identificar patrones de ataque y mejora continuamente la seguridad del sistema.

Además, toda la comunicación entre el navegador del usuario y el servidor se realiza a través de conexiones cifradas (HTTPS), asegurando que la información personal y las contraseñas no puedan ser interceptadas durante la transmisión.

### Arquitectura de Seguridad Técnica

La seguridad se implementa mediante múltiples vectores de protección. El rate limiting se configura a nivel de aplicación para prevenir ataques de fuerza bruta, mientras que la protección CSRF utiliza tokens en combinación con cookies HTTP-only. Los eventos de usuario se registran en la colección `EventUserUX` para auditoría y análisis de patrones.

La base de datos implementa índices optimizados en campos críticos como `email`, `status` e `isDisbursed` para rendimiento y prevención de inconsistencias. Las validaciones de modelo utilizan restricciones Prisma como `@unique` y `@default` para mantener integridad referencial.

El sistema de logging incluye registro detallado de errores, flujos de autenticación y datos de debug configurables mediante variables de entorno. Esta telemetría permite monitoreo proactivo y diagnóstico rápido de issues de seguridad o rendimiento.

## Tecnologías y Herramientas Utilizadas

### Componentes del Sistema

El sistema de autenticación se construye sobre un conjunto robusto de tecnologías especializadas. Para la gestión de usuarios y datos se utiliza MongoDB como base de datos NoSQL, accedida a través de Prisma ORM que proporciona una capa de abstracción type-safe y herramientas de migración.

La autenticación se implementa con JWT (JSON Web Tokens) para mantener sesiones sin estado, procesados mediante las librerías `@nestjs/jwt` y `passport-jwt`. La encriptación de contraseñas utiliza bcrypt, específicamente la implementación `bcryptjs` para compatibilidad multi-plataforma.

Para servicios externos, el sistema integra Resend para envío de correos electrónicos de verificación y recuperación, Cloudinary para gestión de imágenes y documentos de usuario, y Google Cloud Storage para almacenamiento seguro de archivos con diferentes niveles de acceso.

La arquitectura modular utiliza NestJS como framework base, proporcionando inyección de dependencias, decoradores de autenticación y estructura escalable que facilita mantenimiento y testing.

## Conclusión

Este sistema de autenticación y gestión de usuarios representa un equilibrio cuidadoso entre seguridad robusta y experiencia de usuario fluida. Desde la perspectiva del usuario final, los procesos son intuitivos y confiables, mientras que la implementación técnica incorpora las mejores prácticas de la industria para protección de datos y escalabilidad.

La arquitectura modular y el uso de tecnologías establecidas aseguran que el sistema pueda evolucionar con las necesidades del negocio y los estándares de seguridad en constante cambio. La combinación de validaciones múltiples, encriptación robusta y auditoría comprehensiva proporciona una base sólida para el crecimiento futuro de la plataforma.