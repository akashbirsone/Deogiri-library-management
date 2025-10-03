"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, Phone } from "lucide-react"

const faqs = [
  {
    question: "How do I borrow a book?",
    answer:
      "To borrow a book, simply find it in the Book Catalog, and if it's available, click the 'Borrow' button. You can then collect the physical copy from the library counter by showing your student ID.",
  },
  {
    question: "What is the borrowing period for a book?",
    answer:
      "The standard borrowing period is 14 days. You can see the exact due date for each of your borrowed books in the 'My Books' section.",
  },
  {
    question: "How can I renew a book?",
    answer:
      "Book renewals are not yet available through the online portal. Please visit the library counter to request a renewal before the due date.",
  },
  {
    question: "What happens if a book is overdue?",
    answer:
      "Overdue books incur a fine. The fine amount is calculated per day after the due date. You can see any outstanding fines on your dashboard. Please return overdue books as soon as possible to avoid further fines.",
  },
  {
    question: "How do I see my past borrowing history?",
    answer:
      "You can view a complete log of all the books you have ever borrowed and returned in the 'History' section.",
  },
]

export function HelpView() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-headline text-3xl font-bold tracking-tight">
        Help & Support
      </h1>
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem value={`item-${index}`} key={index}>
                    <AccordionTrigger>{faq.question}</AccordionTrigger>
                    <AccordionContent>{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </div>
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Contact Us</CardTitle>
              <CardDescription>
                For any other queries, please reach out to our librarian.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <a href="mailto:librarian@deogiri.ac.in" className="text-sm hover:underline">
                  librarian@deogiri.ac.in
                </a>
              </div>
              <div className="flex items-center gap-4">
                <Phone className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm">+91-240-2367333</span>
              </div>
               <div className="text-sm text-muted-foreground pt-4">
                <p className="font-medium">Library Hours:</p>
                <p>Monday - Saturday</p>
                <p>10:00 AM - 05:00 PM</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
