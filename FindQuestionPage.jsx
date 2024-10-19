import React, { useState, useEffect } from 'react';
import { Card, Container, Header, Input, Button, Icon } from 'semantic-ui-react';
import { db } from '../utils/firebase'; 
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore'; 
import './FindQuestionPage.css';

const FindQuestionPage = () => {
  const [questions, setQuestions] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [filterTitle, setFilterTitle] = useState('');
  const [filterTag, setFilterTag] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [expandedCardId, setExpandedCardId] = useState(null); 


  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const questionsCollection = collection(db, 'questions'); 
        const snapshot = await getDocs(questionsCollection);
        const questionsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setQuestions(questionsData);
        setFilteredQuestions(questionsData); 
      } catch (error) {
        console.error('Error fetching questions: ', error);
      }
    };

    fetchQuestions();
  }, []);

  useEffect(() => {
  
    const applyFilters = () => {
      let updatedQuestions = questions;

      if (filterTitle) {
        updatedQuestions = updatedQuestions.filter((question) =>
          question.title.toLowerCase().includes(filterTitle.toLowerCase())
        );
      }

      if (filterTag) {
        updatedQuestions = updatedQuestions.filter((question) =>
          question.tags.map(tag => tag.toLowerCase()).includes(filterTag.toLowerCase())
        );
      }

      if (filterDate) {
        updatedQuestions = updatedQuestions.filter((question) =>
          question.date === filterDate
        );
      }

      setFilteredQuestions(updatedQuestions);
    };

    applyFilters();
  }, [filterTitle, filterTag, filterDate, questions]);


  const handleDelete = async (id) => {
    try {
      
      await deleteDoc(doc(db, 'questions', id));
    
      setFilteredQuestions((prevQuestions) =>
        prevQuestions.filter((question) => question.id !== id)
      );
      setQuestions((prevQuestions) =>
        prevQuestions.filter((question) => question.id !== id)
      );
    } catch (error) {
      console.error('Error deleting question: ', error);
    }
  };

  
  const handleExpand = (id) => {
    setExpandedCardId(expandedCardId === id ? null : id);
  };

  return (
    <Container className="find-question-page">
      <Header as="h2" className="find-question-header">Find a Question</Header>

      
      <div className="filter-container">
        <Input
          placeholder="Filter by Title..."
          value={filterTitle}
          onChange={(e) => setFilterTitle(e.target.value)}
          className="filter-input"
        />
        <Input
          placeholder="Filter by Tag..."
          value={filterTag}
          onChange={(e) => setFilterTag(e.target.value)}
          className="filter-input"
        />
        <Input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          className="filter-input"
        />
      </div>

      <Card.Group>
        {filteredQuestions.length > 0 ? (
          filteredQuestions.map((question) => (
            <Card key={question.id} fluid>
              <Card.Content>
                <Card.Header>{question.title}</Card.Header>
                <Card.Meta>{question.date}</Card.Meta>
                <Card.Description>
                  {question.description}
                </Card.Description>
                {expandedCardId === question.id && (
                  <Card.Meta>
                
                    Tags: {question.tags.join(', ')}
                  </Card.Meta>
                )}
              </Card.Content>
              <Card.Content extra>
                <Button
                  basic
                  color="blue"
                  onClick={() => handleExpand(question.id)}
                >
                  <Icon name={expandedCardId === question.id ? 'chevron up' : 'chevron down'} />
                  {expandedCardId === question.id ? 'Show Less' : 'Show More'}
                </Button>
                <Button
                  basic
                  color="red"
                  onClick={() => handleDelete(question.id)}
                  style={{ marginLeft: '10px' }}
                >
                  <Icon name="trash" /> Delete
                </Button>
              </Card.Content>
            </Card>
          ))
        ) : (
          <Card>
            <Card.Content>
              <Card.Header>No Questions Found</Card.Header>
              <Card.Description>
                No questions match your filter criteria.
              </Card.Description>
            </Card.Content>
          </Card>
        )}
      </Card.Group>
    </Container>
  );
};

export default FindQuestionPage;
