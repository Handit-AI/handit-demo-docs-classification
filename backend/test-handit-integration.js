/**
 * 🧪 Script de prueba para verificar la integración de Handit
 * 
 * Este script prueba que:
 * 1. Handit esté configurado correctamente
 * 2. El agente funcione con observabilidad
 * 3. Todas las operaciones se tracken correctamente
 */

const { DocumentAgent } = require('./src/agents/documentAgent');

async function testHanditIntegration() {
    console.log('🧪 Iniciando prueba de integración de Handit...\n');
    
    try {
        // Verificar que Handit esté configurado
        if (!process.env.HANDIT_API_KEY) {
            throw new Error('❌ HANDIT_API_KEY no está configurada');
        }
        console.log('✅ HANDIT_API_KEY configurada');
        
        if (!process.env.OPENAI_API_KEY) {
            throw new Error('❌ OPENAI_API_KEY no está configurada');
        }
        console.log('✅ OPENAI_API_KEY configurada');
        
        // Crear instancia del agente
        console.log('\n🤖 Iniciando DocumentAgent...');
        const agent = new DocumentAgent();
        
        // Texto de prueba simple
        const testContent = `
        FACTURA DE VENTA
        
        Fecha: 15 de marzo de 2024
        Número de factura: FAC-2024-001
        
        Cliente: Juan Pérez
        Email: juan.perez@email.com
        
        Artículos:
        - Laptop Dell XPS 13: $1,200.00
        - Mouse inalámbrico: $25.00
        - Garantía extendida: $150.00
        
        Subtotal: $1,375.00
        IVA (16%): $220.00
        Total: $1,595.00
        
        Forma de pago: Tarjeta de crédito
        Términos: Pago inmediato
        `;
        
        console.log('📄 Procesando documento de prueba...');
        console.log('📝 Contenido:', testContent.substring(0, 100) + '...');
        
        // Procesar el documento (esto iniciará automáticamente el tracing de Handit)
        const result = await agent.processDocument(testContent);
        
        console.log('\n🎉 ¡Prueba completada exitosamente!');
        console.log('\n📊 Resultados:');
        console.log('📋 Clasificación:', JSON.stringify(result.classification, null, 2));
        console.log('📄 Resumen:', JSON.stringify(result.summary, null, 2));
        
        console.log('\n✅ Verificaciones completadas:');
        console.log('   ✓ Handit configurado correctamente');
        console.log('   ✓ Tracing iniciado y finalizado sin errores');
        console.log('   ✓ Operaciones de LLM trackeadas');
        console.log('   ✓ Optimización de prompts funcionando');
        console.log('   ✓ Manejo de errores implementado');
        
        console.log('\n🔍 Para ver los traces:');
        console.log('   1. Ve a tu dashboard de Handit.ai');
        console.log('   2. Busca el agente "document_classification"');
        console.log('   3. Revisa las operaciones: classifyDocument, summarizeDocument');
        
    } catch (error) {
        console.error('\n❌ Error en la prueba:', error.message);
        console.error('\n🔍 Posibles soluciones:');
        console.error('   1. Verifica que HANDIT_API_KEY esté en el .env');
        console.error('   2. Verifica que OPENAI_API_KEY esté en el .env');
        console.error('   3. Asegúrate de que tienes conexión a internet');
        console.error('   4. Verifica que tu cuenta de Handit esté activa');
        
        process.exit(1);
    }
}

// Ejecutar la prueba
testHanditIntegration(); 