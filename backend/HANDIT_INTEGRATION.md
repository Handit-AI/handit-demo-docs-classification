# 🔍 Handit.ai Integration - Document Classification System

## Overview

Este sistema de clasificación de documentos está completamente instrumentado con **Handit.ai** para observabilidad completa de IA. Cada operación de AI, desde la extracción de texto hasta la clasificación y resumen, está trackeada y monitoreada.

## 🎯 Features Implemented

### ✅ Complete AI Observability
- **Tracing completo**: Cada sesión de procesamiento de documentos se trackea de principio a fin
- **LLM Monitoring**: Todas las llamadas a OpenAI GPT-4 son monitoreadas
- **Tool Tracking**: Operaciones como OCR, PDF parsing, etc. son trackeadas
- **Error Handling**: Errores son capturados y trackeados automáticamente
- **Performance Metrics**: Tiempos de procesamiento y métricas de rendimiento

### 🔄 Automated Workflow Tracking
- **API Request Lifecycle**: Cada petición HTTP es trackeada completamente
- **Document Processing Pipeline**: Todo el pipeline de procesamiento está instrumentado
- **Parallel Operations**: Operaciones en paralelo (clasificación + resumen) son trackeadas independientemente

### 🚀 Prompt Optimization
- **Optimized Prompts**: Integración con el sistema de optimización de prompts de Handit
- **A/B Testing Ready**: Preparado para pruebas A/B de diferentes versiones de prompts
- **Performance Comparison**: Capacidad de comparar rendimiento de diferentes prompts

## 🏗️ Architecture

### Traced Components

#### 1. **API Layer** (`src/index.js`)
```javascript
Agent Name: 'document_classification_api'
Operations:
- api_request_start
- api_validation_error  
- text_extraction_complete
- api_request_complete
- api_request_error
```

#### 2. **Document Agent** (`src/agents/documentAgent.js`)
```javascript
Agent Name: 'document_classification_agent'
Operations:
- processDocument_start
- classifyDocument (LLM)
- summarizeDocument (LLM)
- processDocument_complete
- *_error (Error handling)
```

#### 3. **Document Processor** (`src/documentProcessor.js`)
```javascript
Agent Name: 'document_classification_agent' 
Operations:
- download_from_url
- extract_text_pdf
- extract_text_ocr
- extract_text_word
- extract_text_excel
- extract_text_csv
- extract_text_plain
- document_extraction_complete
```

## 🔧 Setup Instructions

### 1. Environment Variables
Asegúrate de tener estas variables en tu `.env`:

```bash
# Handit.ai API Key (Required)
HANDIT_API_KEY=your_handit_api_key_here

# OpenAI API Key (Required)  
OPENAI_API_KEY=your_openai_api_key_here
```

### 2. Dependencies
Las dependencias de Handit ya están instaladas:

```bash
npm install @handit.ai/node
```

### 3. Service Initialization
El servicio se inicializa automáticamente al cargar el handitService.js:

```javascript
const { config } = require('@handit.ai/node');
config({ apiKey: process.env.HANDIT_API_KEY });
```

## 🧪 Testing

### Run Integration Test
```bash
node test-handit-integration.js
```

Esta prueba verifica:
- ✅ Configuración correcta de Handit
- ✅ Tracing completo de operaciones
- ✅ Manejo de errores
- ✅ Optimización de prompts

### Expected Output
```
🧪 Iniciando prueba de integración de Handit...
✅ HANDIT_API_KEY configurada
✅ OPENAI_API_KEY configurada
🤖 DocumentAgent inicializado correctamente
🔍 Handit tracing iniciado con ID: [EXECUTION_ID]
✅ Procesamiento completado exitosamente
✅ Handit tracing finalizado exitosamente
```

## 📊 Monitored Operations

### 1. **Document Processing Flow**
```
API Request → Document Processing → AI Classification → AI Summarization → Response
     ↓              ↓                    ↓                ↓               ↓
  [Tracked]      [Tracked]           [Tracked]        [Tracked]     [Tracked]
```

### 2. **LLM Operations**
- **Classification**: Categoria, subcategoria, confianza, keywords
- **Summarization**: Resumen estructurado, puntos clave, detalles importantes
- **Prompt Optimization**: Automática a través de Handit

### 3. **Tool Operations**
- **PDF Processing**: Páginas, caracteres extraídos, tiempo de procesamiento
- **OCR Processing**: Confianza OCR, texto extraído, tiempo de procesamiento  
- **Word/Excel Processing**: Hojas procesadas, caracteres extraídos
- **URL Downloads**: Tamaño descargado, tipo MIME detectado

## 🔍 Dashboard Monitoring

### En tu Handit.ai Dashboard verás:

#### Agents
- `document_classification_api` - API operations
- `document_classification_agent` - Core AI operations

#### Node Types
- **LLM**: Operaciones de clasificación y resumen
- **Tool**: Procesamiento de documentos, extracciones, API calls

#### Metrics Tracked
- **Latency**: Tiempo de respuesta de cada operación
- **Success Rate**: Porcentaje de operaciones exitosas
- **Error Rate**: Frecuencia y tipos de errores
- **Token Usage**: Uso de tokens en operaciones LLM
- **Throughput**: Documentos procesados por minuto

## 🚨 Error Handling

### Automatic Error Tracking
Todos los errores son automáticamente capturados y enviados a Handit:

```javascript
// Errores de API
await trackNode({
    output: { error: error.message },
    nodeName: 'api_request_error',
    // ...
});

// Errores de LLM  
await trackNode({
    output: { error: error.message },
    nodeName: 'classifyDocument_error',
    // ...
});
```

### Error Categories Tracked
- **API Validation Errors**: Parámetros faltantes, tipos incorrectos
- **Document Processing Errors**: Archivos corruptos, formatos no soportados
- **LLM Errors**: Rate limits, API keys, quotas
- **Network Errors**: Timeouts, conexiones fallidas

## 📈 Performance Optimization

### Handit Integration Benefits
1. **Prompt Optimization**: Mejora automática de prompts basada en performance
2. **Bottleneck Identification**: Identifica operaciones lentas en el pipeline
3. **Resource Monitoring**: Monitorea uso de tokens y costos
4. **A/B Testing**: Compara diferentes versiones de prompts y workflows

### Monitored Metrics
- **Processing Time**: Por tipo de documento y operación
- **Token Consumption**: Por operación LLM
- **Success/Failure Rates**: Por tipo de documento
- **User Experience**: Tiempo total de respuesta

## 🔗 Integration Points

### 1. Prompt Optimization
```javascript
const optimizedPrompt = await fetchOptimizedPrompt({
    modelId: 'classifyDocument',
});
```

### 2. Complete Tracing
```javascript
// Start session
const tracingResponse = await startTracing({
    agentName: 'document_classification_agent'
});

// Track operations  
await trackNode({
    input: { /* operation input */ },
    output: { /* operation output */ },
    nodeName: 'operation_name',
    nodeType: 'llm|tool',
    executionId
});

// End session
await endTracing({ executionId, agentName });
```

## 🎯 Next Steps

1. **Visit Handit Dashboard**: Revisa las métricas en tiempo real
2. **Set Up Alerts**: Configura alertas para errores o latencia alta  
3. **Optimize Prompts**: Usa las recomendaciones de Handit para mejorar prompts
4. **Scale Monitoring**: Amplía el monitoring conforme agregues nuevas features

---

¡Tu sistema de clasificación de documentos ahora tiene observabilidad completa de IA! 🎉 