import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Button,
  Divider,
  Grid,
  Paper,
  Fade,
  Stack,
  Avatar,
  IconButton,
  LinearProgress,
  Zoom,
  Slide
} from '@mui/material';
import {
  AutoAwesome,
  Category,
  Description,
  AccessTime,
  FileDownload,
  Refresh,
  CheckCircle,
  Psychology,
  Insights,
  DataUsage,
  Star,
  TrendingUp,
  Speed,
  CloudDone,
  Assignment,
  Timeline,
  Lightbulb,
  VerifiedUser
} from '@mui/icons-material';

const ResultsDisplay = ({ result, onReset, source }) => {
  if (!result) {
    return (
      <Alert severity="error">
        No result data available
      </Alert>
    );
  }
  
  const { classification, summary, metadata } = result;

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getClassificationColor = (classification) => {
    const colors = {
      'technical': '#2196f3',
      'business': '#4caf50', 
      'legal': '#ff9800',
      'financial': '#9c27b0',
      'medical': '#f44336',
      'educational': '#00bcd4',
      'personal': '#795548'
    };
    
    const type = classification?.type?.toLowerCase() || 'other';
    return colors[type] || '#667eea';
  };

  const getConfidenceColor = (confidence) => {
    const level = confidence?.toLowerCase() || '';
    if (level.includes('alto') || level.includes('high')) return '#4caf50';
    if (level.includes('medio') || level.includes('medium')) return '#ff9800';
    if (level.includes('bajo') || level.includes('low')) return '#f44336';
    return '#607d8b';
  };

  return (
    <Fade in timeout={800}>
      <Box>
        {/* Success Header with Animation */}
        <Zoom in timeout={1000}>
          <Card 
            sx={{ 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '24px',
              mb: 4,
              overflow: 'hidden',
              position: 'relative'
            }}
          >
            {/* Decorative elements */}
            <Box
              sx={{
                position: 'absolute',
                top: -50,
                right: -50,
                width: 200,
                height: 200,
                background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
                borderRadius: '50%'
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                bottom: -30,
                left: -30,
                width: 150,
                height: 150,
                background: 'radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%)',
                borderRadius: '50%'
              }}
            />
            
            <CardContent sx={{ p: 4, textAlign: 'center', position: 'relative', zIndex: 1 }}>
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  bgcolor: 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(10px)',
                  border: '3px solid rgba(255, 255, 255, 0.3)',
                  mx: 'auto',
                  mb: 3,
                  animation: 'pulse 2s infinite'
                }}
              >
                <CheckCircle sx={{ fontSize: 40, color: 'white' }} />
              </Avatar>
              
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 700, 
                  color: 'white', 
                  mb: 2,
                  textShadow: '0 2px 10px rgba(0,0,0,0.3)'
                }}
              >
                Analysis Complete!
              </Typography>
              
              <Typography 
                variant="h6" 
                sx={{ 
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontWeight: 300,
                  mb: 2
                }}
              >
                Your document has been successfully analyzed by AI
              </Typography>

              <Stack direction="row" spacing={1} justifyContent="center" flexWrap="wrap">
                <Chip 
                  icon={<Star />}
                  label="AI Powered"
                  sx={{ 
                    bgcolor: 'rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    backdropFilter: 'blur(10px)',
                    '& .MuiChip-icon': { color: 'white' }
                  }}
                />
                <Chip 
                  icon={<Speed />}
                  label={`${metadata?.processing_time_ms || '---'}ms`}
                  sx={{ 
                    bgcolor: 'rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    backdropFilter: 'blur(10px)',
                    '& .MuiChip-icon': { color: 'white' }
                  }}
                />
                <Chip 
                  icon={<VerifiedUser />}
                  label="Secure"
                  sx={{ 
                    bgcolor: 'rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    backdropFilter: 'blur(10px)',
                    '& .MuiChip-icon': { color: 'white' }
                  }}
                />
              </Stack>
            </CardContent>

            <style>
              {`
                @keyframes pulse {
                  0%, 100% { transform: scale(1); }
                  50% { transform: scale(1.05); }
                }
                @keyframes glow {
                  0% { 
                    opacity: 0.5;
                    filter: blur(8px);
                  }
                  100% { 
                    opacity: 0.8;
                    filter: blur(12px);
                  }
                }
              `}
            </style>
          </Card>
        </Zoom>

        <Grid container spacing={3}>
          {/* Classification Results */}
          <Grid item xs={12} md={6} lg={4}>
            <Slide direction="right" in timeout={1200}>
              <Card 
                sx={{ 
                  height: '100%',
                  background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
                  borderRadius: '20px',
                  border: '1px solid rgba(103, 126, 234, 0.1)',
                  boxShadow: '0 10px 40px rgba(103, 126, 234, 0.1)',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 20px 60px rgba(103, 126, 234, 0.15)'
                  }
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                    <Avatar 
                      sx={{ 
                        bgcolor: `${getClassificationColor(classification)}15`,
                        border: `2px solid ${getClassificationColor(classification)}30`,
                        mr: 2,
                        width: 56,
                        height: 56
                      }}
                    >
                      <Category sx={{ color: getClassificationColor(classification), fontSize: 28 }} />
                    </Avatar>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }}>
                        Classification
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Document analysis results
                      </Typography>
                    </Box>
                  </Box>

                  <Stack spacing={3}>
                    {/* Document Type */}
                    <Box>
                      <Typography variant="body2" color="textSecondary" sx={{ mb: 1.5, fontWeight: 600 }}>
                        📄 Document Type
                      </Typography>
                      <Chip 
                        label={classification?.type || 'Unknown'}
                        sx={{ 
                          bgcolor: `${getClassificationColor(classification)}20`,
                          color: getClassificationColor(classification),
                          fontWeight: 700,
                          fontSize: '0.95rem',
                          height: '40px',
                          px: 2,
                          borderRadius: '12px',
                          border: `2px solid ${getClassificationColor(classification)}30`
                        }}
                      />
                    </Box>

                    {/* Category */}
                    {classification?.category && (
                      <Box>
                        <Typography variant="body2" color="textSecondary" sx={{ mb: 1.5, fontWeight: 600 }}>
                          🏷️ Category
                        </Typography>
                        <Chip 
                          label={classification.category}
                          variant="outlined"
                          sx={{ 
                            borderColor: `${getClassificationColor(classification)}50`,
                            color: getClassificationColor(classification),
                            fontWeight: 600,
                            height: '36px',
                            borderRadius: '10px'
                          }}
                        />
                      </Box>
                    )}

                    {/* Confidence */}
                    {classification?.confidence && (
                      <Box>
                        <Typography variant="body2" color="textSecondary" sx={{ mb: 1.5, fontWeight: 600 }}>
                          🎯 Confidence Level
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Chip 
                            label={classification.confidence}
                            sx={{ 
                              bgcolor: `${getConfidenceColor(classification.confidence)}20`,
                              color: getConfidenceColor(classification.confidence),
                              fontWeight: 600,
                              height: '36px',
                              borderRadius: '10px',
                              border: `2px solid ${getConfidenceColor(classification.confidence)}30`
                            }}
                          />
                        </Box>
                      </Box>
                    )}

                    {/* Keywords/Tags */}
                    {classification?.keywords && Array.isArray(classification.keywords) && classification.keywords.length > 0 && (
                      <Box>
                        <Typography variant="body2" color="textSecondary" sx={{ mb: 1.5, fontWeight: 600 }}>
                          🔖 Keywords
                        </Typography>
                        <Stack direction="row" spacing={1} flexWrap="wrap">
                          {classification.keywords.slice(0, 5).map((keyword, index) => (
                            <Chip 
                              key={index}
                              label={keyword}
                              size="small"
                              sx={{ 
                                mb: 1,
                                bgcolor: 'rgba(103, 126, 234, 0.1)',
                                color: '#667eea',
                                fontWeight: 500,
                                '&:hover': { bgcolor: 'rgba(103, 126, 234, 0.2)' }
                              }}
                            />
                          ))}
                        </Stack>
                      </Box>
                    )}
                  </Stack>
                </CardContent>
              </Card>
            </Slide>
          </Grid>

          {/* AI Summary */}
          <Grid item xs={12} md={6} lg={8}>
            <Slide direction="left" in timeout={1400}>
              <Card 
                sx={{ 
                  height: '100%',
                  background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
                  borderRadius: '20px',
                  border: '1px solid rgba(103, 126, 234, 0.1)',
                  boxShadow: '0 10px 40px rgba(103, 126, 234, 0.1)',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 20px 60px rgba(103, 126, 234, 0.15)'
                  }
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                    <Avatar 
                      sx={{ 
                        bgcolor: 'rgba(103, 126, 234, 0.15)', 
                        border: '2px solid rgba(103, 126, 234, 0.3)',
                        mr: 2,
                        width: 56,
                        height: 56
                      }}
                    >
                      <Psychology sx={{ color: '#667eea', fontSize: 28 }} />
                    </Avatar>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }}>
                        AI Summary
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Intelligent content analysis
                      </Typography>
                    </Box>
                  </Box>

                  {/* Main Summary */}
                  <Paper 
                    sx={{ 
                      p: 3, 
                      mb: 3, 
                      bgcolor: 'rgba(103, 126, 234, 0.05)',
                      border: '1px solid rgba(103, 126, 234, 0.1)',
                      borderRadius: '16px',
                      borderLeft: '4px solid #667eea'
                    }}
                  >
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        lineHeight: 1.8,
                        color: 'text.primary',
                        fontSize: '1rem',
                        fontWeight: 400
                      }}
                    >
                      {typeof summary === 'string' 
                        ? summary 
                        : summary?.summary || summary?.main_purpose || 'No summary available for this document.'
                      }
                    </Typography>
                  </Paper>

                  {/* Key Points */}
                  {typeof summary === 'object' && summary?.key_points && Array.isArray(summary.key_points) && (
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Lightbulb sx={{ color: '#667eea', mr: 1 }} />
                        <Typography variant="h6" sx={{ fontWeight: 600, color: '#667eea' }}>
                          Key Insights
                        </Typography>
                      </Box>
                      <Stack spacing={2}>
                        {summary.key_points.slice(0, 4).map((point, index) => (
                          <Box 
                            key={index} 
                            sx={{ 
                              display: 'flex', 
                              alignItems: 'flex-start', 
                              gap: 2,
                              p: 2,
                              borderRadius: '12px',
                              bgcolor: 'rgba(76, 175, 80, 0.05)',
                              border: '1px solid rgba(76, 175, 80, 0.1)',
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                bgcolor: 'rgba(76, 175, 80, 0.1)',
                                transform: 'translateX(4px)'
                              }
                            }}
                          >
                            <Box sx={{ 
                              width: 24, 
                              height: 24, 
                              borderRadius: '50%', 
                              bgcolor: '#4caf50',
                              color: 'white',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '0.8rem',
                              fontWeight: 700,
                              flexShrink: 0,
                              mt: 0.25
                            }}>
                              {index + 1}
                            </Box>
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                fontSize: '0.95rem',
                                lineHeight: 1.6,
                                color: 'text.primary'
                              }}
                            >
                              {point}
                            </Typography>
                          </Box>
                        ))}
                      </Stack>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Slide>
          </Grid>

          {/* Processing Details */}
          <Grid item xs={12}>
            <Slide direction="up" in timeout={1600}>
              <Card 
                sx={{ 
                  background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
                  borderRadius: '20px',
                  border: '1px solid rgba(103, 126, 234, 0.1)',
                  boxShadow: '0 10px 40px rgba(103, 126, 234, 0.1)'
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                    <Avatar 
                      sx={{ 
                        bgcolor: 'rgba(255, 152, 0, 0.15)', 
                        border: '2px solid rgba(255, 152, 0, 0.3)',
                        mr: 2,
                        width: 56,
                        height: 56
                      }}
                    >
                      <Timeline sx={{ color: '#ff9800', fontSize: 28 }} />
                    </Avatar>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }}>
                        Processing Details
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Technical information and metrics
                      </Typography>
                    </Box>
                  </Box>

                  <Grid container spacing={2} justifyContent="center">
                    {/* Processing Time */}
                    <Grid item xs={6} sm={6} md={3}>
                      <Paper 
                        sx={{ 
                          p: 2.5, 
                          textAlign: 'center', 
                          borderRadius: '16px',
                          bgcolor: 'rgba(33, 150, 243, 0.05)',
                          border: '1px solid rgba(33, 150, 243, 0.1)',
                          transition: 'all 0.3s ease',
                          height: '140px',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: '0 12px 32px rgba(33, 150, 243, 0.2)'
                          }
                        }}
                      >
                        <Avatar sx={{ bgcolor: '#2196f3', mx: 'auto', mb: 1.5, width: 40, height: 40 }}>
                          <Speed sx={{ color: 'white', fontSize: '1.2rem' }} />
                        </Avatar>
                        <Typography variant="body2" color="textSecondary" sx={{ mb: 0.5, fontWeight: 600, fontSize: '0.8rem' }}>
                          Processing Time
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: '#2196f3', fontSize: '1.1rem' }}>
                          {metadata?.processing_time_ms ? `${metadata.processing_time_ms}ms` : 'N/A'}
                        </Typography>
                      </Paper>
                    </Grid>

                    {/* Source Type */}
                    <Grid item xs={6} sm={6} md={3}>
                      <Paper 
                        sx={{ 
                          p: 2.5, 
                          textAlign: 'center', 
                          borderRadius: '16px',
                          bgcolor: 'rgba(76, 175, 80, 0.05)',
                          border: '1px solid rgba(76, 175, 80, 0.1)',
                          transition: 'all 0.3s ease',
                          height: '140px',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: '0 12px 32px rgba(76, 175, 80, 0.2)'
                          }
                        }}
                      >
                        <Avatar sx={{ bgcolor: '#4caf50', mx: 'auto', mb: 1.5, width: 40, height: 40 }}>
                          <CloudDone sx={{ color: 'white', fontSize: '1.2rem' }} />
                        </Avatar>
                        <Typography variant="body2" color="textSecondary" sx={{ mb: 0.5, fontWeight: 600, fontSize: '0.8rem' }}>
                          Source Type
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: '#4caf50', fontSize: '1.1rem' }}>
                          {source?.type === 'file' ? 'File Upload' : 'URL'}
                        </Typography>
                      </Paper>
                    </Grid>

                    {/* File Size */}
                    {source?.type === 'file' && metadata?.source?.size && (
                      <Grid item xs={6} sm={6} md={3}>
                        <Paper 
                          sx={{ 
                            p: 2.5, 
                            textAlign: 'center', 
                            borderRadius: '16px',
                            bgcolor: 'rgba(156, 39, 176, 0.05)',
                            border: '1px solid rgba(156, 39, 176, 0.1)',
                            transition: 'all 0.3s ease',
                            height: '140px',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            '&:hover': {
                              transform: 'translateY(-4px)',
                              boxShadow: '0 12px 32px rgba(156, 39, 176, 0.2)'
                            }
                          }}
                        >
                          <Avatar sx={{ bgcolor: '#9c27b0', mx: 'auto', mb: 1.5, width: 40, height: 40 }}>
                            <DataUsage sx={{ color: 'white', fontSize: '1.2rem' }} />
                          </Avatar>
                          <Typography variant="body2" color="textSecondary" sx={{ mb: 0.5, fontWeight: 600, fontSize: '0.8rem' }}>
                            File Size
                          </Typography>
                          <Typography variant="h6" sx={{ fontWeight: 700, color: '#9c27b0', fontSize: '1.1rem' }}>
                            {formatFileSize(metadata.source.size)}
                          </Typography>
                        </Paper>
                      </Grid>
                    )}

                    {/* AI Model */}
                    <Grid item xs={6} sm={6} md={3}>
                      <Paper 
                        sx={{ 
                          p: 2.5, 
                          textAlign: 'center', 
                          borderRadius: '16px',
                          bgcolor: 'rgba(255, 152, 0, 0.05)',
                          border: '1px solid rgba(255, 152, 0, 0.1)',
                          transition: 'all 0.3s ease',
                          height: '140px',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: '0 12px 32px rgba(255, 152, 0, 0.2)'
                          }
                        }}
                      >
                        <Avatar sx={{ bgcolor: '#ff9800', mx: 'auto', mb: 1.5, width: 40, height: 40 }}>
                          <Psychology sx={{ color: 'white', fontSize: '1.2rem' }} />
                        </Avatar>
                        <Typography variant="body2" color="textSecondary" sx={{ mb: 0.5, fontWeight: 600, fontSize: '0.8rem' }}>
                          AI Model
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: '#ff9800', fontSize: '1.1rem' }}>
                          GPT-4
                        </Typography>
                      </Paper>
                    </Grid>
                  </Grid>

                  {/* Source Info */}
                  <Box sx={{ mt: 4 }}>
                    <Paper 
                      sx={{ 
                        p: 3, 
                        borderRadius: '16px',
                        bgcolor: 'rgba(103, 126, 234, 0.05)',
                        border: '1px solid rgba(103, 126, 234, 0.1)',
                        borderLeft: '4px solid #667eea'
                      }}
                    >
                      <Typography variant="body2" color="textSecondary" sx={{ mb: 1, fontWeight: 600 }}>
                        📋 Source Document
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500, color: 'text.primary' }}>
                        {source?.type === 'file' 
                          ? `📄 ${source.name}`
                          : `🔗 ${source.url}`
                        }
                      </Typography>
                    </Paper>
                  </Box>
                </CardContent>
              </Card>
            </Slide>
          </Grid>

          {/* Action Button */}
          <Grid item xs={12}>
            <Zoom in timeout={1800}>
              <Box 
                sx={{ 
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  mt: 6,
                  mb: 2
                }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: '24px',
                    p: 2,
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  {/* Decorative glow effect */}
                  <Box
                    sx={{
                      position: 'absolute',
                      top: -2,
                      left: -2,
                      right: -2,
                      bottom: -2,
                      background: 'linear-gradient(135deg, #667eea, #764ba2, #667eea)',
                      borderRadius: '26px',
                      zIndex: -1,
                      animation: 'glow 3s ease-in-out infinite alternate'
                    }}
                  />
                  
                  <Button
                    variant="contained"
                    onClick={onReset}
                    startIcon={<Refresh sx={{ fontSize: '1.5rem' }} />}
                    size="large"
                    sx={{ 
                      borderRadius: '20px',
                      textTransform: 'none',
                      fontWeight: 800,
                      fontSize: '1.25rem',
                      px: 8,
                      py: 3,
                      background: 'rgba(255, 255, 255, 0.95)',
                      color: '#667eea',
                      boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                      backdropFilter: 'blur(10px)',
                      border: '2px solid rgba(255,255,255,0.2)',
                      '&:hover': {
                        background: 'rgba(255, 255, 255, 1)',
                        transform: 'translateY(-4px) scale(1.02)',
                        boxShadow: '0 16px 64px rgba(103, 126, 234, 0.3)',
                        '& .MuiButton-startIcon': {
                          transform: 'rotate(180deg)',
                          transition: 'transform 0.3s ease'
                        }
                      },
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      '& .MuiButton-startIcon': {
                        transition: 'transform 0.3s ease'
                      }
                    }}
                  >
                    🚀 Analyze Another Document
                  </Button>
                </Paper>
              </Box>
            </Zoom>
          </Grid>
        </Grid>
      </Box>
    </Fade>
  );
};

export default ResultsDisplay; 