/**
 * Represents a common response format for API responses.
 *
 * @template T - The type of data included in the response.
 */
export type CommonResponse<T> = {
  // Indicates whether the operation was successful.
  success: boolean;

  // The HTTP status code of the response.
  statusCode: number;

  // The data included in the response.
  data?: T;

  // The error message, if applicable.
  error?: {
    message: string;
  };
};
