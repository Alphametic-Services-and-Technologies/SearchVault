import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Paper,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  Description as FileIcon,
  Description as FolderIcon,
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

interface DocItem {
  id: string;
  name: string;
  size: string;
  uploadedAt: string;
  type: string;
  content: string; // Add content field
}

// Configure axios base URL for your backend
const API_BASE_URL = 'https://searchvault-middleware.ast-lb.com'; // Your actual backend URL

const Docs: React.FC = () => {
  const theme = useTheme();
  
  const [docs, setDocs] = useState<DocItem[]>([]);
  const [uploadStatus, setUploadStatus] = useState<string>('');
  const [selectedDoc, setSelectedDoc] = useState<DocItem | null>(null);
  const [isViewing, setIsViewing] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch documents on component mount
  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/Docs`, {
        // Add authentication header if you have a token
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`, // Add your auth token here
        },
        // Add timeout to prevent hanging
        timeout: 10000, // 10 seconds
      });
      
      // Ensure response data is an array
      const documents = Array.isArray(response.data) ? response.data : [];
      setDocs(documents);
      
    } catch (error) {
      console.error('Failed to fetch documents:', error);
      
      // Set empty array on error to prevent map errors
      setDocs([]);
      
      if (axios.isAxiosError(error)) {
        console.error('Response:', error.response?.data);
        console.error('Status:', error.response?.status);
        
        if (error.response?.status === 401) {
          console.error('Authentication required - please log in');
        } else if (error.code === 'ERR_NETWORK') {
          console.error('Network error - CORS or connection issue');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get auth token (you'll need to implement this based on your auth system)
  const getAuthToken = () => {
    // Replace this with your actual token retrieval logic
    const token = localStorage.getItem('authToken') || 
                  sessionStorage.getItem('authToken') || 
                  localStorage.getItem('token') ||
                  sessionStorage.getItem('token') || 
                  '';
    
    if (!token) {
      console.warn('No authentication token found. You may need to log in first.');
    }
    
    return token;
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    setUploadStatus(`Uploading ${file.name}...`);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post(`${API_BASE_URL}/Docs/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${getAuthToken()}`, // Add authentication
        },
        // Remove withCredentials for now due to CORS wildcard issue
        // withCredentials: true,
        // Optional: Add upload progress
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadStatus(`Uploading ${file.name}... ${progress}%`);
          }
        },
      });

      // Add the uploaded document to the list
      setDocs([response.data, ...docs]);
      setUploadStatus(`Successfully uploaded ${file.name}!`);
      
    } catch (error) {
      console.error('Upload error:', error);
      
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || error.response?.data || 'Upload failed';
        
        if (error.response?.status === 401) {
          setUploadStatus(`Authentication required. Please log in and try again.`);
        } else if (error.response?.status === 403) {
          setUploadStatus(`Access denied. You don't have permission to upload files.`);
        } else {
          setUploadStatus(`Failed to upload ${file.name}: ${errorMessage}`);
        }
      } else {
        setUploadStatus(`Network error uploading ${file.name}. Please check your connection.`);
      }
    }

    setTimeout(() => setUploadStatus(''), 4000);
    event.target.value = '';
  };

  const handleViewDoc = (doc: DocItem) => {
    setSelectedDoc(doc);
    setIsViewing(true);
  };

  const handleCloseDialog = () => {
    setIsViewing(false);
    setSelectedDoc(null);
  };

  return (
    <Box sx={{ height: '100%', overflow: 'auto' }}>
      {/* Header */}
      <Paper sx={{ p: 3, mb: 3, backgroundColor: theme.palette.primary.main, color: 'white' }}>
        <Box display="flex" alignItems="center" gap={2}>
          <FolderIcon sx={{ fontSize: 32 }} />
          <Box>
            <Typography variant="h5" fontWeight="bold">
              Documents
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Upload and manage your files
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Upload Section */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Upload New Document
        </Typography>
        <input
          accept=".pdf,.doc,.docx,.txt,.xls,.xlsx,.ppt,.pptx"
          style={{ display: 'none' }}
          id="upload-button"
          type="file"
          onChange={handleFileUpload}
        />
        <label htmlFor="upload-button">
          <Button
            variant="contained"
            component="span"
            startIcon={<UploadIcon />}
            size="large"
          >
            Choose File to Upload
          </Button>
        </label>
        
        {uploadStatus && (
          <Alert severity="info" sx={{ mt: 2 }}>
            {uploadStatus}
          </Alert>
        )}
      </Paper>

      {/* Documents List */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Your Documents ({docs.length})
        </Typography>
        
        {docs.length === 0 && !loading ? (
          <Box textAlign="center" py={4}>
            <Typography color="text.secondary" gutterBottom>
              No documents uploaded yet
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {/* Show helpful message if there are API connection issues */}
              {window.navigator.onLine ? 
                'Upload a file to get started' : 
                'Check your internet connection'
              }
            </Typography>
          </Box>
        ) : loading ? (
          <Typography color="text.secondary" textAlign="center" py={4}>
            Loading documents...
          </Typography>
        ) : (
          <List>
            {Array.isArray(docs) && docs.map((doc, index) => (
              <React.Fragment key={doc.id}>
                <ListItem>
                  <ListItemIcon>
                    <FileIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary={doc.name}
                    secondary={`${doc.size} • Uploaded ${doc.uploadedAt}`}
                  />
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleViewDoc(doc)}
                  >
                    View
                  </Button>
                </ListItem>
                {index < docs.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        )}
      </Paper>

      {/* View Document Dialog */}
      <Dialog open={isViewing} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1}>
            <FileIcon color="primary" />
            <Typography variant="h6">{selectedDoc?.name}</Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            File size: {selectedDoc?.size} • Uploaded: {selectedDoc?.uploadedAt}
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Box
            sx={{
              backgroundColor: '#f5f5f5',
              p: 2,
              borderRadius: 1,
              maxHeight: 400,
              overflow: 'auto',
              fontFamily: 'monospace',
              fontSize: '0.875rem',
              whiteSpace: 'pre-wrap',
              wordWrap: 'break-word'
            }}
          >
            {selectedDoc?.content}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
          <Button variant="contained" onClick={handleCloseDialog}>
            Download
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Docs;