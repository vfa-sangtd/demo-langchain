import { CommonResponse } from '../types/common';

/**
 * Creates a success response with the given status code and data.
 *
 * @param statusCode - The status code of the response.
 * @param data - The data to be included in the response.
 * @returns A CommonResponse object representing the success response.
 */
export function getSuccessResponse<T>(
  statusCode: number,
  data: T,
): CommonResponse<T> {
  return {
    success: true,
    statusCode,
    data,
  };
}

/**
 * Creates an error response with the given status code, message, and optional details.
 *
 * @param statusCode - The status code of the response.
 * @param message - The error message to be included in the response.
 * @param details - Additional details about the error (optional).
 * @returns A CommonResponse object representing the error response.
 */
export function getErrorResponse(
  statusCode: number,
  message: string,
  details?: { [key: string]: any },
): CommonResponse<null> {
  return {
    success: false,
    statusCode,
    error: {
      message,
      ...details,
    },
  };
}
