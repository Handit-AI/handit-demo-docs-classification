# 🤖 AI Document Classification Assistant

Una aplicación moderna de clasificación y resumen de documentos usando IA, desarrollada con React y Node.js.

![AI Document Classifier](https://img.shields.io/badge/AI-Document%20Classifier-blue?style=for-the-badge&logo=robot)
![React](https://img.shields.io/badge/React-18+-61DAFB?style=for-the-badge&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js)
![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4-412991?style=for-the-badge&logo=openai)

## ✨ Características

- 🧠 **Clasificación Inteligente**: Usa GPT-4 para clasificar documentos automáticamente
- 📄 **Múltiples Formatos**: Soporta PDF, imágenes, Word, Excel, CSV y texto
- 🎨 **UI Moderna**: Interfaz elegante con Material-UI y animaciones
- 📤 **Drag & Drop**: Subida de archivos intuitiva
- 🌐 **URLs**: Procesa documentos desde enlaces web
- ⚡ **Tiempo Real**: Procesamiento rápido con feedback visual
- 📊 **Análisis Detallado**: Clasificación, resumen y metadatos

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js 18+ y npm
- API Key de OpenAI ([Obtener aquí](https://platform.openai.com/api-keys))

### 1. Clonar y Configurar Backend

```bash
# Instalar dependencias del backend
cd backend
npm install

# Crear archivo de configuración
cp env.example .env

# Editar .env y agregar tu API key de OpenAI
nano .env
```

**Configuración del archivo `.env`:**
```env
PORT=3000
OPENAI_API_KEY=sk-tu-api-key-aqui
NODE_ENV=development
MAX_FILE_SIZE=10485760
```

### 2. Configurar Frontend

```bash
# Instalar dependencias del frontend
cd ../frontend
npm install
```

### 3. Ejecutar la Aplicación

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### 4. Acceder a la Aplicación

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **Health Check**: http://localhost:3000/health

## 🎯 Cómo Usar

### Subir Archivo
1. Arrastra y suelta tu documento en la zona de subida
2. O haz clic para seleccionar un archivo
3. La IA procesará y analizará automáticamente

### Procesar URL
1. Pega la URL de un documento online
2. Haz clic en "Analyze URL"
3. El sistema descargará y procesará el contenido

### Resultados
- **Clasificación**: Tipo, categoría y puntuación de confianza
- **Resumen**: Resumen inteligente generado por IA
- **Metadatos**: Tiempo de procesamiento y detalles del archivo

## 📁 Tipos de Archivo Soportados

| Tipo | Formatos | Descripción |
|------|----------|-------------|
| 📄 **PDF** | `.pdf` | Extracción de texto completo |
| 🖼️ **Imágenes** | `.jpg`, `.jpeg`, `.png` | OCR con Tesseract |
| 📝 **Word** | `.docx`, `.doc` | Documentos de Microsoft Word |
| 📊 **Excel** | `.xlsx`, `.xls` | Hojas de cálculo |
| 📋 **CSV** | `.csv` | Archivos de datos estructurados |
| 📃 **Texto** | `.txt` | Archivos de texto plano |

## 🏗️ Arquitectura

```
┌─────────────────┐    HTTP/REST    ┌─────────────────┐
│                 │ ──────────────> │                 │
│   React Frontend │                 │  Node.js Backend │
│   (Port 5173)   │ <────────────── │   (Port 3000)   │
│                 │                 │                 │
└─────────────────┘                 └─────────────────┘
                                             │
                                             ▼
                                    ┌─────────────────┐
                                    │   OpenAI API    │
                                    │     GPT-4       │
                                    └─────────────────┘
```

### Frontend (React + Vite)
- **Material-UI**: Componentes de interfaz modernos
- **React Router**: Navegación
- **Axios**: Cliente HTTP
- **React Dropzone**: Subida de archivos drag & drop

### Backend (Node.js + Express)
- **Express**: Servidor web
- **Multer**: Manejo de archivos
- **OpenAI**: Procesamiento de IA
- **PDF-Parse**: Extracción de PDFs
- **Tesseract.js**: OCR para imágenes
- **Mammoth**: Documentos Word
- **XLSX**: Hojas de cálculo

## 🔧 API Endpoints

### `POST /api/process-document`
Procesa un documento (archivo o URL)

**Archivo:**
```bash
curl -X POST http://localhost:3000/api/process-document \
  -F "document=@archivo.pdf"
```

**URL:**
```bash
curl -X POST http://localhost:3000/api/process-document \
  -H "Content-Type: application/json" \
  -d '{"url": "https://ejemplo.com/documento.pdf"}'
```

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "classification": {
      "type": "Technical Document",
      "category": "Software Documentation",
      "confidence": 95
    },
    "summary": "Este documento describe...",
    "metadata": {
      "processing_time_ms": 2500,
      "source": {...}
    }
  }
}
```

### `GET /health`
Estado del servidor

### `GET /api/info`
Información del sistema

## 🎨 Capturas de Pantalla

### Pantalla Principal
- Diseño moderno con gradientes y animaciones
- Cards de subida de archivos y URLs
- Chips informativos de características

### Procesamiento
- Indicadores de progreso visuales
- Pasos del procesamiento en tiempo real
- Animaciones suaves

### Resultados
- Tarjetas de clasificación con colores dinámicos
- Resumen de IA destacado
- Metadatos detallados del procesamiento

## 🛠️ Desarrollo

### Estructura del Proyecto
```
├── backend/
│   ├── src/
│   │   ├── index.js              # Servidor principal
│   │   ├── config.js             # Configuración
│   │   ├── documentProcessor.js  # Procesamiento de archivos
│   │   └── agents/
│   │       └── documentAgent.js  # Agente de IA
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── features/
│   │   │   └── documentClassification/
│   │   │       ├── pages/
│   │   │       ├── components/
│   │   │       └── services/
│   │   └── theme/
│   └── package.json
└── README.md
```

### Scripts Disponibles

**Backend:**
```bash
npm run dev     # Desarrollo con nodemon
npm start       # Producción
```

**Frontend:**
```bash
npm run dev     # Servidor de desarrollo
npm run build   # Build para producción
npm run preview # Vista previa del build
```

## 🔒 Seguridad

- ✅ Validación de tipos de archivo
- ✅ Límites de tamaño de archivo
- ✅ CORS configurado
- ✅ Variables de entorno para datos sensibles
- ✅ Sanitización de entrada

## 🚀 Despliegue

### Desarrollo Local
Ya configurado con las instrucciones de arriba.

### Producción
1. Configura variables de entorno en producción
2. Build del frontend: `npm run build`
3. Sirve archivos estáticos del frontend
4. Ejecuta backend con `npm start`

## 🤝 Contribuir

1. Fork del proyecto
2. Crea una rama para tu feature
3. Commit de tus cambios
4. Push a la rama
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 🆘 Soporte

¿Problemas? ¡Aquí tienes ayuda!

### Problemas Comunes

**Backend no inicia:**
```bash
# Verifica que tienes Node.js 18+
node --version

# Instala dependencias
cd backend && npm install

# Verifica el archivo .env
cat .env
```

**Error de conexión frontend-backend:**
```bash
# Verifica que el backend esté ejecutándose
curl http://localhost:3000/health

# Verifica CORS si usas un dominio diferente
```

**Error de API Key:**
- Verifica que tu API key de OpenAI sea válida
- Asegúrate de que esté en el archivo `.env`
- Verifica que tengas créditos en tu cuenta de OpenAI

### Contacto
- 📧 Email: tu-email@ejemplo.com
- 💬 Issues: [GitHub Issues](link-to-issues)

---

Hecho con ❤️ usando React, Node.js y OpenAI GPT-4 