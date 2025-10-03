
"use client"

import * as React from "react";
import Image from "next/image";
import { books } from "@/lib/data";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Book } from "@/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function BooksView() {
    const [searchTerm, setSearchTerm] = React.useState("");
    const [category, setCategory] = React.useState("all");
    const [department, setDepartment] = React.useState("all");

    const filteredBooks = books.filter(book => {
        const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              book.author.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = category === 'all' || book.category === category;
        const matchesDepartment = department === 'all' || book.department === department;
        return matchesSearch && matchesCategory && matchesDepartment;
    });
    
    const categories = ['all', ...Array.from(new Set(books.map(b => b.category)))];
    const departments = ['all', ...Array.from(new Set(books.map(b => b.department).filter(Boolean))) as string[]];


  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-headline text-3xl font-bold tracking-tight">Book Catalog</h1>
      <Card>
        <CardContent className="p-4 space-y-4">
            <Input 
                placeholder="Search books by title or author…" 
                className="w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-end">
                     <div className="w-full md:w-[240px]">
                        <p className="text-sm font-medium mb-2">Department</p>
                         <Select onValueChange={setDepartment} defaultValue="all">
                            <SelectTrigger>
                                <SelectValue placeholder="Select Course" />
                            </SelectTrigger>
                            <SelectContent>
                                {departments.map(dep => (
                                    <SelectItem key={dep} value={dep} className="capitalize">
                                        {dep}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                 <div>
                    <p className="text-sm font-medium mb-2">Category</p>
                     <Select onValueChange={setCategory} defaultValue="all">
                        <SelectTrigger className="w-full md:w-[240px]">
                            <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                        <SelectContent>
                            {categories.map(cat => (
                                <SelectItem key={cat} value={cat} className="capitalize">
                                    {cat}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </CardContent>
      </Card>

        {filteredBooks.length > 0 ? (
             <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredBooks.map((book) => (
                    <BookCard key={book.id} book={book} />
                ))}
            </div>
        ) : (
            <div className="text-center py-16 text-muted-foreground">
                <p className="text-lg">No books found.</p>
                <p>Try adjusting your search or filters.</p>
            </div>
        )}
     
    </div>
  );
}


function BookCard({ book }: { book: Book }) {
  return (
    <Card className="flex flex-col overflow-hidden transition-all hover:shadow-lg">
      <CardHeader className="p-0 relative">
        <Image
          src={book.coverImage}
          alt={`Cover of ${book.title}`}
          width={300}
          height={450}
          className="w-full h-60 object-cover"
          data-ai-hint={book.coverImageHint}
        />
        <Badge className="absolute top-2 right-2" variant={book.availableCopies > 0 ? 'secondary' : 'destructive'}>
          {book.availableCopies > 0 ? 'Available' : 'Borrowed'}
        </Badge>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <div className="flex flex-wrap gap-1 mb-2">
            <Badge variant="outline">{book.category}</Badge>
            {book.department && <Badge variant="outline">{book.department}</Badge>}
        </div>
        <CardTitle className="font-headline text-lg mb-1 leading-tight">{book.title}</CardTitle>
        <p className="text-sm text-muted-foreground">{book.author}</p>
        <p className="text-xs text-muted-foreground mt-2">ISBN: {book.isbn}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button className="w-full" disabled={book.availableCopies === 0}>
          {book.availableCopies > 0 ? 'Borrow' : 'Unavailable'}
        </Button>
      </CardFooter>
    </Card>
  );
}
