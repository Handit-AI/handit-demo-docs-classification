import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Fade,
  Chip,
  Stack
} from '@mui/material';
import {
  CloudUpload,
  Psychology,
  AutoAwesome,
  CheckCircle,
  Description
} from '@mui/icons-material';

const ProcessingStatus = ({ step }) => {
  const steps = [
    { label: 'Uploading document...', icon: <CloudUpload />, color: '#2196f3' },
    { label: 'Extracting text content...', icon: <Description />, color: '#ff9800' },
    { label: 'AI is analyzing the document...', icon: <Psychology />, color: '#9c27b0' },
    { label: 'Generating classification and summary...', icon: <AutoAwesome />, color: '#4caf50' },
    { label: 'Complete!', icon: <CheckCircle />, color: '#4caf50' }
  ];

  const currentStepIndex = steps.findIndex(s => s.label === step);
  const currentStep = steps[currentStepIndex] || steps[0];

  return (
    <Fade in timeout={500}>
      <Card 
        sx={{ 
          bgcolor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderRadius: '20px',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
          overflow: 'hidden'
        }}
      >
        <CardContent sx={{ p: 4 }}>
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Box 
              sx={{ 
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 80,
                height: 80,
                borderRadius: '50%',
                bgcolor: `${currentStep.color}20`,
                mb: 2,
                animation: 'pulse 2s infinite'
              }}
            >
              <Box sx={{ 
                color: currentStep.color, 
                fontSize: 40,
                animation: 'rotate 2s linear infinite'
              }}>
                {currentStep.icon}
              </Box>
            </Box>
            
            <Typography 
              variant="h5" 
              sx={{ 
                mb: 1,
                fontWeight: 600,
                color: 'text.primary'
              }}
            >
              Processing Your Document
            </Typography>
            
            <Typography 
              variant="body1" 
              sx={{ 
                color: currentStep.color,
                fontWeight: 500,
                fontSize: '1.1rem'
              }}
            >
              {step}
            </Typography>
          </Box>

          {/* Progress Bar */}
          <Box sx={{ mb: 4 }}>
            <LinearProgress 
              variant="determinate"
              value={(currentStepIndex + 1) / steps.length * 100}
              sx={{
                height: 8,
                borderRadius: 4,
                bgcolor: 'rgba(0,0,0,0.1)',
                '& .MuiLinearProgress-bar': {
                  borderRadius: 4,
                  background: `linear-gradient(90deg, ${currentStep.color}, ${currentStep.color}dd)`
                }
              }}
            />
            <Typography 
              variant="body2" 
              color="textSecondary" 
              sx={{ textAlign: 'center', mt: 1 }}
            >
              Step {currentStepIndex + 1} of {steps.length}
            </Typography>
          </Box>

          {/* Steps Display */}
          <Stack spacing={2}>
            {steps.map((stepItem, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  p: 2,
                  borderRadius: '12px',
                  bgcolor: index <= currentStepIndex ? `${stepItem.color}10` : 'transparent',
                  transition: 'all 0.3s ease'
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    bgcolor: index <= currentStepIndex ? stepItem.color : 'rgba(0,0,0,0.1)',
                    color: index <= currentStepIndex ? 'white' : 'rgba(0,0,0,0.3)',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {stepItem.icon}
                </Box>
                
                <Typography
                  variant="body1"
                  sx={{
                    color: index <= currentStepIndex ? 'text.primary' : 'text.secondary',
                    fontWeight: index === currentStepIndex ? 600 : 400,
                    transition: 'all 0.3s ease'
                  }}
                >
                  {stepItem.label}
                </Typography>
                
                {index === currentStepIndex && (
                  <Chip
                    label="Processing..."
                    size="small"
                    sx={{
                      bgcolor: `${stepItem.color}20`,
                      color: stepItem.color,
                      fontWeight: 600,
                      animation: 'fadeInOut 2s infinite'
                    }}
                  />
                )}
                
                {index < currentStepIndex && (
                  <CheckCircle 
                    sx={{ 
                      color: stepItem.color,
                      ml: 'auto'
                    }} 
                  />
                )}
              </Box>
            ))}
          </Stack>
        </CardContent>

        <style>
          {`
            @keyframes pulse {
              0%, 100% { transform: scale(1); }
              50% { transform: scale(1.05); }
            }
            
            @keyframes rotate {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
            
            @keyframes fadeInOut {
              0%, 100% { opacity: 1; }
              50% { opacity: 0.5; }
            }
          `}
        </style>
      </Card>
    </Fade>
  );
};

export default ProcessingStatus; 