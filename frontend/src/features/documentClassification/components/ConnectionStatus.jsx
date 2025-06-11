import React, { useState, useEffect } from 'react';
import {
  Box,
  Alert,
  AlertTitle,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Chip,
  Stack,
  IconButton,
  Collapse
} from '@mui/material';
import {
  CheckCircle,
  Error,
  Refresh,
  Info,
  Close,
  Settings
} from '@mui/icons-material';
import { testConnection } from '../services/documentService';

const ConnectionStatus = () => {
  const [connected, setConnected] = useState(null);
  const [checking, setChecking] = useState(false);
  const [showSetup, setShowSetup] = useState(false);
  const [showAlert, setShowAlert] = useState(true);

  const checkConnection = async () => {
    setChecking(true);
    try {
      const isConnected = await testConnection();
      setConnected(isConnected);
    } catch (error) {
      setConnected(false);
    }
    setChecking(false);
  };

  useEffect(() => {
    checkConnection();
  }, []);

  if (connected === true) {
    return null; // Don't show anything if connected
  }

  return (
    <>
      <Collapse in={showAlert && connected === false}>
        <Alert 
          severity="warning" 
          sx={{ 
            mb: 3,
            borderRadius: '12px',
            '& .MuiAlert-message': { width: '100%' }
          }}
          action={
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton 
                color="inherit" 
                size="small" 
                onClick={() => setShowSetup(true)}
              >
                <Settings />
              </IconButton>
              <IconButton 
                color="inherit" 
                size="small" 
                onClick={checkConnection}
                disabled={checking}
              >
                <Refresh />
              </IconButton>
              <IconButton 
                color="inherit" 
                size="small" 
                onClick={() => setShowAlert(false)}
              >
                <Close />
              </IconButton>
            </Box>
          }
        >
          <AlertTitle sx={{ fontWeight: 600 }}>
            Backend Connection Required
          </AlertTitle>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Cannot connect to the backend server. Please ensure the server is running and configured properly.
          </Typography>
          
          <Stack direction="row" spacing={1} flexWrap="wrap">
            <Button 
              size="small" 
              startIcon={<Info />}
              onClick={() => setShowSetup(true)}
              sx={{ textTransform: 'none' }}
            >
              Setup Instructions
            </Button>
            <Button 
              size="small" 
              startIcon={<Refresh />}
              onClick={checkConnection}
              disabled={checking}
              sx={{ textTransform: 'none' }}
            >
              {checking ? 'Checking...' : 'Retry Connection'}
            </Button>
          </Stack>
        </Alert>
      </Collapse>

      {/* Setup Instructions Dialog */}
      <Dialog 
        open={showSetup} 
        onClose={() => setShowSetup(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Settings color="primary" />
          Backend Setup Instructions
        </DialogTitle>
        
        <DialogContent>
          <Stack spacing={3}>
            {/* Step 1 */}
            <Box>
              <Typography variant="h6" sx={{ mb: 1, color: 'primary.main' }}>
                1. Start the Backend Server
              </Typography>
              <Box sx={{ bgcolor: 'rgba(0,0,0,0.05)', p: 2, borderRadius: 1, mb: 2 }}>
                <Typography variant="body2" component="pre" sx={{ fontFamily: 'monospace' }}>
                  cd backend{'\n'}npm run dev
                </Typography>
              </Box>
              <Typography variant="body2" color="textSecondary">
                This will start the server on http://localhost:3000
              </Typography>
            </Box>

            {/* Step 2 */}
            <Box>
              <Typography variant="h6" sx={{ mb: 1, color: 'primary.main' }}>
                2. Configure OpenAI API Key
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Create a <strong>.env</strong> file in the backend directory with:
              </Typography>
              <Box sx={{ bgcolor: 'rgba(0,0,0,0.05)', p: 2, borderRadius: 1, mb: 2 }}>
                <Typography variant="body2" component="pre" sx={{ fontFamily: 'monospace' }}>
                  PORT=3000{'\n'}OPENAI_API_KEY=your_openai_api_key_here
                </Typography>
              </Box>
              <Typography variant="body2" color="textSecondary">
                Get your API key from: <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener">https://platform.openai.com/api-keys</a>
              </Typography>
            </Box>

            {/* Step 3 */}
            <Box>
              <Typography variant="h6" sx={{ mb: 1, color: 'primary.main' }}>
                3. Supported File Types
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 2 }}>
                {['PDF', 'Images (JPG, PNG)', 'Word (.docx)', 'Excel (.xlsx)', 'CSV', 'Text'].map((type) => (
                  <Chip key={type} label={type} size="small" variant="outlined" />
                ))}
              </Stack>
            </Box>

            {/* Connection Status */}
            <Box sx={{ p: 2, bgcolor: 'rgba(0,0,0,0.02)', borderRadius: 1 }}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Current Status:</strong>
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {connected === null ? (
                  <>
                    <Chip label="Checking..." size="small" color="default" />
                  </>
                ) : connected ? (
                  <>
                    <CheckCircle sx={{ color: 'success.main' }} />
                    <Chip label="Connected" size="small" color="success" />
                  </>
                ) : (
                  <>
                    <Error sx={{ color: 'error.main' }} />
                    <Chip label="Disconnected" size="small" color="error" />
                  </>
                )}
              </Box>
            </Box>
          </Stack>
        </DialogContent>
        
        <DialogActions>
          <Button onClick={checkConnection} disabled={checking}>
            {checking ? 'Checking...' : 'Test Connection'}
          </Button>
          <Button onClick={() => setShowSetup(false)} variant="contained">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ConnectionStatus; 