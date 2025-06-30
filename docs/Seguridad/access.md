---
title: "Control de Acceso"
section: "seguridad"
order: 3
level: 1
---
# Control de Acceso

El control de acceso determina qué puede hacer cada usuario una vez que ha sido autenticado en el sistema. Es como tener diferentes niveles de llaves para distintas áreas de un edificio: cada persona solo puede acceder a las funciones y datos que corresponden a su nivel de autorización.

## Sistema de Roles Jerárquicos

Nuestro sistema implementa un modelo basado en roles que organiza los permisos de manera jerárquica, desde el acceso más restringido hasta el más amplio. Los clientes representan el nivel base con acceso limitado a funcionalidades específicas como solicitud de créditos y consulta de su información personal. Los empleados ocupan un nivel intermedio con permisos para gestionar préstamos, revisar solicitudes y realizar operaciones administrativas específicas. Los administradores tienen el nivel máximo con acceso completo a todas las funcionalidades del sistema, incluyendo gestión de usuarios, configuraciones y operaciones críticas.

Cada rol tiene únicamente los permisos mínimos necesarios para realizar sus funciones específicas, siguiendo el principio de menor privilegio. Esto significa que un cliente no puede acceder a funciones administrativas, y un empleado no puede realizar operaciones que requieren privilegios de administrador, manteniendo una separación clara de responsabilidades y reduciendo significativamente los riesgos de seguridad.

## Mecanismos de Protección

El sistema utiliza múltiples "guards" o protectores que actúan como filtros de seguridad en diferentes niveles de la aplicación. El **RolesGuard** verifica que el usuario tenga el rol específico requerido para acceder a una función determinada, utilizando decoradores **@Roles()** en el código que especifican exactamente qué roles pueden ejecutar cada operación crítica.

El **CombinedAuthGuard** proporciona flexibilidad de autenticación, permitiendo que tanto clientes como empleados accedan a ciertas funciones según el contexto específico de la operación. Este guard es especialmente útil para operaciones que pueden ser realizadas por diferentes tipos de usuarios bajo circunstancias apropiadas.

El **ClientAuthGuard** garantiza que solo usuarios autenticados como clientes puedan acceder a funciones específicas del área de clientes, evitando que empleados o administradores interfieran inadvertidamente con procesos sensibles de cliente. De manera complementaria, el **IntranetAuthGuard** asegura que solo personal interno como empleados y administradores puedan acceder a funciones administrativas y de gestión interna, manteniendo completamente separadas las interfaces públicas y privadas del sistema.

## Verificación de Permisos

Cada vez que un usuario intenta realizar una acción, el sistema ejecuta múltiples verificaciones en secuencia. Primero confirma que el usuario tenga una sesión válida y activa, luego comprueba que el rol del usuario permita la acción solicitada, seguido de la verificación del estado de la cuenta para asegurar que esté activa y en buen estado. Finalmente, evalúa si existen restricciones adicionales específicas para la operación particular que se intenta realizar.

El sistema implementa barreras estrictas para prevenir accesos cruzados no autorizados. Los clientes no pueden acceder a herramientas administrativas bajo ninguna circunstancia, los empleados no pueden realizar acciones en nombre de clientes sin autorización específica y explícita, y aunque los administradores tienen acceso completo al sistema, todas sus acciones quedan registradas detalladamente para fines de auditoría y responsabilidad.

## Implementación Técnica

Se utilizan **decoradores @Roles()** que se aplican directamente en los controladores de cada función del sistema. Estos decoradores especifican de manera declarativa y clara qué roles pueden acceder a cada endpoint, proporcionando una capa de seguridad que es tanto explícita como fácil de auditar por parte de los desarrolladores.

El control de acceso está estrechamente integrado con el sistema de autenticación existente. Los tokens JWT contienen información específica sobre el rol del usuario, lo que permite realizar verificaciones rápidas y eficientes sin necesidad de consultas adicionales a la base de datos en cada operación, mejorando significativamente el rendimiento del sistema mientras mantiene la seguridad.

## Gestión Dinámica de Permisos

El sistema puede modificar los permisos de un usuario en tiempo real según cambios en su estado. Si un empleado es desactivado por razones administrativas o disciplinarias, pierde inmediatamente todos sus accesos al sistema. Si un cliente es suspendido por incumplimiento o problemas de pago, no puede realizar nuevas operaciones hasta que se resuelva su situación. Los cambios de rol se aplican automáticamente en la próxima operación que intente realizar el usuario, garantizando que los permisos estén siempre actualizados.

Para funciones especialmente sensibles como la creación o modificación de préstamos, el acceso a información financiera sensible, los cambios en configuraciones críticas del sistema y la generación de documentos legales, se aplican validaciones adicionales que pueden incluir verificaciones de contexto específico, confirmaciones adicionales por parte del usuario y un registro detallado de auditoría que documenta cada paso del proceso.

## Monitoreo y Auditoría

Todos los intentos de acceso, tanto exitosos como fallidos, quedan registrados con información detallada que incluye el usuario que realizó el intento, la función o recurso específico al que intentó acceder, el resultado completo de la verificación de permisos y el timestamp preciso junto con el contexto relevante de la operación.

Esta arquitectura integral de control de acceso garantiza que cada usuario tenga exactamente los permisos necesarios para realizar su trabajo de manera efectiva, ni más ni menos, manteniendo un equilibrio óptimo entre seguridad robusta y funcionalidad operativa sin comprometer ninguno de estos aspectos críticos.