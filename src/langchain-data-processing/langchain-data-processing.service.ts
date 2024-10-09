import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { getSuccessResponse } from 'src/common/utils/common-function';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import { OpenAIEmbeddings } from '@langchain/openai';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { createStuffDocumentsChain } from 'langchain/chains/combine_documents';
import { createRetrievalChain } from 'langchain/chains/retrieval';
import { ChatOpenAI } from '@langchain/openai';
import { PrismaVectorStore } from '@langchain/community/vectorstores/prisma';
import { PrismaClient, Prisma, Document } from '@prisma/client';

@Injectable()
export class LangChainDataProcessingService {
  /**
   * Handles the upload of a file and processes it. It supports files in PDF, TXT, and MD formats.
   * @param {Express.Multer.File} file - The uploaded file to be processed.
   * @returns {Promise<any>} - A success response or an error if processing fails.
   * @memberof LangChainDataProcessingService
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
          const textSplitted = await textSplitter.splitDocuments(docs);

          // Store the documents into the vector database
          await this.storeToDatabase(textSplitted);

          return getSuccessResponse(HttpStatus.OK, textSplitted);

          // const resultOne = await vectorStore.similaritySearch('Suspendisse', 1);
          // console.log('resultOne', resultOne);
          // // 2. Incorporate the retriever into a question-answering chain.
          // const llm = new ChatOpenAI({
          //   model: 'gpt-3.5-turbo',
          //   temperature: 0,
          // });
          // const systemPrompt =
          //   'You are an assistant for question-answering tasks. ' +
          //   'Use the following pieces of retrieved context to answer ' +
          //   "the question. If you don't know the answer, say that you " +
          //   "don't know. Use three sentences maximum and keep the " +
          //   'answer concise.' +
          //   '\n\n' +
          //   '{context}';
          // const prompt = ChatPromptTemplate.fromMessages([
          //   ['system', systemPrompt],
          //   ['human', '{input}'],
          // ]);
          // const questionAnswerChain = await createStuffDocumentsChain({
          //   llm,
          //   prompt,
          // });
          // const ragChain = await createRetrievalChain({
          //   retriever,
          //   combineDocsChain: questionAnswerChain,
          // });
          // const response = await ragChain.invoke({
          //   input: 'What is Donec  lacus  nunc?',
          // });
          // console.log('answer', response.answer);
          // content = docs[0].pageContent.toString();
        }
        case 'text/plain':
        case 'text/markdown': {
          // Process TXT and Markdown files
          content = buffer.toString('utf-8');
          // Create a single document from the content
          const docs = [{ pageContent: content, metadata: null }];

          const textSplitter = new RecursiveCharacterTextSplitter({
            chunkSize: 1000,
            chunkOverlap: 200,
          });
          const textSplitted = await textSplitter.splitDocuments(docs);

          // Store the documents into the vector database
          await this.storeToDatabase(textSplitted);

          return getSuccessResponse(HttpStatus.OK, textSplitted);
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
   * Helper function to store documents into the vector database.
   *
   * @param documents - Array of documents to be stored
   */
  private async storeToDatabase(documents: { pageContent: string }[]) {
    const db = new PrismaClient();

    const vectorStore = PrismaVectorStore.withModel<Document>(db).create(
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

    await vectorStore.addModels(
      await db.$transaction(
        documents.map((doc) =>
          db.document.create({ data: { content: doc.pageContent } }),
        ),
      ),
    );
  }
}
