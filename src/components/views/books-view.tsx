
"use client"

import * as React from "react";
import Image from "next/image";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Book as BookType } from "@/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useApp } from "@/contexts/app-provider";
import { MoreVertical, PlusCircle, Trash, Edit } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { departmentsData } from "@/lib/departments";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function BooksView() {
    const { user, books, borrowBook, addBook, updateBook, deleteBook } = useApp();
    const [searchTerm, setSearchTerm] = React.useState("");
    const [selectedDepartment, setSelectedDepartment] = React.useState("all");
    const [selectedCategory, setSelectedCategory] = React.useState("all");
    const [isFormOpen, setIsFormOpen] = React.useState(false);
    const [editingBook, setEditingBook] = React.useState<BookType | null>(null);
    const { toast } = useToast();

    const handleFormSubmit = (bookData: Partial<BookType>) => {
        if (!user) return;
        
        if (editingBook && 'id' in editingBook) {
            updateBook({ ...editingBook, ...bookData });
            toast({ title: "Book Updated", description: `${bookData.title} has been updated.`});
        } else {
            const newBook : Omit<BookType, 'id'> = {
                title: bookData.title || '',
                author: bookData.author || '',
                isbn: bookData.isbn || '',
                category: bookData.category || '',
                department: bookData.department || '',
                publicationYear: Number(bookData.publicationYear) || new Date().getFullYear(),
                totalCopies: Number(bookData.totalCopies) || 0,
                availableCopies: Number(bookData.totalCopies) || 0,
                coverImage: bookData.coverImage || `https://picsum.photos/seed/${Date.now()}/300/450`,
                coverImageHint: bookData.coverImageHint || 'book cover',
                addedBy: user.email || 'unknown',
                addedDate: new Date().toISOString(),
            };
            addBook(newBook);
            toast({ title: "Book Added", description: `${bookData.title} has been added to the catalog.`});
        }
        setIsFormOpen(false);
        setEditingBook(null);
    };

    const handleEditBook = (book: BookType) => {
        setEditingBook(book);
        setIsFormOpen(true);
    };

    const handleDeleteBook = (bookId: string) => {
        deleteBook(bookId);
        toast({ title: "Book Deleted", variant: "destructive" });
    };
    
    const openAddBookForm = () => {
        setEditingBook(null);
        setIsFormOpen(true);
    }

    const filteredBooks = books.filter(book => {
        const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              book.author.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesDepartment = selectedDepartment === 'all' || book.department === selectedDepartment;
        const matchesCategory = selectedCategory === 'all' || book.category === selectedCategory;
        return matchesSearch && matchesDepartment && matchesCategory;
    });
    
    const categoriesForSelectedDept = selectedDepartment !== 'all' 
        ? departmentsData[selectedDepartment as keyof typeof departmentsData] || []
        : [];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="font-headline text-3xl font-bold tracking-tight">Book Catalog</h1>
        {(user?.role === 'admin' || user?.role === 'librarian') && (
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogTrigger asChild>
                    <Button onClick={openAddBookForm}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add Book
                    </Button>
                </DialogTrigger>
                <BookForm 
                    onSubmit={handleFormSubmit} 
                    onClose={() => setIsFormOpen(false)}
                    book={editingBook}
                />
            </Dialog>
        )}
      </div>
      <Card>
        <CardContent className="p-4 space-y-4">
            <Input 
                placeholder="Search books by title or author…" 
                className="w-full md:w-1/2"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="flex flex-col md:flex-row md:items-end gap-4">
                <div className="w-full md:w-auto">
                    <Label htmlFor="department-select">Department</Label>
                    <Select onValueChange={val => { setSelectedDepartment(val); setSelectedCategory('all'); }} defaultValue="all">
                        <SelectTrigger id="department-select" className="w-full md:w-[240px]">
                            <SelectValue placeholder="Select Department" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Departments</SelectItem>
                            {Object.keys(departmentsData).map(dep => (
                                <SelectItem key={dep} value={dep}>{dep}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                 <div className="w-full md:w-auto">
                    <Label htmlFor="category-select">Category</Label>
                     <Select onValueChange={setSelectedCategory} value={selectedCategory} disabled={selectedDepartment === 'all'}>
                        <SelectTrigger id="category-select" className="w-full md:w-[240px]">
                            <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
                            {categoriesForSelectedDept.map(cat => (
                                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </CardContent>
      </Card>

        {filteredBooks.length > 0 ? (
            <Card>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Title</TableHead>
                                <TableHead>Author</TableHead>
                                <TableHead>Copies</TableHead>
                                <TableHead><span className="sr-only">Actions</span></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredBooks.map((book) => (
                                <TableRow key={book.id}>
                                    <TableCell>
                                        <div className="font-medium">{book.title}</div>
                                        <div className="text-sm text-muted-foreground">{book.category}</div>
                                    </TableCell>
                                    <TableCell>{book.author}</TableCell>
                                    <TableCell>{book.availableCopies} / {book.totalCopies}</TableCell>
                                    <TableCell className="text-right">
                                        <BookActions book={book} onEdit={handleEditBook} onDelete={handleDeleteBook} onBorrow={() => borrowBook(book.id)} />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        ) : (
            <div className="text-center py-16 text-muted-foreground">
                <p className="text-lg">No books found.</p>
                <p>Try adjusting your search or filters.</p>
            </div>
        )}
     
    </div>
  );
}

function BookActions({ book, onEdit, onDelete, onBorrow }: { book: BookType; onEdit: (book: BookType) => void; onDelete: (bookId: string) => void; onBorrow: () => void; }) {
  const { user } = useApp();
  
  if (user?.role === 'admin' || user?.role === 'librarian') {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(book)}>
                    <Edit className="mr-2 h-4 w-4" />
                    <span>Edit</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDelete(book.id)} className="text-destructive">
                    <Trash className="mr-2 h-4 w-4" />
                    <span>Delete</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
  }

  if (user?.role === 'student') {
    return (
        <Button size="sm" disabled={book.availableCopies === 0} onClick={onBorrow}>
          {book.availableCopies > 0 ? 'Borrow' : 'Unavailable'}
        </Button>
    )
  }

  return null;
}


const BookForm = ({ onSubmit, onClose, book }: { onSubmit: (data: Partial<BookType>) => void; onClose: () => void; book: BookType | null }) => {
    const [formData, setFormData] = React.useState<Partial<BookType>>(
        book || {
            title: '',
            author: '',
            isbn: '',
            category: '',
            department: '',
            publicationYear: new Date().getFullYear(),
            totalCopies: 1,
            coverImage: 'https://picsum.photos/seed/newbook/300/450',
            coverImageHint: 'book cover'
        }
    );

    const [selectedDepartment, setSelectedDepartment] = React.useState(book?.department || '');

     const categoriesForSelectedDept = selectedDepartment
        ? departmentsData[selectedDepartment as keyof typeof departmentsData] || []
        : [];


    React.useEffect(() => {
        if (book) {
            setFormData(book);
            setSelectedDepartment(book.department || '');
        } else {
             setFormData({
                title: '', author: '', isbn: '', category: '', department: '',
                publicationYear: new Date().getFullYear(), totalCopies: 1,
                coverImage: `https://picsum.photos/seed/${Date.now()}/300/450`,
                coverImageHint: 'book cover'
            });
            setSelectedDepartment('');
        }
    }, [book]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;
        setFormData({ ...formData, [name]: type === 'number' ? Number(value) : value });
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData({ ...formData, [name]: value });
        if (name === 'department') {
            setSelectedDepartment(value);
            // Reset category when department changes
            setFormData(prev => ({...prev, category: ''}));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>{book ? 'Edit Book' : 'Add New Book'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="title" className="text-right">Title</Label>
                    <Input id="title" name="title" value={formData.title} onChange={handleChange} className="col-span-3" required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="author" className="text-right">Author</Label>
                    <Input id="author" name="author" value={formData.author} onChange={handleChange} className="col-span-3" required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="department" className="text-right">Department</Label>
                     <Select onValueChange={(val) => handleSelectChange('department', val)} value={formData.department}>
                        <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Select Department" />
                        </SelectTrigger>
                        <SelectContent>
                             {Object.keys(departmentsData).map(dep => (
                                <SelectItem key={dep} value={dep}>{dep}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="category" className="text-right">Category</Label>
                     <Select onValueChange={(val) => handleSelectChange('category', val)} value={formData.category} disabled={!selectedDepartment}>
                        <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                        <SelectContent>
                           {categoriesForSelectedDept.map(cat => (
                                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                 <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="publicationYear" className="text-right">Year</Label>
                    <Input id="publicationYear" name="publicationYear" type="number" value={formData.publicationYear} onChange={handleChange} className="col-span-3" required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="totalCopies" className="text-right">Total Copies</Label>
                    <Input id="totalCopies" name="totalCopies" type="number" value={formData.totalCopies} onChange={handleChange} className="col-span-3" required />
                </div>
                 <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="isbn" className="text-right">ISBN</Label>
                    <Input id="isbn" name="isbn" value={formData.isbn} onChange={handleChange} className="col-span-3" />
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
                    </DialogClose>
                    <Button type="submit">Save</Button>
                </DialogFooter>
            </form>
        </DialogContent>
    );
};
