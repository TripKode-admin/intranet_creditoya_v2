---
title: "Estructura de Carpetas"
section: "arquitectura"
order: 3
level: 1
---

# Estructura General

El sistema de gestión crediticia implementa una arquitectura empresarial modular que garantiza seguridad, escalabilidad y eficiencia operacional. La plataforma procesa solicitudes de crédito, valida documentación y genera contratos de manera automatizada, proporcionando ventajas competitivas significativas mediante la reducción de tiempos de procesamiento, minimización del riesgo operacional y aseguramiento del cumplimiento normativo.

## Modulos del Sistema

### Núcleo de la Aplicación (src/)

El directorio principal contiene la infraestructura tecnológica que sustenta todas las operaciones críticas del negocio. Esta organización modular permite que diferentes equipos trabajen simultáneamente en distintas funcionalidades sin interferencias, acelerando el desarrollo y reduciendo los riesgos de implementación. Cada módulo opera como un centro de excelencia especializado que contribuye al objetivo común de procesamiento crediticio eficiente.

### Sistema de Seguridad y Autenticación (auth/)

Este componente actúa como el sistema de control de acceso organizacional, determinando permisos de acceso a información y funcionalidades mientras protege datos sensibles de clientes. El módulo implementa estrategias de validación basadas en JSON Web Tokens (JWT) con diferenciación de roles, incluyendo controladores especializados que gestionan endpoints críticos como `/login` y `/register`.

Las estrategias de validación verifican la autenticidad de tokens considerando niveles de autorización específicos para administradores, empleados y clientes. La implementación incluye guardias de seguridad como `RolesGuard` y `CombinedAuthGuard` que proporcionan control granular sobre el acceso a recursos críticos del sistema.

```typescript
// Validación empresarial de tokens con roles diferenciados
async validate(payload: JwtPayload) {
  const user = await this.prisma.user.findUnique({
    where: { id: payload.sub },
    include: { roles: true }
  });
  if (!user) throw new UnauthorizedException();
  return { ...user, roles: payload.roles };
}
```

### Gestión de Relaciones con Clientes (client/)

El módulo centraliza información y operaciones relacionadas con clientes, funcionando como un departamento de atención al cliente digital que mantiene perfiles actualizados, gestiona documentación requerida y facilita la comunicación con solicitantes de crédito. El servicio encapsula operaciones CRUD optimizadas para la gestión de usuarios externos, implementando validaciones estrictas para actualizaciones de datos críticos.

El sistema limita modificaciones a campos específicos como información de contacto y direcciones de residencia, asegurando la integridad de la información empresarial crítica.

```typescript
// Actualización controlada de información crítica del cliente
async updateClient(userId: string, data: UpdateClientDto) {
  const allowedFields = ['phone', 'residence_address', 'city'];
  const filteredData = Object.entries(data).reduce((acc, [key, value]) => {
    if (allowedFields.includes(key)) acc[key] = value;
    return acc;
  }, {});
  return this.prisma.user.update({
    where: { id: userId },
    data: filteredData
  });
}
```

### Motor de Procesamiento Crediticio (loan/)

Representa el núcleo operacional del negocio, automatizando el proceso completo desde la recepción de solicitudes hasta la generación de contratos legalmente válidos. Este sistema reduce significativamente los tiempos de aprobación, minimiza errores humanos y asegura el cumplimiento de políticas crediticias establecidas.

El módulo coordina múltiples servicios especializados incluyendo validación automatizada de documentos, verificación de condiciones crediticias y generación de contratos en formato PDF. Los controladores exponen endpoints críticos como `/create`, `/approve` y `/reject`, mientras que servicios especializados manejan la lógica de negocio compleja.

```typescript
// Validación automatizada de documentos con verificación de integridad
async validateDocuments(documents: DocumentDto[]) {
  const requiredTypes = ['ID_FRONT', 'LABOR_CARD'];
  const missing = requiredTypes.filter(type => 
    !documents.some(doc => doc.type === type)
  );
  if (missing.length > 0) throw new BadRequestException(`Faltan documentos: ${missing.join(', ')}`);
  return documents.every(doc => doc.isValid);
}
```

El generador de contratos utiliza bibliotecas especializadas como jsPDF para crear documentos legalmente válidos con firmas digitales integradas, asegurando el cumplimiento de requisitos legales y regulatorios.

### Sistema de Continuidad Empresarial (backup/)

Garantiza la continuidad del negocio mediante respaldos automatizados de información crítica, actuando como protección contra pérdida de datos y asegurando el cumplimiento de regulaciones sobre retención de información financiera. El sistema implementa respaldos programados que se ejecutan mensualmente, utilizando Google Cloud Storage como repositorio seguro.

El proceso incluye compresión de datos con GZIP para optimizar el almacenamiento y reducir costos operacionales, mientras mantiene la disponibilidad de información para auditorías y recuperación ante desastres.

