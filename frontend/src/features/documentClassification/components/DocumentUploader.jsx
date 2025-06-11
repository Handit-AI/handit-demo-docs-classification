import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  Box,
  Typography,
  Paper,
  Button,
  LinearProgress,
  Chip,
  Stack
} from '@mui/material';
import {
  CloudUpload,
  Description,
  Image,
  PictureAsPdf,
  TableChart
} from '@mui/icons-material';

const DocumentUploader = ({ onFileUpload, disabled }) => {
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      onFileUpload(acceptedFiles[0]);
    }
  }, [onFileUpload]);

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragReject
  } = useDropzone({
    onDrop,
    disabled,
    multiple: false,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.jpg', '.jpeg', '.png'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/msword': ['.doc'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'text/csv': ['.csv'],
      'text/plain': ['.txt']
    }
  });

  const supportedTypes = [
    { icon: <PictureAsPdf />, label: 'PDF', color: '#f44336' },
    { icon: <Image />, label: 'Images', color: '#4caf50' },
    { icon: <Description />, label: 'Word', color: '#2196f3' },
    { icon: <TableChart />, label: 'Excel/CSV', color: '#ff9800' },
    { icon: <Description />, label: 'Text', color: '#9c27b0' }
  ];

  return (
    <Paper
      {...getRootProps()}
      sx={{
        p: 3,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: disabled ? 'not-allowed' : 'pointer',
        bgcolor: isDragActive 
          ? 'rgba(103, 126, 234, 0.1)' 
          : isDragReject 
            ? 'rgba(244, 67, 54, 0.1)'
            : 'rgba(103, 126, 234, 0.05)',
        border: `2px dashed ${
          isDragActive 
            ? '#667eea' 
            : isDragReject 
              ? '#f44336' 
              : 'rgba(103, 126, 234, 0.3)'
        }`,
        borderRadius: '16px',
        transition: 'all 0.3s ease',
        '&:hover': disabled ? {} : {
          bgcolor: 'rgba(103, 126, 234, 0.1)',
          borderColor: '#667eea',
          transform: 'scale(1.02)'
        }
      }}
    >
      <input {...getInputProps()} />
      
      <CloudUpload 
        sx={{ 
          fontSize: 64, 
          color: isDragReject ? 'error.main' : 'primary.main',
          mb: 2,
          transition: 'all 0.3s ease'
        }} 
      />
      
      <Typography 
        variant="h6" 
        sx={{ 
          mb: 1, 
          fontWeight: 600,
          color: isDragReject ? 'error.main' : 'text.primary'
        }}
      >
        {isDragActive 
          ? 'Drop your file here' 
          : isDragReject 
            ? 'File type not supported'
            : 'Drag & drop your document'
        }
      </Typography>
      
      <Typography 
        variant="body2" 
        color="textSecondary" 
        sx={{ mb: 3, textAlign: 'center' }}
      >
        {isDragReject 
          ? 'Please upload a supported file type'
          : 'or click to browse your files'
        }
      </Typography>
      
      <Button
        variant="contained"
        disabled={disabled}
        sx={{ 
          mb: 3,
          borderRadius: '12px',
          textTransform: 'none',
          fontWeight: 600
        }}
      >
        Choose File
      </Button>
      
      <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
        Supported formats:
      </Typography>
      
      <Stack direction="row" spacing={1} flexWrap="wrap" justifyContent="center">
        {supportedTypes.map((type, index) => (
          <Chip
            key={index}
            icon={type.icon}
            label={type.label}
            size="small"
            sx={{
              bgcolor: `${type.color}20`,
              color: type.color,
              '& .MuiChip-icon': { color: type.color },
              mb: 1
            }}
          />
        ))}
      </Stack>
    </Paper>
  );
};

export default DocumentUploader; 