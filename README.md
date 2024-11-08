# AI Chatbot with LangChain, OpenAI, and PGVector on NestJS

## Introduction

This project is a demo AI chatbot capable of analyzing and querying information from documents (PDF, TXT, MD). The system uses the following technologies:

- **LangChain**: for processing and generating embeddings from text content.
- **OpenAI**: for answering natural language queries.
- **PGVector**: for storing embeddings to optimize querying based on vector distance.
- **NestJS**: provides the REST API backend and handles user requests.

This project demonstrates a chatbot application that can search, understand, and respond to questions based on document content.

---

## Main Components

### 1. LangChain for Text Data Processing

LangChain is used to:

- Read and chunk documents in PDF, TXT, and MD formats into smaller text segments.
- Generate embeddings for these segments, representing the semantic meaning of the text as vectors. These embeddings help the chatbot understand the document content and easily query relevant information based on user keywords.

### 2. Storage and Querying with PGVector

- The embeddings are stored in a **PostgreSQL** database with the **PGVector** plugin to manage vector data.
- This setup allows efficient searches for similar embeddings by calculating vector distances, improving the system's accuracy and response speed when answering queries.

### 3. OpenAI for Natural Language Responses

- When a user submits a question, the system uses OpenAI to generate responses based on data from stored embeddings.
- This enables the application to create natural and relevant answers that align with the user's intent, enhancing the interactive experience.

### 4. NestJS API for User Interaction

- NestJS organizes API endpoints, allowing users to:
  - **Upload documents**: Users can upload text files for processing.
  - **Send queries**: Users can ask questions, and the system will answer based on stored content.

The API is divided into two main modules:

- **Upload and Embedding Module**: Handles file upload, generates embeddings, and stores them in the database.
- **Query and OpenAI Module**: Receives user queries, searches embeddings in the database, and responds through OpenAI.

---

## Installation and Usage

### Requirements

- **Node.js** (version 18 or higher)
- **NestJS** installed (You can refer to https://nestjs.com/ for more information)
- **PostgreSQL** with the **PGVector** plugin
- **OpenAI API Key**: Sign up at OpenAI to get your API key.

### Setup Guide

1. **Clone the repository**:

   ```bash
   git clone https://github.com/vfa-sangtd/demo-langchain.git
   cd demo-langchain
   ```

2. **Install dependencies**:

   ```bash
   yarn install
   ```

3. **Configure PostgreSQL database with PGVector**:

   - Install PostgreSQL and PGVector.
   - Create a new database and enable the PGVector extension:
     ```sql
     CREATE EXTENSION IF NOT EXISTS vector;
     ```

4. **Set up environment variables** in the `.env` file:

   - Update the following variables in the `.env` file:
     ```dotenv
     LANGCHAIN_API_KEY=your_langchain_api_key
     OPENAI_API_KEY=your_openai_api_key
     DATABASE_URL=postgresql://username:password@127.0.0.1:5432/demo-langchain
     ```

5. **Run the application**:
   ```bash
   yarn start:dev
   ```

The application will run at `http://localhost:3000`.

---

## Usage Guide

1. **Upload Document**:

   - Send a POST request to the `/api/langchain/upload` endpoint with an attached file (PDF, TXT, or MD).
   - The system will process the file, chunk it into segments, and create embeddings for each chunk. These embeddings are stored in the database for query purposes.

2. **Send Query**:
   - Send a GET request to the `/api/langchain/query` endpoint with your question as a query string.
   - The system will search for relevant embeddings in the database, query OpenAI, and return a response based on the stored content.

---

## API Endpoints

### **Upload Document**

- **URL**: `/api/langchain/upload`
- **Method**: `POST`
- **Payload**: `multipart/form-data` (including PDF, TXT, or MD file)
- **Description**: Uploads a document, generates embeddings, and stores them in the database.

### **Query Content**

- **URL**: `/api/langchain/query`
- **Method**: `GET`
- **Payload**: `{ query: "your_question", num: number_of_most_similar_results }`
- **Description**: Receives a question from the user, searches for relevant content, and returns a response from OpenAI.

---

## Notes and Considerations

- **Testing and Optimization**: When testing with large files, you may adjust the chunking to improve performance.
- **Security**: Ensure the OpenAI API Key is secure and not shared in publicly accessible code.
- **Access Control**: Consider integrating security measures, such as API authentication or access restrictions.
- **Additional Features**: Consider adding chunking based on context for more accurate responses and providing options to use different AI models for greater flexibility in generating responses.

---

## Conclusion

This AI chatbot application demonstrates how to integrate multiple advanced technologies to build a system capable of understanding and querying complex information from documents. Using LangChain, OpenAI, and PGVector on a NestJS backend, the project creates a powerful, flexible, and extensible chatbot platform. You can customize and extend the system with additional features to meet your specific needs.
