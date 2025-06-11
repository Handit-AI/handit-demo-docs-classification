# 🎓 Guía Rápida para Desarrolladores Junior

¡Bienvenido! Esta guía te ayudará a entender cómo funciona este proyecto paso a paso.

## 🏗️ ¿Cómo está construido el proyecto?

### Arquitectura simple
```
Usuario → API REST → Procesador de Archivos → IA (OpenAI) → Respuesta
```

### Estructura de archivos
```
📁 proyecto/
├── 📄 package.json          # Dependencias del proyecto
├── 📄 env.example           # Ejemplo de configuración
├── 📁 src/
│   ├── 📄 config.js         # ⚙️ Toda la configuración
│   ├── 📄 index.js          # 🚀 Servidor principal
│   ├── 📄 documentProcessor.js  # 📄 Extrae texto de archivos
│   └── 📁 agents/
│       └── 📄 documentAgent.js  # 🤖 Habla con OpenAI
```

## 🔄 ¿Cómo funciona el flujo?

### 1. **Usuario envía documento** (index.js)
```javascript
// El usuario puede enviar:
// - Un archivo: req.file (usando multer)
// - Una URL: req.body.url
```

### 2. **Validaciones de seguridad** (index.js)
```javascript
// Verificamos:
// ✅ ¿Existe el archivo o URL?
// ✅ ¿Es un tipo de archivo permitido?
// ✅ ¿No es muy grande?
```

### 3. **Extraer texto** (documentProcessor.js)
```javascript
// Según el tipo de archivo:
if (esPDF) {
    texto = usarPDFParser();
} else if (esImagen) {
    texto = usarOCR(); // Lee texto en imágenes
} else if (esWord) {
    texto = usarMammoth();
}
```

### 4. **Procesar con IA** (documentAgent.js)
```javascript
// Enviamos a OpenAI dos preguntas:
const clasificacion = preguntarTipoDocumento(texto);
const resumen = preguntarResumen(texto);
```

### 5. **Devolver resultado** (index.js)
```javascript
// Enviamos respuesta organizada al usuario
res.json({
    success: true,
    data: { clasificacion, resumen, metadata }
});
```

## 🔧 Principales tecnologías

### Node.js y Express
```javascript
// Express = framework web simple
const app = express();
app.post('/api/endpoint', (req, res) => {
    // Procesar petición
    res.json({ resultado });
});
```

### Multer (subida de archivos)
```javascript
// Multer permite recibir archivos
const upload = multer({ storage: multer.memoryStorage() });
app.post('/upload', upload.single('archivo'), (req, res) => {
    // req.file contiene el archivo subido
});
```

### OpenAI
```javascript
// Cliente para hablar con GPT-4
const openai = new OpenAI({ apiKey: 'tu-key' });
const respuesta = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [{ role: 'user', content: 'pregunta' }]
});
```

## 📚 Conceptos importantes

### ¿Qué es una API REST?
- **REST** = forma estándar de comunicarse con servidores web
- **GET** = obtener información
- **POST** = enviar información
- **JSON** = formato de datos que usamos

### ¿Qué es middleware?
```javascript
// Middleware = funciones que se ejecutan ANTES de tu código
app.use(cors());        // Permite peticiones de otros sitios
app.use(express.json()); // Entiende JSON en peticiones
```

### ¿Qué es async/await?
```javascript
// Forma moderna de manejar operaciones que toman tiempo
async function miFuncion() {
    const resultado = await operacionLenta(); // Espera a que termine
    console.log(resultado);
}
```

### ¿Qué son los try/catch?
```javascript
// Manejo de errores
try {
    const resultado = await operacionPeligrosa();
} catch (error) {
    console.error('Algo salió mal:', error.message);
}
```

## 🛠️ Cómo modificar el proyecto

### Agregar un nuevo tipo de archivo

1. **Actualizar configuración** (config.js):
```javascript
allowedMimeTypes: [
    // ... tipos existentes ...
    'application/nuevo-tipo'
]
```

2. **Agregar lógica de procesamiento** (documentProcessor.js):
```javascript
} else if (mimeType.includes('nuevo-tipo')) {
    processingMethod = 'Nuevo Parser';
    extractedText = await procesarNuevoTipo(content);
```

### Cambiar las categorías de clasificación

**Editar** `documentAgent.js`:
```javascript
const categories = [
    'Recibo/Factura', 
    'Contrato/NDA',
    'Tu Nueva Categoría', // ← Agregar aquí
    // ... más categorías ...
];
```

### Modificar los prompts de IA

**Para clasificación** (documentAgent.js):
```javascript
const prompt = `Tu nuevo prompt para clasificación...
CATEGORÍAS: ${categories.join(', ')}
DOCUMENTO: ${documentContent}
...`;
```

**Para resumen** (documentAgent.js):
```javascript
const prompt = `Tu nuevo prompt para resumen...
Enfócate en: [tus criterios]
...`;
```

## 🐛 Debugging (encontrar errores)

### Usar console.log estratégicamente
```javascript
console.log('🔍 Datos recibidos:', req.body);
console.log('📄 Archivo:', req.file?.originalname);
console.log('✅ Texto extraído:', extractedText.length, 'caracteres');
```

### Verificar logs del servidor
```bash
# Los logs aparecen en la terminal donde ejecutaste:
npm run dev
```

### Usar herramientas de desarrollo
```bash
# Probar endpoints con curl
curl -X POST -F "document=@test.pdf" http://localhost:3000/api/process-document

# O usar Postman, Insomnia, etc.
```

## 📊 Métricas útiles

### Tiempo de procesamiento
```javascript
const startTime = Date.now();
// ... procesar ...
const timeElapsed = Date.now() - startTime;
console.log(`⏱️ Procesado en ${timeElapsed}ms`);
```

### Tamaño de archivos
```javascript
console.log(`📊 Archivo: ${req.file.size} bytes`);
console.log(`📊 Texto: ${extractedText.length} caracteres`);
console.log(`📊 Palabras: ${extractedText.split(' ').length}`);
```

## 🚨 Errores comunes y soluciones

### "Cannot read property 'x' of undefined"
```javascript
// ❌ Problemático
const nombre = usuario.datos.nombre;

// ✅ Seguro
const nombre = usuario?.datos?.nombre || 'Sin nombre';
```

### "API key not found"
```javascript
// Verificar que el .env esté configurado
if (!process.env.OPENAI_API_KEY) {
    console.error('❌ Falta OPENAI_API_KEY en .env');
    process.exit(1);
}
```

### "File too large"
```javascript
// Ajustar límites en config.js
maxFileSize: 20 * 1024 * 1024, // 20MB en lugar de 10MB
```

## 🎯 Tips para seguir aprendiendo

1. **Lee los logs**: Siempre revisa lo que dice la consola
2. **Experimenta**: Cambia valores y ve qué pasa
3. **Usa el debugger**: `console.log` es tu amigo
4. **Lee documentación**: Cada librería tiene docs oficiales
5. **Practica**: Crea pequeños proyectos similares

## 📖 Recursos recomendados

- **JavaScript moderno**: [MDN Web Docs](https://developer.mozilla.org/es/)
- **Node.js**: [Documentación oficial](https://nodejs.org/docs/)
- **Express**: [Guía oficial](https://expressjs.com/es/)
- **Promesas y async/await**: [JavaScript.info](https://es.javascript.info/async-await)

---

¡Recuerda: **todos empezamos como principiantes**! Lo importante es seguir practicando y preguntando cuando no entiendas algo. 💪 