---
title: "Autenticación"
section: "seguridad"
order: 2
level: 1
---

# Autenticación

La autenticación es el proceso mediante el cual el sistema verifica la identidad de quienes intentan acceder a él. Nuestro sistema implementa un mecanismo robusto y multicapa que garantiza que solo usuarios legítimos puedan acceder a sus cuentas y realizar operaciones autorizadas.

## Proceso de Verificación de Identidad

Cuando un usuario intenta iniciar sesión, el sistema ejecuta un proceso riguroso de verificación que comienza con la validación de credenciales. Las contraseñas no se almacenan en texto plano en ningún momento, sino que se procesan mediante algoritmos avanzados que las convierten en códigos únicos e irreversibles. Utilizamos **bcryptjs** con técnicas de "salting" y "hashing", lo que significa que cada contraseña se combina con datos únicos generados aleatoriamente antes de ser encriptada, haciendo prácticamente imposible su descifrado incluso si alguien lograra acceder directamente a la base de datos.

Una vez verificada la identidad del usuario, el sistema genera un **JSON Web Token (JWT)** único para cada sesión individual. Este token actúa como una "credencial digital" que el usuario presenta automáticamente en cada operación posterior que realice en el sistema. Los tokens están encriptados utilizando el algoritmo **HS256** y tienen una duración limitada de 24 horas, después de la cual expiran automáticamente como medida de seguridad adicional, requiriendo que el usuario se autentique nuevamente.

## Diferenciación de Usuarios

El sistema reconoce y maneja dos tipos diferentes de usuarios con estrategias de autenticación específicamente diseñadas para cada contexto. Los clientes externos utilizan la estrategia `jwt-client`, que está optimizada para usuarios que acceden desde aplicaciones públicas y redes externas, implementando medidas de seguridad apropiadas para este entorno de mayor riesgo. Los empleados emplean la estrategia `jwt-intranet`, especialmente diseñada para acceso desde la red interna de la organización, donde se pueden aplicar políticas de seguridad más específicas y controles adicionales.

Esta diferenciación permite aplicar políticas de seguridad específicas según el contexto y nivel de riesgo asociado con cada tipo de usuario. El sistema no solo verifica que el token sea válido criptográficamente, sino que constantemente comprueba el estado actual del usuario en tiempo real. Para clientes, esto incluye verificar que la cuenta no esté baneada, suspendida o bajo algún tipo de restricción. Para empleados, el sistema confirma que la cuenta esté activa, no haya sido deshabilitada por razones administrativas y que el empleado mantenga su estatus válido dentro de la organización.

## Tecnología de Implementación

Utilizamos **Passport.js** como motor principal de autenticación, una biblioteca especializada y ampliamente probada que proporciona estrategias flexibles y robustas para diversos tipos de autenticación. Esta herramienta nos permite implementar tanto estrategias locales tradicionales basadas en usuario y contraseña como autenticación JWT de manera integrada y cohesiva, manteniendo la consistencia en todo el sistema.

Los tokens se almacenan en **cookies HTTPOnly**, una medida de seguridad crítica que impide que scripts maliciosos ejecutándose en navegadores web puedan acceder a las credenciales de sesión del usuario. Esta protección es fundamental para prevenir ataques de tipo **Cross-Site Scripting (XSS)**, donde código malicioso podría intentar robar las credenciales de autenticación de usuarios legítimos.

## Flujo de Autenticación

El proceso de autenticación sigue una secuencia rigurosa y bien definida. Primero, el sistema recibe las credenciales proporcionadas por el usuario, típicamente email o nombre de usuario junto con la contraseña. Luego realiza una validación inicial para confirmar que el usuario existe en el sistema y tiene un registro válido. El siguiente paso involucra la verificación de la contraseña, comparando la contraseña proporcionada con el hash almacenado utilizando los algoritmos de encriptación seguros.

Una vez confirmada la autenticidad de las credenciales, el sistema procede a validar el estado actual de la cuenta, asegurándose de que esté activa y en buen estado operativo. Si todas las verificaciones son exitosas, se genera un JWT con información específica del usuario que incluye su ID único, email y tipo de usuario. Finalmente, el token se entrega de manera segura almacenándolo en cookies HTTPOnly o headers apropiados según la configuración del cliente.

Para cada solicitud posterior que realice el usuario, el sistema extrae automáticamente el token de la cookie o header correspondiente, verifica su validez criptográfica utilizando las claves secretas del sistema, confirma que no haya expirado según el tiempo establecido de 24 horas, valida que el usuario asociado al token siga teniendo un estado activo en el sistema y finalmente procede con la operación solicitada si todas las verificaciones son exitosas.

## Gestión de Sesiones

Los tokens tienen una vida útil estrictamente limitada de 24 horas, lo que reduce significativamente el riesgo de compromiso de seguridad en caso de que un token sea interceptado o comprometido de alguna manera. Una vez que un token expira, se vuelve completamente inútil y el usuario debe autenticarse nuevamente para obtener un nuevo token válido.

El sistema puede revocar el acceso de un usuario de manera inmediata y efectiva modificando el estado del usuario directamente en la base de datos. Esta acción invalida automáticamente todas las sesiones activas del usuario en la próxima verificación que realice el sistema, proporcionando un mecanismo rápido y confiable para gestionar situaciones de seguridad o cambios administrativos.

Esta arquitectura integral de autenticación proporciona un equilibrio óptimo entre seguridad robusta y usabilidad práctica, asegurando que la verificación de identidad sea extremadamente confiable y resistente a ataques, mientras mantiene una experiencia de usuario fluida y eficiente que no interfiere con las operaciones normales del sistema.