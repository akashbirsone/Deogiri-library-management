
"use client"

import * as React from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Book, Sparkles, AlertCircle } from "lucide-react"
import { useApp } from "@/contexts/app-provider"
import { students, books } from "@/lib/data"
import {
  getBookRecommendations,
  BookRecommendationOutput,
} from "@/ai/flows/book-recommendation-flow"
import { useToast } from "@/hooks/use-toast"
import { Skeleton } from "./ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function RecommendedBooks() {
  const { user } = useApp()
  const { toast } = useToast()
  const [recommendations, setRecommendations] =
    React.useState<BookRecommendationOutput | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [apiError, setApiError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchRecommendations = async () => {
      const studentData = students.find((s) => s.id === user.id)
      if (!studentData || studentData.borrowHistory.length === 0) {
        setLoading(false)
        return
      }

      setLoading(true)
      setApiError(null);
      try {
        const history = studentData.borrowHistory.map((item) => {
          const book = books.find((b) => b.id === item.bookId)
          return {
            title: book?.title || "",
            author: book?.author || "",
            genre: book?.category || "",
          }
        }).filter(item => item.title);

        if (history.length === 0) {
            setLoading(false);
            return;
        }

        const result = await getBookRecommendations({
          userId: user.id,
          borrowHistory: history,
        })
        setRecommendations(result)
      } catch (error: any) {
        console.error("Failed to get book recommendations:", error)
        if (error.message && error.message.includes("SERVICE_DISABLED")) {
            setApiError("The Generative AI service is not enabled for your project. Please enable it in your Google Cloud console and try again.");
        } else {
            toast({
                variant: "destructive",
                title: "AI Error",
                description: "Could not fetch book recommendations.",
            })
        }
      } finally {
        setLoading(false)
      }
    }

    if (user.role === 'student') {
        fetchRecommendations()
    } else {
        setLoading(false)
        setRecommendations(null)
    }
  }, [user, toast])

  if (user.role !== 'student') return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <span className="font-headline">Books For You</span>
        </CardTitle>
        <CardDescription>
          AI-powered recommendations based on your history.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
            <div className="space-y-4">
                <RecommendationSkeleton />
                <RecommendationSkeleton />
            </div>
        ) : apiError ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Configuration Required</AlertTitle>
            <AlertDescription>
              {apiError}
            </AlertDescription>
          </Alert>
        ) : !recommendations || recommendations.recommendedBooks.length === 0 || recommendations.recommendedBooks[0].reason === "Not enough history" ? (
          <div className="text-center text-muted-foreground py-8">
            <Book className="mx-auto h-12 w-12 mb-4" />
            <p>Borrow a few more books to get personalized recommendations!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {recommendations.recommendedBooks.slice(0, 3).map((book, index) => (
              <div key={index} className="p-4 rounded-lg bg-muted/50">
                <p className="font-semibold">{book.title}</p>
                <p className="text-sm text-muted-foreground">{book.author}</p>
                <p className="text-sm mt-2 border-l-2 border-primary pl-2">
                  <span className="font-medium">Why you might like it:</span> {book.reason}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}


const RecommendationSkeleton = () => (
    <div className="p-4 rounded-lg bg-muted/50 space-y-2">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-8 w-full mt-2" />
    </div>
)
