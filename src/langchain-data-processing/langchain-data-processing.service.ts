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

@Injectable()
export class LangChainDataProcessingService {
  async uploadFile(file: Express.Multer.File) {
    try {
      const llm = new ChatOpenAI({
        model: 'gpt-3.5-turbo',
        temperature: 0,
      });
      // 1. Load, chunk and index the contents of the blog to create a retriever.

      let content = '';
      // File is provided by multer
      const buffer = file.buffer;
      const blob = new Blob([buffer]);

      if (file.mimetype === 'application/pdf') {
        const loader = new PDFLoader(blob, {
          splitPages: false,
        });
        const docs = await loader.load();
        // Chunk văn bản thành các phần nhỏ
        const textSplitter = new RecursiveCharacterTextSplitter({
          chunkSize: 1000,
          chunkOverlap: 200,
        });
        const splits = await textSplitter.splitDocuments(docs);

        const vectorstore = await MemoryVectorStore.fromDocuments(
          splits,
          new OpenAIEmbeddings(),
        );
        const retriever = vectorstore.asRetriever();
        console.log('retriever', retriever);

        // 2. Incorporate the retriever into a question-answering chain.
        const systemPrompt =
          'You are an assistant for question-answering tasks. ' +
          'Use the following pieces of retrieved context to answer ' +
          "the question. If you don't know the answer, say that you " +
          "don't know. Use three sentences maximum and keep the " +
          'answer concise.' +
          '\n\n' +
          '{context}';

        const prompt = ChatPromptTemplate.fromMessages([
          ['system', systemPrompt],
          ['human', '{input}'],
        ]);

        const questionAnswerChain = await createStuffDocumentsChain({
          llm,
          prompt,
        });

        const ragChain = await createRetrievalChain({
          retriever,
          combineDocsChain: questionAnswerChain,
        });

        const response = await ragChain.invoke({
          input: 'What is Donec  lacus  nunc?',
        });
        console.log('answer', response.answer);

        content = docs[0].pageContent.toString();
      } else {
        // Convert "buffer" to "string"
        content = buffer.toString('utf-8');
      }

      // console.log('content:', content);

      return getSuccessResponse(HttpStatus.OK, 'Data processed successfully!');
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
