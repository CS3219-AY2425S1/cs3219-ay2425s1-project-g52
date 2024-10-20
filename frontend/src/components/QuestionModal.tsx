import React, { useState, useEffect } from 'react';
import { Modal, Box, TextField, Button, Select, MenuItem, InputLabel } from '@mui/material';
import { Question } from '../api/interfaces';

interface QuestionModalProps {
  open: boolean;
  onClose: () => void;
  question: Question | null;
  onAdd: (newData: Omit<Question, '_id'>) => void;
  onEdit: (id: string, updatedData: Partial<Question>) => void;
}

const QuestionModal: React.FC<QuestionModalProps> = ({ open, onClose, question, onAdd, onEdit }) => {
  const [formData, setFormData] = useState<Partial<Question>>({
    qTitle: '',
    qDescription: '',
    qCategory: [],
    qComplexity: '',
  });


  useEffect(() => {
    if (question) {
      setFormData({
        qTitle: question.qTitle,
        qDescription: question.qDescription,
        qCategory: question.qCategory,
        qComplexity: question.qComplexity,
      });
    } else {
      setFormData({
          qTitle: '',
          qDescription: '',
          qCategory: [],
          qComplexity: '',
      }); 
    }
  }, [question]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === 'qCategory') {
      setFormData({
        ...formData,
        qCategory: value ? value.split(',').map(item => item.trim()) : [],
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = () => {
    if (question) {
      onEdit(question._id || '', formData);
    } else {
      onAdd(formData as Omit<Question, '_id'>);
    }
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ padding: 2, backgroundColor: 'white', borderRadius: 1 }}>
        <h2>{question ? 'Edit Question' : 'Add Question'}</h2>
        <TextField
          name="qTitle"
          label="Title"
          value={formData.qTitle || ''}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          name="qDescription"
          label="Description"
          value={formData.qDescription || ''}
          onChange={handleChange}
          fullWidth
          margin="normal"
          multiline
        />
        <TextField
          name="qCategory"
          label="Category"
          value={formData.qCategory?.join(', ') || ''}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <InputLabel sx={{fontSize: '12px'}}>
          Complexity
        </InputLabel>
        <Select
          name="qComplexity"
          label="Complexity"
          value={formData.qComplexity || ''}
          onChange={(event) => {
            handleChange(event as unknown as React.ChangeEvent<HTMLSelectElement>);
          }}
          fullWidth
        >
          <MenuItem value="Easy">Easy</MenuItem>
          <MenuItem value="Medium">Medium</MenuItem>
          <MenuItem value="Hard">Hard</MenuItem>
        </Select>
        <Button variant="contained" color="error" onClick={onClose} style={{margin:'4px'}}>
          Cancel
        </Button>
        <Button variant="contained" color="primary" onClick={handleSubmit} style={{margin:'4px'}}>
          Save
        </Button>
      </Box>
    </Modal>
  );
};

export default QuestionModal;
