import React, { useState } from 'react';
import { Box, TextField, Button, Paper, Stack, Typography } from '@mui/material';
import ReactDatePicker from 'react-datepicker';
import { motion } from 'framer-motion';
import "react-datepicker/dist/react-datepicker.css";
import { FaPlane, FaCalendarAlt, FaMapMarkerAlt } from 'react-icons/fa';

const SearchForm = ({ onSearch, loading }) => {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState(new Date());

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({ from, to, date: date.toISOString().split('T')[0] });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Paper 
        elevation={3}
        sx={{
          p: 4,
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px'
        }}
      >
        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <Typography variant="h5" fontWeight="bold" color="primary">
              Find Your Perfect Trip
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Box sx={{ flex: 1, minWidth: '200px' }}>
                <TextField
                  fullWidth
                  label="From"
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  required
                  InputProps={{
                    startAdornment: <FaMapMarkerAlt style={{ marginRight: 8 }} />
                  }}
                />
              </Box>
              
              <Box sx={{ flex: 1, minWidth: '200px' }}>
                <TextField
                  fullWidth
                  label="To"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  required
                  InputProps={{
                    startAdornment: <FaPlane style={{ marginRight: 8 }} />
                  }}
                />
              </Box>
              
              <Box sx={{ flex: 1, minWidth: '200px' }}>
                <div className="custom-datepicker-wrapper">
                  <ReactDatePicker
                    selected={date}
                    onChange={(date) => setDate(date)}
                    dateFormat="yyyy-MM-dd"
                    minDate={new Date()}
                    customInput={
                      <TextField
                        fullWidth
                        label="Date"
                        value={date ? date.toLocaleDateString() : ''}
                        InputProps={{
                          startAdornment: <FaCalendarAlt style={{ marginRight: 8 }} />
                        }}
                      />
                    }
                  />
                </div>
              </Box>
            </Box>

            <Button
              variant="contained"
              type="submit"
              size="large"
              disabled={loading}
              sx={{
                py: 1.5,
                background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #1976D2 30%, #00B4D8 90%)',
                }
              }}
            >
              {loading ? 'Searching...' : 'Search'}
            </Button>
          </Stack>
        </form>
      </Paper>
    </motion.div>
  );
};

export default SearchForm;
