import React, { useState, useCallback } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  Chip,
  Alert,
  CircularProgress,
  Grid,
  Paper,
  Divider,
  LinearProgress,
  Avatar,
  Stack,
  Fade,
  useTheme
} from '@mui/material';
import {
  CloudUpload,
  Description,
  SmartToy,
  AutoAwesome,
  CheckCircle,
  Link as LinkIcon,
  Assessment,
  Psychology,
  Upload,
  Insights
} from '@mui/icons-material';
import { useDropzone } from 'react-dropzone';
import DocumentUploader from '../components/DocumentUploader';
import ProcessingStatus from '../components/ProcessingStatus';
import ResultsDisplay from '../components/ResultsDisplay';
import ConnectionStatus from '../components/ConnectionStatus';
import { classifyDocument } from '../services/documentService';

const DocumentClassification = () => {
  const theme = useTheme();
  const [file, setFile] = useState(null);
  const [url, setUrl] = useState('');
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [processingStep, setProcessingStep] = useState('');

  const handleFileUpload = async (uploadedFile) => {
    setFile(uploadedFile);
    setUrl('');
    setError(null);
    await processDocument(uploadedFile, null);
  };

  const handleUrlSubmit = async () => {
    if (!url.trim()) return;
    setFile(null);
    setError(null);
    await processDocument(null, url.trim());
  };

  const processDocument = async (fileToProcess, urlToProcess) => {
    setProcessing(true);
    setResult(null);
    setError(null);

    try {
      setProcessingStep('Uploading document...');
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setProcessingStep('Extracting text content...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setProcessingStep('AI is analyzing the document...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setProcessingStep('Generating classification and summary...');
      
      const response = await classifyDocument(fileToProcess, urlToProcess);
      
      if (response && response.data) {
        setProcessingStep('Complete!');
        await new Promise(resolve => setTimeout(resolve, 500)); // Brief pause to show completion
        setResult(response.data);
      } else {
        throw new Error('Invalid response format from server');
      }
      
    } catch (err) {
      console.error('Error processing document:', err);
      setError(err.response?.data?.details || err.message || 'Error processing document');
    } finally {
      setProcessing(false);
    }
  };

  const reset = () => {
    setFile(null);
    setUrl('');
    setResult(null);
    setError(null);
    setProcessing(false);
    setProcessingStep('');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Animated background elements */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: `
            radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(120, 119, 198, 0.2) 0%, transparent 50%)
          `,
          animation: 'float 20s ease-in-out infinite'
        }}
      />
      
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            33% { transform: translateY(-10px) rotate(1deg); }
            66% { transform: translateY(5px) rotate(-1deg); }
          }
        `}
      </style>

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, py: 4 }}>
        {/* Header */}
        <Fade in timeout={1000}>
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  bgcolor: 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(10px)',
                  border: '2px solid rgba(255, 255, 255, 0.3)'
                }}
              >
                <SmartToy sx={{ fontSize: 40, color: 'white' }} />
              </Avatar>
            </Box>
            
            <Typography 
              variant="h2" 
              sx={{ 
                mb: 2,
                fontWeight: 700,
                color: 'white',
                textShadow: '0 2px 10px rgba(0,0,0,0.3)',
                fontSize: { xs: '2.5rem', md: '3.5rem' }
              }}
            >
              AI Document Classifier
            </Typography>
            
            <Typography 
              variant="h5" 
              sx={{ 
                mb: 4,
                color: 'rgba(255, 255, 255, 0.9)',
                fontWeight: 300,
                maxWidth: '600px',
                mx: 'auto'
              }}
            >
              Upload any document and let our AI analyze, classify, and summarize it instantly
            </Typography>

            {/* Feature chips */}
            <Stack 
              direction="row" 
              spacing={2} 
              sx={{ 
                justifyContent: 'center', 
                flexWrap: 'wrap',
                gap: 1
              }}
            >
              <Chip 
                icon={<Psychology />} 
                label="AI-Powered Analysis" 
                sx={{ 
                  bgcolor: 'rgba(255, 255, 255, 0.2)', 
                  color: 'white',
                  '& .MuiChip-icon': { color: 'white' }
                }} 
              />
              <Chip 
                icon={<Assessment />} 
                label="Smart Classification" 
                sx={{ 
                  bgcolor: 'rgba(255, 255, 255, 0.2)', 
                  color: 'white',
                  '& .MuiChip-icon': { color: 'white' }
                }} 
              />
              <Chip 
                icon={<Insights />} 
                label="Instant Summaries" 
                sx={{ 
                  bgcolor: 'rgba(255, 255, 255, 0.2)', 
                  color: 'white',
                  '& .MuiChip-icon': { color: 'white' }
                }} 
              />
            </Stack>
          </Box>
        </Fade>

        {/* Connection Status */}
        <ConnectionStatus />

        {/* Main Content */}
        <Grid container spacing={4} justifyContent="center">
          {!processing && !result && !error && (
            <Grid item xs={12} md={10} lg={8}>
              <Fade in timeout={1500}>
                <Card 
                  sx={{ 
                    bgcolor: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: '20px',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Typography variant="h5" sx={{ mb: 3, textAlign: 'center', fontWeight: 600 }}>
                      Choose Your Method
                    </Typography>
                    
                    <Grid container spacing={4} justifyContent="center">
                      {/* File Upload */}
                      <Grid item xs={12} md={6}>
                        <DocumentUploader 
                          onFileUpload={handleFileUpload}
                          disabled={processing}
                        />
                      </Grid>

                      {/* URL Input */}
                      <Grid item xs={12} md={6}>
                        <Paper 
                          sx={{ 
                            p: 3, 
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            bgcolor: 'rgba(103, 126, 234, 0.05)',
                            border: '2px dashed rgba(103, 126, 234, 0.3)',
                            borderRadius: '16px'
                          }}
                        >
                          <Box sx={{ textAlign: 'center', mb: 3 }}>
                            <LinkIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                            <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                              Or Enter URL
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              Provide a link to a document online
                            </Typography>
                          </Box>
                          
                          <TextField
                            fullWidth
                            placeholder="https://example.com/document.pdf"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            disabled={processing}
                            sx={{ mb: 2 }}
                            InputProps={{
                              sx: { borderRadius: '12px' }
                            }}
                          />
                          
                          <Button
                            variant="contained"
                            onClick={handleUrlSubmit}
                            disabled={!url.trim() || processing}
                            startIcon={<AutoAwesome />}
                            sx={{ 
                              borderRadius: '12px',
                              textTransform: 'none',
                              fontWeight: 600
                            }}
                          >
                            Analyze URL
                          </Button>
                        </Paper>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Fade>
            </Grid>
          )}

          {/* Processing Status */}
          {processing && (
            <Grid item xs={12} md={10} lg={8}>
              <ProcessingStatus step={processingStep} />
            </Grid>
          )}

          {/* Results */}
          {result && !processing && (
            <Grid item xs={12} md={10} lg={8}>
              <ResultsDisplay 
                result={result} 
                onReset={reset}
                source={file ? { type: 'file', name: file.name } : { type: 'url', url }}
              />
            </Grid>
          )}

          {/* Error */}
          {error && (
            <Grid item xs={12} md={10} lg={8}>
              <Fade in>
                <Alert 
                  severity="error" 
                  sx={{ 
                    borderRadius: '12px',
                    '& .MuiAlert-message': { fontSize: '1rem' }
                  }}
                  action={
                    <Button color="inherit" size="small" onClick={reset}>
                      Try Again
                    </Button>
                  }
                >
                  {error}
                </Alert>
              </Fade>
            </Grid>
          )}
        </Grid>

        {/* Footer */}
        <Box sx={{ textAlign: 'center', mt: 8, opacity: 0.8 }}>
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            Powered by OpenAI GPT-4 • Supports PDF, Images, Word, Excel, CSV, and Text files
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default DocumentClassification; 