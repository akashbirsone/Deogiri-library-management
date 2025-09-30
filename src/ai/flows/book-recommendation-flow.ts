'use server';

/**
 * @fileOverview An AI agent that provides book recommendations based on a user's borrowing history.
 *
 * - getBookRecommendations - A function that retrieves book recommendations for a user.
 * - BookRecommendationInput - The input type for the getBookRecommendations function.
 * - BookRecommendationOutput - The return type for the getBookRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const BookRecommendationInputSchema = z.object({
  userId: z.string().describe('The ID of the user to get recommendations for.'),
  borrowHistory: z
    .array(
      z.object({
        title: z.string(),
        author: z.string(),
        genre: z.string(),
      })
    )
    .describe('The user history.'),
});
export type BookRecommendationInput = z.infer<typeof BookRecommendationInputSchema>;

const BookRecommendationOutputSchema = z.object({
  recommendedBooks: z
    .array(
      z.object({
        title: z.string(),
        author: z.string(),
        genre: z.string(),
        reason: z.string(),
      })
    )
    .describe('A list of recommended books based on the user borrow history.'),
});
export type BookRecommendationOutput = z.infer<typeof BookRecommendationOutputSchema>;

export async function getBookRecommendations(
  input: BookRecommendationInput
): Promise<BookRecommendationOutput> {
  return bookRecommendationFlow(input);
}

const bookRecommendationPrompt = ai.definePrompt({
  name: 'bookRecommendationPrompt',
  input: {
    schema: BookRecommendationInputSchema,
  },
  output: {
    schema: BookRecommendationOutputSchema,
  },
  prompt: `You are a book recommendation expert. Given a user's borrowing history, you will recommend books that the user might be interested in.

Borrow History:
{{#each borrowHistory}}
- Title: {{this.title}}, Author: {{this.author}}, Genre: {{this.genre}}
{{/each}}

Consider the user's past borrowing history and preferences to recommend books from similar authors, genres, or themes. Provide a brief explanation of why each book is recommended, considering their past preferences.

Here are the recommendations:
{{#each recommendedBooks}}
- Title: {{this.title}}, Author: {{this.author}}, Genre: {{this.genre}}, Reason: {{this.reason}}
{{/each}}`,
});

const bookRecommendationFlow = ai.defineFlow(
  {
    name: 'bookRecommendationFlow',
    inputSchema: BookRecommendationInputSchema,
    outputSchema: BookRecommendationOutputSchema,
  },
  async input => {
    // Check if the user has sufficient borrowing history to make recommendations.
    if (input.borrowHistory.length < 3) {
      return {
        recommendedBooks: [
          {
            title: 'N/A',
            author: 'N/A',
            genre: 'N/A',
            reason: 'Not enough history',
          },
        ],
      };
    }

    const {output} = await bookRecommendationPrompt(input);
    return output!;
  }
);
