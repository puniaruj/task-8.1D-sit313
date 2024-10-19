import React, { useState } from 'react';
import { Form, Header, Message } from 'semantic-ui-react';
import './ArticleForm.css'; 
import { storage, db } from '../utils/firebase'; 
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'; 
import { collection, addDoc } from 'firebase/firestore'; 

const ArticleForm = () => {
  const [title, setTitle] = useState('');
  const [abstract, setAbstract] = useState('');
  const [articleText, setArticleText] = useState('');
  const [tags, setTags] = useState('');
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [imageError, setImageError] = useState('');

  const sanitizeFileName = (fileName) => {
    return fileName.replace(/\s+/g, '_').replace(/[^\w.-]+/g, '');
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
      setImageError('');
    } else {
      setImageError('No file selected. Please choose an image.');
    }
  };

  const handleImageUpload = async () => {
    if (!image) {
      setImageError('No file selected. Please choose an image.');
      throw new Error('No image to upload.');
    }

    const sanitizedFileName = sanitizeFileName(image.name);
    const storageRef = ref(storage, `images/${sanitizedFileName}`);

    console.log('Uploading image:', sanitizedFileName, 'Size (bytes):', image.size);

    try {
      const snapshot = await uploadBytes(storageRef, image);
      console.log('Uploaded a blob or file!');

      const url = await getDownloadURL(snapshot.ref);
      setImageUrl(url);
      console.log("Image URL:", url);
      return url; 
    } catch (error) {
      console.error("Error uploading image:", error.message, error);
      throw error; 
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const uploadedImageUrl = await handleImageUpload(); 
      
      const articleData = {
        title,
        abstract,
        articleText,
        tags,
        imageUrl: uploadedImageUrl,
        createdAt: new Date(),
      };

      console.log("Uploading article data:", articleData); 

      await addDoc(collection(db, 'articles'), articleData);

    
      setTitle('');
      setAbstract('');
      setArticleText('');
      setTags('');
      setImage(null);
      setImageUrl('');
      setImageError('');
      console.log('Article uploaded successfully!');

    } catch (error) {
      console.error("Error uploading article:", error.message);
    }
  };

  return (
    <>
      <Header as='h2' className="article-form-header">What do you want to share?</Header>
      <Form className="article-form" onSubmit={handleSubmit}>
        <Form.Input 
          label="Title" 
          placeholder="Enter a descriptive title" 
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="input-field"
        />
        
        <Form.Input 
          type="file" 
          label="Add an image" 
          onChange={handleImageChange} 
          className="input-field"
        />
        {imageError && <Message negative>{imageError}</Message>} 

        <Form.Input 
          label="Abstract" 
          placeholder="Enter a 1-paragraph abstract" 
          value={abstract}
          onChange={(e) => setAbstract(e.target.value)}
          className="input-field"
        />
        
        <Form.TextArea 
          label="Article Text" 
          placeholder="Enter article content..." 
          value={articleText}
          onChange={(e) => setArticleText(e.target.value)}
          className="input-field"
        />
        
        <Form.Input 
          label="Tags" 
          placeholder="Please add up to 3 tags e.g., Java" 
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="input-field"
        />
        <div className="post-button-container">
          <button type="submit" className="custom-button">Post</button>
        </div>
      </Form>
    </>
  );
};

export default ArticleForm;
