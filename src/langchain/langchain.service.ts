import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { getSuccessResponse } from 'src/common/utils/common-function';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { OpenAIEmbeddings } from '@langchain/openai';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { createStuffDocumentsChain } from 'langchain/chains/combine_documents';
import { ChatOpenAI } from '@langchain/openai';
import { PrismaVectorStore } from '@langchain/community/vectorstores/prisma';
import { PrismaClient, Prisma, Document } from '@prisma/client';
import { SimilaritySearchDto } from './dto/similarity-search.dto';
import { BasicMessageDto } from './dto/query.dto';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { RunnableSequence } from '@langchain/core/runnables';

@Injectable()
export class LangChainService {
  // Prisma Client
  private readonly db = new PrismaClient();
  private vectorStore: any;

  constructor() {
    // Initialize the vector store in the constructor
    this.initializeVectorStore();
  }

  /**
   * Handles the upload of a file and processes it. It supports files in PDF, TXT, and MD formats.
   * @param {Express.Multer.File} file - The uploaded file to be processed.
   * @returns {Promise<any>} - A success response or an error if processing fails.
   */
  async embedding(file: Express.Multer.File): Promise<any> {
    try {
      let content = '';
      const buffer = file.buffer;

      switch (file.mimetype) {
        case 'application/pdf': {
          // Process PDF files
          const blob = new Blob([buffer]);
          const loader = new PDFLoader(blob, { splitPages: false });
          const docs = await loader.load();

          const textSplitter = new RecursiveCharacterTextSplitter({
            chunkSize: 1000,
            chunkOverlap: 200,
          });
          const texts = await textSplitter.splitDocuments(docs);

          // Store the documents into the vector database
          await this.storeToDatabase(texts);

          return getSuccessResponse(HttpStatus.OK, texts);
        }
        case 'text/plain':
        case 'text/markdown': {
          // Process TXT and Markdown files
          content = buffer.toString('utf-8');
          // Create a single document from the content
          const docs = [{ pageContent: content, metadata: {} }];

          const textSplitter = new RecursiveCharacterTextSplitter({
            chunkSize: 1000,
            chunkOverlap: 200,
          });
          const texts = await textSplitter.splitDocuments(docs);

          // Store the documents into the vector database
          await this.storeToDatabase(texts);

          return getSuccessResponse(HttpStatus.OK, texts);
        }
        default:
          // Handle unsupported file types
          throw new HttpException(
            'Unsupported file type',
            HttpStatus.BAD_REQUEST,
          );
      }
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Similarity search
   */
  async getSimilaritySearch(condition: SimilaritySearchDto): Promise<any> {
    try {
      const { query, num } = condition;

      const searchResults = await this.vectorStore.similaritySearch(query, num);

      if (!Array.isArray(searchResults) || searchResults.length === 0) {
        return getSuccessResponse(
          HttpStatus.OK,
          'No relevant documents found for the query',
        );
      }

      return getSuccessResponse(HttpStatus.OK, searchResults);
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   *
   */
  async query(condition: BasicMessageDto) {
    try {
      const { query, num } = condition;

      // Step 1: Retrieve documents based on the query (5 most similar results)
      const searchResults = await this.vectorStore.similaritySearch(query, num);

      if (!Array.isArray(searchResults) || searchResults.length === 0) {
        return getSuccessResponse(
          HttpStatus.OK,
          'No relevant documents found for the query',
        );
      }

      // Format the search results to ensure proper structure
      const formattedResults = searchResults.map((doc) => ({
        pageContent: doc.pageContent || '',
        metadata: doc.metadata || {},
      }));

      // Combine the contents of the retrieved documents into a single context string
      const context = formattedResults
        .map((doc) => doc.pageContent)
        .join('\n\n');

      // Step 2: Create the question-answering chain (RAG Chain)
      const llm = new ChatOpenAI({
        model: 'gpt-3.5-turbo',
        // Control randomness
        temperature: 0,
      });

      // Use ChatGPT to combine retrieved documents into a response
      const systemTemplate = `
        You are an assistant for answering questions based on the following context.
        Use the context to answer the question. If the answer isn't in the context, say that you don't know.
        Answer in three sentences maximum.
    
        Context:
        {context}
      `;
      const humanTemplate = '{query}';

      const chatPrompt = ChatPromptTemplate.fromMessages([
        ['system', systemTemplate],
        ['human', humanTemplate],
      ]);

      // Step 3: Invoke the chain with user input and retrieved context
      const outputParser = new StringOutputParser();
      const chain = RunnableSequence.from([chatPrompt, llm, outputParser]);

      const response = await chain.invoke({
        query: query,
        context: context,
      });

      return getSuccessResponse(HttpStatus.OK, {
        message: response,
      });
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  //---------------------------------------------------------------------------
  /**
   * Private method to initialize the vector store
   */
  private initializeVectorStore() {
    this.vectorStore = PrismaVectorStore.withModel<Document>(this.db).create(
      new OpenAIEmbeddings({
        openAIApiKey: process.env.OPENAI_API_KEY,
        timeout: 15000,
      }),
      {
        prisma: Prisma,
        tableName: 'Document',
        vectorColumnName: 'vector',
        columns: {
          id: PrismaVectorStore.IdColumn,
          content: PrismaVectorStore.ContentColumn,
        },
      },
    );
  }

  /**
   * Helper function to store documents into the vector database.
   * @param documents - Array of documents to be stored
   */
  private async storeToDatabase(documents: { pageContent: string }[]) {
    await this.vectorStore.addModels(
      await this.db.$transaction(
        documents.map((doc) =>
          this.db.document.create({ data: { content: doc.pageContent } }),
        ),
      ),
    );
  }
}