```typescript
// Respaldo automatizado con programación empresarial
@Cron('0 0 1 * *') // Ejecución el primer día de cada mes
async monthlyBackup() {
  const timestamp = new Date().toISOString();
  const backupFileName = `mongodb_backup_${timestamp}.gz`;
  await this.mongoBackupService.exportDatabase(backupFileName);
  await this.googleStorage.upload(backupFileName);
}
```

### Gestión de Activos Digitales (cloudinary/)

Administra documentos, imágenes y archivos multimedia organizacionales, asegurando optimización, seguridad y accesibilidad. Este sistema reduce costos de almacenamiento y mejora la experiencia del usuario mediante la aceleración de carga de documentos.

La integración con servicios de Cloudinary proporciona procesamiento avanzado de imágenes, incluyendo optimización automática, generación de URLs firmadas para seguridad y transformaciones en tiempo real. El sistema incluye interceptores que procesan archivos antes del almacenamiento, garantizando estándares de calidad consistentes.

```typescript
// Optimización automática de recursos multimedia
async processImage(file: Express.Multer.File) {
  const resizedImage = await sharp(file.buffer)
    .resize(800, 600)
    .jpeg({ quality: 80 })
    .toBuffer();
  return this.cloudinaryUploader.upload(resizedImage);
}
```

### Capa de Persistencia Empresarial (prisma/)

Funciona como el archivo central organizacional, manteniendo información de clientes, préstamos y transacciones de manera organizada y segura. Garantiza la integridad de datos y facilita la generación de reportes para toma de decisiones estratégicas.

El sistema utiliza Prisma ORM para gestionar la interacción con la base de datos MongoDB, proporcionando tipado estático y migraciones controladas. El esquema centraliza las relaciones entre entidades críticas del negocio, asegurando consistencia y trazabilidad de información.

```prisma
// Modelo de datos empresarial con relaciones definidas
model User {
  id               String    @id @default(uuid())
  email            String    @unique
  password         String
  role             Role
  documents        Document[]
  LoanApplication  LoanApplication[]
}
```

### Servicios Corporativos Compartidos (common/)

Contiene herramientas y procesos estandarizados utilizados por todos los componentes del sistema, similar a los servicios corporativos compartidos en organizaciones tradicionales. Asegura consistencia en el manejo de información sensible y facilita el cumplimiento de estándares de seguridad empresarial.

La implementación incluye utilidades críticas como sistemas de encriptación con CryptoJS para protección de datos sensibles, manejadores de errores globalizados y sistemas de logging estructurado con Pino HTTP para auditoría y monitoreo operacional.

```typescript
// Encriptación empresarial de información sensible
function encryptData(data: string, key: Buffer): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + encrypted;
}
```

## Infraestructura Tecnológica

### Servicios de Almacenamiento Distribuido

La plataforma utiliza servicios especializados de Google Cloud Storage y Cloudinary que operan como extensiones virtuales del sistema principal. Esta arquitectura híbrida aprovecha la infraestructura global de proveedores especializados mientras mantiene el control sobre la lógica de negocio crítica, proporcionando escalabilidad, disponibilidad y redundancia geográfica.

### Contenerización y Despliegue (docker/)

El sistema garantiza funcionamiento idéntico en todos los entornos mediante contenerización con Docker, eliminando riesgos asociados con diferencias de configuración y acelerando los despliegues. La configuración está optimizada para despliegues en Google Cloud Run, proporcionando escalabilidad automática y gestión de recursos eficiente.

```dockerfile
# Configuración de contenedor optimizada para producción
FROM node:18-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci --production
COPY dist/ dist/
CMD ["node", "dist/main"]
```

## Impacto Organizacional

### Ventajas Competitivas

La arquitectura representa una inversión estratégica en capacidades digitales que posiciona la organización para crecimiento sostenible. Los beneficios incluyen reducción de costos operacionales, mejora en la experiencia del cliente, cumplimiento automatizado de regulaciones y capacidad de escalamiento sin degradación del servicio.

### Capacidades Técnicas

La implementación proporciona un entorno de desarrollo eficiente basado en principios de ingeniería de software establecidos. La separación de responsabilidades permite desarrollo paralelo, testing independiente y mantenimiento simplificado. La integración con servicios en la nube modernos asegura disponibilidad empresarial y recuperación ante desastres.

## Conclusión Estratégica

La arquitectura modular implementada refleja mejores prácticas de la industria financiera tecnológica, proporcionando una base sólida para el crecimiento organizacional. Cada componente opera como un centro de excelencia especializado que contribuye al objetivo común de procesamiento crediticio eficiente y seguro.

Esta estructura establece una plataforma para la innovación continua, permitiendo la integración de nuevas capacidades sin disrumpir operaciones existentes. La inversión en esta arquitectura posiciona la organización para aprovechar oportunidades futuras en el mercado financiero digital, manteniendo la flexibilidad necesaria para adaptarse a cambios regulatorios y demandas del mercado.