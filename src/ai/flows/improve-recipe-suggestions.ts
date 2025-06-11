'use server';

/**
 * @fileOverview Flow for generating improved recipe suggestions based on user feedback.
 *
 * - improveRecipeSuggestions - A function that takes ingredients and feedback to generate a better recipe.
 * - ImproveRecipeSuggestionsInput - The input type for the improveRecipeSuggestions function.
 * - ImproveRecipeSuggestionsOutput - The return type for the improveRecipeSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ImproveRecipeSuggestionsInputSchema = z.object({
  ingredients: z.string().describe('A comma-separated list of ingredients available.'),
  feedback: z.string().describe('User feedback on the previous recipe suggestion.'),
});
export type ImproveRecipeSuggestionsInput = z.infer<typeof ImproveRecipeSuggestionsInputSchema>;

const ImproveRecipeSuggestionsOutputSchema = z.object({
  recipeName: z.string().describe('The name of the improved recipe.'),
  ingredients: z.string().describe('A list of ingredients for the improved recipe.'),
  instructions: z.string().describe('Step-by-step instructions for the improved recipe.'),
});
export type ImproveRecipeSuggestionsOutput = z.infer<typeof ImproveRecipeSuggestionsOutputSchema>;

export async function improveRecipeSuggestions(
  input: ImproveRecipeSuggestionsInput
): Promise<ImproveRecipeSuggestionsOutput> {
  return improveRecipeSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'improveRecipeSuggestionsPrompt',
  input: {schema: ImproveRecipeSuggestionsInputSchema},
  output: {schema: ImproveRecipeSuggestionsOutputSchema},
  prompt: `You are a recipe generation expert. Given the following ingredients and feedback on a previous recipe, generate an improved recipe suggestion. Be creative and provide a delicious and easy-to-follow recipe.

Ingredients: {{{ingredients}}}
Feedback: {{{feedback}}}

Recipe Name:
Ingredients:
Instructions:`,
});

const improveRecipeSuggestionsFlow = ai.defineFlow(
  {
    name: 'improveRecipeSuggestionsFlow',
    inputSchema: ImproveRecipeSuggestionsInputSchema,
    outputSchema: ImproveRecipeSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
