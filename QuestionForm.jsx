// QuestionForm.jsx
import React, { useState } from 'react';
import { Form } from 'semantic-ui-react';
import { db } from '../utils/firebase';
import { collection, addDoc } from 'firebase/firestore'; 
import './QuestionForm.css';

const QuestionForm = ({ onAddQuestion }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tags: '',
    date: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation: Ensure all fields are filled
    if (!formData.title || !formData.description || !formData.tags || !formData.date) {
      alert('Please fill in all fields.');
      return;
    }

    // Create a new question object
    const newQuestion = {
      title: formData.title,
      description: formData.description,
      tags: formData.tags.split(',').map(tag => tag.trim()),
      date: formData.date,
      createdAt: new Date().toISOString(),
    };

    try {
      // Add the new question to Firestore
      const docRef = await addDoc(collection(db, 'questions'), newQuestion);
      console.log("Document written with ID: ", docRef.id);
      
      // Optionally, call the parent function to update the state
      if (onAddQuestion) {
        onAddQuestion({ ...newQuestion, id: docRef.id });
      }

      // Clear the form
      setFormData({
        title: '',
        description: '',
        tags: '',
        date: '',
      });
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("Error posting the question. Please try again.");
    }
  };

  return (
    <>
      <h2 className="question-form-header">What do you want to ask or share?</h2>

      <Form className="question-form" onSubmit={handleSubmit}>
        <Form.Input
          label="Title"
          placeholder="Start your question with how, what, why, etc."
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          className="input-field"
        />
        <Form.TextArea
          label="Describe your problem"
          placeholder="Describe your problem in detail..."
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          className="input-field"
        />
        <Form.Input
          label="Tags"
          placeholder="Please add up to 3 tags to describe what your question is about e.g., Java"
          name="tags"
          value={formData.tags}
          onChange={handleInputChange}
          className="input-field"
        />
        <Form.Input
          label="Date"
          type="date"
          name="date"
          value={formData.date}
          onChange={handleInputChange}
          className="input-field"
        />
        <div className="post-button-container">
          <button type="submit" className="custom-button">Post</button>
        </div>
      </Form>
    </>
  );
};

export default QuestionForm;
