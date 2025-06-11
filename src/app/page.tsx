'use client';

import { useState } from 'react';
import type { FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { generateRecipe, GenerateRecipeOutput } from '@/ai/flows/generate-recipe';
import { improveRecipeSuggestions, ImproveRecipeSuggestionsOutput } from '@/ai/flows/improve-recipe-suggestions';
import { ModeToggle } from '@/components/mode-toggle';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const [ingredients, setIngredients] = useState('');
  const [recipe, setRecipe] = useState<GenerateRecipeOutput | ImproveRecipeSuggestionsOutput | null>(null);
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateRecipe = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setRecipe(null);
    try {
      const result = await generateRecipe({ ingredients });
      setRecipe(result);
    } catch (err) {
      console.error(err);
      setError('Failed to generate recipe. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleImproveRecipe = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!recipe) return;
    setLoading(true);
    setError(null);
    try {
      const result = await improveRecipeSuggestions({ ingredients, feedback });
      setRecipe(result);
      setFeedback(''); // Clear feedback after improvement
    } catch (err) {
      console.error(err);
      setError('Failed to improve recipe suggestion. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-primary">Fridge Chef</h1>
        <ModeToggle />
      </header>
      <main className="flex-grow container mx-auto px-4 py-8">
        {/* Changed grid layout to single column */}
        <div className="grid gap-8 max-w-2xl mx-auto">
          <Card className="shadow-lg rounded-lg">
            <CardHeader>
              <CardTitle className="text-2xl">Enter Your Ingredients</CardTitle>
              <CardDescription>List the ingredients you have on hand, separated by commas.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleGenerateRecipe} className="space-y-4">
                <div>
                  <Label htmlFor="ingredients" className="text-foreground/80">Ingredients</Label>
                  <Textarea
                    id="ingredients"
                    placeholder="e.g., chicken breast, broccoli, soy sauce, rice"
                    value={ingredients}
                    onChange={(e) => setIngredients(e.target.value)}
                    required
                    className="mt-1 min-h-[100px]"
                  />
                </div>
                <Button type="submit" disabled={loading || !ingredients.trim()} className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  {loading ? 'Generating...' : 'Generate Recipe'}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="shadow-lg rounded-lg">
            <CardHeader>
              <CardTitle className="text-2xl">Recipe Suggestion</CardTitle>
              <CardDescription>Here's a recipe suggestion based on your ingredients.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {loading && !recipe && (
                <div className="flex justify-center items-center min-h-[200px]">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              )}
              {error && <p className="text-destructive">{error}</p>}
              {recipe && (
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-primary">{recipe.recipeName}</h3>
                  <div>
                    <h4 className="font-medium text-foreground/90">Ingredients:</h4>
                    <p className="text-foreground/80 whitespace-pre-line">{recipe.ingredientsList || recipe.ingredients}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground/90">Instructions:</h4>
                    <p className="text-foreground/80 whitespace-pre-line">{recipe.instructions}</p>
                  </div>
                  <form onSubmit={handleImproveRecipe} className="space-y-4 pt-4 border-t">
                     <Label htmlFor="feedback" className="text-foreground/80">Not quite right? Provide feedback:</Label>
                     <Textarea
                       id="feedback"
                       placeholder="e.g., Make it spicier, I don't have onions, suggest a vegan alternative"
                       value={feedback}
                       onChange={(e) => setFeedback(e.target.value)}
                       className="mt-1 min-h-[80px]"
                     />
                     <Button type="submit" disabled={loading || !feedback.trim()} variant="secondary" className="w-full">
                       {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                       {loading ? 'Improving...' : 'Improve Suggestion'}
                     </Button>
                   </form>
                </div>
              )}
              {!loading && !recipe && !error && (
                 <p className="text-muted-foreground text-center min-h-[200px] flex items-center justify-center">Enter ingredients to get started!</p>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <footer className="container mx-auto px-4 py-4 text-center text-muted-foreground">
        Powered by AI. Recipes are suggestions, adjust to your taste.
      </footer>
    </div>
  );
}
